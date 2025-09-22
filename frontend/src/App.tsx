import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import RoadmapPage from './pages/RoadmapPage';
import RoadmapDetailPage from './pages/RoadmapDetailPage';
import CVAnalysisPage from './pages/CVAnalysisPage';
import DashboardPage from './pages/DashboardPage';
import ProjectSuggestionsPage from './pages/ProjectSuggestionsPage';
import ProjectEvaluationPage from './pages/ProjectEvaluationPage';
import ProfilePage from './pages/ProfilePage';
import QuizPage from './pages/QuizPage';
import HackathonsPage from './pages/HackathonsPage';
import ProtectedRoute from './components/routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
          <Route path="/roadmap" element={<ProtectedRoute element={<RoadmapPage />} />} />
          <Route path="/roadmap/:roadmapId/detail/:itemId" element={<ProtectedRoute element={<RoadmapDetailPage />} />} />
          <Route path="/cv-analysis" element={<CVAnalysisPage />} />
          <Route path="/project-suggestions" element={<ProtectedRoute element={<ProjectSuggestionsPage />} />} />
          <Route path="/project-evaluation/:evaluationId" element={<ProtectedRoute element={<ProjectEvaluationPage />} />} />
          <Route path="/quiz" element={<ProtectedRoute element={<QuizPage />} />} />
          <Route path="/hackathons" element={<ProtectedRoute element={<HackathonsPage />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
          <Route path="/roadmap/:roadmapId/quiz" element={<ProtectedRoute element={<QuizPage />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
