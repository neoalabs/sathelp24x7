
import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SATHELP24x7"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE_ME")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@db:5432/sathelp")
    PINECONE_API_KEY: str = os.getenv("PINECONE_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ALGORITHM: str = "HS256"

settings = Settings()
