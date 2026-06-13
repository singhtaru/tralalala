from services.cart_service import add_to_cart, checkout, clear_cart, get_cart
from services.llm_service import detect_intent
from services.product_service import (
    build_candidate_baskets,
    filter_products_by_constraints,
    rank_products,
    search_products,
)


def run_agent(query):
    intent = detect_intent(query)
    tool_calls = []

    action = intent["requested_action"]
    if action == "get_cart":
        cart = get_cart()
        tool_calls.append(_tool_call("get_cart", {}, f"Loaded {len(cart['items'])} cart items."))
        return _build_response(query, intent, action, tool_calls, [], [], [], cart, cart["total"], _cart_message(cart))

    if action == "clear_cart":
        cleared = clear_cart()
        tool_calls.append(_tool_call("clear_cart", {}, f"Removed {cleared['removed_count']} items from cart."))
        cart = get_cart()
        return _build_response(query, intent, action, tool_calls, [], [], [], cart, cart["total"], "Cart cleared.")

    if action == "checkout":
        checkout_result = checkout()
        tool_calls.append(
            _tool_call(
                "checkout",
                {},
                checkout_result["message"],
            )
        )
        cart = get_cart()
        message = checkout_result["message"]
        return _build_response(query, intent, action, tool_calls, [], [], [], cart, checkout_result["total"], message)

    search_query = _build_search_query(intent)
    matched_products = search_products(search_query, ranking_constraints_from_intent(intent))
    tool_calls.append(_tool_call("search_products", {"query": search_query}, f"Collected {len(matched_products)} candidate products."))

    ranking_constraints = ranking_constraints_from_intent(intent)
    filtered_products = filter_products_by_constraints(matched_products, ranking_constraints)
    if len(filtered_products) != len(matched_products):
        tool_calls.append(
            _tool_call(
                "constraint_filter",
                {"constraints": ranking_constraints["constraints"]},
                f"Filtered candidates from {len(matched_products)} to {len(filtered_products)}.",
            )
        )
    ranked_products = rank_products(filtered_products, ranking_constraints)
    tool_calls.append(
        _tool_call(
            "rank_products",
            {"product_count": len(filtered_products), "user_constraints": ranking_constraints},
            f"Ranked {len(ranked_products)} products.",
        )
    )

    candidate_baskets = build_candidate_baskets(ranked_products, ranking_constraints)
    recommended_items = candidate_baskets[0]["items"] if candidate_baskets else ranked_products[:4]
    total = round(sum(item["price"] for item in recommended_items), 2)
    cart = get_cart()

    if action == "add_to_cart":
        for item in recommended_items:
            add_to_cart(item["id"])
            tool_calls.append(
                _tool_call("add_to_cart", {"product_id": item["id"]}, f"Added {item['name']} to cart.")
            )
        cart = get_cart()
        total = cart["total"]
        message = f"Cart updated with {len(recommended_items)} items totaling Rs {cart['total']}."
    else:
        message = _recommendation_message(intent, recommended_items, candidate_baskets, total)

    return _build_response(
        query,
        intent,
        action,
        tool_calls,
        matched_products,
        ranked_products,
        candidate_baskets,
        cart,
        total,
        message,
        recommended_items,
    )


def _build_search_query(intent):
    parts = [intent.get("goal"), intent.get("occasion"), intent.get("category")]
    return " ".join(part for part in parts if part and part != "general")


def ranking_constraints_from_intent(intent):
    return {
        "goal": intent["goal"],
        "category": intent["category"],
        "budget": intent["budget"],
        "occasion": intent["occasion"],
        "group_size": intent["group_size"],
        "constraints": intent["constraints"],
    }


def _build_response(
    query,
    intent,
    action,
    tool_calls,
    matched_products,
    ranked_products,
    candidate_baskets,
    cart,
    total,
    message,
    recommended_items=None,
):
    return {
        "user_query": query,
        "intent": intent,
        "action": action,
        "tool_calls": tool_calls,
        "matched_products": matched_products,
        "ranked_products": ranked_products,
        "candidate_baskets": candidate_baskets,
        "recommended_items": recommended_items or [],
        "cart": cart,
        "total": total,
        "message": message,
    }


def _tool_call(tool, input_data, outcome):
    return {
        "tool": tool,
        "input": input_data,
        "outcome": outcome,
    }


def _recommendation_message(intent, recommended_items, candidate_baskets, total):
    if not recommended_items:
        return "I could not find a suitable basket for that request."

    names = ", ".join(item["name"] for item in recommended_items)
    occasion = intent.get("occasion") or intent.get("goal") or "your request"
    if candidate_baskets:
        return f"Built a basket for {occasion} with {names}, totaling Rs {total}."
    return f"Top recommendations for {occasion}: {names}."


def _cart_message(cart):
    if not cart["items"]:
        return "Your cart is empty."

    names = ", ".join(item["name"] for item in cart["items"])
    return f"Your cart has {len(cart['items'])} items: {names}. Total is Rs {cart['total']}."
