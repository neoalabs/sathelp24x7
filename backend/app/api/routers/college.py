from fastapi import APIRouter, Query
from typing import Optional, List
from app.services.college import search_colleges, search_scholarships

router = APIRouter()

@router.get("/colleges")
async def colleges(
    q: Optional[str] = None, 
    min_sat: Optional[int] = None,
    max_tuition: Optional[int] = Query(None),
    country: Optional[str] = None
):
    results = await search_colleges(q, min_sat, max_tuition, country)
    return {"colleges": results}

@router.get("/colleges/{college_id}")
async def get_college(college_id: int):
    # In a real app, you'd fetch from DB
    # This is placeholder logic
    from app.services.college import COLLEGES
    for college in COLLEGES:
        if college["id"] == college_id:
            return college
    return {"detail": "College not found"}, 404

@router.get("/scholarships")
async def scholarships(
    q: Optional[str] = None,
    min_amount: Optional[int] = None,
    country: Optional[str] = None
):
    results = await search_scholarships(q, min_amount, country)
    return {"scholarships": results}