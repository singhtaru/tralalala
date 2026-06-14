import json
import os
import re
from itertools import combinations
from pathlib import Path

import requests

PRODUCTS_FILE = Path(__file__).resolve().parent.parent / "products.json"
DUMMYJSON_BASE_URL = os.getenv("DUMMYJSON_BASE_URL", "https://dummyjson.com")

FOOD_CATEGORIES = {
    "groceries", "snacks", "drinks", "instant food", "beverages", "first-aid", "first_aid", 
    "baby", "emergency", "party_food", "breakfast", "fruits", "atta", "oil", "dairy", 
    "bakery", "cereal", "meat", "chips", "chocolate", "tea", "instant", "health", "icecream",
    "general"
}
NON_FOOD_CATEGORIES = {
    "beauty",
    "skin-care",
    "fragrances",
    "furniture",
    "home-decoration",
    "motorcycle",
    "vehicle",
    "pet-supplies",
}

NON_FOOD_KEYWORDS = {
    "lotion",
    "cream",
    "serum",
    "shampoo",
    "conditioner",
    "soap",
    "perfume",
    "moisturizer",
    "face wash",
    "lipstick",
    "deodorant",
    "cat food",
    "dog food",
    "pet food",
}

HUMAN_FOOD_KEYWORDS = {
    "chips",
    "nachos",
    "popcorn",
    "cookies",
    "cookie",
    "granola",
    "protein",
    "nuts",
    "trail mix",
    "makhana",
    "cracker",
    "juice",
    "water",
    "cola",
    "coke",
    "sprite",
    "soda",
    "drink",
    "ramen",
    "noodle",
    "noodles",
    "pasta",
    "maggi",
    "soup",
    "oats",
    "bar",
}

PRODUCT_TAG_KEYWORDS = {
    "snack": ["chips", "nachos", "popcorn", "cookies", "cookie", "cracker", "makhana"],
    "healthy_snack": ["nuts", "granola", "protein", "trail mix", "makhana", "roasted", "bar"],
    "instant_food": ["maggi", "noodle", "noodles", "ramen", "pasta", "soup", "oats", "mac"],
    "drink": ["coke", "cola", "sprite", "soda", "juice", "drink", "water"],
    "healthy_drink": ["water", "juice", "sparkling", "coconut"],
    "sweet_snack": ["cookie", "cookies", "chocolate", "brownie", "sweet"],
    "pet_food": ["cat food", "dog food", "pet food"],
    "non_food": ["lotion", "cream", "serum", "shampoo", "soap", "perfume", "moisturizer"],
    "first_aid": ["bandage", "bandages", "cotton", "antiseptic", "dettol", "tape", "thermometer", "medicine"],
    "baby": ["diaper", "diapers", "wipes", "baby"],
    "emergency": ["led", "bulb", "torch", "light", "rechargeable"],
    "party_food": ["plates", "disposable", "party", "guests"],
    "breakfast": ["eggs", "milk", "oats", "yogurt", "bread", "butter", "curd", "dahi"],
    "butter": ["butter"],
}

OCCASION_PRODUCT_TAGS = {
    "movie night": {"snack": 35, "drink": 20, "healthy_snack": 15},
    "party": {"snack": 25, "drink": 20},
    "study session": {"healthy_snack": 20, "drink": 15, "instant_food": 10},
    "late night": {"instant_food": 25, "snack": 15, "drink": 10},
    "gaming": {"snack": 25, "drink": 20},
    "first aid emergency": {"first_aid": 50},
    "guest preparation": {"party_food": 40, "snack": 20, "drink": 20},
    "quick healthy breakfast": {"breakfast": 50, "healthy_snack": 15},
    "butter": {"butter": 50},
}

