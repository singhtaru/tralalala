import json
import os
import re
from typing import Any

import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
GROQ_BASE_URL = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1/chat/completions")

ALLOWED_ACTIONS = {"recommend", "add_to_cart", "get_cart", "clear_cart", "checkout"}
ALLOWED_CATEGORIES = {
    "snacks",
    "healthy_snacks",
    "drinks",
    "instant_food",
    "breakfast",
    "party_food",
    "general",
}
ALLOWED_CONSTRAINTS = {
    "vegetarian",
    "vegan",
    "high protein",
    "low sugar",
    "gluten free",
    "healthy",
    "spicy",
    "sweet",
    "organic",
}

OCCASION_ALIASES = {
    "watch party": "movie night",
    "netflix": "movie night",
    "binge watching": "movie night",
    "binge watch": "movie night",
    "cricket match": "movie night",
    "ipl finals": "movie night",
    "ipl final": "movie night",
    "sports night": "movie night",
}

CATEGORY_ALIASES = {
    "healthy snacks": "healthy_snacks",
    "healthy snack": "healthy_snacks",
    "movie snacks": "snacks",
    "party food": "party_food",
    "study snacks": "snacks",
    "breakfast items": "breakfast",
    "instant food": "instant_food",
}


def _normalize_constraint(value: str) -> str:
    normalized = " ".join(value.lower().replace("_", " ").replace("-", " ").split())
    if normalized in {"highprotein", "high protein"}:
        return "high protein"
    if normalized in {"glutenfree", "gluten free"}:
        return "gluten free"
    if normalized in {"lowsugar", "low sugar"}:
        return "low sugar"
    return normalized


def _normalize_occasion(value: str | None) -> str | None:
    if not value:
        return None

    normalized = " ".join(str(value).lower().replace("_", " ").replace("-", " ").split())
    return OCCASION_ALIASES.get(normalized, normalized)


def _fallback_intent(query: str) -> dict[str, Any]:
    lowered = query.lower()
    category = "general"
    occasion = None
    requested_action = "recommend"

    if any(term in lowered for term in ["cut", "finger", "injury", "hurt", "bleed", "bandage", "first aid", "first-aid"]):
        category = "first_aid"
        occasion = "first aid emergency"
    elif any(term in lowered for term in ["guest", "guests", "friend", "friends"]):
        category = "party_food"
        occasion = "guest preparation"
    elif any(term in lowered for term in ["breakfast", "morning meal"]):
        category = "breakfast"
        occasion = "quick healthy breakfast"
    elif "butter" in lowered:
        category = "breakfast"
        occasion = "butter"
        if "order" in lowered or "add" in lowered:
            requested_action = "add_to_cart"
    elif any(term in lowered for term in ["yogurt", "curd", "dahi"]):
        category = "breakfast"
        occasion = "yogurt"
        if "order" in lowered or "add" in lowered:
            requested_action = "add_to_cart"
    elif any(term in lowered for term in ["snack", "chips", "popcorn", "nachos", "cookie", "granola", "nuts", "makhana"]):
        category = "snacks"
    elif any(term in lowered for term in ["drink", "juice", "soda", "coke", "sprite", "water"]):
        category = "drinks"
    elif any(term in lowered for term in ["instant food", "maggi", "noodle", "noodles", "pasta", "ramen", "soup", "oats"]):
        category = "instant_food"
    elif any(term in lowered for term in ["breakfast", "oats", "cereal", "toast", "bread", "milk"]):
        category = "breakfast"
    elif any(term in lowered for term in ["party", "ipl", "watch party", "movie night"]):
        category = "party_food"

    constraints = [constraint for constraint in ALLOWED_CONSTRAINTS if constraint in lowered]
    if "high protein" in lowered or "higher protein" in lowered or "protein" in lowered:
        if "high protein" not in constraints:
            constraints.append("high protein")
    if "healthy" in lowered or "healthier" in lowered:
        if "healthy" not in constraints:
            constraints.append("healthy")

    budget = None
    budget_patterns = [
        r"under\s*(?:rs\.?|inr|₹)?\s*(\d+)",
        r"below\s*(?:rs\.?|inr|₹)?\s*(\d+)",
        r"budget\s*(?:of)?\s*(?:rs\.?|inr|₹)?\s*(\d+)",
        r"(?:rs\.?|inr|₹)\s*(\d+)",
    ]
    for pattern in budget_patterns:
        match = re.search(pattern, lowered)
        if match:
            budget = int(match.group(1))
            break

    group_size = None
    match = re.search(r"for\s+(\d+)\s+(?:people|person|guests|friends)", lowered)
    if match:
        group_size = int(match.group(1))

    if "checkout" in lowered:
        requested_action = "checkout"
    elif "clear cart" in lowered or "empty cart" in lowered:
        requested_action = "clear_cart"
    elif "show my cart" in lowered or "view cart" in lowered or "get cart" in lowered:
        requested_action = "get_cart"
    elif "add to cart" in lowered:
        requested_action = "add_to_cart"

    if not occasion:
        if any(term in lowered for term in ["movie night", "netflix", "watch party", "binge watching", "binge watch", "ipl finals", "ipl final", "cricket match", "sports night"]):
            occasion = "movie night"

    return {
        "original_query": query,
        "goal": query,
        "category": category,
        "budget": budget,
        "occasion": _normalize_occasion(occasion),
        "group_size": group_size,
        "constraints": constraints,
        "requested_action": requested_action,
        "provider": "rule-based fallback",
        "api_key_configured": bool(GROQ_API_KEY),
    }


