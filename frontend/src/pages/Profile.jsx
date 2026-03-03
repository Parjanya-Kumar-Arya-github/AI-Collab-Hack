import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { User, MapPin, Link as LinkIcon, Edit3, Grid, Trophy, CheckCircle2 } from 'lucide-react';

const SKILL_DATA = [
    { domain: 'Frontend', weight: 85 },
    { domain: 'Backend', weight: 60 },
    { domain: 'UI/UX', weight: 70 },
    { domain: 'DevOps', weight: 45 },
    { domain: 'AI/ML', weight: 30 },
    { domain: 'System Design', weight: 65 }
];

const TIMELINE = [
    { id: 1, title: 'Winner - SAH 1.0', date: 'October 2025', type: 'podium', org: 'AI Tech Alliance' },
    { id: 2, title: 'Finalist - Web3 Build', date: 'August 2025', type: 'checkpoint', org: 'Ethereum Foundation' },
    { id: 3, title: 'Top 10 - Global Hack', date: 'June 2025', type: 'checkpoint', org: 'Major League Hacking' }
];

export default function Profile() {
    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* Profile Header Card */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="px-8 pb-8 relative">
                    <div className="flex justify-between items-end">
                        <div className="-mt-12 relative flex items-center">
                            <img
                                src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                                alt="Profile"
                                className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-sm"
                            />
                            <div className="ml-4 mt-12">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Parjanya R.</h1>
                                <p className="text-sm font-medium text-gray-500">Fullstack Developer & AI Enthusiast</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 rounded shadow-sm text-sm font-semibold flex items-center transition-colors">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center mt-6 gap-6 text-sm text-gray-600">
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400" /> New Delhi, India</span>
                        <span className="flex items-center"><LinkIcon className="w-4 h-4 mr-1 text-gray-400" /> parjanya.dev</span>
                        <span className="flex items-center text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded">
                            <Trophy className="w-4 h-4 mr-1" /> Elo: 1540 (Expert)
                        </span>
                    </div>

                    <div className="mt-6 text-gray-700 text-sm leading-relaxed max-w-3xl">
                        Passionate about building scalable web applications and exploring the intersection of AI with modern frontend architecture. Always looking for challenging hackathons to build cool stuff.
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
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SKILL_DATA}>
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

                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">React</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">Node.js</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">PostgreSQL</span>
                    </div>
                </div>

                {/* Right Column: Timeline */}
                <div className="md:col-span-2 border border-gray-200 bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-indigo-500" />
                        Past Podiums & Checkpoints
                    </h3>

                    <div className="space-y-6">
                        {TIMELINE.map((item, index) => (
                            <div key={item.id} className="relative pl-6 border-l-2 border-gray-100 pb-2 last:pb-0">
                                <div className={`absolute -left-[9px] top-0 p-1 rounded-full bg-white border-2 ${item.type === 'podium' ? 'border-indigo-500 text-indigo-500' : 'border-gray-300 text-gray-400'}`}>
                                    {item.type === 'podium' ? <Trophy className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                                    <div className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">{item.org} • {item.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