CONSTRAINT_TAG_BONUSES = {
    "healthy": {"healthy_snack": 30, "healthy_drink": 20, "snack": -10, "sweet_snack": -25, "drink": -10},
    "high protein": {"healthy_snack": 25, "snack": -5},
    "low sugar": {"healthy_drink": 20, "sweet_snack": -30, "drink": -10},
    "vegan": {"healthy_snack": 15, "drink": 5},
    "vegetarian": {"snack": 5, "healthy_snack": 5, "instant_food": 5},
    "sweet": {"sweet_snack": 20},
    "spicy": {"snack": 10},
}

BASKET_TEMPLATES = {
    "movie night": [["snack", "healthy_snack"], ["snack", "healthy_snack"], ["drink", "healthy_drink"]],
    "healthy movie night": [["healthy_snack"], ["healthy_snack", "snack"], ["healthy_drink", "drink"]],
    "instant food": [["instant_food"], ["instant_food"], ["drink", "healthy_drink"]],
    "drinks": [["drink", "healthy_drink"], ["drink", "healthy_drink"]],
    "snacks": [["snack", "healthy_snack"], ["snack", "healthy_snack"], ["drink", "healthy_drink"]],
    "first aid emergency": [["first_aid"], ["first_aid"], ["first_aid"], ["first_aid"]],
    "guest preparation": [["party_food"], ["snack"], ["drink"], ["sweet_snack"]],
    "quick healthy breakfast": [["breakfast"], ["breakfast"], ["breakfast"], ["breakfast"]],
    "butter": [["butter"]],
    "yogurt": [["breakfast"]],
}

CATEGORY_TO_TAGS = {
    "snacks": {"snack", "healthy_snack", "drink", "healthy_drink", "sweet_snack"},
    "healthy_snacks": {"healthy_snack", "healthy_drink", "snack"},
    "drinks": {"drink", "healthy_drink"},
    "instant_food": {"instant_food", "drink", "healthy_drink"},
    "breakfast": {"breakfast", "healthy_snack", "instant_food", "healthy_drink", "snack"},
    "party_food": {"party_food", "snack", "healthy_snack", "drink", "sweet_snack"},
    "first_aid": {"first_aid"},
    "baby": {"baby"},
    "emergency": {"emergency"},
    "general": {"snack", "healthy_snack", "drink", "healthy_drink", "instant_food", "sweet_snack", "first_aid", "baby", "emergency", "party_food", "breakfast", "butter"},
}


def _load_local_products():
    with PRODUCTS_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def _normalize_product(product, source_name="dummyjson"):
    product_id = str(product["id"])
    name = product.get("name") or product.get("title", "Unknown Product")
    rating = float(product.get("rating", 4.5))
    delivery_mins = int(product.get("deliveryMins", 15))
    
    # Generate deterministic metadata based on name hash
    h = abs(hash(name))
    purchase_count = (h % 450) + 50
    popularity = (h % 90) + 10
    repeat_purchases = int(purchase_count * ((h % 30) + 10) / 100.0)
    brand = product.get("brand") or name.split()[0]
    thumbnail = product.get("thumbnail") or product.get("imageUrl") or "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80"

    return {
        "id": product_id,
        "name": name,
        "category": product.get("category", "general"),
        "price": float(product.get("price", 0.0)),
        "description": product.get("description", ""),
        "thumbnail": thumbnail,
        "imageUrl": thumbnail,
        "source": product.get("source", source_name),
        "brand": brand,
        "rating": rating,
        "deliveryMins": delivery_mins,
        "purchase_count": purchase_count,
        "popularity": popularity,
        "repeat_purchases": repeat_purchases,
    }


def _tokenize(text):
    return [token for token in re.findall(r"[a-z0-9]+", text.lower()) if len(token) > 1]


def _product_text(product):
    return " ".join(
        [
            str(product.get("name", "")),
            str(product.get("category", "")),
            str(product.get("description", "")),
        ]
    ).lower()


def _canonical_key(product):
    return (
        re.sub(r"[^a-z0-9]+", " ", product.get("name", "").lower()).strip(),
        product.get("category", "").lower(),
    )


