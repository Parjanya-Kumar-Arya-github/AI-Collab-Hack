import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import {
  CheckCircle2, ChevronRight, ChevronLeft, Loader2,
  Code2, Link2, Award, Trophy, Briefcase, Sparkles
} from 'lucide-react';

// ─── Skills master list (mirrors DB seed) ────────────────────────────────────
const SKILLS_BY_CATEGORY = {
  Frontend:  ['JavaScript','TypeScript','React','Vue.js','Next.js','HTML/CSS'],
  Backend:   ['Node.js','Python','Java','Go','Express.js','FastAPI'],
  'AI/ML':   ['Machine Learning','Deep Learning','NLP','Computer Vision','LLMs','TensorFlow'],
  Design:    ['UI/UX Design','Figma','Graphic Design','Illustration','Motion Design'],
  Data:      ['PostgreSQL','MongoDB','SQL','Pandas','Data Analysis','Power BI','Tableau'],
  DevOps:    ['DevOps','Docker','AWS','CI/CD','Kubernetes'],
  Web3:      ['Blockchain','Smart Contracts','Solidity'],
  Business:  ['Financial Modeling','Market Research','Product Management','Strategy','Public Speaking'],
};

const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];
const COMP_TYPES = ['hackathon', 'case_comp', 'design_challenge', 'coding_contest'];

const STEPS = [
  { id: 1, title: 'Your Skills',         icon: Code2 },
  { id: 2, title: 'Linked Profiles',     icon: Link2 },
  { id: 3, title: 'Certificates',        icon: Award },
  { id: 4, title: 'Past Competitions',   icon: Trophy },
  { id: 5, title: 'Featured Project',    icon: Briefcase },
  { id: 6, title: 'About You',           icon: Sparkles },
];

// ─── Step Components ──────────────────────────────────────────────────────────

