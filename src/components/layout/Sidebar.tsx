'use client';
import { useAuth, UserRole } from '@/context/AuthContext';
import { LayoutDashboard, Truck, Shield, AlertCircle, Settings, HelpCircle, LogOut, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const roleNavItems: Record<UserRole, { name: string; icon: any; href: string }[]> = {
    general: [
        { name: 'HEALTH HUB', icon: LayoutDashboard, href: '/' },
        { name: 'SOS', icon: AlertCircle, href: '/sos' },
    ],
    asha: [
        { name: 'DASHBOARD', icon: Truck, href: '/logistics' },
        { name: 'SOS', icon: AlertCircle, href: '/sos' },
    ],
    admin: [
        { name: 'ANALYTICS', icon: BarChart3, href: '/admin' },
    ],
};

const roleBadgeColors: Record<UserRole, string> = {
    general: 'bg-emerald-100 text-emerald-700',
    asha: 'bg-blue-100 text-blue-700',
    admin: 'bg-amber-100 text-amber-700',
};

const roleLabels: Record<UserRole, string> = {
    general: 'Patient',
    asha: 'ASHA Worker',
    admin: 'Admin',
};

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const navItems = roleNavItems[user.role] || [];

    return (
        <aside className="w-64 bg-gradient-to-b from-white to-slate-100/30 border-r border-slate-100 flex flex-col h-full py-8 shadow-[4px_0_40px_rgba(0,0,0,0.03)] z-50">
            {/* Logo */}
            <div className="px-8 mb-10 flex flex-col">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-black text-clinical tracking-tighter uppercase">Nirdaan</h1>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                </div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em] mt-1 ml-0.5">Clinical Sanctuary</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
                    return (
                        <Link 
                            key={item.name} 
                            href={item.href}
                            className={`flex items-center px-5 py-3.5 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
                                isActive 
                                ? 'text-clinical font-bold bg-white shadow-[0_4px_20px_rgba(15,118,110,0.08)] scale-[1.02]' 
                                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                            }`}
                        >
                            {isActive && (
                                <motion.div layoutId="activeNav" className="absolute left-0 top-0 bottom-0 w-1.5 bg-clinical rounded-r-full" />
                            )}
                            <item.icon className={`w-5 h-5 mr-3.5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:translate-x-1'}`} strokeWidth={isActive ? 3 : 2} />
                            <span className="text-[11px] font-black tracking-widest uppercase">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer nav */}
            <div className="px-4 space-y-1 border-t border-slate-100/50 pt-6">
                <Link href="/settings" className="flex items-center space-x-3 px-5 py-2.5 text-slate-400 hover:text-slate-600 transition-all hover:translate-x-1">
                    <Settings className="w-4 h-4" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Settings</span>
                </Link>
                <Link href="/help" className="flex items-center space-x-3 px-5 py-2.5 text-slate-400 hover:text-slate-600 transition-all hover:translate-x-1">
                    <HelpCircle className="w-4 h-4" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Help Center</span>
                </Link>
            </div>

            {/* User info + Logout */}
            <div className="px-4 mt-6 pt-6 border-t border-slate-100/50">
                <div className="flex items-center gap-4 px-4 mb-4 p-3 rounded-2xl bg-white/40 border border-white/60 shadow-sm">
                    <div className="w-9 h-9 rounded-xl bg-clinical text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-clinical/20">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-700 truncate tracking-tight">{user.name}</div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full mt-1 inline-block ${roleBadgeColors[user.role]}`}>
                            {roleLabels[user.role]}
                        </span>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50/50 py-3 rounded-2xl transition-all"
                >
                    <LogOut size={14} strokeWidth={3} /> Sign Out
                </button>
            </div>
        </aside>
    );
}