def _dedupe_products(products):
    unique_products = {}
    for product in products:
        unique_products[_canonical_key(product)] = product
    return list(unique_products.values())


def _infer_product_tags(product):
    product_text = _product_text(product)
    tags = set()

    for tag, keywords in PRODUCT_TAG_KEYWORDS.items():
        if any(keyword in product_text for keyword in keywords):
            tags.add(tag)

    category = product.get("category", "").lower()
    if category in {"snacks", "chips", "bakery", "chocolate", "icecream"}:
        tags.add("snack")
    if category in {"drinks", "tea"}:
        tags.add("drink")
    if category in {"instant", "instant_food", "instant food"}:
        tags.add("instant_food")
    if category in {"first-aid", "first_aid"}:
        tags.add("first_aid")
    if category == "baby":
        tags.add("baby")
    if category == "emergency":
        tags.add("emergency")
    if category == "party_food":
        tags.add("party_food")
    if category in {"dairy", "breakfast"}:
        tags.add("breakfast")
    if category in {"cereal", "health"}:
        tags.add("healthy_snack")
    if "healthy" in product_text:
        tags.add("healthy_snack")

    return tags


def _is_food_request(user_constraints):
    return (
        user_constraints.get("category") in {"snacks", "healthy_snacks", "drinks", "instant_food", "breakfast", "party_food"}
        or bool(user_constraints.get("occasion"))
        or any(constraint in {"healthy", "vegan", "vegetarian", "high protein", "low sugar"} for constraint in user_constraints.get("constraints", []))
    )


def _is_relevant_food_product(product, user_constraints):
    category = product.get("category", "").lower()
    product_text = _product_text(product)
    tags = _infer_product_tags(product)

    if category in NON_FOOD_CATEGORIES or "non_food" in tags or "pet_food" in tags:
        return False

    if any(keyword in product_text for keyword in NON_FOOD_KEYWORDS):
        return False

    if not _is_food_request(user_constraints):
        return True

    if category in FOOD_CATEGORIES:
        return True

    return any(keyword in product_text for keyword in HUMAN_FOOD_KEYWORDS)


def _allowed_tags_for_request(user_constraints):
    category = user_constraints.get("category")
    occasion = user_constraints.get("occasion")

    if occasion == "first aid emergency" or occasion == "injury" or category in {"first-aid", "first_aid"}:
        return {"first_aid"}
    if occasion == "guest preparation" or category == "party_food":
        return {"party_food", "snack", "drink", "sweet_snack"}
    if occasion == "butter" or category == "butter":
        return {"butter", "breakfast", "general"}
    if occasion == "yogurt" or category == "yogurt":
        return {"breakfast", "general"}
    if occasion == "quick healthy breakfast" or category == "breakfast":
        return {"breakfast", "healthy_snack", "drink"}
    if category == "baby":
        return {"baby"}
    if category == "emergency":
        return {"emergency"}
    if category == "instant_food":
        return {"instant_food", "drink", "healthy_drink"}
    if category == "drinks":
        return {"drink", "healthy_drink"}
    if category == "healthy_snacks":
        return {"healthy_snack", "healthy_drink", "snack"}
    if category == "snacks" or occasion == "movie night":
        return {"snack", "healthy_snack", "drink", "healthy_drink", "sweet_snack"}
    return {"snack", "healthy_snack", "drink", "healthy_drink", "instant_food", "sweet_snack", "first_aid", "baby", "emergency", "party_food", "breakfast", "butter"}


def _matches_request_type(product, user_constraints):
    tags = _infer_product_tags(product)
    allowed_tags = _allowed_tags_for_request(user_constraints)

    if not tags & allowed_tags:
        return False

    if user_constraints.get("category") == "instant_food" and "instant_food" not in tags:
        return False
    if user_constraints.get("category") == "drinks" and not (tags & {"drink", "healthy_drink"}):
        return False

    return True


