from typing import Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = "default"


class IntentResult(BaseModel):
    original_query: str
    goal: str
    category: str
    budget: Optional[int] = None
    occasion: Optional[str] = None
    group_size: Optional[int] = None
    constraints: list[str] = Field(default_factory=list)
    requested_action: str
    provider: str
    api_key_configured: bool


class Product(BaseModel):
    id: str
    name: str
    category: str
    price: float
    quantity: Optional[int] = 1
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    source: Optional[str] = None


class ScoreBreakdown(BaseModel):
    relevance: float
    budget: float
    occasion: float
    constraint: float
    base_ranking: Optional[float] = None
    total: float


class RankedProduct(Product):
    score: float
    score_breakdown: ScoreBreakdown
    constraint_matches: list[str] = Field(default_factory=list)


class Basket(BaseModel):
    product_ids: list[str]
    items: list[Product]
    total: float
    score: float
    rationale: str


class Cart(BaseModel):
    items: list[Product]
    total: float
    total_quantity: int = 0


class ToolCall(BaseModel):
    tool: str
    input: dict
    outcome: str


class ChatResponse(BaseModel):
    user_query: str
    intent: IntentResult
    action: str
    tool_calls: list[ToolCall]
    matched_products: list[Product]
    ranked_products: list[RankedProduct]
    candidate_baskets: list[Basket]
    recommended_items: list[Product]
    cart: Cart
    total: float
    message: str
    reason: str
    refinement_filters: list[str] = Field(default_factory=list)
