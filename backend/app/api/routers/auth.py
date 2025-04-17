
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.future import select
from app.db.session import get_session
from app.db import models
from app.core.security import verify_password, create_access_token, get_password_hash

router = APIRouter()

@router.post("/register")
async def register(email: str, password: str, session=Depends(get_session)):
    user = (await session.execute(select(models.User).where(models.User.email == email))).scalar_one_or_none()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = models.User(email=email, hashed_password=get_password_hash(password))
    session.add(new_user)
    await session.commit()
    return {"msg": "registered"}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session=Depends(get_session)):
    user = (await session.execute(select(models.User).where(models.User.email == form_data.username))).scalar_one_or_none()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
