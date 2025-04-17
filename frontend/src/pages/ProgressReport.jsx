import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bar, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import Navbar from '../components/Navbar';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProgressReport() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // week, month, all
  
  // Mock data - in a real app, this would come from API
  const mockData = {
    totalQuizzes: 24,
    totalPoints: 1840,
    studyHours: 48,
    avgScore: 724,
    improvement: 120,
    topicScores: {
      'Algebra': 78,
      'Geometry': 65,
      'Statistics': 82,
      'Word Problems': 74,
      'Reading': 68
    },
    scoreHistory: [
      { date: '2025-01-01', score: 620 },
      { date: '2025-01-15', score: 640 },
      { date: '2025-02-01', score: 680 },
      { date: '2025-02-15', score: 700 },
      { date: '2025-03-01', score: 710 },
      { date: '2025-03-15', score: 730 },
      { date: '2025-04-01', score: 740 },
    ],
    recommendations: [
      "Focus on Geometry - your weakest topic",
      "Increase timed practice sessions for better pacing",
      "Review formula sheet daily for 10 minutes",
      "Take one full practice test each weekend"
    ]
  };
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, navigate]);
  
  // Score history chart data
  const scoreHistoryData = {
    labels: mockData.scoreHistory.map(entry => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'SAT Score',
        data: mockData.scoreHistory.map(entry => entry.score),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        fill: false
      }
    ]
  };
  
  // Topic mastery radar chart
  const topicMasteryData = {
    labels: Object.keys(mockData.topicScores),
    datasets: [
      {
        label: 'Mastery Level (%)',
        data: Object.values(mockData.topicScores),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
      }
    ]
  };
  
  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };
  
  const lineOptions = {
    scales: {
      y: {
        min: 400,
        max: 800,
        title: {
          display: true,
          text: 'SAT Score'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return `Score: ${context.parsed.y}`;
          }
        }
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Progress Report</h1>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Time range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="p-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Average Score</div>
                <div className="text-3xl font-bold text-blue-600">{mockData.avgScore}</div>
                <div className="text-sm text-green-600 mt-1">
                  +{mockData.improvement} points improvement
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Completed Quizzes</div>
                <div className="text-3xl font-bold text-blue-600">{mockData.totalQuizzes}</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Total Study Hours</div>
                <div className="text-3xl font-bold text-blue-600">{mockData.studyHours}</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Total Points Earned</div>
                <div className="text-3xl font-bold text-blue-600">{mockData.totalPoints}</div>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Score History</h2>
                <div className="h-80">
                  <Line data={scoreHistoryData} options={lineOptions} />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Topic Mastery</h2>
                <div className="h-80">
                  <Radar data={topicMasteryData} options={radarOptions} />
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Personalized Recommendations</h2>
              
              <ul className="space-y-3">
                {mockData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-2">{recommendation}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 flex justify-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Create Personalized Study Plan
                </button>
              </div>
            </div>
            
            {/* Study Time Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Predicted Score Range</h2>
              
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                      Your Predicted SAT Score Range
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                      {mockData.avgScore - 50} - {mockData.avgScore + 50}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                  <div style={{ width: "0%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>400</span>
                  <span>500</span>
                  <span>600</span>
                  <span>700</span>
                  <span>800</span>
                </div>
                <div 
                  className="absolute h-6 w-6 bg-blue-600 rounded-full border-2 border-white shadow" 
                  style={{ 
                    left: `${((mockData.avgScore - 400) / 400) * 100}%`, 
                    top: '0.25rem',
                    transform: 'translateX(-50%)'
                  }}
                ></div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Based on your consistent progress, you're on track to reach your target score.
                  Continue focusing on your weak areas for best results.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}