import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock } from 'lucide-react';

export default function AssessmentBanner() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-[#7856FF] to-[#9B7AFF] rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 shadow-lg shadow-[#7856FF]/20">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Complete Your Skill Assessment</h3>
          <p className="text-white/80 text-sm mt-1 max-w-md">
            Your rating is currently <span className="font-bold text-white">Unrated</span>. Complete the one-time skill assessment to unlock team matchmaking, get your ELO rating, and appear on the leaderboard.
          </p>
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-white/70">
            <span>✓ Takes ~5 minutes</span>
            <span>✓ One time only</span>
            <span>✓ AI-powered verification</span>
            <span>✓ Unlocks Smart Match</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate('/assessment')}
        className="shrink-0 flex items-center space-x-2 px-6 py-3 bg-white text-[#7856FF] rounded-xl font-bold text-sm hover:bg-white/90 transition-colors shadow-md"
      >
        <Sparkles className="w-4 h-4" />
        <span>Start Assessment</span>
      </button>
    </div>
  );
}
