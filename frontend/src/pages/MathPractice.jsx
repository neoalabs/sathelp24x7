import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizService } from '../services/api';
import Navbar from '../components/Navbar';
import { FlashcardDeck } from '../components/Flashcard';

// Mock flashcard data - in a real app, this would come from the API
const MOCK_FLASHCARDS = [
  {
    front: "Quadratic Formula",
    back: "x = (-b ± √(b² - 4ac)) / 2a"
  },
  {
    front: "Pythagorean Theorem",
    back: "a² + b² = c²"
  },
  {
    front: "Area of a Circle",
    back: "A = πr²"
  },
  {
    front: "Slope Formula",
    back: "m = (y₂ - y₁) / (x₂ - x₁)"
  },
  {
    front: "Distance Formula",
    back: "d = √[(x₂ - x₁)² + (y₂ - y₁)²]"
  }
];

export default function MathPractice() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('topics');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // SAT Math topics
  const topics = [
    {
      name: "Algebra",
      description: "Linear equations, quadratics, functions, and more",
      icon: "📊",
      subtopics: ["Linear Equations", "Quadratic Functions", "Systems of Equations", "Inequalities"]
    },
    {
      name: "Geometry",
      description: "Angles, triangles, circles, and coordinate geometry",
      icon: "📐",
      subtopics: ["Angles", "Triangles", "Circles", "Coordinate Geometry"]
    },
    {
      name: "Statistics",
      description: "Data analysis, probability, and statistical concepts",
      icon: "📈",
      subtopics: ["Mean, Median, Mode", "Standard Deviation", "Probability", "Data Interpretation"]
    },
    {
      name: "Word Problems",
      description: "Real-world application problems requiring math skills",
      icon: "🔢",
      subtopics: ["Rate Problems", "Work Problems", "Mixture Problems", "Distance Problems"]
    }
  ];
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchQuizzes = async () => {
      try {
        const response = await quizService.getQuizzes();
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [isAuthenticated, navigate]);
  
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };
  
  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">SAT Math Practice</h1>
        
        {/* Sub-navigation */}
        <div className="sm:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="topics">Topics</option>
            <option value="quizzes">Quizzes</option>
            <option value="flashcards">Flashcards</option>
            <option value="solver">Math Solver</option>
          </select>
        </div>
        
        <div className="hidden sm:block mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['topics', 'quizzes', 'flashcards', 'solver'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Content based on selected tab */}
        <div className="mt-6">
          {/* Topics View */}
          {activeTab === 'topics' && (
            <div>
              {selectedTopic ? (
                <div>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="flex items-center text-blue-600 mb-4"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Topics
                  </button>
                  
                  <h2 className="text-2xl font-bold mb-2">{selectedTopic.name} {selectedTopic.icon}</h2>
                  <p className="text-gray-600 mb-6">{selectedTopic.description}</p>
                  
                  <h3 className="text-xl font-semibold mb-4">Subtopics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {selectedTopic.subtopics.map((subtopic, idx) => (
                      <div key={idx} className="border rounded-lg p-4 bg-white hover:shadow-md transition">
                        <h4 className="font-medium text-lg">{subtopic}</h4>
                        <div className="mt-3 flex justify-end">
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                            Practice
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Related Quizzes */}
                  <h3 className="text-xl font-semibold mb-4">Related Quizzes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                      <div>Loading quizzes...</div>
                    ) : (
                      quizzes
                        .filter(quiz => quiz.topic.toLowerCase() === selectedTopic.name.toLowerCase())
                        .map(quiz => (
                          <div key={quiz.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition">
                            <h4 className="font-medium text-lg capitalize">{quiz.topic}</h4>
                            <p className="text-sm text-gray-500 mb-3">Difficulty: {quiz.difficulty}</p>
                            <div className="flex justify-end">
                              <button 
                                onClick={() => handleStartQuiz(quiz.id)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              >
                                Start Quiz
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                    
                    {!loading && quizzes.filter(quiz => 
                      quiz.topic.toLowerCase() === selectedTopic.name.toLowerCase()
                    ).length === 0 && (
                      <div className="text-gray-500">No quizzes available for this topic yet.</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {topics.map((topic, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleTopicSelect(topic)}
                      className="border rounded-lg p-6 bg-white hover:shadow-md transition cursor-pointer"
                    >
                      <div className="text-4xl mb-2">{topic.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{topic.name}</h3>
                      <p className="text-gray-600">{topic.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Quizzes View */}
          {activeTab === 'quizzes' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">SAT Math Quizzes</h2>
              <p className="text-gray-600 mb-6">Test your knowledge with our adaptive quizzes.</p>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quizzes.map((quiz) => (
                    <div 
                      key={quiz.id}
                      className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => handleStartQuiz(quiz.id)}
                    >
                      <h3 className="font-semibold text-lg capitalize">{quiz.topic}</h3>
                      <p className="text-sm text-gray-500 capitalize">Difficulty: {quiz.difficulty}</p>
                    </div>
                  ))}
                  
                  {quizzes.length === 0 && (
                    <div className="col-span-3 text-center py-8 text-gray-500">
                      No quizzes available. Please check back later.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Flashcards View */}
          {activeTab === 'flashcards' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">SAT Math Flashcards</h2>
              <p className="text-gray-600 mb-6">Memorize key formulas and concepts with flashcards.</p>
              
              <div className="my-8">
                <FlashcardDeck cards={MOCK_FLASHCARDS} />
              </div>
            </div>
          )}
          
          {/* Math Solver View */}
          {activeTab === 'solver' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">AI Math Solver</h2>
              <p className="text-gray-600 mb-6">Get step-by-step solutions for any SAT math problem.</p>
              
              <div className="bg-white rounded-lg shadow p-6">
                <label htmlFor="math-problem" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your math problem
                </label>
                <textarea
                  id="math-problem"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type or paste your math problem here..."
                ></textarea>
                
                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Solve Problem
                  </button>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <p className="text-gray-500 text-center">Solution will appear here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}