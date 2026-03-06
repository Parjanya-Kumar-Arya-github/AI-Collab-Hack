import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import CollabDrawer from '../components/CollabDrawer';
import RegistrationModal from '../components/RegistrationModal';
import {
  Calendar, Trophy, Users, Globe, MapPin, Tag, ExternalLink,
  Sparkles, Loader2, ChevronRight, CheckCircle2, Clock, Zap,
  ArrowLeft, Star
} from 'lucide-react';

const TIER_COLOR = {
  Elite: 'bg-amber-100 text-amber-700', Expert: 'bg-indigo-100 text-indigo-700',
  Hacker: 'bg-orange-100 text-orange-700', Builder: 'bg-green-100 text-green-700',
  Explorer: 'bg-gray-100 text-gray-600',
};

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export default function CompetitionDetail() {
  const { id }          = useParams();
  const { user }        = useAuth();
  const navigate        = useNavigate();

  const [comp, setComp]               = useState(null);
  const [workflow, setWorkflow]       = useState(null);
  const [rolesNeeded, setRoles]       = useState(null);
  const [loadingComp, setLoadingComp] = useState(true);
  const [loadingWF, setLoadingWF]     = useState(false);
  const [registering, setRegistering] = useState(false);
  const [showCollab, setShowCollab]   = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    fetchComp();
  }, [id]);

  const fetchComp = async () => {
    try {
      setLoadingComp(true);
      const data = await api.get(`/competitions/${id}`);
      setComp(data.competition);
    } catch (err) {
      setError('Competition not found.');
    } finally {
      setLoadingComp(false);
    }
  };

  const fetchWorkflow = async () => {
    try {
      setLoadingWF(true);
      const data = await api.get(`/competitions/${id}/workflow`);
      setWorkflow(data.workflow);
      setRoles(data.roles_needed);
    } catch (err) {
      console.error('Workflow error:', err);
    } finally {
      setLoadingWF(false);
    }
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await api.post(`/competitions/${id}/register`);
      setComp(prev => ({ ...prev, is_registered: true, participant_count: parseInt(prev.participant_count) + 1 }));
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setRegistering(false);
    }
  };

  if (loadingComp) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-[#7856FF] animate-spin" />
    </div>
  );

  if (error || !comp) return (
    <div className="text-center py-20">
      <p className="text-gray-500">{error || 'Competition not found.'}</p>
      <button onClick={() => navigate('/discover')} className="mt-4 text-[#7856FF] text-sm font-medium">← Back to Discover</button>
    </div>
  );

  const isExpired     = comp.status === 'completed';
  const isRegistered  = comp.is_registered;
  const deadlinePassed = comp.registration_deadline && new Date(comp.registration_deadline) < new Date();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-32">
      {/* Back */}
      <button onClick={() => navigate('/discover')} className="flex items-center space-x-1 text-sm text-gray-400 hover:text-gray-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /><span>Back to Discover</span>
      </button>

      {/* ── Hero Banner ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {comp.banner_url ? (
          <img src={comp.banner_url} alt={comp.title} className="w-full h-52 object-cover" />
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-[#7856FF] via-[#9B7AFF] to-[#C4B0FF] flex items-center justify-center">
            <Trophy className="w-16 h-16 text-white/40" />
          </div>
        )}

        <div className="p-6">
          {/* Type + status badges */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="px-2.5 py-1 bg-[#E8DDFF] text-[#7856FF] text-xs font-bold rounded-lg capitalize">
              {comp.type?.replace('_', ' ')}
            </span>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg capitalize ${
              comp.status === 'open'     ? 'bg-green-100 text-green-700' :
              comp.status === 'ongoing'  ? 'bg-blue-100 text-blue-700' :
              comp.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' :
                                           'bg-gray-100 text-gray-500'
            }`}>
              {comp.status}
            </span>
            {comp.is_online && <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-lg">🌐 Online</span>}
          </div>

          <h1 className="text-2xl font-black text-gray-900 mb-2">{comp.title}</h1>

          {/* Organizer */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-[#E8DDFF] overflow-hidden flex items-center justify-center">
              {comp.organizer_avatar
                ? <img src={comp.organizer_avatar} alt="" className="w-full h-full object-cover" />
                : <span className="text-[10px] font-bold text-[#7856FF]">{(comp.organizer_full_name || comp.organizer_name || 'O').charAt(0)}</span>
              }
            </div>
            <span className="text-sm text-gray-500">by <span className="font-medium text-gray-700">{comp.organizer_full_name || comp.organizer_name || 'Unknown'}</span></span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100">
            {[
              { icon: Calendar, label: 'Starts',        value: fmt(comp.start_date) },
              { icon: Clock,    label: 'Ends',          value: fmt(comp.end_date) },
              { icon: Trophy,   label: 'Prize Pool',    value: comp.prize_pool || 'TBD' },
              { icon: Users,    label: 'Participants',  value: `${comp.participant_count || 0}${comp.max_participants ? ` / ${comp.max_participants}` : ''}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start space-x-2">
                <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          {comp.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {comp.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg flex items-center space-x-1">
                  <Tag className="w-3 h-3" /><span>{tag}</span>
                </span>
              ))}
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-4">
            {comp.website_url && (
              <a href={comp.website_url} target="_blank" rel="noreferrer"
                className="flex items-center space-x-1.5 text-sm text-[#7856FF] font-medium hover:underline">
                <Globe className="w-4 h-4" /><span>Competition Website</span><ExternalLink className="w-3 h-3" />
              </a>
            )}
            {comp.location && (
              <span className="flex items-center space-x-1.5 text-sm text-gray-500">
                <MapPin className="w-4 h-4" /><span>{comp.location}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── About ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{comp.description}</p>
        {comp.prize_description && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">🏆 Prize Breakdown</p>
            <p className="text-sm text-amber-800 whitespace-pre-line">{comp.prize_description}</p>
          </div>
        )}
      </div>

      {/* ── AI Workflow ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#E8DDFF] rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#7856FF]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">AI Competition Workflow</h2>
              <p className="text-xs text-gray-400">Personalized action plan for this competition</p>
            </div>
          </div>
          {!workflow && !loadingWF && (
            <button onClick={fetchWorkflow}
              className="flex items-center space-x-2 px-4 py-2 bg-[#7856FF] text-white rounded-xl text-xs font-bold hover:bg-[#6846EB] transition-colors">
              <Sparkles className="w-3.5 h-3.5" /><span>Generate</span>
            </button>
          )}
        </div>

        {loadingWF && (
          <div className="flex items-center space-x-3 py-8 justify-center text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">AI is crafting your workflow...</span>
          </div>
        )}

        {!workflow && !loadingWF && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">Click "Generate" to get an AI-crafted step-by-step action plan for this competition.</p>
          </div>
        )}

        {workflow && (
          <div className="space-y-4">
            {/* Key insight */}
            {rolesNeeded?.key_insight && (
              <div className="bg-[#F4F0FF] border border-[#7856FF]/20 rounded-xl px-4 py-3 flex items-start space-x-2">
                <Star className="w-4 h-4 text-[#7856FF] shrink-0 mt-0.5" />
                <p className="text-sm text-[#5C3FBB] font-medium">{rolesNeeded.key_insight}</p>
              </div>
            )}

            {/* Workflow phases */}
            <div className="relative">
              {workflow.map((phase, idx) => (
                <div key={idx} className="flex space-x-4 mb-5">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-[#E8DDFF] text-[#7856FF] flex items-center justify-center text-lg shrink-0">
                      {phase.icon || '📋'}
                    </div>
                    {idx < workflow.length - 1 && <div className="w-0.5 bg-gray-100 flex-1 mt-2 min-h-[20px]" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-bold text-gray-900 text-sm">{phase.phase}</h4>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{phase.timeline}</span>
                    </div>
                    <ul className="space-y-1 mb-2">
                      {phase.steps?.map((step, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                    {phase.tip && (
                      <div className="flex items-start space-x-2 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
                        <Zap className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-700 italic">{phase.tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Domain roles breakdown */}
            {rolesNeeded?.roles_needed?.length > 0 && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Roles needed for this competition</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rolesNeeded.roles_needed.map((role, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 mt-0.5 ${
                        role.priority === 'high'   ? 'bg-red-100 text-red-600' :
                        role.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                                     'bg-gray-100 text-gray-500'
                      }`}>{role.priority}</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{role.domain} <span className="font-normal text-gray-400">×{role.count}</span></p>
                        <p className="text-xs text-gray-500 mt-0.5">{role.reason}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {role.skills?.map(s => (
                            <span key={s} className="text-[10px] bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common mistakes */}
            {rolesNeeded?.common_mistakes?.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">⚠ Common Mistakes to Avoid</p>
                <ul className="space-y-1">
                  {rolesNeeded.common_mistakes.map((m, i) => (
                    <li key={i} className="text-xs text-gray-500 flex items-start space-x-2">
                      <span className="text-red-400 shrink-0">✗</span><span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Sticky Action Bar ── */}
      <div className="fixed bottom-0 left-[280px] right-0 bg-white border-t border-gray-100 px-8 py-4 flex items-center justify-between z-20 shadow-lg">
        <div className="text-sm text-gray-500">
          {comp.registration_deadline && (
            <span>Registration {deadlinePassed ? 'closed' : `closes ${fmt(comp.registration_deadline)}`}</span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {/* Collab button — only if registered or assessment done */}
          {user?.is_assessment_done && (
            <button
              onClick={() => setShowCollab(true)}
              className="flex items-center space-x-2 px-5 py-2.5 border-2 border-[#7856FF] text-[#7856FF] rounded-xl text-sm font-bold hover:bg-[#F4F0FF] transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>🤝 Find Collaborators</span>
            </button>
          )}

          {/* Register button */}
          {isRegistered ? (
            <div className="flex items-center space-x-2 px-5 py-2.5 bg-green-100 text-green-700 rounded-xl text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Registered</span>
            </div>
          ) : isExpired || deadlinePassed ? (
            <div className="px-5 py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-medium">
              Registration Closed
            </div>
          ) : (
            <button
              onClick={() => setShowRegister(true)}
              className="flex items-center space-x-2 px-6 py-2.5 bg-[#7856FF] text-white rounded-xl text-sm font-bold hover:bg-[#6846EB] transition-colors shadow-lg shadow-[#7856FF]/20"
            >
              <Trophy className="w-4 h-4" /><span>Register Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Collab Drawer */}
      {showCollab && (
        <CollabDrawer
          competitionId={id}
          competitionTitle={comp.title}
          onClose={() => setShowCollab(false)}
        />
      )}

      {/* Registration Modal */}
      {showRegister && (
        <RegistrationModal
          competition={comp}
          onClose={() => setShowRegister(false)}
          onSuccess={() => {
            setShowRegister(false);
            setComp(prev => ({ ...prev, is_registered: true, participant_count: parseInt(prev.participant_count) + 1 }));
          }}
        />
      )}
    </div>
  );
}
