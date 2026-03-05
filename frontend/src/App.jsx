import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Discover from './pages/Discover';
import SmartMatch from './pages/SmartMatch';
import Profile from './pages/Profile';
import Login from './pages/Login';

import ProfileBuilder from './pages/ProfileBuilder';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import './index.css';

function App() {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<DashboardLayout />}>
        {/* Redirect root to Discover */}
        <Route index element={<Navigate to="/discover" replace />} />

        <Route path="discover" element={<Discover />} />
        <Route path="smart-match" element={<SmartMatch />} />
        <Route path="profile" element={<Profile />} />

        {/* Fallback routes */}
        <Route path="my-teams" element={<div className="p-8 text-indigo-900 font-bold">My Teams (Coming Soon)</div>} />
        <Route path="leaderboard" element={<div className="p-8 text-indigo-900 font-bold">Leaderboard (Coming Soon)</div>} />
      </Route>
      <Route path="/profile/build" element={<ProfileBuilder />} />
    </Routes>
    </AuthProvider>
  );
}

export default App;