def get_products():
    products = [
        {
            **_normalize_product(product, source_name="local-fallback"),
            "source": "local-fallback",
        }
        for product in _load_local_products()
    ]
    return _dedupe_products(products)


def search_products(query, user_constraints=None):
    user_constraints = user_constraints or {}
    products = get_products()
    filtered_products = [product for product in products if _is_relevant_food_product(product, user_constraints)]
    filtered_products = [product for product in filtered_products if _matches_request_type(product, user_constraints)]

    query_tokens = set(_tokenize(query))
    scored_products = []

    for product in filtered_products:
        product_text = _product_text(product)
        tags = _infer_product_tags(product)
        token_overlap = len(query_tokens & set(_tokenize(product_text)))
        tag_overlap = sum(2 for token in query_tokens if token in product_text)
        semantic_bonus = 0

        if user_constraints.get("category") == "snacks" and tags & {"snack", "healthy_snack"}:
            semantic_bonus += 20
        if user_constraints.get("category") == "drinks" and tags & {"drink", "healthy_drink"}:
            semantic_bonus += 20
        if user_constraints.get("category") == "instant_food" and "instant_food" in tags:
            semantic_bonus += 35
        if user_constraints.get("occasion") == "movie night" and tags & {"snack", "healthy_snack", "drink"}:
            semantic_bonus += 18
        if (user_constraints.get("occasion") == "first aid emergency" or user_constraints.get("occasion") == "injury" or user_constraints.get("category") in {"first-aid", "first_aid"}) and "first_aid" in tags:
            semantic_bonus += 50
        if (user_constraints.get("occasion") == "guest preparation" or user_constraints.get("category") == "party_food") and tags & {"party_food", "snack", "drink", "sweet_snack"}:
            semantic_bonus += 35
        if (user_constraints.get("occasion") == "quick healthy breakfast" or user_constraints.get("category") == "breakfast") and "breakfast" in tags:
            semantic_bonus += 40
        if (user_constraints.get("occasion") == "butter" or user_constraints.get("category") == "butter") and "butter" in tags:
            semantic_bonus += 50
        if user_constraints.get("category") == "baby" and "baby" in tags:
            semantic_bonus += 50
        if user_constraints.get("category") == "emergency" and "emergency" in tags:
            semantic_bonus += 50

        if "healthy" in user_constraints.get("constraints", []) and tags & {"healthy_snack", "healthy_drink"}:
            semantic_bonus += 18

        total_score = token_overlap * 8 + tag_overlap + semantic_bonus
        if total_score > 0:
            scored_products.append((total_score, product))

    scored_products.sort(
        key=lambda item: (
            -item[0],
            0 if item[1].get("source") == "local-fallback" else 1,
            item[1]["price"],
            item[1]["name"],
        )
    )
    matched_products = [product for _, product in scored_products]

    if matched_products:
        return matched_products[:20]

    return filtered_products[:12]


def _score_relevance(product, user_constraints):
    goal = user_constraints.get("goal", "").lower()
    goal_tokens = set(_tokenize(goal))
    
    # Expand goal tokens for synonym matching
    if "yogurt" in goal_tokens or "yogurt" in goal:
        goal_tokens.add("curd")
        goal_tokens.add("yogurt")
    if "curd" in goal_tokens or "curd" in goal:
        goal_tokens.add("yogurt")
        goal_tokens.add("curd")

    product_tokens = set(_tokenize(_product_text(product)))
    tags = _infer_product_tags(product)
    source_bonus = 10.0 if product.get("source") == "local-fallback" else 0.0

    overlap = len(goal_tokens & product_tokens) * 12
    tag_bonus = 0
    
    # Occasion exact match bonus
    occasion = user_constraints.get("occasion")
    if occasion:
        occ_lower = occasion.lower()
        prod_name_lower = product.get("name", "").lower()
        if occ_lower == "yogurt" and any(x in prod_name_lower for x in ["yogurt", "curd", "dahi"]):
            tag_bonus += 50
        elif occ_lower in prod_name_lower:
            tag_bonus += 50

    if user_constraints.get("category") == "instant_food" and "instant_food" in tags:
        tag_bonus += 35
    if user_constraints.get("category") == "snacks" and tags & {"snack", "healthy_snack"}:
        tag_bonus += 25
    if user_constraints.get("category") == "healthy_snacks" and tags & {"healthy_snack", "healthy_drink"}:
        tag_bonus += 28
    if user_constraints.get("category") == "breakfast" and tags & {"healthy_snack", "instant_food"}:
        tag_bonus += 28
    if user_constraints.get("category") == "party_food" and tags & {"snack", "sweet_snack"}:
        tag_bonus += 22
    if user_constraints.get("category") == "drinks" and tags & {"drink", "healthy_drink"}:
        tag_bonus += 25

    return min(70.0, float(overlap + tag_bonus + source_bonus))


