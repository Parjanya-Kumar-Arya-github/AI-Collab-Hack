import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Onboard from './pages/Onboard';
import AuthCallback from './pages/AuthCallback';
import UpdateProfile from './pages/UpdateProfile';
import Discover from './pages/Discover';
import Leaderboard from './pages/Leaderboard';
import MyTeams from './pages/MyTeams';
import Profile from './pages/Profile';
import DashboardLayout from './components/DashboardLayout';
import Assessment from './pages/Assessment';
import SmartMatch from './pages/SmartMatch';
import HostEvent from './pages/HostEvent';
import CompetitionDetail from './pages/CompetitionDetail';
import MyEvents from './pages/MyEvents';


// ─── Guards ──────────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

const PublicOnly = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return null;
  if (token) return <Navigate to="/discover" replace />;
  return children;
};

// ─── Router ───────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public — no sidebar */}
      <Route path="/login" element={<PublicOnly><Onboard /></PublicOnly>} />
      <Route path="/onboard" element={<PublicOnly><Onboard /></PublicOnly>} />

      {/* OAuth callback — no guard, no sidebar */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Profile setup — no sidebar (standalone flow) */}
      <Route path="/update-profile" element={
        <ProtectedRoute><UpdateProfile /></ProtectedRoute>
      } />
      <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />

      {/* ── All dashboard pages share the sidebar layout ── */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/discover" element={<Discover />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/my-teams" element={<MyTeams />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/smart-match" element={<SmartMatch />} />
        <Route path="/competitions/new" element={<HostEvent />} />
        <Route path="/competitions/:id" element={<CompetitionDetail />} />
        <Route path="/my-events" element={<MyEvents />} />
      </Route>

      {/* Public profile — viewable without login */}
      <Route path="/profile/:username" element={<Profile />} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/discover" replace />} />
      <Route path="*" element={<Navigate to="/discover" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}