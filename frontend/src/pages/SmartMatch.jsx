import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, Users, Zap, Target, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: Zap,    title: 'AI-Powered Matching',    desc: 'Get matched with teammates based on your verified skills and competition style.' },
  { icon: Target, title: 'Role-Based Suggestions', desc: 'Find people who complement your skillset — no more unbalanced teams.' },
  { icon: Users,  title: 'Compatibility Score',    desc: 'See how well you mesh with potential teammates before sending a request.' },
  { icon: Shield, title: 'Verified Profiles Only', desc: 'Every match is with a user whose skills have been AI-verified.' },
];

export default function SmartMatch() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isUnrated = !user?.is_assessment_done || !user?.tier || user?.tier === 'Unrated';

  // If rated in future, render actual smart match UI here
  if (!isUnrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#5C5C5C]">Smart Match coming soon...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500 font-sans">

      {/* Locked Hero */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
        {/* Purple gradient header */}
        <div className="bg-gradient-to-br from-[#7856FF] via-[#9B7AFF] to-[#C4B0FF] px-8 py-12 text-center relative overflow-hidden">
          {/* Background blur circles */}
          <div className="absolute top-[-30%] right-[-10%] w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-[-30%] left-[-10%] w-64 h-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/30">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Smart Match</h1>
            <p className="text-white/80 text-base max-w-md mx-auto">
              This feature is locked. Complete your skill assessment to unlock AI-powered team matchmaking.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">

          {/* Why locked */}
          <div className="flex items-start space-x-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-amber-600 text-sm font-bold">!</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">Your profile is currently Unrated</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Smart Match uses your verified skill rating to find compatible teammates. You need to complete the one-time skill assessment first.
              </p>
            </div>
          </div>

          {/* What you unlock */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">What you unlock</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start space-x-3 p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl">
                  <div className="w-9 h-9 bg-[#E8DDFF] rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#7856FF]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#201F24]">{title}</p>
                    <p className="text-xs text-[#5C5C5C] mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/assessment')}
              className="flex-1 flex items-center justify-center space-x-2 py-3.5 bg-[#7856FF] hover:bg-[#6846EB] text-white rounded-xl font-bold transition-colors shadow-lg shadow-[#7856FF]/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Skill Assessment</span>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center space-x-2 py-3.5 px-6 bg-white border border-[#E5E7EB] text-[#5C5C5C] rounded-xl font-medium hover:bg-[#FAFAFA] transition-colors text-sm"
            >
              View My Profile
            </button>
          </div>

          <p className="text-center text-xs text-gray-400">
            The assessment takes ~5 minutes and can only be done once.
          </p>
        </div>
      </div>
    </div>
  );
}
