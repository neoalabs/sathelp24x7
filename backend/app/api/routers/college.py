
from fastapi import APIRouter
router = APIRouter()

@router.get("/colleges")
async def colleges(q: str | None = None, budget: int | None = None):
    # placeholder static list
    return {"colleges": [{"name": "MIT", "location": "USA"}, {"name": "NYUAD", "location": "UAE"}]}
