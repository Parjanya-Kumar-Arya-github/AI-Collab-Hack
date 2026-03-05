import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check, Upload, Award, Briefcase, User, Star, MapPin, AlignLeft, Camera, AtSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

// Step Components
const BasicInfoStep = ({ data, updateData, onAvatarUpload, uploading }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Profile Info</h3>
            <p className="text-sm text-gray-500">Let's start with the essentials.</p>
        </div>

        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center mb-6 gap-3">
            <div className="relative group">
                {data.basicInfo?.avatar_url ? (
                    <img src={data.basicInfo.avatar_url} alt="Avatar Preview" className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                        <User className="w-10 h-10 text-indigo-300" />
                    </div>
                )}
                {uploading && (
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
            <label className="cursor-pointer flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                <Camera className="h-4 w-4" />
                <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onAvatarUpload}
                    disabled={uploading}
                />
            </label>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User className="h-4 w-4" />
                    </div>
                    <input
                        type="text"
                        value={data.basicInfo?.full_name ?? ''}
                        onChange={(e) => updateData('basicInfo', { ...data.basicInfo, full_name: e.target.value })}
                        className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                        placeholder="Jane Doe"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Username <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <AtSign className="h-4 w-4" />
                        </div>
                        <input
                            type="text"
                            required
                            value={data.basicInfo?.username ?? ''}
                            onChange={(e) => updateData('basicInfo', { ...data.basicInfo, username: e.target.value.toLowerCase().trim() })}
                            className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                            placeholder="janedoe"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <MapPin className="h-4 w-4" />
                        </div>
                        <input
                            type="text"
                            value={data.basicInfo?.city ?? ''}
                            onChange={(e) => updateData('basicInfo', { ...data.basicInfo, city: e.target.value })}
                            className="block w-full pl-9 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                            placeholder="San Francisco"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Bio</label>
                <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none text-gray-400">
                        <AlignLeft className="h-4 w-4" />
                    </div>
                    <textarea
                        rows={3}
                        value={data.basicInfo?.bio ?? ''}
                        onChange={(e) => updateData('basicInfo', { ...data.basicInfo, bio: e.target.value })}
                        className="block w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-gray-50 focus:bg-white transition-colors resize-none"
                        placeholder="I am a software engineer..."
                    />
                </div>
            </div>
        </div>
    </div>
);
const SkillsStep = ({ data, updateData }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Technical Skills</h3>
            <p className="text-sm text-gray-500 mb-6">Select your core competencies and rate your proficiency.</p>
        </div>
        
        {['Frontend', 'Backend', 'UI/UX', 'Data Science', 'DevOps'].map(domain => (
            <div key={domain} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-800">{domain}</span>
                    <span className="text-indigo-600 font-bold text-sm bg-indigo-50 px-2 py-1 rounded">
                         {data.skills[domain] || 0}/100
                    </span>
                </div>
                <input 
                    type="range" 
                    min="0" max="100" 
                    value={data.skills[domain] || 0}
                    onChange={(e) => updateData('skills', { ...data.skills, [domain]: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
            </div>
        ))}
    </div>
);

const LinkedProfilesStep = ({ data, updateData }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Linked Profiles</h3>
            <p className="text-sm text-gray-500 mb-6">Link at least one external profile to verify your experience.</p>
        </div>

        {[
            { id: 'github', label: 'GitHub', icon: 'Code', placeholder: 'github.com/username' },
            { id: 'linkedin', label: 'LinkedIn', icon: 'Users', placeholder: 'linkedin.com/in/username' },
            { id: 'behance', label: 'Behance / Dribbble', icon: 'PenTool', placeholder: 'behance.net/username' },
            { id: 'kaggle', label: 'Kaggle', icon: 'Database', placeholder: 'kaggle.com/username' },
        ].map(profile => (
            <div key={profile.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{profile.label}</label>
                <input
                    type="url"
                    value={data.links[profile.id] || ''}
                    onChange={(e) => updateData('links', { ...data.links, [profile.id]: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    placeholder={`https://${profile.placeholder}`}
                />
            </div>
        ))}
    </div>
);

const CertificatesStep = ({ data, updateData }) => {
    const [isHandling, setIsHandling] = useState(false);

    const handleUpload = () => {
        setIsHandling(true);
        // Simulate AI extraction
        setTimeout(() => {
            setIsHandling(false);
            updateData('certificates', [...(data.certificates || []), { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2025' }]);
        }, 2000);
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Certificates & Credentials</h3>
                <p className="text-sm text-gray-500 mb-6">Upload certificates and our AI will extract the details.</p>
            </div>

            <div 
                className="border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center bg-indigo-50/50 hover:bg-indigo-50 transition-colors cursor-pointer"
                onClick={handleUpload}
            >
                {isHandling ? (
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-semibold text-indigo-700">AI is extracting details...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                            <Upload className="w-6 h-6 text-indigo-500" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG (Max 10MB)</p>
                    </div>
                )}
            </div>

            {data.certificates?.length > 0 && (
                <div className="mt-8 space-y-3">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Extracted Credentials</h4>
                    {data.certificates.map((cert, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center shadow-sm">
                            <Award className="w-8 h-8 text-yellow-500 mr-4" />
                            <div>
                                <h5 className="font-bold text-gray-900">{cert.name}</h5>
                                <p className="text-sm text-gray-500">{cert.issuer} • {cert.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CompetitionsStep = ({ data, updateData }) => {
    const addComp = () => {
        updateData('competitions', [...(data.competitions || []), { name: '', year: new Date().getFullYear(), role: '', placement: '' }]);
    };

    const updateComp = (index, field, value) => {
        const newComps = [...data.competitions];
        newComps[index][field] = value;
        updateData('competitions', newComps);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Past Competitions</h3>
                <p className="text-sm text-gray-500 mb-6">Showcase your hackathon and case comp experience.</p>
            </div>

            {(data.competitions || []).map((comp, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                             <input type="text" value={comp.name} onChange={e => updateComp(idx, 'name', e.target.value)} placeholder="Competition Name (e.g. TreeHacks)" className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <div>
                             <input type="text" value={comp.role} onChange={e => updateComp(idx, 'role', e.target.value)} placeholder="Your Role (e.g. Frontend Lead)" className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                        <div className="flex space-x-2">
                            <input type="number" value={comp.year} onChange={e => updateComp(idx, 'year', e.target.value)} placeholder="Year" className="w-1/2 px-3 py-2 border rounded-lg text-sm" />
                            <input type="text" value={comp.placement} onChange={e => updateComp(idx, 'placement', e.target.value)} placeholder="Placement (e.g. 1st Place)" className="w-1/2 px-3 py-2 border rounded-lg text-sm" />
                        </div>
                    </div>
                </div>
            ))}

            <button onClick={addComp} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-semibold hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                + Add Competition Record
            </button>
        </div>
    );
};

const FeaturedProjectStep = ({ data, updateData }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Featured Project</h3>
                <p className="text-sm text-gray-500 mb-6">Describe your proudest achievement. Our AI analyzes this to verify skills.</p>
            </div>

            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Project Title" 
                    value={data.featuredProject?.title || ''}
                    onChange={e => updateData('featuredProject', {...data.featuredProject, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600" 
                />
                
                <textarea 
                    rows={4} 
                    placeholder="Describe the project, your role, and the outcome/impact (3-5 sentences)..." 
                    value={data.featuredProject?.description || ''}
                    onChange={e => updateData('featuredProject', {...data.featuredProject, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 resize-none" 
                />

                <input 
                    type="url" 
                    placeholder="Link (GitHub repo, live site, etc.)" 
                    value={data.featuredProject?.link || ''}
                    onChange={e => updateData('featuredProject', {...data.featuredProject, link: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600" 
                />

                {data.featuredProject?.description?.length > 50 && (
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start mt-4">
                        <Star className="w-5 h-5 text-indigo-500 mt-0.5 mr-3 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-indigo-900">AI Analysis Active</p>
                            <p className="text-xs text-indigo-700 mt-1">Cross-referencing stated skills (React, Node.js) with project description...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const PreferencesStep = ({ data, updateData }) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Availability & Preferences</h3>
            <p className="text-sm text-gray-500 mb-6">Help us match you with the right teams.</p>
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Hours per week</label>
            <input 
                type="range" 
                min="0" max="40" step="5"
                value={data.preferences?.hours || 10}
                onChange={e => updateData('preferences', {...data.preferences, hours: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="text-center mt-2 font-semibold text-indigo-600">{data.preferences?.hours || 10} hrs/week</div>
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Preferred Team Role</label>
            <div className="flex space-x-3">
                {['Leader', 'Contributor', 'Flexible'].map(role => (
                    <button 
                        key={role}
                        onClick={() => updateData('preferences', {...data.preferences, role})}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${data.preferences?.role === role ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {role}
                    </button>
                ))}
            </div>
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Participation Type</label>
            <div className="flex space-x-3">
                {['In-Person', 'Online', 'Both'].map(type => (
                    <button 
                        key={type}
                        onClick={() => updateData('preferences', {...data.preferences, type})}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${data.preferences?.type === type ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    </div>
);


export default function ProfileBuilder() {
    const { user, profile, fetchProfile, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    // We pre-fill basic info from OAuth/Profiles if available 
    const [formData, setFormData] = useState({
        basicInfo: {
            full_name: profile?.full_name || user?.user_metadata?.full_name || '',
            username: profile?.username || '',
            city: profile?.city || '',
            bio: profile?.bio || '',
            avatar_url: profile?.avatar_url || user?.user_metadata?.avatar_url || ''
        },
        skills: {},
        links: {},
        certificates: [],
        competitions: [],
        featuredProject: {},
        preferences: { hours: 10, role: 'Flexible', type: 'Both' }
    });

    const updateData = (key, val) => {
        setFormData(prev => ({ ...prev, [key]: val }));
    };

    const handleNext = () => {
        if (step === 1 && !formData.basicInfo?.username) {
            alert('Username is required.');
            return;
        }
        setStep(s => Math.min(s + 1, 7));
    };
    const handlePrev = () => setStep(s => Math.max(s - 1, 1));

    // Handle avatar image upload to Supabase Storage
    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const ext = file.name.split('.').pop();
            const filePath = `${user.id}/avatar.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });
            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            updateData('basicInfo', { ...formData.basicInfo, avatar_url: urlData.publicUrl });
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Image upload failed. Make sure the "avatars" storage bucket exists and is set to public in Supabase.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Check linking validation
            const hasLink = Object.values(formData.links).some(link => link.length > 5);
            if (!hasLink) {
                alert("Please provide at least one linked profile (GitHub, LinkedIn, etc.) on Step 2.");
                setStep(2);
                setLoading(false);
                return;
            }

            // Save top-level profile fields + JSON data to Supabase profile
            const updates = {
                id: user.id,
                full_name: formData.basicInfo.full_name,
                username: formData.basicInfo.username.toLowerCase(),
                city: formData.basicInfo.city,
                bio: formData.basicInfo.bio,
                avatar_url: formData.basicInfo.avatar_url,
                profile_completed: true, // Mark profile builder as completed
                collaborative_data: {
                    skills: formData.skills,
                    links: formData.links,
                    certificates: formData.certificates,
                    competitions: formData.competitions,
                    featuredProject: formData.featuredProject,
                    preferences: formData.preferences
                },
                updated_at: new Date()
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;

            await fetchProfile(user.id);
            navigate('/profile');

        } catch (error) {
            alert('Error saving profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const STEP_TITLES = ['Basic Info', 'Skills', 'Links', 'Certificates', 'Competitions', 'Project', 'Preferences'];

    // While auth is resolving, show a loading spinner
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Once auth has settled and there's still no user, redirect to login
    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full mx-auto relative">
                
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                        <span>Step {step} of 7</span>
                        <span>{STEP_TITLES[step-1]}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${(step / 7) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10 relative overflow-hidden">
                    
                    {/* Decorative Blob */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-50 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 min-h-[400px]">
                        {step === 1 && <BasicInfoStep data={formData} updateData={updateData} onAvatarUpload={handleAvatarUpload} uploading={uploading} />}
                        {step === 2 && <SkillsStep data={formData} updateData={updateData} />}
                        {step === 3 && <LinkedProfilesStep data={formData} updateData={updateData} />}
                        {step === 4 && <CertificatesStep data={formData} updateData={updateData} />}
                        {step === 5 && <CompetitionsStep data={formData} updateData={updateData} />}
                        {step === 6 && <FeaturedProjectStep data={formData} updateData={updateData} />}
                        {step === 7 && <PreferencesStep data={formData} updateData={updateData} />}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">
                        <button
                            onClick={handlePrev}
                            disabled={step === 1}
                            className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-0 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Back
                        </button>

                        {step < 7 ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all transform hover:-translate-y-0.5"
                            >
                                Continue <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center bg-gray-900 hover:bg-black text-white px-8 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-gray-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70"
                            >
                                {loading ? 'Saving...' : 'Complete Profile'} <Check className="w-4 h-4 ml-2" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
