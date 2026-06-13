import os
import re

from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

CATEGORY_KEYWORDS = {
    "snacks": ["snack", "chips", "popcorn", "movie night", "nachos", "cookies", "granola", "nuts", "trail mix", "makhana"],
    "drinks": ["drink", "coke", "juice", "soda", "cold drink", "sprite", "water"],
    "instant food": ["maggi", "noodle", "instant food", "pasta", "ramen", "soup", "oats"],
}

OCCASION_KEYWORDS = [
    "movie night",
    "party",
    "study session",
    "late night",
    "gaming",
]

CONSTRAINT_KEYWORDS = [
    "vegetarian",
    "vegan",
    "high protein",
    "low sugar",
    "gluten free",
    "healthy",
    "spicy",
    "sweet",
    "organic",
]


def _normalized_text(query):
    return re.sub(r"[-_/]+", " ", query.lower())


def _extract_budget(query):
    budget_patterns = [
        r"under\s*(?:rs\.?|inr|₹)?\s*(\d+)",
        r"below\s*(?:rs\.?|inr|₹)?\s*(\d+)",
        r"budget\s*(?:of)?\s*(?:rs\.?|inr|₹)?\s*(\d+)",
        r"(?:rs\.?|inr|₹)\s*(\d+)",
    ]

    for pattern in budget_patterns:
        match = re.search(pattern, query, flags=re.IGNORECASE)
        if match:
            return int(match.group(1))

    return None


def _extract_category(query):
    lowered_query = _normalized_text(query)
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in lowered_query for keyword in keywords):
            return category

    return "general"


def _extract_occasion(query):
    lowered_query = _normalized_text(query)
    for occasion in OCCASION_KEYWORDS:
        if occasion in lowered_query:
            return occasion

    return None


def _extract_group_size(query):
    match = re.search(r"for\s+(\d+)\s+(?:people|person|guests|friends)", query, flags=re.IGNORECASE)
    if match:
        return int(match.group(1))

    return None


def _extract_constraints(query):
    lowered_query = _normalized_text(query)
    return [constraint for constraint in CONSTRAINT_KEYWORDS if constraint in lowered_query]


def _extract_requested_action(query):
    lowered_query = _normalized_text(query)

    if "checkout" in lowered_query:
        return "checkout"
    if "clear cart" in lowered_query or "empty cart" in lowered_query:
        return "clear_cart"
    if "cart" in lowered_query and any(term in lowered_query for term in ["show", "view", "get", "what"]):
        return "get_cart"
    if any(term in lowered_query for term in ["add to cart", "put in cart", "add it to my cart", "add them to my cart"]):
        return "add_to_cart"

    return "recommend"


def _extract_goal(query, category, occasion, constraints):
    lowered_query = _normalized_text(query)
    filler_patterns = [
        r"plan\b",
        r"need\b",
        r"find\b",
        r"show me\b",
        r"recommend\b",
        r"add .*? to (?:my )?cart\b",
        r"and add it to (?:my )?cart\b",
        r"and add them to (?:my )?cart\b",
        r"under\s*(?:rs\.?|inr|₹)?\s*\d+",
        r"for\s+\d+\s+(?:people|person|guests|friends)",
    ]

    goal = lowered_query
    for pattern in filler_patterns:
        goal = re.sub(pattern, "", goal, flags=re.IGNORECASE)

    goal = " ".join(goal.split()).strip(" ,.")
    goal = re.sub(r"\b(a|an|the)\b\s*", "", goal).strip()
    goal = re.sub(r"\band\b$", "", goal).strip()
    if goal:
        return goal

    pieces = [occasion, *constraints, category]
    return " ".join(piece for piece in pieces if piece)


def detect_intent(query):
    category = _extract_category(query)
    occasion = _extract_occasion(query)
    constraints = _extract_constraints(query)

    return {
        "original_query": query,
        "goal": _extract_goal(query, category, occasion, constraints),
        "category": category,
        "budget": _extract_budget(query),
        "occasion": occasion,
        "group_size": _extract_group_size(query),
        "constraints": constraints,
        "requested_action": _extract_requested_action(query),
        "provider": "rule-based fallback",
        "api_key_configured": bool(API_KEY),
    }
