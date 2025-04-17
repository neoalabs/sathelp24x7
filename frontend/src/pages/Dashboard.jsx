import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatInterface from '../components/ChatInterface';
import { quizService } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
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
  
  // Mock data for progress chart
  const progressData = {
    labels: ['Algebra', 'Geometry', 'Word Problems', 'Statistics', 'Logic'],
    datasets: [
      {
        label: 'Mastery Level',
        data: [75, 60, 85, 45, 70],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'SAT Math Topic Mastery',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Mastery %'
        }
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">SATHELP24x7</h1>
            </div>
            <div className="flex items-center">
              <button 
                onClick={logout}
                className="px-3 py-1 text-sm border border-red-500 text-red-600 rounded hover:bg-red-50"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="chat">AI Tutor</option>
              <option value="quizzes">Quizzes</option>
              <option value="progress">Progress</option>
              <option value="colleges">College Finder</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {['chat', 'quizzes', 'progress', 'colleges'].map((tab) => (
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
        </div>
        
        <div className="mt-6">
          {activeTab === 'chat' && (
            <ChatInterface />
          )}
          
          {activeTab === 'quizzes' && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Practice Quizzes</h2>
                <p className="text-gray-600 mb-6">Test your SAT skills with our practice quizzes.</p>
                
                {loading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quizzes.map((quiz) => (
                      <div 
                        key={quiz.id}
                        className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                        onClick={() => navigate(`/quiz/${quiz.id}`)}
                      >
                        <h3 className="font-semibold text-lg capitalize">{quiz.topic}</h3>
                        <p className="text-sm text-gray-500 capitalize">Difficulty: {quiz.difficulty}</p>
                      </div>
                    ))}
                    
                    {/* Placeholder quiz cards if no quizzes available */}
                    {quizzes.length === 0 && (
                      <>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h3 className="font-semibold text-lg">Algebra Basics</h3>
                          <p className="text-sm text-gray-500">Difficulty: Easy</p>
                          <p className="text-xs text-blue-500 mt-2">Coming soon</p>
                        </div>
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h3 className="font-semibold text-lg">Advanced Geometry</h3>
                          <p className="text-sm text-gray-500">Difficulty: Hard</p>
                          <p className="text-xs text-blue-500 mt-2">Coming soon</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'progress' && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">SAT Math Mastery</h3>
                  <div className="h-80">
                    <Bar options={chartOptions} data={progressData} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border rounded-lg p-4 text-center">
                    <h4 className="text-sm text-gray-500 mb-1">Recent SAT Score</h4>
                    <p className="text-3xl font-bold text-blue-600">720</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <h4 className="text-sm text-gray-500 mb-1">Quizzes Completed</h4>
                    <p className="text-3xl font-bold text-blue-600">12</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <h4 className="text-sm text-gray-500 mb-1">Study Hours</h4>
                    <p className="text-3xl font-bold text-blue-600">24</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'colleges' && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">College Finder</h2>
                <p className="text-gray-600 mb-6">Find colleges that match your preferences and SAT scores.</p>
                
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <input 
                      type="text"
                      placeholder="Search colleges by name, location, major..."
                      className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <button className="bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition">
                    Search
                  </button>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Featured Colleges</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium">Massachusetts Institute of Technology</h4>
                      <p className="text-sm text-gray-500">Cambridge, USA</p>
                      <div className="mt-2 flex justify-between text-sm">
                        <span>Avg. SAT: 1550</span>
                        <span className="text-blue-600">View Details</span>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium">New York University Abu Dhabi</h4>
                      <p className="text-sm text-gray-500">Abu Dhabi, UAE</p>
                      <div className="mt-2 flex justify-between text-sm">
                        <span>Avg. SAT: 1480</span>
                        <span className="text-blue-600">View Details</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}