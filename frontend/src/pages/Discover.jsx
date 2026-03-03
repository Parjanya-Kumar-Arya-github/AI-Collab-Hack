import React from 'react';

const HACKATHONS = [
    {
        id: 1,
        name: "SAH 2.0 (Smart AI Hackathon)",
        organizer: "AI Tech Alliance",
        dates: "Nov 15 - Nov 17, 2026",
        prizePool: "$50,000",
        tags: ["AI", "Machine Learning", "Open to All"],
        status: "Registration Open",
        participants: 1240
    },
    {
        id: 2,
        name: "Web3 Global Summit '26",
        organizer: "Crypto Foundation",
        dates: "Dec 1 - Dec 5, 2026",
        prizePool: "$100,000",
        tags: ["Web3", "Blockchain", "DeFi"],
        status: "Upcoming",
        participants: 890
    },
    {
        id: 3,
        name: "Code4Good Initiative",
        organizer: "Global Non-Profit",
        dates: "Jan 10 - Jan 12, 2027",
        prizePool: "Mentorship & Grants",
        tags: ["Social Impact", "Open Source", "Beginner Friendly"],
        status: "Registration Open",
        participants: 450
    },
    {
        id: 4,
        name: "FinTech Disrupters",
        organizer: "FinBankorp",
        dates: "Nov 30 - Dec 2, 2026",
        prizePool: "$25,000",
        tags: ["Fintech", "Payment", "Startups"],
        status: "Registration Open",
        participants: 760
    }
];

export default function Discover() {
    return (
        <div className="w-full h-full space-y-8 animate-in fade-in duration-500 font-sans">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-[32px] font-[600] tracking-tight text-[#201F24] mb-2">Discover</h1>
                    <p className="text-[#5C5C5C] text-[16px]">Find top hackathons, competitions, and hiring challenges.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-[20px] py-[10px] bg-white border border-[#E5E7EB] text-[#201F24] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)] font-[500] hover:bg-[#FAFAFA] transition-colors text-[14px]">
                        Filters
                    </button>
                    <button className="px-[20px] py-[10px] bg-[#7856FF] hover:bg-[#6846EB] text-white rounded-full font-[500] transition-colors text-[14px]">
                        Host an Event
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HACKATHONS.map((event) => (
                    <div
                        key={event.id}
                        className="group bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col overflow-hidden"
                    >
                        {/* Banner */}
                        <div className="h-32 bg-[#E8DDFF] w-full relative">
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[12px] font-[600] px-2.5 py-1 rounded-full text-[#7856FF]">
                                {event.status}
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-2 text-[12px] font-[600] text-[#5C5C5C] uppercase tracking-wider">{event.organizer}</div>
                            <h3 className="text-[20px] font-[600] text-[#201F24] mb-3 leading-tight group-hover:text-[#7856FF] transition-colors">{event.name}</h3>

                            <div className="flex flex-wrap gap-2 mb-6 mt-1">
                                {event.tags.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 bg-[#FAFAFA] border border-[#E5E7EB] text-[#5C5C5C] rounded-lg text-[12px] font-[500]">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-auto space-y-2.5 mb-6">
                                <div className="flex items-center text-[14px] text-[#5C5C5C]">
                                    <svg className="w-4 h-4 mr-2.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {event.dates}
                                </div>
                                <div className="flex items-center text-[14px] text-[#5C5C5C]">
                                    <svg className="w-4 h-4 mr-2.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Prize: {event.prizePool}
                                </div>
                                <div className="flex items-center text-[14px] text-[#5C5C5C]">
                                    <svg className="w-4 h-4 mr-2.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {event.participants} Registered
                                </div>
                            </div>

                            <button className="w-full py-2.5 bg-[#FAFAFA] hover:bg-[#7856FF] text-[#201F24] hover:text-white border border-[#E5E7EB] hover:border-[#7856FF] rounded-full font-[500] transition-colors duration-200 text-[14px]">
                                Register Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
