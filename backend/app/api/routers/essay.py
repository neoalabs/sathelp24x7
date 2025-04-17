
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.gemini import generate_response
from app.db.session import get_session
from app.db import models

router = APIRouter()

class EssayRequest(BaseModel):
    content: str

@router.post("/essay")
async def essay_feedback(req: EssayRequest, session=Depends(get_session)):
    prompt = f"Provide detailed feedback on the following SAT essay:\n{req.content}"
    feedback = await generate_response(prompt)
    # persist if needed
    return {"feedback": feedback}
