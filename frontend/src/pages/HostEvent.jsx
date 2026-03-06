import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ChevronLeft, ChevronRight, Loader2, Trophy, Calendar, DollarSign, Settings, CheckCircle2 } from 'lucide-react';

const COMP_TYPES = ['hackathon', 'case_comp', 'design_challenge', 'coding_contest', 'data_science', 'other'];
const TAGS_LIST  = ['AI/ML', 'Web Dev', 'Mobile', 'Blockchain', 'FinTech', 'HealthTech', 'EdTech', 'SustainTech', 'Open Innovation', 'Social Impact', 'AR/VR', 'IoT', 'Cybersecurity', 'Data Science', 'Design', 'Business'];

const STEPS = [
  { id: 'basics',   label: 'Basic Info',   icon: Trophy },
  { id: 'details',  label: 'Details',      icon: Calendar },
  { id: 'prizes',   label: 'Prizes',       icon: DollarSign },
  { id: 'settings', label: 'Settings',     icon: Settings },
  { id: 'review',   label: 'Review',       icon: CheckCircle2 },
];

const Input = ({ label, required, error, children, hint }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-[#7856FF]">*</span>}
    </label>
    {children}
    {hint  && <p className="text-xs text-gray-400">{hint}</p>}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const inputCls = "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7856FF] bg-white";

export default function HostEvent() {
  const navigate  = useNavigate();
  const [step, setStep]         = useState(0);
  const [submitting, setSubmit] = useState(false);
  const [error, setError]       = useState('');
  const [tagInput, setTagInput] = useState('');

  const [form, setForm] = useState({
    // Basics
    title: '', type: '', description: '', tags: [],
    // Details
    start_date: '', end_date: '', registration_deadline: '',
    is_online: true, location: '', website_url: '', banner_url: '',
    // Prizes
    prize_pool: '', prize_description: '',
    // Settings
    min_team_size: 2, max_team_size: 4, max_participants: '',
    status: 'upcoming',
  });

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));
  const toggleTag = (tag) => set('tags', form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag]);
  const addCustomTag = () => {
    const t = tagInput.trim();
    if (!t || form.tags.includes(t)) return;
    set('tags', [...form.tags, t]);
    setTagInput('');
  };

  const validate = () => {
    if (step === 0 && !form.title.trim()) return 'Title is required.';
    if (step === 0 && !form.type)         return 'Competition type is required.';
    if (step === 0 && !form.description.trim()) return 'Description is required.';
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    try {
      setSubmit(true);
      setError('');
      const result = await api.post('/competitions', form);
      navigate(`/competitions/${result.competition.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create competition.');
    } finally {
      setSubmit(false);
    }
  };

  const currentStep = STEPS[step];
  const progress    = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <button onClick={() => navigate('/discover')} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Host an Event</h1>
          <p className="text-sm text-gray-500">Create a competition for the community</p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, idx) => {
          const Icon    = s.icon;
          const isActive = idx === step;
          const isDone   = idx < step;
          return (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isDone   ? 'bg-[#7856FF] text-white' :
                  isActive ? 'bg-[#E8DDFF] text-[#7856FF] ring-2 ring-[#7856FF]' :
                             'bg-gray-100 text-gray-400'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-[10px] font-semibold mt-1 hidden sm:block ${isActive ? 'text-[#7856FF]' : 'text-gray-400'}`}>{s.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 ${idx < step ? 'bg-[#7856FF]' : 'bg-gray-100'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">{currentStep.label}</h2>

        {/* ── Step 0: Basics ── */}
        {step === 0 && (
          <div className="space-y-5">
            <Input label="Competition Title" required>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. HackIndia 2025" className={inputCls} />
            </Input>
            <Input label="Competition Type" required>
              <div className="flex flex-wrap gap-2">
                {COMP_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => set('type', t)}
                    className={`px-3 py-1.5 rounded-lg text-sm border capitalize transition-all ${
                      form.type === t ? 'bg-[#7856FF] text-white border-[#7856FF]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#7856FF]'
                    }`}>
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </Input>
            <Input label="Description" required hint="Describe the competition, its theme, and what participants should build.">
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={5} placeholder="Tell participants what this competition is about..." className={`${inputCls} resize-none`} />
            </Input>
            <Input label="Tags / Themes" hint="Pick from suggestions or type your own and press Enter.">
              {/* Selected tags */}
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.tags.map(tag => (
                    <span key={tag} className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#7856FF] text-white text-xs rounded-lg font-medium">
                      <span>{tag}</span>
                      <button type="button" onClick={() => toggleTag(tag)} className="hover:text-white/70 transition-colors leading-none ml-1">×</button>
                    </span>
                  ))}
                </div>
              )}
              {/* Custom tag input */}
              <div className="flex gap-2 mb-3">
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag(); } }}
                  placeholder="Type a custom tag and press Enter..."
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7856FF]"
                />
                <button type="button" onClick={addCustomTag}
                  className="px-4 py-2.5 bg-[#7856FF] text-white text-sm font-semibold rounded-xl hover:bg-[#6846EB] transition-colors">
                  Add
                </button>
              </div>
              {/* Preset suggestions */}
              <div className="flex flex-wrap gap-2">
                {TAGS_LIST.filter(t => !form.tags.includes(t)).map(tag => (
                  <button key={tag} type="button" onClick={() => toggleTag(tag)}
                    className="px-3 py-1.5 rounded-lg text-xs border bg-white text-gray-600 border-gray-200 hover:border-[#7856FF] hover:text-[#7856FF] transition-all">
                    + {tag}
                  </button>
                ))}
              </div>
            </Input>
            <Input label="Banner Image URL" hint="Paste a URL to your competition banner (16:9 recommended)">
              <input value={form.banner_url} onChange={e => set('banner_url', e.target.value)} placeholder="https://..." className={inputCls} />
            </Input>
          </div>
        )}

        {/* ── Step 1: Details ── */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date">
                <input type="datetime-local" value={form.start_date} onChange={e => set('start_date', e.target.value)} className={inputCls} />
              </Input>
              <Input label="End Date">
                <input type="datetime-local" value={form.end_date} onChange={e => set('end_date', e.target.value)} className={inputCls} />
              </Input>
            </div>
            <Input label="Registration Deadline">
              <input type="datetime-local" value={form.registration_deadline} onChange={e => set('registration_deadline', e.target.value)} className={inputCls} />
            </Input>
            <Input label="Format">
              <div className="flex gap-3">
                {[{ val: true, label: '🌐 Online' }, { val: false, label: '📍 In-Person' }].map(opt => (
                  <button key={String(opt.val)} type="button" onClick={() => set('is_online', opt.val)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                      form.is_online === opt.val ? 'bg-[#7856FF] text-white border-[#7856FF]' : 'bg-white text-gray-600 border-gray-200'
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </Input>
            {!form.is_online && (
              <Input label="Location">
                <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. IIT Delhi, New Delhi" className={inputCls} />
              </Input>
            )}
            <Input label="Competition Website" hint="Your Devfolio, Devpost, or custom page">
              <input type="url" value={form.website_url} onChange={e => set('website_url', e.target.value)} placeholder="https://..." className={inputCls} />
            </Input>
            <Input label="Status">
              <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
                <option value="upcoming">Upcoming (not yet open)</option>
                <option value="ongoing">Ongoing (accepting registrations)</option>
                <option value="completed">Completed</option>
              </select>
            </Input>
          </div>
        )}

        {/* ── Step 2: Prizes ── */}
        {step === 2 && (
          <div className="space-y-5">
            <Input label="Total Prize Pool" hint="e.g. ₹5,00,000 or $10,000 or 'Internship + Cash'">
              <input value={form.prize_pool} onChange={e => set('prize_pool', e.target.value)} placeholder="e.g. ₹5,00,000" className={inputCls} />
            </Input>
            <Input label="Prize Breakdown" hint="Describe 1st, 2nd, 3rd place prizes and any special awards">
              <textarea value={form.prize_description} onChange={e => set('prize_description', e.target.value)}
                rows={5} placeholder="1st Place: ₹2,00,000 + Internship&#10;2nd Place: ₹1,00,000&#10;3rd Place: ₹50,000&#10;Best UI: ₹25,000..." className={`${inputCls} resize-none`} />
            </Input>
          </div>
        )}

        {/* ── Step 3: Settings ── */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Min Team Size">
                <input type="number" min={1} max={10} value={form.min_team_size} onChange={e => set('min_team_size', parseInt(e.target.value))} className={inputCls} />
              </Input>
              <Input label="Max Team Size">
                <input type="number" min={1} max={10} value={form.max_team_size} onChange={e => set('max_team_size', parseInt(e.target.value))} className={inputCls} />
              </Input>
            </div>
            <Input label="Max Participants" hint="Leave blank for unlimited">
              <input type="number" value={form.max_participants} onChange={e => set('max_participants', e.target.value)} placeholder="Unlimited" className={inputCls} />
            </Input>
          </div>
        )}

        {/* ── Step 4: Review ── */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Review your competition details before publishing.</p>
            {[
              { label: 'Title',       value: form.title },
              { label: 'Type',        value: form.type?.replace('_', ' ') },
              { label: 'Status',      value: form.status },
              { label: 'Starts',      value: form.start_date ? new Date(form.start_date).toLocaleDateString() : 'Not set' },
              { label: 'Ends',        value: form.end_date ? new Date(form.end_date).toLocaleDateString() : 'Not set' },
              { label: 'Prize Pool',  value: form.prize_pool || 'Not specified' },
              { label: 'Team Size',   value: `${form.min_team_size} – ${form.max_team_size} members` },
              { label: 'Format',      value: form.is_online ? 'Online' : `In-Person${form.location ? ` · ${form.location}` : ''}` },
              { label: 'Tags',        value: form.tags.join(', ') || 'None' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500 w-28 shrink-0">{label}</span>
                <span className="text-sm font-medium text-gray-900 text-right capitalize">{value}</span>
              </div>
            ))}
            <div className="mt-2">
              <span className="text-sm text-gray-500">Description</span>
              <p className="text-sm text-gray-700 mt-1 leading-relaxed line-clamp-4">{form.description}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={() => { setError(''); setStep(s => s - 1); }}
            disabled={step === 0}
            className="flex items-center space-x-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /><span>Back</span>
          </button>

          <span className="text-xs text-gray-400">{step + 1} / {STEPS.length}</span>

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#7856FF] text-white rounded-xl text-sm font-semibold hover:bg-[#6846EB] transition-colors">
              <span>Next</span><ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting}
              className="flex items-center space-x-2 px-6 py-2.5 bg-[#7856FF] text-white rounded-xl text-sm font-bold hover:bg-[#6846EB] disabled:opacity-60 transition-colors">
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Publishing...</span></>
                : <><Trophy className="w-4 h-4" /><span>Publish Competition</span></>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}