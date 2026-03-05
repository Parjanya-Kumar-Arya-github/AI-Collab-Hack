import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Compass, Users, Target, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const routes = [
        { name: 'Discover',     path: '/discover',     icon: Compass },
        { name: 'Smart Match',  path: '/smart-match',  icon: Users },
        { name: 'My Teams',     path: '/my-teams',     icon: Target },
        { name: 'Leaderboard',  path: '/leaderboard',  icon: LayoutDashboard },
        { name: 'Profile',      path: '/profile',      icon: User },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Get initials from full name or username
    const getInitials = () => {
        if (user?.full_name) {
            return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return (user?.username || 'U').slice(0, 2).toUpperCase();
    };

    return (
        <div className="w-[280px] bg-white border-r border-[#E5E7EB] h-screen fixed top-0 left-0 flex flex-col p-6 shadow-[1px_0_0_0_rgba(0,0,0,0.02)] z-10 font-sans">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-10 mt-2 pl-1">
                <div className="bg-[#7856FF] text-white w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-bold text-xl leading-none">
                    K
                </div>
                <span className="text-2xl font-bold tracking-tight text-[#201F24] leading-none">Kinetic</span>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 space-y-[2px]">
                {routes.map((route) => (
                    <NavLink
                        key={route.path}
                        to={route.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3.5 px-3 py-2.5 rounded-xl transition-all font-medium text-[15px] ${
                                isActive
                                    ? 'bg-[#E8DDFF] text-[#7856FF]'
                                    : 'text-[#5C5C5C] hover:bg-[#FAFAFA]'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <route.icon className={`w-[22px] h-[22px] ${isActive ? 'text-[#7856FF]' : 'text-[#8C8C8C]'}`} />
                                <span>{route.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Footer */}
            <div className="pt-4 mt-4 border-t border-[#E5E7EB]">
                <div className="flex items-center px-2 space-x-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E8DDFF] border border-[#7856FF]/20 shrink-0 flex items-center justify-center">
                        {user?.avatar_url
                            ? <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                            : <span className="text-sm font-bold text-[#7856FF]">{getInitials()}</span>
                        }
                    </div>

                    {/* Name + tier */}
                    <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-semibold text-[#201F24] truncate">
                            {user?.full_name || user?.username || 'User'}
                        </div>
                        <div className="text-[12px] font-medium text-[#5C5C5C]">
                            {user?.tier || 'Explorer'}
                            {user?.elo_score ? ` · ${user.elo_score.toLocaleString()} pts` : ''}
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="p-1.5 rounded-lg text-[#8C8C8C] hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#201F24] flex">
            <Sidebar />
            <div className="ml-[280px] flex-1 flex flex-col min-h-screen">
                <main className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}