import React, { useState } from 'react';

const LEADERBOARD_DATA = [
    { rank: 1, name: "Alex Chen", handle: "@alexc", score: 12450, badges: ["🏆", "💻"], trend: "up" },
    { rank: 2, name: "Sarah Jenkins", handle: "@sjenkins", score: 11820, badges: ["🥈", "🚀"], trend: "same" },
    { rank: 3, name: "Parjanya R.", handle: "@parjanya", score: 11500, badges: ["🥉", "⚡"], trend: "up", isCurrentUser: true },
    { rank: 4, name: "David Kim", handle: "@dkim99", score: 10940, badges: ["🔥"], trend: "down" },
    { rank: 5, name: "Emily Blunt", handle: "@emilyb", score: 10210, badges: ["💡"], trend: "up" },
    { rank: 6, name: "Michael Chang", handle: "@mchang", score: 9800, badges: [], trend: "down" },
    { rank: 7, name: "Jessica Wu", handle: "@jessw", score: 9550, badges: ["🌟"], trend: "same" },
];

export default function Leaderboard() {
    const [activeTab, setActiveTab] = useState('Global');

    return (
        <div className="w-full h-full space-y-8 animate-in fade-in duration-500 font-sans">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-[32px] font-[600] tracking-tight text-[#201F24] mb-2">Leaderboard</h1>
                    <p className="text-[#5C5C5C] text-[16px]">See where you stand among top developers globally.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-[#FAFAFA] p-1 border border-[#E5E7EB] rounded-xl w-fit mb-6">
                {['Global', 'University', 'Following'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 text-[14px] font-[500] rounded-lg transition-all ${activeTab === tab
                                ? 'bg-white text-[#201F24] shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                                : 'text-[#8C8C8C] hover:text-[#5C5C5C]'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB] text-[#5C5C5C] text-[13px] uppercase tracking-wider">
                                <th className="px-6 py-4 font-[600] w-24 text-center">Rank</th>
                                <th className="px-6 py-4 font-[600]">Hacker</th>
                                <th className="px-6 py-4 font-[600] text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {LEADERBOARD_DATA.map((user) => (
                                <tr
                                    key={user.rank}
                                    className={`transition-colors hover:bg-[#FAFAFA] ${user.isCurrentUser ? 'bg-[#F4F0FF] hover:bg-[#E8DDFF]' : ''}`}
                                >
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <span className={`text-[16px] font-[700] ${user.rank === 1 ? 'text-amber-500' :
                                                    user.rank === 2 ? 'text-gray-400' :
                                                        user.rank === 3 ? 'text-amber-700' :
                                                            'text-[#5C5C5C]'
                                                }`}>
                                                #{user.rank}
                                            </span>
                                            {user.trend === 'up' && <span className="text-green-500 text-xs">▲</span>}
                                            {user.trend === 'down' && <span className="text-red-500 text-xs">▼</span>}
                                            {user.trend === 'same' && <span className="text-gray-400 text-xs">-</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold ${user.isCurrentUser ? 'bg-[#7856FF] text-white' : 'bg-[#F0F0F0] text-[#5C5C5C]'
                                                }`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`font-[600] text-[15px] ${user.isCurrentUser ? 'text-[#7856FF]' : 'text-[#201F24]'}`}>
                                                        {user.name}
                                                    </span>
                                                    {user.badges.map((badge, i) => (
                                                        <span key={i} title="Badge">{badge}</span>
                                                    ))}
                                                </div>
                                                <div className="text-[13px] text-[#8C8C8C]">{user.handle}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right font-[600] text-[#201F24] text-[15px]">
                                        {user.score.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
