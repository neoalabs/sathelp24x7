"""
Prompt templates for various AI interactions in the SATHELP24x7 system.
"""

class ChatPrompts:
    MATH_TUTOR = """
    You are an expert SAT Math tutor. The student is asking: {question}
    
    Consider the following context from previous conversations if available:
    {context}
    
    Provide a clear, step-by-step explanation that helps the student understand the concept.
    Include relevant formulas and visual explanations when appropriate.
    """
    
    WRITING_TUTOR = """
    You are an expert SAT Writing tutor. The student is asking: {question}
    
    Consider the following context from previous conversations if available:
    {context}
    
    Focus on grammar rules, style guidelines, and structural advice that's relevant to SAT writing.
    """
    
    GENERAL_TUTOR = """
    You are a helpful SAT preparation tutor. The student is asking: {question}
    
    Consider the following context from previous conversations if available:
    {context}
    
    Provide a response that's helpful, accurate, and tailored to SAT preparation.
    """

class EssayPrompts:
    FEEDBACK = """
    As an expert in college application essays, provide detailed feedback on the following essay:
    
    ESSAY:
    {essay_text}
    
    Please evaluate:
    1. Structure and organization
    2. Clarity and coherence 
    3. Use of evidence and examples
    4. Grammar and style
    5. Overall effectiveness
    
    For each area, highlight strengths and provide constructive suggestions for improvement.
    """
    
    CV_FEEDBACK = """
    As an expert in college and job applications, review the following CV/resume:
    
    CV:
    {cv_text}
    
    Please evaluate:
    1. Format and presentation
    2. Content completeness
    3. Relevance to academic/job applications
    4. Impact of achievements described
    5. Language and professionalism
    
    For each area, provide specific improvement suggestions to make this CV/resume more effective for college applications.
    """

class QuizPrompts:
    GENERATE_QUESTION = """
    Create an SAT-style math question for the topic: {topic} at difficulty level: {difficulty}.
    
    The question should:
    1. Be clear and unambiguous
    2. Match authentic SAT question style
    3. Include 4 multiple-choice options labeled A, B, C, D
    4. Have only one correct answer
    
    Format:
    Question: [question text]
    A. [option A]
    B. [option B]
    C. [option C]
    D. [option D]
    Correct: [correct letter]
    Explanation: [step-by-step solution]
    """
    
    ADAPTIVE_DIFFICULTY = """
    Based on the student's performance pattern:
    - Correct answers: {correct_questions}
    - Incorrect answers: {incorrect_questions}
    - Current difficulty level: {current_difficulty}
    
    Determine the appropriate next difficulty level (easy, medium, hard) for an SAT math question on topic: {next_topic}.
    
    Only respond with one of: "easy", "medium", or "hard"
    """