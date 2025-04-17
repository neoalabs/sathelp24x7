"""
Service for generating feedback and scoring for essays, quizzes, and progress.
"""

from typing import Dict, List, Any, Optional
import json
from app.services.gemini import generate_response

async def score_essay(essay_text: str, rubric_type: str = "college_app") -> Dict[str, Any]:
    """
    Score an essay based on various criteria.
    
    Args:
        essay_text: The essay to score
        rubric_type: Type of scoring rubric to use
        
    Returns:
        Dictionary containing scores and feedback
    """
    # Define scoring rubrics for different essay types
    rubrics = {
        "college_app": {
            "criteria": [
                "Originality and authenticity",
                "Structure and organization",
                "Grammar and mechanics",
                "Clarity and coherence",
                "Impact and memorability"
            ],
            "max_score": 10
        },
        "sat": {
            "criteria": [
                "Reading comprehension",
                "Analysis of argument",
                "Writing clarity",
                "Grammar and usage",
                "Overall essay effectiveness"
            ],
            "max_score": 8
        }
    }
    
    rubric = rubrics.get(rubric_type, rubrics["college_app"])
    
    prompt = f"""
    Score the following essay based on these criteria (scale 1-{rubric["max_score"]}):
    
    ESSAY:
    {essay_text}
    
    CRITERIA:
    {", ".join(rubric["criteria"])}
    
    For each criterion:
    1. Provide a score (1-{rubric["max_score"]})
    2. Give specific feedback with examples from the essay
    
    Return your response as valid JSON with this structure:
    {{
      "overall_score": (average of all scores),
      "detailed_scores": {{
        "criterion1": {{
          "score": (score value),
          "feedback": "(specific feedback)"
        }},
        ... (for each criterion)
      }},
      "summary": "(overall feedback summary)"
    }}
    """
    
    try:
        response = await generate_response(prompt)
        scores = json.loads(response)
        return scores
    except Exception as e:
        print(f"Error scoring essay: {e}")
        # Fallback with basic scoring
        return {
            "overall_score": 7,
            "detailed_scores": {
                criterion: {"score": 7, "feedback": "Feedback unavailable"} 
                for criterion in rubric["criteria"]
            },
            "summary": "Essay scoring service encountered an error. Please try again later."
        }

async def analyze_quiz_results(
    quiz_results: List[Dict[str, Any]], 
    user_id: int
) -> Dict[str, Any]:
    """
    Analyze a user's quiz results and provide feedback and recommendations.
    
    Args:
        quiz_results: List of quiz attempt dictionaries
        user_id: User ID
        
    Returns:
        Analysis and personalized learning recommendations
    """
    if not quiz_results:
        return {
            "average_score": 0,
            "strengths": [],
            "weaknesses": [],
            "recommendations": ["Complete some quizzes to receive personalized feedback"]
        }
    
    # Calculate basic statistics
    total_score = 0
    correct_by_topic = {}
    total_by_topic = {}
    
    for result in quiz_results:
        total_score += result.get("score", 0)
        
        # Track performance by topic
        topic = result.get("topic", "unknown")
        if topic not in correct_by_topic:
            correct_by_topic[topic] = 0
            total_by_topic[topic] = 0
            
        correct_by_topic[topic] += result.get("correct_count", 0)
        total_by_topic[topic] += result.get("total_questions", 0)
    
    average_score = total_score / len(quiz_results)
    
    # Identify strengths and weaknesses
    strengths = []
    weaknesses = []
    
    for topic, correct in correct_by_topic.items():
        total = total_by_topic[topic]
        if total > 0:
            accuracy = correct / total
            if accuracy >= 0.7:
                strengths.append(topic)
            elif accuracy <= 0.5:
                weaknesses.append(topic)
    
    # Generate recommendations prompt
    prompt = f"""
    Based on this quiz performance data:
    - Average score: {average_score:.1f}
    - Strengths: {', '.join(strengths) if strengths else 'None identified'}
    - Weaknesses: {', '.join(weaknesses) if weaknesses else 'None identified'}
    
    Provide 3-5 specific study recommendations for this SAT student.
    Each recommendation should be focused, actionable, and help improve their score.
    
    Format as JSON:
    {{
      "recommendations": [
        {{
          "topic": "(topic name)",
          "action": "(specific study action)",
          "resource": "(suggested resource or practice method)"
        }},
        ...
      ]
    }}
    """
    
    try:
        response = await generate_response(prompt)
        recommendations = json.loads(response)
        
        return {
            "average_score": average_score,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommendations": recommendations.get("recommendations", [])
        }
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return {
            "average_score": average_score,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommendations": [{
                "topic": "general",
                "action": "Review your weakest topics",
                "resource": "SAT practice questions"
            }]
        }

async def generate_progress_report(user_id: int) -> Dict[str, Any]:
    """
    Generate a comprehensive progress report for a user.
    
    Args:
        user_id: User ID
        
    Returns:
        Progress report data
    """
    # In a real implementation, this would query the database for user activity
    # This is a placeholder that would be replaced with actual DB queries
    
    # Mock data for demonstration purposes
    mock_data = {
        "quiz_attempts": 12,
        "essay_submissions": 3,
        "chat_interactions": 45,
        "study_time_hours": 28,
        "topics_studied": ["algebra", "geometry", "reading comprehension"],
        "average_quiz_score": 720,
        "score_improvement": 80
    }
    
    # AI could enhance this with personalized insights
    prompt = f"""
    Based on this student's SAT prep activity:
    - Completed {mock_data["quiz_attempts"]} quizzes
    - Submitted {mock_data["essay_submissions"]} essays
    - Had {mock_data["chat_interactions"]} tutor chat interactions
    - Studied for {mock_data["study_time_hours"]} hours
    - Current average score: {mock_data["average_quiz_score"]}
    - Improved by {mock_data["score_improvement"]} points
    
    Provide a motivational progress summary and 3 specific recommendations for continued improvement.
    
    Format as JSON:
    {{
      "progress_summary": "(motivational summary)",
      "recommendations": [
        "recommendation 1",
        "recommendation 2",
        "recommendation 3"
      ],
      "estimated_score_range": "(estimated SAT score range based on progress)"
    }}
    """
    
    try:
        response = await generate_response(prompt)
        insights = json.loads(response)
        
        # Combine data and insights
        return {
            **mock_data,
            **insights
        }
    except Exception as e:
        print(f"Error generating progress report: {e}")
        return {
            **mock_data,
            "progress_summary": "You're making good progress in your SAT preparation!",
            "recommendations": [
                "Focus more on your weakest topics",
                "Take timed practice tests to build stamina",
                "Review your mistakes carefully to avoid repeating them"
            ],
            "estimated_score_range": "700-750"
        }