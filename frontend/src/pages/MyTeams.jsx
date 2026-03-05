import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

const timeAgo = (dateStr) => {
  if (!dateStr) return 'Unknown';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days > 0)  return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${mins} min${mins !== 1 ? 's' : ''} ago`;
};

// ─── Join Team Modal ──────────────────────────────────────────────────────────
function JoinModal({ onClose, onJoined }) {
  const [code, setCode]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleJoin = async () => {
    if (!code.trim()) return;
    try {
      setLoading(true); setError('');
      await api.post('/teams/join', { invite_code: code.trim() });
      onJoined();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#201F24]">Join a Team</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
        </div>
        <p className="text-sm text-[#5C5C5C] mb-4">Enter the invite code shared by your team leader.</p>
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. A3F9B2"
          className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-[#7856FF] outline-none mb-3"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          onClick={handleJoin}
          disabled={loading || !code.trim()}
          className="w-full py-3 bg-[#7856FF] text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Joining...</span></> : <span>Join Team</span>}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MyTeams() {
  const navigate = useNavigate();
  const [teams, setTeams]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [showJoin, setShowJoin]     = useState(false);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await api.get('/teams/my');
      setTeams(data.teams);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeams(); }, []);

  const getStatusInfo = (team) => {
    const isFull = team.member_count >= team.max_members;
    if (!team.is_open || isFull) return { label: 'Full', color: 'bg-red-400' };
    if (team.competition_status === 'ongoing') return { label: 'Active', color: 'bg-green-500' };
    if (team.member_count < team.max_members) return { label: 'Looking for members', color: 'bg-orange-400' };
    return { label: 'Active', color: 'bg-green-500' };
  };

  return (
    <div className="w-full h-full space-y-8 animate-in fade-in duration-500 font-sans">
      {showJoin && <JoinModal onClose={() => setShowJoin(false)} onJoined={fetchTeams} />}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-[32px] font-[600] tracking-tight text-[#201F24] mb-2">My Teams</h1>
          <p className="text-[#5C5C5C] text-[16px]">Manage your teams, roles, and open invitations.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowJoin(true)}
            className="px-[20px] py-[10px] bg-white border border-[#E5E7EB] text-[#201F24] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)] font-[500] hover:bg-[#FAFAFA] transition-colors text-[14px]"
          >
            Join Team
          </button>
          <button
            onClick={() => navigate('/discover')}
            className="px-[20px] py-[10px] bg-[#7856FF] hover:bg-[#6846EB] text-white rounded-full font-[500] transition-colors text-[14px]"
          >
            Create New Team
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-[#7856FF]" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-sm">{error}</div>
      )}

      {!loading && !error && teams.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
          <div className="w-16 h-16 bg-[#F4F0FF] rounded-2xl flex items-center justify-center text-2xl">👥</div>
          <p className="text-[#201F24] font-semibold text-lg">No teams yet</p>
          <p className="text-[#5C5C5C] text-sm max-w-xs">Register for a competition and create or join a team to get started.</p>
          <button onClick={() => navigate('/discover')} className="px-5 py-2.5 bg-[#7856FF] text-white rounded-full text-sm font-medium">
            Browse Competitions
          </button>
        </div>
      )}

      {!loading && !error && teams.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {teams.map((team) => {
            const statusInfo = getStatusInfo(team);
            return (
              <div
                key={team.id}
                className="group bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 p-6 flex flex-col md:flex-row md:items-center justify-between"
              >
                <div className="flex items-center space-x-5 mb-4 md:mb-0">
                  <div className="w-14 h-14 rounded-xl bg-[#E8DDFF] text-[#7856FF] flex items-center justify-center text-xl font-bold border border-[#7856FF]/20">
                    {team.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-[18px] font-[600] text-[#201F24] group-hover:text-[#7856FF] transition-colors">
                      {team.name}
                    </h3>
                    <div className="text-[14px] text-[#5C5C5C] flex items-center space-x-2 mt-1">
                      <span className="font-medium px-2 py-0.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-md capitalize">
                        {team.my_role}
                      </span>
                      <span>•</span>
                      <span>{team.member_count}/{team.max_members} Members</span>
                    </div>
                    {/* Member avatars */}
                    {team.members?.length > 0 && (
                      <div className="flex -space-x-2 mt-2">
                        {team.members.slice(0, 5).map(m => (
                          <div key={m.id} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-[#E8DDFF]">
                            {m.avatar_url
                              ? <img src={m.avatar_url} alt={m.username} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-[#7856FF]">
                                  {(m.full_name || m.username || '?').charAt(0).toUpperCase()}
                                </div>
                            }
                          </div>
                        ))}
                        {team.members.length > 5 && (
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] text-gray-500">
                            +{team.members.length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${statusInfo.color}`}></span>
                    <span className="text-[14px] text-[#201F24] font-medium">{statusInfo.label}</span>
                  </div>
                  <div className="text-[13px] text-[#5C5C5C]">Last active {timeAgo(team.last_active_at)}</div>
                  {team.competition_title && (
                    <div className="text-[12px] text-[#7856FF] font-medium">
                      Registered for {team.competition_title}
                    </div>
                  )}
                  {team.my_role === 'leader' && team.invite_code && (
                    <div className="text-[11px] text-gray-400 font-mono">
                      Code: <span className="font-bold text-gray-600 select-all">{team.invite_code}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 md:mt-0 md:ml-6">
                  <button className="w-full md:w-auto px-4 py-2 bg-white border border-[#E5E7EB] hover:bg-[#FAFAFA] text-[#201F24] rounded-lg text-[14px] font-[500] transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
