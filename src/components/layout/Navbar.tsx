'use client';
import { useAuth, UserRole } from '@/context/AuthContext';
import { LayoutDashboard, Truck, Shield, AlertCircle, Settings, HelpCircle, LogOut, BarChart3, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const roleNavItems: Record<UserRole, { name: string; icon: any; href: string }[]> = {
    general: [
        { name: 'HEALTH HUB', icon: LayoutDashboard, href: '/' },
        { name: 'SOS', icon: AlertCircle, href: '/sos' },
        { name: 'SETTINGS', icon: Settings, href: '/settings' },
        { name: 'HELP', icon: HelpCircle, href: '/help' },
    ],
    asha: [
        { name: 'DASHBOARD', icon: Truck, href: '/logistics' },
        { name: 'SOS', icon: AlertCircle, href: '/sos' },
        { name: 'SETTINGS', icon: Settings, href: '/settings' },
        { name: 'HELP', icon: HelpCircle, href: '/help' },
    ],
    admin: [
        { name: 'ANALYTICS', icon: BarChart3, href: '/admin' },
        { name: 'SETTINGS', icon: Settings, href: '/settings' },
        { name: 'HELP', icon: HelpCircle, href: '/help' },
    ],
};

function DiamondLogo() {
    return (
        <div className="relative w-8 h-8 flex items-center justify-center mr-6">
            <div className="grid grid-cols-2 gap-1.5 rotate-45">
                <div className="w-2 h-2 rounded-full bg-clinical/40" />
                <div className="w-2 h-2 rounded-full bg-clinical" />
                <div className="w-2 h-2 rounded-full bg-clinical" />
                <div className="w-2 h-2 rounded-full bg-clinical/40" />
            </div>
        </div>
    );
}

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    if (!user) return null;

    const navItems = roleNavItems[user.role] || [];

    return (
        <div className="fixed top-8 left-0 right-0 z-[100] flex justify-center px-4">
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-[#042f2e]/95 backdrop-blur-2xl border border-white/10 rounded-full h-20 flex items-center px-10 shadow-[0_20px_50px_rgba(4,47,46,0.3)] max-w-6xl w-full"
            >
                {/* Logo Text */}
                <Link href="/" className="flex items-center mr-12">
                    <span className="text-2xl font-black text-white tracking-tighter uppercase">Nirdaan</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-clinical-400 ml-1 mt-auto mb-1"></div>
                </Link>

                {/* Nav Links */}
                <nav className="flex-1 flex items-center justify-center gap-14">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`text-[12px] font-black tracking-[0.25em] transition-all duration-300 relative py-1 uppercase ${
                                    isActive ? 'text-white' : 'text-clinical-200/50 hover:text-white'
                                }`}
                            >
                                {item.name}
                                {isActive && (
                                    <motion.div 
                                        layoutId="navUnderline" 
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-clinical-400 rounded-full" 
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Side Buttons */}
                <div className="flex items-center ml-12">
                    <div className="relative">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="bg-white text-clinical-950 px-10 py-3.5 rounded-full text-[12px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center gap-3"
                        >
                            ACCOUNT
                            <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </motion.button>


                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
                                >
                                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Signed in as</div>
                                        <div className="text-xs font-bold text-white truncate">{user.name}</div>
                                    </div>
                                    <button 
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut size={14} strokeWidth={2.5} /> Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
