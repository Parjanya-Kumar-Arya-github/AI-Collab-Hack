import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, Github, Zap } from 'lucide-react';

const CANDIDATES = [
    {
        id: 1,
        name: "Alex Rivera",
        role: "Frontend React Developer",
        rating: 1540,
        ratingLabel: "Expert",
        skills: ["React", "TailwindCSS", "UI/UX", "Next.js"],
        verified: true,
        github: "alexriv",
        availability: "Available",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d"
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Fullstack Engineer",
        rating: 1450,
        ratingLabel: "Reliable",
        skills: ["Node.js", "React", "PostgreSQL", "System Design"],
        verified: true,
        github: "schen_dev",
        availability: "Looking for Team",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c"
    },
    {
        id: 3,
        name: "Vikram Sharma",
        role: "AI/ML Engineer",
        rating: 1620,
        ratingLabel: "Master",
        skills: ["Python", "PyTorch", "LLMs", "FastAPI"],
        verified: true,
        github: "vikramai",
        availability: "In a team",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026704b"
    },
    {
        id: 4,
        name: "Jayden Park",
        role: "Backend Developer",
        rating: 1380,
        ratingLabel: "Rising",
        skills: ["Go", "Docker", "Kubernetes", "Redis"],
        verified: false,
        github: "jpark_go",
        availability: "Available",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    }
];

export default function SmartMatch() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="w-full h-full space-y-8 animate-in fade-in duration-500 font-sans">

            {/* Header & Filter Section */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col space-y-4">
                <h1 className="text-[24px] font-[600] tracking-tight text-[#201F24]">Smart Match</h1>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C5C5C]" />
                        <input
                            type="text"
                            placeholder="Looking for: Frontend React Developer..."
                            className="w-full pl-11 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7856FF]/20 focus:border-[#7856FF] transition-all text-[14px] bg-[#FAFAFA] hover:bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative md:w-64">
                        <select className="w-full appearance-none bg-[#FAFAFA] hover:bg-white border border-[#E5E7EB] text-[#201F24] py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7856FF]/20 focus:border-[#7856FF] text-[14px] font-[500] transition-all">
                            <option>Event: SAH 2.0</option>
                            <option>Event: Web3 Summit</option>
                            <option>Any Event</option>
                        </select>
                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5C5C] pointer-events-none" />
                    </div>

                    <button className="bg-white text-[#201F24] border border-[#E5E7EB] py-2.5 px-5 rounded-xl hover:bg-[#FAFAFA] transition-colors text-[14px] font-[500] flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                        More Filters
                    </button>
                </div>
            </div>

            {/* Recommended Candidates Grid */}
            <div className="space-y-4">
                <h3 className="text-[18px] font-[600] text-[#201F24]">Suggested Teammates</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {CANDIDATES.filter(c => c.role.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((candidate) => (
                        <div key={candidate.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all flex flex-col sm:flex-row gap-5">

                            <div className="flex flex-col items-center sm:items-start shrink-0">
                                <div className="relative">
                                    <img src={candidate.avatar} alt={candidate.name} className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
                                    {candidate.verified && (
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                            <ShieldCheck className="w-5 h-5 text-[#7856FF]" />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3 flex items-center text-[12px] font-[600] px-2.5 py-1 bg-[#E8DDFF] text-[#7856FF] rounded-full">
                                    <Zap className="w-3 h-3 mr-1" />
                                    {candidate.rating}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h4 className="text-[16px] font-[600] text-[#201F24] flex items-center">
                                            {candidate.name}
                                        </h4>
                                        <p className="text-[14px] text-[#5C5C5C] font-[500]">{candidate.role}</p>
                                    </div>
                                    <span className={`text-[10px] uppercase tracking-wider font-[600] px-2.5 py-1 rounded-full ${candidate.availability === 'Available' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#FAFAFA] text-[#5C5C5C] border border-[#E5E7EB]'}`}>
                                        {candidate.availability}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2 text-[12px] text-[#5C5C5C] mb-4 mt-1">
                                    <Github className="w-3.5 h-3.5" />
                                    <span>{candidate.github}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="font-[600] text-[#201F24]">Rating: {candidate.ratingLabel}</span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-5">
                                    {candidate.skills.map(skill => (
                                        <span key={skill} className="px-2.5 py-1 bg-[#FAFAFA] border border-[#E5E7EB] text-[#5C5C5C] rounded-lg text-[12px] font-[500]">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-auto flex justify-end">
                                    <button className="px-5 py-2 bg-[#7856FF] hover:bg-[#6846EB] text-white text-[14px] font-[500] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors">
                                        Invite to Team
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
