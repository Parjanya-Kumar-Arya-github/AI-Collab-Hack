import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    const token = params.get('token');
    const isNew = params.get('new') === 'true';

    console.log('Token received:', token);   // ← add this
    console.log('Is new user:', isNew);      // ← add this

    if (!token) {
      navigate('/login?error=no_token');
      return;
    }

    loginWithToken(token);
    // New user → profile setup. Returning user → dashboard
    navigate(isNew ? '/update-profile' : '/discover', { replace: true });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}
