"""
Essay writing and analysis service.
"""

from typing import Dict, Optional, List
import asyncio
from app.db.models import Essay, User
from app.db.session import get_session
from sqlalchemy.future import select
from app.services.gemini import generate_response
from app.utils.prompts import EssayPrompts

async def analyze_essay(
    content: str,
    user_id: Optional[int] = None,
    essay_type: str = "college_app"
) -> str:
    """
    Analyze an essay and provide detailed feedback.
    
    Args:
        content: The essay content to analyze
        user_id: Optional user ID to save the essay for
        essay_type: Type of essay (college_app, sat, personal_statement)
        
    Returns:
        Detailed feedback for the essay
    """
    prompt = EssayPrompts.FEEDBACK.format(essay_text=content)
    
    # Generate feedback using AI
    feedback = await generate_response(prompt)
    
    # Store essay and feedback if user is specified
    if user_id:
        async with get_session() as session:
            essay = Essay(
                user_id=user_id,
                content=content,
                feedback=feedback,
                essay_type=essay_type
            )
            session.add(essay)
            await session.commit()
    
    return feedback

async def analyze_cv(content: str, user_id: Optional[int] = None) -> str:
    """
    Analyze a CV/resume and provide feedback.
    
    Args:
        content: CV content
        user_id: Optional user ID
        
    Returns:
        CV feedback
    """
    prompt = EssayPrompts.CV_FEEDBACK.format(cv_text=content)
    
    # Generate feedback
    feedback = await generate_response(prompt)
    
    # Store in database if user specified
    if user_id:
        async with get_session() as session:
            essay = Essay(
                user_id=user_id,
                content=content,
                feedback=feedback,
                essay_type="cv_resume"
            )
            session.add(essay)
            await session.commit()
    
    return feedback

async def get_essay_history(user_id: int) -> List[Dict]:
    """
    Get the essay history for a specific user.
    
    Args:
        user_id: User ID
        
    Returns:
        List of essay records with feedback
    """
    async with get_session() as session:
        result = await session.execute(
            select(Essay)
            .where(Essay.user_id == user_id)
            .order_by(Essay.created_at.desc())
        )
        
        essays = []
        for essay in result.scalars().all():
            essays.append({
                "id": essay.id,
                "content": essay.content,
                "feedback": essay.feedback,
                "created_at": essay.created_at.isoformat(),
                "essay_type": getattr(essay, "essay_type", "general")
            })
            
        return essays

async def suggest_improvements(essay_id: int) -> str:
    """
    Generate specific improvement suggestions for a previously submitted essay.
    
    Args:
        essay_id: ID of the essay to improve
        
    Returns:
        Specific improvement suggestions
    """
    async with get_session() as session:
        essay = await session.get(Essay, essay_id)
        if not essay:
            return "Essay not found"
        
        prompt = f"""
        Based on this essay:
        
        {essay.content}
        
        And the previous feedback:
        
        {essay.feedback}
        
        Provide 5 specific, actionable improvements the writer can make to strengthen this essay.
        For each suggestion, provide an example of how to implement the change.
        """
        
        suggestions = await generate_response(prompt)
        return suggestions