def _score_budget(product, user_constraints):
    budget = user_constraints.get("budget")
    if budget is None:
        return 8.0

    price = product["price"]
    if price > budget:
        return -10.0

    utilization = price / budget if budget else 0
    return round(18.0 - (utilization * 10.0), 2)


def _score_occasion(product, user_constraints):
    occasion = user_constraints.get("occasion")
    if not occasion:
        return 0.0

    tags = _infer_product_tags(product)
    tag_scores = OCCASION_PRODUCT_TAGS.get(occasion.lower(), {})
    return float(sum(score for tag, score in tag_scores.items() if tag in tags))


def _score_constraints(product, user_constraints):
    tags = _infer_product_tags(product)
    product_text = _product_text(product)
    constraint_score = 0.0
    matched_constraints = []

    for constraint in user_constraints.get("constraints", []):
        tag_bonuses = CONSTRAINT_TAG_BONUSES.get(constraint.lower(), {})
        delta = sum(score for tag, score in tag_bonuses.items() if tag in tags)
        if delta > 0:
            matched_constraints.append(constraint)
        constraint_score += delta

        if constraint.lower() == "healthy" and any(token in product_text for token in ["coke", "cola", "soda", "cookie", "cookies", "chocolate", "chips", "nachos", "brownie", "candy"]):
            constraint_score -= 20

    return max(-60.0, min(60.0, constraint_score)), matched_constraints


def _calculate_ranking_base_score(product):
    # Rating: 0.0 to 5.0 -> normalize to 0-10
    rating_score = float(product.get("rating", 4.5)) * 2.0
    
    # Purchase count: 50 to 500 -> normalize to 0-10
    purchase_count = float(product.get("purchase_count", 100))
    purchase_score = (purchase_count / 500.0) * 10.0
    
    # Popularity: 10 to 100 -> normalize to 0-10
    popularity = float(product.get("popularity", 50))
    popularity_score = (popularity / 100.0) * 10.0
    
    # Repeat purchases: 10 to 150 -> normalize to 0-10
    repeat_purchases = float(product.get("repeat_purchases", 20))
    repeat_score = (repeat_purchases / 150.0) * 10.0
    
    # Delivery speed: lower is better (8 mins -> 10, 20 mins -> 0)
    delivery_mins = float(product.get("deliveryMins", 15))
    delivery_score = max(0.0, (20.0 - delivery_mins) / 12.0 * 10.0)
    
    # Weighted sum: Rating (30%), Purchase Count (20%), Popularity (20%), Repeat Purchases (10%), Delivery Speed (20%)
    base_score = (
        (rating_score * 0.3) + 
        (purchase_score * 0.2) + 
        (popularity_score * 0.2) + 
        (repeat_score * 0.1) + 
        (delivery_score * 0.2)
    )
    return base_score


