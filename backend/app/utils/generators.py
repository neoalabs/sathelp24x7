"""
Generators for creating quizzes, flashcards, and other learning materials.
"""

import random
import json
from typing import List, Dict, Any, Optional, Tuple
from app.services.gemini import generate_response
from app.utils.prompts import QuizPrompts

# Math topics and subtopics for quiz generation
MATH_TOPICS = {
    "algebra": [
        "Linear equations", 
        "Quadratic equations", 
        "Inequalities", 
        "Functions",
        "Systems of equations"
    ],
    "geometry": [
        "Lines and angles", 
        "Triangles", 
        "Circles", 
        "Polygons",
        "Coordinate geometry"
    ],
    "statistics": [
        "Mean, median, mode", 
        "Standard deviation", 
        "Probability", 
        "Data interpretation",
        "Normal distribution"
    ],
    "word_problems": [
        "Rate problems", 
        "Work problems", 
        "Mixture problems", 
        "Distance problems",
        "Percent problems"
    ]
}

# Difficulty levels and their weights for adaptive quizzing
DIFFICULTY_LEVELS = ["easy", "medium", "hard"]
DIFFICULTY_WEIGHTS = {
    "easy": {"easy": 0.7, "medium": 0.3, "hard": 0.0},
    "medium": {"easy": 0.2, "medium": 0.6, "hard": 0.2},
    "hard": {"easy": 0.0, "medium": 0.3, "hard": 0.7}
}

async def generate_quiz_question(
    topic: str, 
    difficulty: str = "medium",
    subtopic: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generate a single quiz question using AI.
    
    Args:
        topic: Main topic (algebra, geometry, etc.)
        difficulty: Question difficulty (easy, medium, hard)
        subtopic: Optional specific subtopic
        
    Returns:
        Dictionary containing the generated question
    """
    if not subtopic and topic in MATH_TOPICS:
        subtopic = random.choice(MATH_TOPICS[topic])
        
    full_topic = f"{subtopic} in {topic}" if subtopic else topic
    
    # Generate the question using Gemini
    prompt = QuizPrompts.GENERATE_QUESTION.format(
        topic=full_topic,
        difficulty=difficulty
    )
    
    response = await generate_response(prompt)
    
    # Parse the response
    try:
        lines = response.strip().split('\n')
        question_text = ""
        options = []
        correct_answer = ""
        explanation = ""
        
        # Extract question content
        for i, line in enumerate(lines):
            if line.startswith("Question:"):
                question_text = line.replace("Question:", "").strip()
            elif line.startswith(("A.", "B.", "C.", "D.")):
                options.append(line[2:].strip())
            elif line.startswith("Correct:"):
                correct_letter = line.replace("Correct:", "").strip()
                correct_answer = ["A", "B", "C", "D"].index(correct_letter)
            elif line.startswith("Explanation:"):
                explanation = '\n'.join(lines[i:]).replace("Explanation:", "").strip()
                break
        
        return {
            "prompt": question_text,
            "choices": options,
            "answer": str(correct_answer),
            "explanation": explanation,
            "topic": topic,
            "subtopic": subtopic,
            "difficulty": difficulty
        }
    except Exception as e:
        # Fallback with static question if parsing fails
        print(f"Error parsing AI response: {e}")
        return {
            "prompt": f"Sample {topic} question about {subtopic}",
            "choices": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "0",
            "explanation": "This is a placeholder explanation.",
            "topic": topic,
            "subtopic": subtopic,
            "difficulty": difficulty
        }

async def generate_adaptive_quiz(
    topic: str,
    user_performance: Dict[str, List[str]],
    num_questions: int = 10
) -> List[Dict[str, Any]]:
    """
    Generate an adaptive quiz based on user performance.
    
    Args:
        topic: Quiz topic
        user_performance: Dictionary with correct and incorrect question IDs
        num_questions: Number of questions to generate
        
    Returns:
        List of quiz questions
    """
    questions = []
    current_difficulty = "medium"
    
    # Determine initial difficulty based on past performance
    correct_ratio = 0.5  # Default 50% if no history
    if len(user_performance.get("correct", [])) + len(user_performance.get("incorrect", [])) > 0:
        total_answered = len(user_performance.get("correct", [])) + len(user_performance.get("incorrect", []))
        correct_ratio = len(user_performance.get("correct", [])) / total_answered
        
        if correct_ratio > 0.8:
            current_difficulty = "hard"
        elif correct_ratio < 0.4:
            current_difficulty = "easy"
    
    # Generate questions with adaptive difficulty
    for i in range(num_questions):
        # Update difficulty based on performance
        if i > 0:
            # Weighted random selection for next difficulty
            weights = DIFFICULTY_WEIGHTS[current_difficulty]
            current_difficulty = random.choices(
                DIFFICULTY_LEVELS, 
                weights=[weights.get(d, 0) for d in DIFFICULTY_LEVELS]
            )[0]
        
        # Generate question with current difficulty
        question = await generate_quiz_question(topic, current_difficulty)
        questions.append(question)
    
    return questions

async def generate_flashcards(
    topic: str,
    subtopic: Optional[str] = None,
    num_cards: int = 5
) -> List[Dict[str, str]]:
    """
    Generate flashcards for a specific topic.
    
    Args:
        topic: Topic for flashcards
        subtopic: Optional subtopic
        num_cards: Number of flashcards to generate
        
    Returns:
        List of flashcard dictionaries (front/back)
    """
    full_topic = f"{subtopic} in {topic}" if subtopic else topic
    
    prompt = f"""
    Create {num_cards} SAT math flashcards for the topic: {full_topic}.
    
    Each flashcard should have:
    1. A front side with a key concept, formula, or rule
    2. A back side with explanation, application, or example
    
    Format your response as valid JSON with this structure:
    [
      {{
        "front": "Concept or Formula",
        "back": "Explanation or Example"
      }},
      ...
    ]
    """
    
    try:
        response = await generate_response(prompt)
        cards = json.loads(response)
        return cards
    except Exception as e:
        # Fallback with static flashcards if generation fails
        print(f"Error generating flashcards: {e}")
        return [
            {
                "front": f"Key formula for {full_topic}",
                "back": "This is a placeholder explanation"
            }
            for _ in range(num_cards)
        ]