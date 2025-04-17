import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import Dashboard from '../../src/pages/Dashboard';
import '@testing-library/jest-dom';

// Mock the API service
jest.mock('../../src/services/api', () => ({
  quizService: {
    getQuizzes: jest.fn().mockResolvedValue({
      data: [
        { id: 1, topic: 'algebra', difficulty: 'medium' },
        { id: 2, topic: 'geometry', difficulty: 'hard' }
      ]
    })
  }
}));

// Mock the useNavigate and useAuth hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../../src/context/AuthContext', () => ({
  ...jest.requireActual('../../src/context/AuthContext'),
  useAuth: () => ({
    isAuthenticated: true,
    logout: jest.fn()
  })
}));

// Mock Chart.js components
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
}));

describe('Dashboard Component', () => {
  test('renders correctly', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check if the dashboard title/header is present
    expect(screen.getByText('SATHELP24x7')).toBeInTheDocument();
    
    // Check if tabs are present
    await waitFor(() => {
      expect(screen.getByText('Chat')).toBeInTheDocument();
      expect(screen.getByText('Quizzes')).toBeInTheDocument();
      expect(screen.getByText('Progress')).toBeInTheDocument();
      expect(screen.getByText('College Finder')).toBeInTheDocument();
    });
  });
  
  test('changes active tab when clicked', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Initial tab should be 'chat'
    await waitFor(() => {
      expect(screen.getByText('SAT AI Tutor')).toBeInTheDocument();
    });
    
    // Click the Quizzes tab
    fireEvent.click(screen.getByText('Quizzes'));
    
    // Should show quizzes content
    await waitFor(() => {
      expect(screen.getByText('Practice Quizzes')).toBeInTheDocument();
    });
    
    // Click the Progress tab
    fireEvent.click(screen.getByText('Progress'));
    
    // Should show progress content
    await waitFor(() => {
      expect(screen.getByText('Your Progress')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });
  
  test('displays quizzes when data is loaded', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Click the Quizzes tab
    fireEvent.click(screen.getByText('Quizzes'));
    
    // Should show quiz data once loaded
    await waitFor(() => {
      expect(screen.getByText('algebra')).toBeInTheDocument();
      expect(screen.getByText('geometry')).toBeInTheDocument();
      expect(screen.getByText('Difficulty: medium')).toBeInTheDocument();
      expect(screen.getByText('Difficulty: hard')).toBeInTheDocument();
    });
  });
});