import React from 'react';

const TEAMS = [
    {
        id: 1,
        name: "Quantum Coders",
        role: "Admin",
        members: 4,
        status: "Active",
        lastActive: "2 hours ago",
        events: ["SAH 2.0 (Smart AI Hackathon)"]
    },
    {
        id: 2,
        name: "Byte Builders",
        role: "Member",
        members: 3,
        status: "Looking for members",
        lastActive: "1 day ago",
        events: []
    },
    {
        id: 3,
        name: "Data Miners",
        role: "Member",
        members: 5,
        status: "Active",
        lastActive: "3 days ago",
        events: ["Web3 Global Summit '26"]
    }
];

export default function MyTeams() {
    return (
        <div className="w-full h-full space-y-8 animate-in fade-in duration-500 font-sans">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-[32px] font-[600] tracking-tight text-[#201F24] mb-2">My Teams</h1>
                    <p className="text-[#5C5C5C] text-[16px]">Manage your teams, roles, and open invitations.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-[20px] py-[10px] bg-white border border-[#E5E7EB] text-[#201F24] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)] font-[500] hover:bg-[#FAFAFA] transition-colors text-[14px]">
                        Join Team
                    </button>
                    <button className="px-[20px] py-[10px] bg-[#7856FF] hover:bg-[#6846EB] text-white rounded-full font-[500] transition-colors text-[14px]">
                        Create New Team
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {TEAMS.map((team) => (
                    <div
                        key={team.id}
                        className="group bg-white rounded-2xl border border-[#E5E7EB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 p-6 flex flex-col md:flex-row md:items-center justify-between"
                    >
                        <div className="flex items-center space-x-5 mb-4 md:mb-0">
                            <div className="w-14 h-14 rounded-xl bg-[#E8DDFF] text-[#7856FF] flex items-center justify-center text-xl font-bold border border-[#7856FF]/20">
                                {team.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-[18px] font-[600] text-[#201F24] group-hover:text-[#7856FF] transition-colors">
                                    {team.name}
                                </h3>
                                <div className="text-[14px] text-[#5C5C5C] flex items-center space-x-2 mt-1">
                                    <span className="font-medium px-2 py-0.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-md">{team.role}</span>
                                    <span>•</span>
                                    <span>{team.members} Members</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:items-end space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${team.status === 'Active' ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                                <span className="text-[14px] text-[#201F24] font-medium">{team.status}</span>
                            </div>
                            <div className="text-[13px] text-[#5C5C5C]">
                                Last active {team.lastActive}
                            </div>
                            {team.events.length > 0 && (
                                <div className="text-[12px] text-[#7856FF] font-medium">
                                    Registered for {team.events[0]}
                                </div>
                            )}
                        </div>

                        <div className="mt-4 md:mt-0 flex md:block">
                            <button className="w-full md:w-auto px-4 py-2 bg-white border border-[#E5E7EB] hover:bg-[#FAFAFA] text-[#201F24] rounded-lg text-[14px] font-[500] transition-colors">
                                Manage
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
