import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const TYPES   = ['hackathon', 'case_comp', 'design_challenge', 'coding_contest', 'other'];
const STATUSES = ['upcoming', 'ongoing', 'completed'];

const formatDates = (s, e) => {
  if (!s || !e) return 'TBD';
  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  return `${new Date(s).toLocaleDateString('en-US', opts)} – ${new Date(e).toLocaleDateString('en-US', opts)}`;
};

const formatStatus = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ') : 'Upcoming';

export default function Discover() {
  const { token } = useAuth();
  const navigate  = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [registered, setRegistered]     = useState(new Set()); // ids already registered

  // Filters
  const [search, setSearch]     = useState('');
  const [filterType, setFilterType]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters]   = useState(false);

  // Pagination
  const [page, setPage]   = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCompetitions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: 12 });
      if (search)       params.append('search', search);
      if (filterType)   params.append('type', filterType);
      if (filterStatus) params.append('status', filterStatus);

      const data = await api.get(`/competitions?${params}`);
      setCompetitions(data.competitions);
      setTotalPages(data.pagination.pages);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterType, filterStatus]);

  useEffect(() => { fetchCompetitions(); }, [fetchCompetitions]);

  // Fetch user's registrations to mark which ones they've joined
  useEffect(() => {
    if (!token) return;
    api.get('/competitions/my')
      .then(data => setRegistered(new Set(data.competitions.map(c => c.id))))
      .catch(() => {});
  }, [token]);


  const clearFilters = () => {
    setSearch(''); setFilterType(''); setFilterStatus(''); setPage(1);
  };

  const hasFilters = search || filterType || filterStatus;

  return (
    <div className="w-full h-full space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-[32px] font-[600] tracking-tight text-[#201F24] mb-2">Discover</h1>
          <p className="text-[#5C5C5C] text-[16px]">Find top hackathons, competitions, and hiring challenges.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-[20px] py-[10px] bg-white border text-[#201F24] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)] font-[500] hover:bg-[#FAFAFA] transition-colors text-[14px] flex items-center space-x-2 ${showFilters ? 'border-[#7856FF] text-[#7856FF]' : 'border-[#E5E7EB]'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasFilters ? '•' : ''}</span>
          </button>
          <button className="px-[20px] py-[10px] bg-[#7856FF] hover:bg-[#6846EB] text-white rounded-full font-[500] transition-colors text-[14px]">
            Host an Event
          </button>
        </div>
      </div>

      {/* Search + Filters Panel */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search competitions or organizers..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#7856FF] outline-none text-[14px]"
          />
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 bg-white border border-[#E5E7EB] rounded-xl animate-in fade-in duration-200">
            <select
              value={filterType}
              onChange={e => { setFilterType(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-[13px] text-[#5C5C5C] outline-none focus:ring-2 focus:ring-[#7856FF]"
            >
              <option value="">All Types</option>
              {TYPES.map(t => <option key={t} value={t}>{formatStatus(t)}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-[13px] text-[#5C5C5C] outline-none focus:ring-2 focus:ring-[#7856FF]"
            >
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{formatStatus(s)}</option>)}
            </select>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center space-x-1 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <X className="w-3 h-3" /><span>Clear</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* States */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-[#7856FF]" />
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-sm">
          Error loading competitions: {error}
        </div>
      )}
      {!loading && !error && competitions.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 space-y-3">
          <p className="text-[#5C5C5C] text-[16px]">No competitions found.</p>
          {hasFilters && <button onClick={clearFilters} className="text-[#7856FF] text-sm underline">Clear filters</button>}
        </div>
      )}

      {/* Competition Grid */}
      {!loading && !error && competitions.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((comp) => {
              const isReg = registered.has(comp.id);
              return (
                <div
                  key={comp.id}
                  className="group bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Banner */}
                  <div
                    className="h-32 w-full relative bg-[#E8DDFF]"
                    style={comp.banner_url ? { backgroundImage: `url(${comp.banner_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                  >
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[12px] font-[600] px-2.5 py-1 rounded-full text-[#7856FF]">
                      {formatStatus(comp.status)}
                    </div>
                    {comp.type && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[11px] font-[500] px-2 py-1 rounded-full text-[#5C5C5C] capitalize">
                        {comp.type.replace('_', ' ')}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-2 text-[12px] font-[600] text-[#5C5C5C] uppercase tracking-wider">{comp.organizer}</div>
                    <h3 className="text-[20px] font-[600] text-[#201F24] mb-3 leading-tight group-hover:text-[#7856FF] transition-colors">{comp.title}</h3>

                    <div className="flex flex-wrap gap-2 mb-6 mt-1">
                      {(comp.tags || []).map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-[#FAFAFA] border border-[#E5E7EB] text-[#5C5C5C] rounded-lg text-[12px] font-[500]">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto space-y-2.5 mb-6">
                      <div className="flex items-center text-[14px] text-[#5C5C5C]">
                        <svg className="w-4 h-4 mr-2.5 opacity-60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDates(comp.start_date, comp.end_date)}
                      </div>
                      <div className="flex items-center text-[14px] text-[#5C5C5C]">
                        <svg className="w-4 h-4 mr-2.5 opacity-60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Prize: {comp.prize_pool || 'TBD'}
                      </div>
                      <div className="flex items-center text-[14px] text-[#5C5C5C]">
                        <svg className="w-4 h-4 mr-2.5 opacity-60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {comp.registered_count || 0} Registered
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/competitions/${comp.id}`)}
                      className="w-full py-2.5 rounded-full font-[500] transition-colors duration-200 text-[14px] border bg-[#FAFAFA] hover:bg-[#7856FF] text-[#201F24] hover:text-white border-[#E5E7EB] hover:border-[#7856FF]"
                    >
                      {isReg ? '✓ Registered · View' : 'View Details'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm disabled:opacity-40 hover:bg-[#FAFAFA]"
              >
                Previous
              </button>
              <span className="text-sm text-[#5C5C5C]">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm disabled:opacity-40 hover:bg-[#FAFAFA]"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}