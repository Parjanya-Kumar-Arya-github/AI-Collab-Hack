import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const TIER_COLORS = {
  Elite:    'text-amber-500',
  Expert:   'text-indigo-600',
  Hacker:   'text-orange-500',
  Builder:  'text-green-600',
  Explorer: 'text-gray-500',
};

const TABS = ['Global', 'City'];

export default function Leaderboard() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('Global');
  const [entries, setEntries]     = useState([]);
  const [myRank, setMyRank]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, page]);

  useEffect(() => {
    if (token) fetchMyRank();
  }, [token]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const scope  = activeTab === 'City' ? 'city' : 'global';
      const city   = activeTab === 'City' && user?.city ? user.city : '';
      const params = new URLSearchParams({ scope, page, limit: 50 });
      if (city) params.append('city', city);

      const data = await api.get(`/leaderboard?${params}`);
      setEntries(data.leaderboard);
      setTotalPages(data.pagination.pages);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRank = async () => {
    try {
      const data = await api.get('/leaderboard/me');
      setMyRank(data);
    } catch {}
  };

  return (
    <div className="w-full h-full space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-[32px] font-[600] tracking-tight text-[#201F24] mb-2">Leaderboard</h1>
          <p className="text-[#5C5C5C] text-[16px]">See where you stand among top competitors globally.</p>
        </div>
        {myRank?.rank && (
          <div className="text-sm text-[#5C5C5C] bg-white border border-[#E5E7EB] px-4 py-2 rounded-xl shadow-sm">
            Your rank: <span className="font-bold text-[#7856FF]">#{myRank.rank}</span>
            <span className="ml-2 text-gray-400">·</span>
            <span className="ml-2 font-semibold">{myRank.elo_score?.toLocaleString()} pts</span>
            <span className={`ml-2 text-xs font-bold ${TIER_COLORS[myRank.tier] || ''}`}>{myRank.tier}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-[#FAFAFA] p-1 border border-[#E5E7EB] rounded-xl w-fit mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }}
            className={`px-5 py-2 text-[14px] font-[500] rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-white text-[#201F24] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                : 'text-[#8C8C8C] hover:text-[#5C5C5C]'
            }`}
          >
            {tab === 'City' && user?.city ? `${user.city}` : tab}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-[#7856FF]" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <p className="text-[#5C5C5C]">No users on this leaderboard yet.</p>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB] text-[#5C5C5C] text-[13px] uppercase tracking-wider">
                    <th className="px-6 py-4 font-[600] w-24 text-center">Rank</th>
                    <th className="px-6 py-4 font-[600]">User</th>
                    <th className="px-6 py-4 font-[600] hidden md:table-cell">Tier</th>
                    <th className="px-6 py-4 font-[600] hidden md:table-cell text-center">Competitions</th>
                    <th className="px-6 py-4 font-[600] text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {entries.map((entry) => {
                    const isCurrentUser = user && entry.id === user.id;
                    return (
                      <tr
                        key={entry.id}
                        className={`transition-colors hover:bg-[#FAFAFA] ${isCurrentUser ? 'bg-[#F4F0FF] hover:bg-[#E8DDFF]' : ''}`}
                      >
                        <td className="px-6 py-5 text-center">
                          <span className={`text-[16px] font-[700] ${
                            entry.rank === 1 ? 'text-amber-500' :
                            entry.rank === 2 ? 'text-gray-400' :
                            entry.rank === 3 ? 'text-amber-700' : 'text-[#5C5C5C]'
                          }`}>
                            #{entry.rank}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold overflow-hidden ${isCurrentUser ? 'ring-2 ring-[#7856FF]' : ''}`}>
                              {entry.avatar_url
                                ? <img src={entry.avatar_url} alt={entry.username} className="w-full h-full object-cover" />
                                : <div className={`w-full h-full flex items-center justify-center ${isCurrentUser ? 'bg-[#7856FF] text-white' : 'bg-[#F0F0F0] text-[#5C5C5C]'}`}>
                                    {(entry.full_name || entry.username || '?').charAt(0).toUpperCase()}
                                  </div>
                              }
                            </div>
                            <div>
                              <span className={`font-[600] text-[15px] ${isCurrentUser ? 'text-[#7856FF]' : 'text-[#201F24]'}`}>
                                {entry.full_name || entry.username}
                              </span>
                              <div className="text-[13px] text-[#8C8C8C]">@{entry.username}</div>
                              {entry.city && <div className="text-[12px] text-[#ABABAB]">{entry.city}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden md:table-cell">
                          <span className={`text-[13px] font-bold ${TIER_COLORS[entry.tier] || 'text-gray-500'}`}>
                            {entry.tier || 'Explorer'}
                          </span>
                        </td>
                        <td className="px-6 py-5 hidden md:table-cell text-center text-[14px] text-[#5C5C5C]">
                          {entry.total_competitions || 0}
                          {entry.wins > 0 && <span className="ml-1 text-amber-500 text-xs">({entry.wins}W)</span>}
                        </td>
                        <td className="px-6 py-5 text-right font-[600] text-[#201F24] text-[15px]">
                          {(entry.elo_score || 0).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm disabled:opacity-40 hover:bg-[#FAFAFA]">
                Previous
              </button>
              <span className="text-sm text-[#5C5C5C]">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm disabled:opacity-40 hover:bg-[#FAFAFA]">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
