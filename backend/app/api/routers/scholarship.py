
from fastapi import APIRouter
router = APIRouter()

@router.get("/scholarships")
async def scholarships(q: str | None = None, country: str | None = None):
    return {"scholarships": [{"name": "Fulbright", "amount": 20000}]}
