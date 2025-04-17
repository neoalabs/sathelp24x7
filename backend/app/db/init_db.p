import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import Base
from app.db.session import engine, AsyncSessionLocal
from app.core.security import get_password_hash
from app.db.models import User, Quiz, Question

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def init_data(session: AsyncSession):
    # Create admin user if it doesn't exist
    admin = await session.execute(
        "SELECT * FROM users WHERE email = 'admin@sathelp24x7.com'"
    )
    admin = admin.fetchone()
    
    if not admin:
        admin_user = User(
            email="admin@sathelp24x7.com",
            hashed_password=get_password_hash("adminpassword"),
            role="admin"
        )
        session.add(admin_user)
        
    # Create sample math quiz
    quiz = Quiz(topic="algebra", difficulty="medium")
    session.add(quiz)
    await session.flush()
    
    # Add sample questions
    questions = [
        Question(
            quiz_id=quiz.id,
            prompt="If x² + y² = 25 and x + y = 7, what is the value of xy?",
            choices='["12", "24", "36", "49"]',
            answer="1"
        ),
        Question(
            quiz_id=quiz.id,
            prompt="Solve for x: 2x² - 5x - 3 = 0",
            choices='["x = 3 or x = -0.5", "x = 4 or x = -0.5", "x = 3 or x = -1", "x = 4 or x = -1"]',
            answer="0"
        ),
    ]
    for q in questions:
        session.add(q)
    
    await session.commit()

async def init():
    await create_tables()
    async with AsyncSessionLocal() as session:
        await init_data(session)

if __name__ == "__main__":
    asyncio.run(init())