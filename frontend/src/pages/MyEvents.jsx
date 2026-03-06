import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import {
  Plus, Trophy, Users, Calendar, ChevronRight, Eye,
  Loader2, Search, Download, ExternalLink, X,
  GraduationCap, Github, Linkedin, Globe, Star
} from 'lucide-react';

const STATUS_STYLE = {
  open:      'bg-green-100 text-green-700',
  upcoming:  'bg-yellow-100 text-yellow-700',
  ongoing:   'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-500',
};

const TIER_STYLE = {
  Elite:   'bg-amber-100 text-amber-700',
  Expert:  'bg-indigo-100 text-indigo-700',
  Hacker:  'bg-orange-100 text-orange-700',
  Builder: 'bg-green-100 text-green-700',
  Explorer:'bg-gray-100 text-gray-500',
};

const fmt = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

// ─── Registrant Detail Modal ──────────────────────────────────────────────────
function RegistrantModal({ registrant, onClose }) {
  if (!registrant) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[85vh] flex flex-col z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="font-bold text-gray-900">Registration Details</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Profile */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E8DDFF] flex items-center justify-center text-xl font-bold text-[#7856FF] overflow-hidden shrink-0">
              {registrant.avatar_url
                ? <img src={registrant.avatar_url} alt="" className="w-full h-full object-cover" />
                : (registrant.full_name || registrant.username || '?').charAt(0)
              }
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{registrant.full_name || registrant.username}</h4>
              <p className="text-sm text-gray-500">@{registrant.username}</p>
              <div className="flex items-center space-x-2 mt-1">
                {registrant.tier && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIER_STYLE[registrant.tier] || 'bg-gray-100 text-gray-500'}`}>
                    {registrant.tier}
                  </span>
                )}
                {registrant.elo_score > 0 && (
                  <span className="text-xs text-gray-400">{registrant.elo_score.toLocaleString()} pts</span>
                )}
                {registrant.team_name && (
                  <span className="text-xs bg-blue-100 text-blue-600 font-medium px-2 py-0.5 rounded-full">
                    Team: {registrant.team_name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details grid */}
          {[
            { label: 'Email',         value: registrant.email },
            { label: 'Mobile',        value: registrant.mobile },
            { label: 'College',       value: registrant.college },
            { label: 'Year / Role',   value: registrant.year_of_study },
            { label: 'City',          value: registrant.city },
            { label: 'Registered',    value: fmt(registrant.registered_at) },
          ].filter(d => d.value).map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm border-b border-gray-50 pb-2">
              <span className="text-gray-400 w-28 shrink-0">{label}</span>
              <span className="text-gray-800 font-medium text-right">{value}</span>
            </div>
          ))}

          {/* Skills */}
          {registrant.skills_summary && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skills</p>
              <p className="text-sm text-gray-700">{registrant.skills_summary}</p>
            </div>
          )}

          {/* Why join */}
          {registrant.why_join && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Why They Want to Join</p>
              <p className="text-sm text-gray-700 leading-relaxed">{registrant.why_join}</p>
            </div>
          )}

          {/* Experience */}
          {registrant.experience && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Experience</p>
              <p className="text-sm text-gray-700 leading-relaxed">{registrant.experience}</p>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-2">
            {registrant.github_url && (
              <a href={registrant.github_url} target="_blank" rel="noreferrer"
                className="flex items-center space-x-1.5 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                <Github className="w-3.5 h-3.5" /><span>GitHub</span><ExternalLink className="w-3 h-3" />
              </a>
            )}
            {registrant.linkedin_url && (
              <a href={registrant.linkedin_url} target="_blank" rel="noreferrer"
                className="flex items-center space-x-1.5 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                <Linkedin className="w-3.5 h-3.5" /><span>LinkedIn</span><ExternalLink className="w-3 h-3" />
              </a>
            )}
            {registrant.portfolio_url && (
              <a href={registrant.portfolio_url} target="_blank" rel="noreferrer"
                className="flex items-center space-x-1.5 text-xs text-[#7856FF] bg-[#F4F0FF] px-3 py-1.5 rounded-lg hover:bg-[#E8DDFF] transition-colors">
                <Globe className="w-3.5 h-3.5" /><span>Portfolio</span><ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Custom answers */}
          {Object.keys(registrant.custom_answers || {}).length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Custom Questions</p>
              {Object.entries(registrant.custom_answers).map(([key, val]) => (
                <div key={key} className="mb-2">
                  <p className="text-xs text-gray-500 font-medium">{key}</p>
                  <p className="text-sm text-gray-700">{val}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Registrants Panel ────────────────────────────────────────────────────────
function RegistrantsPanel({ competition, onBack }) {
  const [registrants, setRegistrants] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [selected, setSelected]       = useState(null);

  useEffect(() => {
    api.get(`/competitions/${competition.id}/registrants`)
      .then(d => setRegistrants(d.registrants || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [competition.id]);

  const filtered = registrants.filter(r => {
    const q = search.toLowerCase();
    return !q
      || r.full_name?.toLowerCase().includes(q)
      || r.username?.toLowerCase().includes(q)
      || r.college?.toLowerCase().includes(q)
      || r.skills_summary?.toLowerCase().includes(q);
  });

  const exportCSV = () => {
    const headers = ['Name','Username','Email','Mobile','College','Year','Skills','Team','ELO','Tier','GitHub','LinkedIn','Registered At'];
    const rows = registrants.map(r => [
      r.full_name, r.username, r.email, r.mobile, r.college,
      r.year_of_study, r.skills_summary, r.team_name || '',
      r.elo_score || '', r.tier || '',
      r.github_url || '', r.linkedin_url || '',
      new Date(r.registered_at).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map(row =>
      row.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${competition.title}-registrants.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronRight className="w-4 h-4 text-gray-600 rotate-180" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-black text-gray-900">{competition.title}</h2>
          <p className="text-sm text-gray-500">{registrants.length} registrant{registrants.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" /><span>Export CSV</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, college, skills..."
          className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7856FF]"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',     value: registrants.length },
          { label: 'In Teams',  value: registrants.filter(r => r.team_name).length },
          { label: 'Solo',      value: registrants.filter(r => !r.team_name).length },
          { label: 'Avg ELO',   value: registrants.length
              ? Math.round(registrants.reduce((s, r) => s + (r.elo_score || 0), 0) / registrants.length)
              : 0 },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#7856FF] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {registrants.length === 0 ? 'No registrations yet.' : 'No results match your search.'}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Participant</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">College</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Team</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Registered</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(r => (
                <tr key={r.registration_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#E8DDFF] flex items-center justify-center text-xs font-bold text-[#7856FF] overflow-hidden shrink-0">
                        {r.avatar_url
                          ? <img src={r.avatar_url} alt="" className="w-full h-full object-cover" />
                          : (r.full_name || r.username || '?').charAt(0)
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{r.full_name || r.username}</p>
                        <p className="text-xs text-gray-400">@{r.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div>
                      <p className="text-gray-700">{r.college || '—'}</p>
                      {r.year_of_study && <p className="text-xs text-gray-400">{r.year_of_study}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {r.tier ? (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIER_STYLE[r.tier] || 'bg-gray-100 text-gray-500'}`}>
                        {r.tier}
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {r.team_name
                      ? <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg">{r.team_name}</span>
                      : <span className="text-xs text-gray-300">Solo</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-400">{fmt(r.registered_at)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(r)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#7856FF] hover:bg-[#F4F0FF] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <RegistrantModal registrant={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── Main MyEvents Page ───────────────────────────────────────────────────────
export default function MyEvents() {
  const navigate = useNavigate();
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [viewing, setViewing]     = useState(null); // competition whose registrants to show

  useEffect(() => {
    api.get('/competitions/hosted')
      .then(d => setEvents(d.competitions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (viewing) {
    return <RegistrantsPanel competition={viewing} onBack={() => setViewing(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Events</h1>
          <p className="text-sm text-gray-500 mt-0.5">Competitions you've organized</p>
        </div>
        <button onClick={() => navigate('/competitions/new')}
          className="flex items-center space-x-2 px-5 py-2.5 bg-[#7856FF] text-white rounded-xl text-sm font-bold hover:bg-[#6846EB] transition-colors shadow-lg shadow-[#7856FF]/20">
          <Plus className="w-4 h-4" /><span>Host New Event</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-[#7856FF] animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center space-y-4">
          <div className="w-16 h-16 bg-[#F4F0FF] rounded-2xl flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-[#7856FF]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No events yet</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Host your first competition and bring the community together.
          </p>
          <button onClick={() => navigate('/competitions/new')}
            className="mx-auto flex items-center space-x-2 px-5 py-2.5 bg-[#7856FF] text-white rounded-xl text-sm font-bold hover:bg-[#6846EB] transition-colors">
            <Plus className="w-4 h-4" /><span>Host an Event</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[#7856FF]/30 hover:shadow-md transition-all overflow-hidden">
              <div className="flex items-center p-5 gap-5">
                {/* Banner / Icon */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-[#7856FF] to-[#9B7AFF] flex items-center justify-center">
                  {event.banner_url
                    ? <img src={event.banner_url} alt="" className="w-full h-full object-cover" />
                    : <Trophy className="w-7 h-7 text-white/70" />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-gray-900 truncate">{event.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 capitalize ${STATUS_STYLE[event.status] || 'bg-gray-100 text-gray-500'}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{fmt(event.start_date)}{event.end_date ? ` → ${fmt(event.end_date)}` : ''}</span>
                    </span>
                    {event.prize_pool && (
                      <span className="flex items-center space-x-1">
                        <Trophy className="w-3 h-3" /><span>{event.prize_pool}</span>
                      </span>
                    )}
                    <span className="capitalize text-[#7856FF] font-medium">{event.type?.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Registrant count + actions */}
                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-center">
                    <p className="text-2xl font-black text-gray-900">{event.participant_count || 0}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Registered</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setViewing(event)}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-[#F4F0FF] text-[#7856FF] rounded-xl text-xs font-bold hover:bg-[#E8DDFF] transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" /><span>View Registrants</span>
                    </button>
                    <button
                      onClick={() => navigate(`/competitions/${event.id}`)}
                      className="flex items-center space-x-1.5 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /><span>View Page</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
