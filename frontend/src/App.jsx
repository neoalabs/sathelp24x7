import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MathPractice from "./pages/MathPractice";
import EssayEditor from "./pages/EssayEditor"; 
import CollegeFinder from "./pages/CollegeFinder";
import ProgressReport from "./pages/ProgressReport";
import QuizInterface from "./components/QuizInterface";
import { ProtectedRoute } from "./routes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/practice" element={
        <ProtectedRoute>
          <MathPractice />
        </ProtectedRoute>
      } />
      <Route path="/essay" element={
        <ProtectedRoute>
          <EssayEditor />
        </ProtectedRoute>
      } />
      <Route path="/colleges" element={
        <ProtectedRoute>
          <CollegeFinder />
        </ProtectedRoute>
      } />
      <Route path="/progress" element={
        <ProtectedRoute>
          <ProgressReport />
        </ProtectedRoute>
      } />
      <Route path="/quiz/:quizId" element={
        <ProtectedRoute>
          <QuizInterface />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;