def rank_products(products, user_constraints):
    ranked = []

    for product in products:
        relevance_score = _score_relevance(product, user_constraints)
        budget_score = _score_budget(product, user_constraints)
        occasion_score = _score_occasion(product, user_constraints)
        constraint_score, matched_constraints = _score_constraints(product, user_constraints)
        
        base_score = _calculate_ranking_base_score(product)
        total_score = round(relevance_score + budget_score + occasion_score + constraint_score + base_score, 2)

        ranked.append(
            {
                **product,
                "score": total_score,
                "score_breakdown": {
                    "relevance": round(relevance_score, 2),
                    "budget": round(budget_score, 2),
                    "occasion": round(occasion_score, 2),
                    "constraint": round(constraint_score, 2),
                    "base_ranking": round(base_score, 2),
                    "total": total_score,
                },
                "constraint_matches": matched_constraints,
            }
        )

    ranked.sort(key=lambda product: (-product["score"], 0 if product.get("source") == "local-fallback" else 1, product["price"], product["name"]))
    return ranked


def filter_products_by_constraints(products, user_constraints):
    constraints = user_constraints.get("constraints", [])
    if not constraints:
        return products

    valid_products = []
    for product in products:
        product_text = _product_text(product)
        tags = _infer_product_tags(product)
        excluded = False

        if "healthy" in constraints and any(term in product_text for term in ["lotion", "cream", "cat food", "dog food"]):
            excluded = True
        if "low sugar" in constraints and any(term in product_text for term in ["coke", "cola", "soda", "cookie", "chocolate"]):
            excluded = True
        if "gluten free" in constraints and any(term in product_text for term in ["cookie", "noodle", "pasta"]):
            excluded = True
        if "vegan" in constraints and any(term in product_text for term in ["butter", "chocolate"]):
            excluded = True
        if "healthy" in constraints and "sweet_snack" in tags:
            excluded = True

        if not excluded:
            valid_products.append(product)

    return valid_products if valid_products else products


def build_candidate_baskets(ranked_products, user_constraints, limit=3):
    if not ranked_products:
        return []

    budget = user_constraints.get("budget")
    group_size = user_constraints.get("group_size")
    if group_size:
        target_items = min(max(3, group_size + 1 if group_size <= 4 else group_size), 8)
    else:
        target_items = 4
    max_items = min(max(target_items, 2), 8)
    pool = ranked_products[: min(len(ranked_products), 10)]
    baskets = []
    seen = set()
    template = _select_basket_template(user_constraints)

    for size in range(max(2, len(template) if template else 2), max_items + 1):
        for combo in combinations(pool, size):
            total = round(sum(item["price"] for item in combo), 2)
            if budget is not None and total > budget:
                continue

            product_ids = tuple(sorted(item["id"] for item in combo))
            if product_ids in seen:
                continue
            seen.add(product_ids)

            items_with_quantities = _assign_quantities(list(combo), group_size)
            actual_total = round(sum(item["price"] * item.get("quantity", 1) for item in items_with_quantities), 2)
            if budget is not None and actual_total > budget:
                continue

            product_score = sum(item["score"] for item in combo)
            diversity_bonus = len({frozenset(_infer_product_tags(item)) for item in combo}) * 5
            budget_bonus = 0.0
            if budget:
                budget_bonus = max(0.0, 15.0 - abs(budget - actual_total) / max(budget, 1) * 15.0)
            template_bonus = _basket_template_score(combo, template)
            group_bonus = min(size, group_size or size) * 2
            basket_score = round(product_score + diversity_bonus + budget_bonus + template_bonus + group_bonus, 2)

            baskets.append(
                {
                    "product_ids": list(product_ids),
                    "items": items_with_quantities,
                    "total": actual_total,
                    "score": basket_score,
                    "rationale": _build_basket_rationale(items_with_quantities, actual_total, user_constraints),
                }
            )

    if not baskets:
        best_single = ranked_products[0]
        assigned_items = _assign_quantities([best_single], group_size)
        baskets.append(
            {
                "product_ids": [best_single["id"]],
                "items": assigned_items,
                "total": round(sum(item["price"] * item.get("quantity", 1) for item in assigned_items), 2),
                "score": best_single["score"],
                "rationale": "Best available single item when no full basket fit the budget.",
            }
        )

    baskets.sort(key=lambda basket: (-basket["score"], basket["total"]))
    return baskets[:limit]


