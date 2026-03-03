import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Compass, Users, Target, LayoutDashboard, User } from 'lucide-react';

const Sidebar = () => {
    const routes = [
        { name: 'Discover', path: '/discover', icon: Compass },
        { name: 'Smart Match', path: '/smart-match', icon: Users },
        { name: 'My Teams', path: '/my-teams', icon: Target },
        { name: 'Leaderboard', path: '/leaderboard', icon: LayoutDashboard },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <div className="w-[280px] bg-white border-r border-[#E5E7EB] h-screen fixed top-0 left-0 flex flex-col p-6 shadow-[1px_0_0_0_rgba(0,0,0,0.02)] z-10 transition-all font-sans">
            <div className="flex items-center space-x-3 mb-10 mt-2 pl-1">
                <div className="bg-[#7856FF] text-white w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-bold text-xl leading-none">
                    K
                </div>
                <span className="text-2xl font-bold tracking-tight text-[#201F24] leading-none">Kinetic</span>
            </div>

            <nav className="flex-1 space-y-[2px]">
                {routes.map((route) => (
                    <NavLink
                        key={route.path}
                        to={route.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3.5 px-3 py-2.5 rounded-xl transition-all font-medium text-[15px] ${isActive
                                ? 'bg-[#E8DDFF] text-[#7856FF]'
                                : 'text-[#5C5C5C] hover:bg-[#FAFAFA]'
                            }`
                        }
                    >
                        <route.icon className={`w-[22px] h-[22px] ${({ isActive }) => isActive ? 'text-[#7856FF]' : 'text-[#8C8C8C]'}`} />
                        <span>{route.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="pt-6 mt-4 border-t border-[#E5E7EB] flex items-center px-2 space-x-4 pb-2">
                <div className="w-10 h-10 rounded-full bg-[#E8DDFF] text-[#7856FF] flex justify-center items-center text-sm font-bold border border-[#7856FF]/20">
                    PR
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#201F24] truncate">Parjanya R.</div>
                    <div className="text-[12px] font-medium text-[#5C5C5C]">Pro Member</div>
                </div>
            </div>
        </div>
    );
};

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#201F24] flex">
            {/* Sidebar fixed */}
            <Sidebar />

            {/* Main Content Box offset for Sidebar */}
            <div className="ml-[280px] flex-1 flex flex-col min-h-screen">
                <main className="flex-1 p-10 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
