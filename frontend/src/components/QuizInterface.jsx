import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../services/api';

export default function QuizInterface() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuiz(quizId);
        setQuiz(response.data);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [quizId]);
  
  const handleAnswerChange = (questionId, answerIdx) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIdx
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await quizService.submitQuiz({
        quiz_id: parseInt(quizId),
        answers
      });
      setResults(response.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !quiz) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  if (submitted && results) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <div className="mb-6 text-center">
          <div className="text-5xl font-bold text-blue-700">{results.score}</div>
          <p className="text-gray-600">Your SAT Score</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Question Feedback</h3>
          {quiz.questions.map(q => (
            <div key={q.id} className="mb-4 p-4 bg-gray-50 rounded">
              <p className="font-medium">{q.prompt}</p>
              <div className="mt-2 ml-4">
                <p className={
                  results.feedback[q.id]?.startsWith('Correct') 
                    ? "text-green-600 font-medium" 
                    : "text-red-600 font-medium"
                }>
                  {results.feedback[q.id]}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
              setResults(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">{quiz?.topic.charAt(0).toUpperCase() + quiz?.topic.slice(1)} Quiz</h2>
      <p className="text-gray-600 mb-6">Difficulty: {quiz?.difficulty.charAt(0).toUpperCase() + quiz?.difficulty.slice(1)}</p>
      
      <form onSubmit={handleSubmit}>
        {quiz?.questions.map((question, qIndex) => (
          <div key={question.id} className="mb-8 pb-6 border-b">
            <p className="font-medium mb-4">{qIndex + 1}. {question.prompt}</p>
            <div className="ml-4 space-y-2">
              {question.choices.map((choice, idx) => (
                <label key={idx} className="flex items-start p-3 rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={idx}
                    checked={answers[question.id] === idx}
                    onChange={() => handleAnswerChange(question.id, idx)}
                    className="mt-1 mr-3"
                  />
                  <span>{choice}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading || Object.keys(answers).length < (quiz?.questions.length || 0)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}