def _post_chat_completion(messages: list[dict[str, str]], temperature: float = 0.0) -> str | None:
    if not GROQ_API_KEY:
        return None

    try:
        response = requests.post(
            GROQ_BASE_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": GROQ_MODEL,
                "messages": messages,
                "temperature": temperature,
            },
            timeout=30,
        )
        response.raise_for_status()
        payload = response.json()
        return payload["choices"][0]["message"]["content"]
    except requests.RequestException:
        return None


def _safe_json_loads(content: str) -> dict[str, Any] | None:
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        start = content.find("{")
        end = content.rfind("}")
        if start >= 0 and end > start:
            try:
                return json.loads(content[start : end + 1])
            except json.JSONDecodeError:
                return None
    return None


def detect_intent(query: str) -> dict[str, Any]:
    prompt = [
        {
            "role": "system",
            "content": (
                "You extract shopping intent from user queries. "
                "Return valid JSON only with keys: goal, category, budget, occasion, group_size, constraints, requested_action. "
                "Allowed categories: snacks, healthy_snacks, drinks, instant_food, breakfast, party_food, general. "
                "Allowed requested_action values: recommend, add_to_cart, get_cart, clear_cart, checkout. "
                "Constraints should be a JSON array of short lowercase strings. "
                "Use null when a value is unknown. "
                "Normalize occasion to snake_case if needed. "
                "Do not add any explanation."
            ),
        },
        {"role": "user", "content": query},
    ]

    content = _post_chat_completion(prompt)
    parsed = _safe_json_loads(content) if content else None

    if not parsed:
        return _fallback_intent(query)

    category = str(parsed.get("category") or "general").strip().lower().replace(" ", "_")
    category = CATEGORY_ALIASES.get(category.replace("_", " "), category)
    if category not in ALLOWED_CATEGORIES:
        category = "general"

    requested_action = str(parsed.get("requested_action") or "recommend").strip().lower()
    if requested_action not in ALLOWED_ACTIONS:
        requested_action = "recommend"

    raw_constraints = parsed.get("constraints") or []
    normalized_constraints = []
    for constraint in raw_constraints:
        normalized = _normalize_constraint(str(constraint))
        if normalized in ALLOWED_CONSTRAINTS and normalized not in normalized_constraints:
            normalized_constraints.append(normalized)

    return {
        "original_query": query,
        "goal": str(parsed.get("goal") or query).strip(),
        "category": category,
        "budget": parsed.get("budget"),
        "occasion": _normalize_occasion(parsed.get("occasion")),
        "group_size": parsed.get("group_size"),
        "constraints": normalized_constraints,
        "requested_action": requested_action,
        "provider": "groq",
        "api_key_configured": bool(GROQ_API_KEY),
    }


def rerank_products(query: str, intent: dict[str, Any], products: list[dict[str, Any]], top_k: int = 5) -> tuple[list[dict[str, Any]], str]:
    if not products:
        return [], "No products were available to rerank."

    prompt = [
        {
            "role": "system",
            "content": (
                "You are a shopping reranker. Rank the given products from best to worst for the user's query. "
                "Return valid JSON only with keys: ranked_ids (array of product IDs in best-to-worst order), reason (string). "
                "Only use IDs from the input list. Keep the reason short and practical."
            ),
        },
        {
            "role": "user",
            "content": json.dumps(
                {
                    "query": query,
                    "intent": intent,
                    "products": [
                        {
                            "id": product["id"],
                            "name": product["name"],
                            "category": product["category"],
                            "price": product["price"],
                            "description": product.get("description"),
                        }
                        for product in products[:20]
                    ],
                },
                ensure_ascii=False,
            ),
        },
    ]

    content = _post_chat_completion(prompt, temperature=0.2)
    parsed = _safe_json_loads(content) if content else None

    if not parsed or not isinstance(parsed.get("ranked_ids"), list) or len(parsed["ranked_ids"]) == 0:
        return products[:top_k], "Ranked using deterministic scoring because the LLM reranker was unavailable."

    ranked_ids = parsed.get("ranked_ids") or []
    ordered = []
    by_id = {product["id"]: product for product in products}
    for product_id in ranked_ids:
        product = by_id.get(product_id)
        if product and product not in ordered:
            ordered.append(product)

    for product in products:
        if product not in ordered:
            ordered.append(product)

    reason = str(parsed.get("reason") or "Selected the best matching products.")
    return ordered[:top_k], reason
