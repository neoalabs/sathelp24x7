import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MathPractice from './pages/MathPractice';
import EssayEditor from './pages/EssayEditor';
import CollegeFinder from './pages/CollegeFinder';
import ProgressReport from './pages/ProgressReport';
import QuizInterface from './components/QuizInterface';

// Protected route wrapper component
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Public route wrapper component (redirects if already authenticated)
export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

// Routes configuration
const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    )
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/practice',
    element: (
      <ProtectedRoute>
        <MathPractice />
      </ProtectedRoute>
    )
  },
  {
    path: '/essay',
    element: (
      <ProtectedRoute>
        <EssayEditor />
      </ProtectedRoute>
    )
  },
  {
    path: '/colleges',
    element: (
      <ProtectedRoute>
        <CollegeFinder />
      </ProtectedRoute>
    )
  },
  {
    path: '/progress',
    element: (
      <ProtectedRoute>
        <ProgressReport />
      </ProtectedRoute>
    )
  },
  {
    path: '/quiz/:quizId',
    element: (
      <ProtectedRoute>
        <QuizInterface />
      </ProtectedRoute>
    )
  }
];

export default routes;