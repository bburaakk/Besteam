import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import RoadmapPage from './pages/RoadmapPage';
import CVAnalysisPage from './pages/CVAnalysisPage';
import DashboardPage from './pages/DashboardPage';
import ProjectSuggestionsPage from './pages/ProjectSuggestionsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/cv-analysis" element={<CVAnalysisPage />} />
          <Route path="/project-suggestions" element={<ProjectSuggestionsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
