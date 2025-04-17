
from typing import List
from google.generativeai import GenerativeModel, configure
from app.core.config import settings

configure(api_key=settings.GEMINI_API_KEY)

model = GenerativeModel("gemini-pro")

async def generate_response(prompt: str) -> str:
    resp = model.generate_content(prompt)
    return resp.candidates[0].text
