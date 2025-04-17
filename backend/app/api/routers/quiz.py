from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from sqlalchemy.future import select
from app.db.session import get_session
from app.db import models
from app.core.auth import get_current_user
import json

router = APIRouter()

class QuizQuestion(BaseModel):
    id: int
    prompt: str
    choices: List[str]

class QuizResponse(BaseModel):
    id: int
    topic: str
    difficulty: str
    questions: List[QuizQuestion]

class AnswerSubmission(BaseModel):
    quiz_id: int
    answers: Dict[int, int]  # question_id -> selected_choice_index

class QuizResult(BaseModel):
    score: int
    total: int
    correct_answers: Dict[int, int]
    feedback: Dict[int, str]

@router.get("/quizzes", response_model=List[dict])
async def list_quizzes(session=Depends(get_session)):
    result = await session.execute(select(models.Quiz))
    quizzes = result.scalars().all()
    return [{"id": quiz.id, "topic": quiz.topic, "difficulty": quiz.difficulty} for quiz in quizzes]

@router.get("/quiz/{quiz_id}", response_model=QuizResponse)
async def get_quiz(
    quiz_id: int, 
    current_user: models.User = Depends(get_current_user),
    session=Depends(get_session)
):
    # Get quiz
    quiz = await session.get(models.Quiz, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Get questions
    result = await session.execute(
        select(models.Question).where(models.Question.quiz_id == quiz_id)
    )
    questions = result.scalars().all()
    
    # Format response
    formatted_questions = []
    for q in questions:
        choices = json.loads(q.choices) if isinstance(q.choices, str) else q.choices
        formatted_questions.append(
            QuizQuestion(id=q.id, prompt=q.prompt, choices=choices)
        )
    
    return QuizResponse(
        id=quiz.id,
        topic=quiz.topic,
        difficulty=quiz.difficulty,
        questions=formatted_questions
    )

@router.post("/quiz/submit", response_model=QuizResult)
async def submit_quiz(
    submission: AnswerSubmission,
    current_user: models.User = Depends(get_current_user),
    session=Depends(get_session)
):
    # Get the quiz
    quiz = await session.get(models.Quiz, submission.quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Get the questions and answers
    result = await session.execute(
        select(models.Question).where(models.Question.quiz_id == submission.quiz_id)
    )
    questions = {q.id: q for q in result.scalars().all()}
    
    # Calculate score
    total = len(questions)
    correct = 0
    correct_answers = {}
    feedback = {}
    
    for q_id, selected_idx in submission.answers.items():
        if str(q_id) not in [str(id) for id in questions.keys()]:
            continue
            
        question = questions[int(q_id)]
        correct_idx = int(question.answer)
        correct_answers[q_id] = correct_idx
        
        if selected_idx == correct_idx:
            correct += 1
            feedback[q_id] = "Correct!"
        else:
            choices = json.loads(question.choices) if isinstance(question.choices, str) else question.choices
            feedback[q_id] = f"Incorrect. The correct answer is: {choices[correct_idx]}"
    
    # Calculate percentage score (out of 800 for SAT-style scoring)
    score = int(600 + (correct / total) * 200) if total > 0 else 600
    
    # Save result to database
    quiz_result = models.QuizResult(
        user_id=current_user.id,
        quiz_id=quiz.id,
        score=score
    )
    session.add(quiz_result)
    await session.commit()
    
    return QuizResult(
        score=score,
        total=total,
        correct_answers=correct_answers,
        feedback=feedback
    )