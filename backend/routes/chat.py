from fastapi import APIRouter

from models.request_models import ChatRequest, ChatResponse
from services.agent_service import run_agent

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(data: ChatRequest):
    return ChatResponse(**run_agent(data.query))