function Step1({ data, setData }) {
  const toggle = (skill) => {
    setData(prev => {
      const exists = prev.claimed_skills.find(s => s.skill === skill);
      if (exists) return { ...prev, claimed_skills: prev.claimed_skills.filter(s => s.skill !== skill) };
      return { ...prev, claimed_skills: [...prev.claimed_skills, { skill, proficiency_level: 'intermediate' }] };
    });
  };

  const setLevel = (skill, level) => {
    setData(prev => ({
      ...prev,
      claimed_skills: prev.claimed_skills.map(s => s.skill === skill ? { ...s, proficiency_level: level } : s),
    }));
  };

  const isSelected = (skill) => data.claimed_skills.some(s => s.skill === skill);
  const getLevel = (skill) => data.claimed_skills.find(s => s.skill === skill)?.proficiency_level || 'intermediate';

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Select the skills you have and set your proficiency level for each.</p>
      {Object.entries(SKILLS_BY_CATEGORY).map(([cat, skills]) => (
        <div key={cat}>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{cat}</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <div key={skill} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => toggle(skill)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    isSelected(skill)
                      ? 'bg-[#7856FF] text-white border-[#7856FF]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#7856FF]'
                  }`}
                >
                  {skill}
                </button>
                {isSelected(skill) && (
                  <select
                    value={getLevel(skill)}
                    onChange={e => setLevel(skill, e.target.value)}
                    className="mt-1 text-xs border border-gray-200 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-[#7856FF]"
                  >
                    {PROFICIENCY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {data.claimed_skills.length > 0 && (
        <p className="text-xs text-[#7856FF] font-medium">{data.claimed_skills.length} skill{data.claimed_skills.length > 1 ? 's' : ''} selected</p>
      )}
    </div>
  );
}

function Step2({ data, setData }) {
  const handle = (field, val) => setData(prev => ({ ...prev, [field]: val }));
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">Link your external profiles so the AI can better verify your skills. All optional but recommended.</p>
      {[
        { field: 'github_username', label: 'GitHub Username', placeholder: 'e.g. johndoe', prefix: 'github.com/' },
        { field: 'linkedin_url',    label: 'LinkedIn URL',    placeholder: 'https://linkedin.com/in/...' },
        { field: 'kaggle_url',      label: 'Kaggle URL',      placeholder: 'https://kaggle.com/...' },
        { field: 'other_profile_url', label: 'Other (Behance, Dribbble, etc.)', placeholder: 'https://...' },
      ].map(({ field, label, placeholder, prefix }) => (
        <div key={field} className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">{label}</label>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#7856FF]">
            {prefix && <span className="px-3 text-sm text-gray-400 bg-gray-50 border-r border-gray-200 py-3">{prefix}</span>}
            <input
              type="text"
              value={data[field] || ''}
              onChange={e => handle(field, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-3 text-sm outline-none bg-white"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Step3({ data, setData }) {
  const addCert = () => setData(prev => ({
    ...prev,
    certificates: [...prev.certificates, { title: '', issuer: '', issued_date: '' }],
  }));

  const updateCert = (i, field, val) => setData(prev => ({
    ...prev,
    certificates: prev.certificates.map((c, idx) => idx === i ? { ...c, [field]: val } : c),
  }));

  const removeCert = (i) => setData(prev => ({
    ...prev,
    certificates: prev.certificates.filter((_, idx) => idx !== i),
  }));

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">Add any relevant certifications. Google, AWS, CFA, Coursera, HackerRank — anything that validates your skills.</p>
      {data.certificates.map((cert, i) => (
        <div key={i} className="p-4 border border-gray-200 rounded-xl space-y-3 relative">
          <button type="button" onClick={() => removeCert(i)} className="absolute top-3 right-3 text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Certificate Title</label>
              <input value={cert.title} onChange={e => updateCert(i, 'title', e.target.value)} placeholder="e.g. AWS Solutions Architect" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7856FF]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Issuer</label>
              <input value={cert.issuer} onChange={e => updateCert(i, 'issuer', e.target.value)} placeholder="e.g. Amazon Web Services" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7856FF]" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Date Issued</label>
            <input type="month" value={cert.issued_date} onChange={e => updateCert(i, 'issued_date', e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7856FF]" />
          </div>
        </div>
      ))}
      <button type="button" onClick={addCert} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#7856FF] hover:text-[#7856FF] transition-colors">
        + Add Certificate
      </button>
      {data.certificates.length === 0 && (
        <p className="text-xs text-gray-400 text-center">No certificates? That's fine — skip to the next step.</p>
      )}
    </div>
  );
}

function Step4({ data, setData }) {
  const addComp = () => setData(prev => ({
    ...prev,
    past_competitions: [...prev.past_competitions, { name: '', organizer: '', year: '', role: '', placement: '' }],
  }));

  const updateComp = (i, field, val) => setData(prev => ({
    ...prev,
    past_competitions: prev.past_competitions.map((c, idx) => idx === i ? { ...c, [field]: val } : c),
  }));

  const removeComp = (i) => setData(prev => ({
    ...prev,
    past_competitions: prev.past_competitions.filter((_, idx) => idx !== i),
  }));

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">List any hackathons, case competitions, or coding contests you've participated in before joining this platform.</p>
      {data.past_competitions.map((comp, i) => (
        <div key={i} className="p-4 border border-gray-200 rounded-xl space-y-3 relative">
          <button type="button" onClick={() => removeComp(i)} className="absolute top-3 right-3 text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Competition Name</label>
              <input value={comp.name} onChange={e => updateComp(i, 'name', e.target.value)} placeholder="e.g. Smart India Hackathon 2024" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7856FF]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Organizer</label>
              <input value={comp.organizer} onChange={e => updateComp(i, 'organizer', e.target.value)} placeholder="e.g. MLH" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7856FF]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Year</label>
              <input type="number" value={comp.year} onChange={e => updateComp(i, 'year', e.target.value)} placeholder="2024" min="2000" max="2030" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7856FF]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Your Role</label>
              <input value={comp.role} onChange={e => updateComp(i, 'role', e.target.value)} placeholder="e.g. Team Lead, Designer" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7856FF]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Placement</label>
              <input value={comp.placement} onChange={e => updateComp(i, 'placement', e.target.value)} placeholder="e.g. Winner, Finalist, Top 10" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7856FF]" />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={addComp} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#7856FF] hover:text-[#7856FF] transition-colors">
        + Add Competition
      </button>
    </div>
  );
}

function Step5({ data, setData }) {
  const handle = (field, val) => setData(prev => ({ ...prev, [field]: val }));
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">Describe your best project. This is your strongest signal — the AI will use this to cross-verify your claimed skills.</p>
      {[
        { field: 'project_title',       label: 'Project Title',      placeholder: 'e.g. AI-Powered Resume Builder', type: 'text' },
        { field: 'project_role',        label: 'Your Role',          placeholder: 'e.g. Full-stack developer, ML engineer', type: 'text' },
        { field: 'project_outcome',     label: 'Outcome / Impact',   placeholder: 'e.g. Won 1st place, 500 users, shipped to production', type: 'text' },
        { field: 'project_link',        label: 'Project Link',       placeholder: 'GitHub, live site, Figma, case study PDF...', type: 'url' },
      ].map(({ field, label, placeholder, type }) => (
        <div key={field} className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">{label}</label>
          <input type={type} value={data[field] || ''} onChange={e => handle(field, e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7856FF]" />
        </div>
      ))}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Project Description</label>
        <textarea
          value={data.project_description || ''}
          onChange={e => handle('project_description', e.target.value)}
          rows={4}
          placeholder="Describe what you built, what technologies you used, and what problem it solved..."
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7856FF] resize-none"
        />
      </div>
    </div>
  );
}

function Step6({ data, setData }) {
  const handle = (field, val) => setData(prev => ({ ...prev, [field]: val }));
  const toggleCompType = (type) => {
    setData(prev => ({
      ...prev,
      preferred_comp_types: prev.preferred_comp_types.includes(type)
        ? prev.preferred_comp_types.filter(t => t !== type)
        : [...prev.preferred_comp_types, type],
    }));
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">A few final questions to help the AI assess your experience and set up your matchmaking preferences.</p>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Describe your strongest project or achievement in 2-3 sentences</label>
        <textarea value={data.written_strongest_project || ''} onChange={e => handle('written_strongest_project', e.target.value)} rows={3} placeholder="What did you build or accomplish that you're most proud of?" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7856FF] resize-none" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">What role do you usually take in a team?</label>
        <textarea value={data.written_team_role || ''} onChange={e => handle('written_team_role', e.target.value)} rows={2} placeholder="e.g. I usually lead the backend architecture and coordinate between team members..." className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7856FF] resize-none" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Your biggest achievement outside of projects</label>
        <textarea value={data.written_achievement || ''} onChange={e => handle('written_achievement', e.target.value)} rows={2} placeholder="e.g. Ranked top 5% in competitive programming, published a paper, led a 10-person team..." className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7856FF] resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Hours available per week</label>
          <input type="number" min={1} max={80} value={data.hours_per_week || ''} onChange={e => handle('hours_per_week', parseInt(e.target.value))} placeholder="e.g. 15" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7856FF]" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Preferred team role</label>
          <select value={data.preferred_role || ''} onChange={e => handle('preferred_role', e.target.value)} className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7856FF] bg-white">
            <option value="">Select...</option>
            <option value="leader">Leader</option>
            <option value="member">Member</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Competition types you're interested in</label>
        <div className="flex flex-wrap gap-2">
          {COMP_TYPES.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => toggleCompType(type)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all capitalize ${
                data.preferred_comp_types.includes(type)
                  ? 'bg-[#7856FF] text-white border-[#7856FF]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#7856FF]'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Location preference</label>
        <div className="flex gap-3">
          {['online', 'in_person', 'both'].map(opt => (
            <button key={opt} type="button" onClick={() => handle('location_preference', opt)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                data.location_preference === opt
                  ? 'bg-[#7856FF] text-white border-[#7856FF]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#7856FF]'
              }`}>
              {opt.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Result Screen ────────────────────────────────────────────────────────────
function AssessmentResult({ result, onDone }) {
  const tierColors = {
    Elite: 'text-amber-500', Expert: 'text-indigo-600',
    Hacker: 'text-orange-500', Builder: 'text-green-600', Explorer: 'text-gray-500',
  };

  return (
    <div className="text-center space-y-6 py-4">
      <div className="w-20 h-20 bg-[#E8DDFF] rounded-full flex items-center justify-center mx-auto">
        <Sparkles className="w-10 h-10 text-[#7856FF]" />
      </div>
      <div>
        <h3 className="text-2xl font-black text-gray-900 mb-1">Assessment Complete!</h3>
        <p className="text-gray-500 text-sm">Here's your initial skill rating based on your profile.</p>
      </div>

      <div className="bg-[#F4F0FF] border border-[#7856FF]/20 rounded-2xl p-6 space-y-2">
        <div className={`text-5xl font-black ${tierColors[result.tier] || 'text-gray-700'}`}>
          {result.elo_score.toLocaleString()}
        </div>
        <div className={`text-lg font-bold ${tierColors[result.tier] || 'text-gray-700'}`}>
          {result.tier}
        </div>
        <div className="text-xs text-gray-400 capitalize">Confidence: {result.confidence}</div>
      </div>

      {result.skill_scores && (
        <div className="text-left space-y-2">
          <p className="text-sm font-semibold text-gray-700">Domain Scores</p>
          {Object.entries(result.skill_scores).filter(([, v]) => v > 0).map(([domain, score]) => (
            <div key={domain} className="flex items-center space-x-3">
              <span className="text-xs text-gray-500 w-24 shrink-0">{domain}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className="bg-[#7856FF] h-2 rounded-full transition-all" style={{ width: `${score}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-600 w-8 text-right">{score}</span>
            </div>
          ))}
        </div>
      )}

      {result.reasoning && (
        <div className="text-left bg-gray-50 rounded-xl p-4 text-sm text-gray-600 italic border border-gray-100">
          "{result.reasoning}"
        </div>
      )}

      <button onClick={onDone} className="w-full py-3 bg-[#7856FF] text-white rounded-xl font-semibold hover:bg-[#6846EB] transition-colors">
        View My Profile →
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Assessment() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState('');
  const [result, setResult]           = useState(null);

  const [formData, setFormData] = useState({
    claimed_skills:           [],
    github_username:          '',
    linkedin_url:             '',
    kaggle_url:               '',
    other_profile_url:        '',
    certificates:             [],
    past_competitions:        [],
    project_title:            '',
    project_description:      '',
    project_role:             '',
    project_outcome:          '',
    project_link:             '',
    written_strongest_project: '',
    written_team_role:        '',
    written_achievement:      '',
    hours_per_week:           null,
    preferred_role:           '',
    preferred_comp_types:     [],
    location_preference:      '',
  });

  // Redirect if already done
  useEffect(() => {
    if (user?.is_assessment_done) {
      navigate('/profile', { replace: true });
    }
  }, [user]);

  // Pre-fill github if on profile
  useEffect(() => {
    if (user?.github_username) {
      setFormData(prev => ({ ...prev, github_username: user.github_username }));
    }
  }, [user]);

  const handleSubmit = async () => {
    if (formData.claimed_skills.length === 0) {
      setError('Please select at least one skill before submitting.');
      setCurrentStep(1);
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      const data = await api.post('/assessment/submit', formData);
      await refreshUser();
      setResult(data.result);
    } catch (err) {
      setError(err.message || 'Assessment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepProps = { data: formData, setData: setFormData };

  const stepComponents = {
    1: <Step1 {...stepProps} />,
    2: <Step2 {...stepProps} />,
    3: <Step3 {...stepProps} />,
    4: <Step4 {...stepProps} />,
    5: <Step5 {...stepProps} />,
    6: <Step6 {...stepProps} />,
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <AssessmentResult result={result} onDone={() => navigate('/profile')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-1">Skill Assessment</h2>
          <p className="text-gray-500 text-sm">Complete this once to unlock matchmaking and get your initial rating.</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isDone   = step.id < currentStep;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center space-y-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isDone   ? 'bg-[#7856FF] text-white' :
                    isActive ? 'bg-[#E8DDFF] text-[#7856FF] ring-2 ring-[#7856FF]' :
                               'bg-gray-100 text-gray-400'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] font-semibold hidden sm:block ${isActive ? 'text-[#7856FF]' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 ${step.id < currentStep ? 'bg-[#7856FF]' : 'bg-gray-100'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step content */}
        <div className="mb-8 min-h-[300px]">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Step {currentStep}: {STEPS[currentStep - 1].title}
          </h3>
          {stepComponents[currentStep]}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setCurrentStep(s => s - 1)}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /><span>Back</span>
          </button>

          <span className="text-xs text-gray-400">{currentStep} / {STEPS.length}</span>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={() => setCurrentStep(s => s + 1)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#7856FF] text-white rounded-xl text-sm font-semibold hover:bg-[#6846EB] transition-colors"
            >
              <span>Next</span><ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#7856FF] text-white rounded-xl text-sm font-semibold hover:bg-[#6846EB] disabled:opacity-60 transition-colors"
            >
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Analyzing...</span></>
                : <><Sparkles className="w-4 h-4" /><span>Get My Rating</span></>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
