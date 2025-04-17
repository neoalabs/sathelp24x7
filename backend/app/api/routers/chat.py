from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.chat import get_chat_service, ChatService
from app.core.auth import get_current_user
from app.db.models import User

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatHistoryRequest(BaseModel):
    limit: int = 20
    offset: int = 0

@router.post("/chat")
async def chat(
    req: ChatRequest, 
    current_user: User = Depends(get_current_user),
    chat_service: ChatService = Depends(get_chat_service)
):
    reply = await chat_service.get_chat_response(current_user, req.message)
    return {"reply": reply}

@router.get("/chat/history")
async def chat_history(
    limit: int = 20, 
    offset: int = 0,
    current_user: User = Depends(get_current_user)
):
    # In a real implementation, you'd query the chat history from the database
    # This is a placeholder
    return {"history": []}