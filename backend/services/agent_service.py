from services.memory_service import get_session_state, update_session_state
from services.cart_service import add_to_cart, checkout, clear_cart, get_cart
from services.llm_service import detect_intent, rerank_products
from services.product_service import (
    build_candidate_baskets,
    filter_products_by_constraints,
    rank_products,
    plan_quantities,
    search_products,
)


def run_agent(query, session_id="default"):
    previous_state = get_session_state(session_id)
    enriched_query = _enrich_query_with_memory(query, previous_state)
    intent = detect_intent(enriched_query)
    intent = _merge_with_memory(intent, previous_state, query)
    tool_calls = []

    action = intent["requested_action"]
    if action == "get_cart":
        cart = get_cart()
        tool_calls.append(_tool_call("get_cart", {}, f"Loaded {len(cart['items'])} cart items."))
        return _build_response(query, intent, action, tool_calls, [], [], [], cart, cart["total"], _cart_message(cart), _cart_message(cart))

    if action == "clear_cart":
        cleared = clear_cart()
        tool_calls.append(_tool_call("clear_cart", {}, f"Removed {cleared['removed_count']} items from cart."))
        cart = get_cart()
        return _build_response(query, intent, action, tool_calls, [], [], [], cart, cart["total"], "Cart cleared.", "Cart was emptied successfully.")

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
        return _build_response(query, intent, action, tool_calls, [], [], [], cart, checkout_result["total"], message, message)

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

    blended_products, rerank_reason = _blend_rankings(query, intent, ranked_products)
    if blended_products:
        tool_calls.append(
            _tool_call(
                "llm_rerank",
                {"candidate_count": min(len(ranked_products), 10), "top_k": 5},
                f"Blended heuristic and LLM ranking: {rerank_reason}",
            )
        )

    quantity_plan = plan_quantities(blended_products, ranking_constraints)
    candidate_baskets = build_candidate_baskets(blended_products, ranking_constraints)
    recommended_items = candidate_baskets[0]["items"] if candidate_baskets else [dict(item, quantity=item.get("quantity", 1)) for item in quantity_plan[:4]]
    total = round(sum(item["price"] * item.get("quantity", 1) for item in recommended_items), 2)
    cart = get_cart()

    if action == "add_to_cart":
        for item in recommended_items:
            quantity = item.get("quantity", 1)
            for _ in range(quantity):
                add_to_cart(item["id"])
            tool_calls.append(
                _tool_call("add_to_cart", {"product_id": item["id"], "quantity": quantity}, f"Added {item['name']} x{quantity} to cart.")
            )
        cart = get_cart()
        total = cart["total"]
        message = f"Cart updated with {len(recommended_items)} items totaling Rs {cart['total']}."
    else:
        message = _recommendation_message(intent, recommended_items, candidate_baskets, total)
    reason = _build_reason(intent, recommended_items, rerank_reason, candidate_baskets)
    update_session_state(session_id, {"intent": intent, "recommended_items": recommended_items, "last_query": query})

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
        reason,
        _attach_quantities(recommended_items, quantity_plan),
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
    reason,
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
        "reason": reason,
    }


def _enrich_query_with_memory(query, previous_state):
    if not previous_state:
        return query

    lowered = query.lower().strip()
    if len(lowered.split()) <= 4 and any(term in lowered for term in ["healthier", "more", "less", "same", "that", "it", "them", "this"]):
        previous_intent = previous_state.get("intent", {})
        previous_goal = previous_intent.get("goal", "")
        previous_occasion = previous_intent.get("occasion", "")
        previous_constraints = " ".join(previous_intent.get("constraints", []))
        return " ".join(part for part in [previous_goal, previous_occasion, previous_constraints, query] if part).strip()
    return query


def _merge_with_memory(intent, previous_state, current_query):
    if not previous_state:
        return intent

    previous_intent = previous_state.get("intent", {})
    if not intent.get("occasion") and previous_intent.get("occasion"):
        intent["occasion"] = previous_intent["occasion"]

    if not intent.get("category") or intent.get("category") == "general":
        intent["category"] = previous_intent.get("category", intent.get("category"))

    if not intent.get("budget"):
        intent["budget"] = previous_intent.get("budget")

    lowered_query = current_query.lower()
    if any(phrase in lowered_query for phrase in ["instead", "replace", "rather than"]):
        intent["constraints"] = intent.get("constraints") or []
    else:
        merged_constraints = list(dict.fromkeys((previous_intent.get("constraints") or []) + (intent.get("constraints") or [])))
        intent["constraints"] = merged_constraints

    lowered_query = current_query.lower()
    if any(term in lowered_query for term in ["healthier", "healthy", "lighter", "less sugar"]):
        if "healthy" not in intent["constraints"]:
            intent["constraints"].append("healthy")
    if "higher protein" in lowered_query or "more protein" in lowered_query:
        if "high protein" not in intent["constraints"]:
            intent["constraints"].append("high protein")
    return intent


def _attach_quantities(recommended_items, quantity_plan):
    if not recommended_items:
        return []

    by_id = {item["id"]: item for item in quantity_plan}
    attached = []
    for item in recommended_items:
        quantity = by_id.get(item["id"], {}).get("quantity", item.get("quantity", 1))
        attached.append({**item, "quantity": quantity})
    return attached


def _blend_rankings(query, intent, ranked_products):
    top_candidates = ranked_products[:10]
    if not top_candidates:
        return [], "No candidates were available to rank."

    reranked_products, rerank_reason = rerank_products(query, intent, top_candidates, top_k=len(top_candidates))
    rerank_positions = {product["id"]: index for index, product in enumerate(reranked_products)}
    heuristic_positions = {product["id"]: index for index, product in enumerate(top_candidates)}

    max_heuristic = max(len(top_candidates) - 1, 1)
    max_rerank = max(len(top_candidates) - 1, 1)
    blended = []

    for product in top_candidates:
        heuristic_score = 1.0 - (heuristic_positions[product["id"]] / max_heuristic)
        rerank_score = 1.0 - (rerank_positions.get(product["id"], len(top_candidates) - 1) / max_rerank)
        blended_score = round((heuristic_score * 0.7) + (rerank_score * 0.3), 4)
        blended.append(
            {
                **product,
                "blended_score": blended_score,
                "heuristic_rank": heuristic_positions[product["id"]] + 1,
                "rerank_rank": rerank_positions.get(product["id"], len(top_candidates) - 1) + 1,
            }
        )

    blended.sort(key=lambda product: (-product["blended_score"], product["source"] != "local-fallback", product["price"], product["name"]))
    return blended[:5], rerank_reason


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

    names = ", ".join(f"{item['name']} x{item.get('quantity', 1)}" for item in cart["items"])
    total_quantity = cart.get("total_quantity", sum(item.get("quantity", 1) for item in cart["items"]))
    return f"Your cart has {total_quantity} items: {names}. Total is Rs {cart['total']}."


def _build_reason(intent, recommended_items, rerank_reason, candidate_baskets):
    if recommended_items:
        names = ", ".join(
            f"{item['name']} x{item.get('quantity', 1)}" if item.get("quantity", 1) > 1 else item["name"]
            for item in recommended_items[:4]
        )
        occasion = intent.get("occasion") or intent.get("goal") or "your request"
        if candidate_baskets:
            return f"Selected {names} for {occasion}. {rerank_reason}"
        return f"Selected {names} for {occasion}. {rerank_reason}"

    return rerank_reason or "No strong recommendation was available."