def _select_basket_template(user_constraints):
    occasion = user_constraints.get("occasion")
    if occasion == "first aid emergency" or occasion == "injury":
        return BASKET_TEMPLATES["first aid emergency"]
    if occasion == "guest preparation":
        return BASKET_TEMPLATES["guest preparation"]
    if occasion == "quick healthy breakfast":
        return BASKET_TEMPLATES["quick healthy breakfast"]
    if occasion == "butter":
        return BASKET_TEMPLATES["butter"]
    if occasion == "yogurt":
        return BASKET_TEMPLATES["yogurt"]
    if user_constraints.get("occasion") == "movie night" and "healthy" in user_constraints.get("constraints", []):
        return BASKET_TEMPLATES["healthy movie night"]
    if user_constraints.get("occasion") == "movie night":
        return BASKET_TEMPLATES["movie night"]
    if user_constraints.get("category") == "instant_food":
        return BASKET_TEMPLATES["instant food"]
    if user_constraints.get("category") == "drinks":
        return BASKET_TEMPLATES["drinks"]
    if user_constraints.get("category") in {"snacks", "healthy_snacks", "party_food"}:
        return BASKET_TEMPLATES["snacks"]
    if user_constraints.get("category") == "breakfast":
        return [["healthy_snack"], ["instant_food"], ["healthy_drink"]]
    return []


def _basket_template_score(items, template):
    if not template:
        return 0.0

    item_tags = [_infer_product_tags(item) for item in items]
    matched_slots = 0
    used_indexes = set()

    for slot in template:
        for index, tags in enumerate(item_tags):
            if index in used_indexes:
                continue
            if any(tag in tags for tag in slot):
                used_indexes.add(index)
                matched_slots += 1
                break

    if matched_slots == len(template):
        return 40.0

    return matched_slots * 8.0 - 20.0


def _build_basket_rationale(items, total, user_constraints):
    names = ", ".join(item["name"] for item in items)
    occasion = user_constraints.get("occasion")
    budget = user_constraints.get("budget")

    message = f"Balanced basket with {names}"
    if occasion:
        message += f" for {occasion}"
    if budget is not None:
        message += f", staying near the Rs {budget} budget at Rs {total}"
    return message + "."


def plan_quantities(ranked_products, user_constraints):
    group_size = user_constraints.get("group_size") or 1
    if not ranked_products:
        return []

    preferred_count = min(max(3, group_size // 2 + 2), 8)
    chosen = ranked_products[:preferred_count]
    planned = []
    remaining = group_size

    for index, product in enumerate(chosen):
        if group_size <= 2:
            quantity = 1
        else:
            base = max(1, group_size // preferred_count)
            quantity = base
            if index < (group_size % preferred_count):
                quantity += 1

        quantity = min(quantity, max(1, remaining))
        remaining -= quantity
        planned.append({**product, "quantity": quantity})

    if remaining > 0 and planned:
        planned[0]["quantity"] += remaining

    return planned


def _assign_quantities(items, group_size):
    if not items:
        return items

    quantity_plan = []
    if not group_size or group_size <= 1:
        return [{**item, "quantity": 1} for item in items]

    remaining = group_size
    count = len(items)
    base = max(1, group_size // count)

    for index, item in enumerate(items):
        quantity = base
        if index < (group_size % count):
            quantity += 1
        if index == count - 1:
            quantity = max(1, remaining)
        quantity = min(quantity, max(1, remaining))
        remaining -= quantity
        quantity_plan.append({**item, "quantity": quantity})

    if remaining > 0:
        quantity_plan[0]["quantity"] += remaining

    return quantity_plan
