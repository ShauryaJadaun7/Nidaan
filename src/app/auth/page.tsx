'use client';
import { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Heart, Users, Eye, EyeOff, ArrowRight, Stethoscope } from 'lucide-react';

const roles: { value: UserRole; label: string; icon: any; desc: string }[] = [
    { value: 'general', label: 'General Public', icon: Heart, desc: 'Get AI-powered health guidance' },
    { value: 'asha', label: 'ASHA Worker', icon: Users, desc: 'Manage patients & logistics' },
    { value: 'admin', label: 'Administrator', icon: Shield, desc: 'Platform analytics & control' },
];

export default function AuthPage() {
    const { login, signup } = useAuth();
    const router = useRouter();
    const [tab, setTab] = useState<'login' | 'signup'>('login');
    const [role, setRole] = useState<UserRole>('general');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('');
    const [ashaId, setAshaId] = useState('');
    const [district, setDistrict] = useState('');
    const [subCenter, setSubCenter] = useState('');
    const [adminCode, setAdminCode] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (tab === 'signup') {
                if (role === 'admin' && adminCode !== 'NIRDAAN2026') {
                    setError('Invalid admin access code.');
                    setLoading(false);
                    return;
                }
                await signup(email, password, {
                    name, email, phone, role, location,
                    ...(role === 'asha' ? { ashaId, district, subCenter } : {}),
                });
            } else {
                await login(email, password);
            }
            router.push('/');
        } catch (err: any) {
            const msg = err?.message || 'Something went wrong';
            if (msg.includes('auth/email-already-in-use')) setError('This email is already registered.');
            else if (msg.includes('auth/invalid-credential')) setError('Invalid email or password.');
            else if (msg.includes('auth/weak-password')) setError('Password must be at least 6 characters.');
            else setError(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium outline-none focus:border-clinical focus:ring-2 focus:ring-clinical/10 transition-all placeholder:text-slate-400";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0fdf9] via-white to-[#f0f5ff] flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-clinical/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-clinical rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-clinical/20">
                        <Stethoscope className="text-white" size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Nirdaan</h1>
                    <p className="text-xs uppercase font-semibold text-slate-400 tracking-widest mt-1">Clinical Sanctuary</p>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                    {/* Tab switcher */}
                    <div className="flex bg-slate-50 p-1.5 mx-5 mt-5 rounded-xl">
                        {(['login', 'signup'] as const).map(t => (
                            <button 
                                key={t} 
                                onClick={() => { setTab(t); setError(''); }}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                    tab === t ? 'bg-white text-clinical shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {t === 'login' ? 'Sign In' : 'Sign Up'}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 space-y-4">
                        <AnimatePresence mode="wait">
                            {tab === 'signup' && (
                                <motion.div 
                                    key="signup-fields"
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    {/* Role selector */}
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">Select Your Role</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {roles.map(r => (
                                                <button
                                                    key={r.value}
                                                    type="button"
                                                    onClick={() => setRole(r.value)}
                                                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                                                        role === r.value 
                                                            ? 'border-clinical bg-clinical/5 shadow-sm' 
                                                            : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                                >
                                                    <r.icon size={20} className={`mx-auto mb-1.5 ${role === r.value ? 'text-clinical' : 'text-slate-400'}`} />
                                                    <div className={`text-[10px] font-bold ${role === r.value ? 'text-clinical' : 'text-slate-500'}`}>{r.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required className={inputClass} />
                                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" type="tel" required className={inputClass} />
                                    <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City / Village" className={inputClass} />

                                    {role === 'asha' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 bg-teal-50/50 rounded-xl p-3 border border-teal-100/50">
                                            <div className="text-[10px] uppercase font-bold text-clinical tracking-wider">ASHA Worker Details</div>
                                            <input value={ashaId} onChange={e => setAshaId(e.target.value)} placeholder="ASHA Worker ID" required className={inputClass} />
                                            <input value={district} onChange={e => setDistrict(e.target.value)} placeholder="District" required className={inputClass} />
                                            <input value={subCenter} onChange={e => setSubCenter(e.target.value)} placeholder="Sub-center Name" required className={inputClass} />
                                        </motion.div>
                                    )}

                                    {role === 'admin' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 bg-amber-50/50 rounded-xl p-3 border border-amber-100/50">
                                            <div className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Admin Verification</div>
                                            <input value={adminCode} onChange={e => setAdminCode(e.target.value)} placeholder="Admin Access Code" required className={inputClass} />
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <input 
                            value={email} onChange={e => setEmail(e.target.value)} 
                            placeholder="Email Address" type="email" required 
                            className={inputClass} 
                        />
                        <div className="relative">
                            <input 
                                value={password} onChange={e => setPassword(e.target.value)} 
                                placeholder="Password" type={showPassword ? 'text' : 'password'} required 
                                className={inputClass} 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-xl border border-red-100">
                                {error}
                            </motion.div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-clinical text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-clinical/20 hover:bg-clinical-dark hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {tab === 'login' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6 font-medium">
                    Nirdaan Clinical Sanctuary — AI-Powered Health Triage
                </p>
            </motion.div>
        </div>
    );
}
