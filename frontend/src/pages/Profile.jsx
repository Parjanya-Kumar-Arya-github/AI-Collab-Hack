import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { User, MapPin, Link as LinkIcon, Edit3, Grid, Trophy, CheckCircle2, Loader2, Award, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user, profile, loading, signOut } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
    }

    if (!user) {
        return <div className="text-center py-20 font-semibold text-gray-500">Please log in to view your profile.</div>;
    }

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const { collaborative_data: colabData = {} } = profile || {};
    const hasSkills = Object.keys(colabData.skills || {}).length > 0;
    
    // Transform skills for radar chart
    const skillData = hasSkills 
        ? Object.entries(colabData.skills).map(([domain, weight]) => ({ domain, weight }))
        : [
            { domain: 'Frontend', weight: 85 },
            { domain: 'Backend', weight: 60 },
            { domain: 'UI/UX', weight: 70 },
            { domain: 'DevOps', weight: 45 },
            { domain: 'AI/ML', weight: 30 }
        ];

    // Timeline entries
    const comps = colabData.competitions || [];
    const certs = colabData.certificates || [];
    const timeline = [
        ...comps.map(c => ({ id: `comp-${c.name}`, title: c.placement || 'Participant', date: c.year, type: 'podium', org: c.name })),
        ...certs.map(c => ({ id: `cert-${c.name}`, title: c.name, date: c.date, type: 'checkpoint', org: c.issuer }))
    ].sort((a,b) => b.date - a.date); // Sort descending (basic text sort if year strings)
    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Profile Header Card */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="px-8 pb-8 relative">
                    <div className="flex justify-between items-end">
                        <div className="-mt-12 relative flex items-center">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt="Profile"
                                    className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-sm object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-indigo-100 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                                    <User className="w-10 h-10 text-indigo-400" />
                                </div>
                            )}
                            <div className="ml-4 mt-12">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">{profile?.full_name || 'Anonymous User'}</h1>
                                <p className="text-sm font-medium text-gray-500">@{profile?.username || 'user'}</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Link to="/profile/build" className="px-4 py-2 border border-blue-600 text-white bg-blue-600 hover:bg-blue-700 rounded shadow-md text-sm font-semibold flex items-center transition-colors">
                                <Edit3 className="w-4 h-4 mr-2" />
                                Update Collaborative Profile
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="px-4 py-2 border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:text-red-600 rounded shadow-sm text-sm font-semibold flex items-center transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center mt-6 gap-6 text-sm text-gray-600">
                        {profile?.city && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400" /> {profile.city}</span>}
                        
                        {colabData.links?.github && (
                            <a href={colabData.links.github} target="_blank" rel="noreferrer" className="flex items-center hover:text-indigo-600">
                                <LinkIcon className="w-4 h-4 mr-1 text-gray-400" /> GitHub
                            </a>
                        )}
                        {colabData.links?.linkedin && (
                            <a href={colabData.links.linkedin} target="_blank" rel="noreferrer" className="flex items-center hover:text-indigo-600">
                                <LinkIcon className="w-4 h-4 mr-1 text-gray-400" /> LinkedIn
                            </a>
                        )}

                        <span className="flex items-center text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded">
                            <Trophy className="w-4 h-4 mr-1" /> Elo: 1540 (Expert)
                        </span>
                    </div>

                    <div className="mt-6 text-gray-700 text-sm leading-relaxed max-w-3xl">
                        {profile?.bio || "Passionate about building scalable web applications and exploring the intersection of AI with modern architecture. Always looking for challenging hackathons to build cool stuff."}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Skills Radar */}
                <div className="md:col-span-1 border border-gray-200 bg-white rounded-xl shadow-sm p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Grid className="w-5 h-5 mr-2 text-indigo-500" />
                        Domain Expertise
                    </h3>

                    <div className="flex-1 min-h-[250px] flex items-center justify-center -ml-4">
                        <ResponsiveContainer width="100%" height={250}>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="domain" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }} />
                                <Radar
                                    name="Weight"
                                    dataKey="weight"
                                    stroke="#4f46e5"
                                    strokeWidth={2}
                                    fill="#6366f1"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {!hasSkills && (
                         <div className="text-center mt-2 text-xs text-orange-500 font-semibold bg-orange-50 py-2 rounded">
                             Skills not yet declared. Click "Update Collaborative Profile".
                         </div>
                    )}
                </div>

                {/* Right Column: Timeline */}
                <div className="md:col-span-2 border border-gray-200 bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-indigo-500" />
                        Past Podiums & Checkpoints
                    </h3>

                    <div className="space-y-6">
                        {timeline.length > 0 ? timeline.map((item, index) => (
                            <div key={item.id || index} className="relative pl-6 border-l-2 border-gray-100 pb-2 last:pb-0">
                                <div className={`absolute -left-[9px] top-0 p-1 rounded-full bg-white border-2 ${item.type === 'podium' ? 'border-indigo-500 text-indigo-500' : 'border-gray-300 text-gray-400'}`}>
                                    {item.type === 'podium' ? <Trophy className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                    <div className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">{item.org} • {item.date}</div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-sm text-gray-500 py-4 text-center border-2 border-dashed border-gray-100 rounded-lg">
                                No past hackathons or certificates linked yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Featured Project Banner (if exists) */}
                {colabData.featuredProject?.title && (
                    <div className="md:col-span-3 border border-indigo-200 bg-indigo-50/50 rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                         <div>
                             <h3 className="text-lg font-bold text-indigo-900 mb-1 flex items-center">
                                 <Award className="w-5 h-5 mr-2 text-indigo-500" />
                                 {colabData.featuredProject.title}
                             </h3>
                             <p className="text-sm text-indigo-700 max-w-2xl">{colabData.featuredProject.description}</p>
                         </div>
                         {colabData.featuredProject.link && (
                             <a href={colabData.featuredProject.link} target="_blank" rel="noreferrer" className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded shadow text-sm font-semibold hover:bg-indigo-700 transition-colors">
                                 View Project
                             </a>
                         )}
                    </div>
                )}
            </div>
        </div>
    );
}
