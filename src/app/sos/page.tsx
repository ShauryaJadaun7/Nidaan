'use client';
import { AlertCircle, Phone, Heart, Users, MapPin, ShieldAlert, Navigation } from 'lucide-react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const contacts = [
    { name: 'Dr. Ramesh (PHC)', role: 'Doctor', phone: '+91 98765 43210' },
    { name: 'District Ambulance', role: 'Emergency', phone: '102' },
    { name: 'Suresh Kumar', role: 'Family (Brother)', phone: '+91 87654 32109' },
];

export default function SOSPage() {
    const [isTriggered, setIsTriggered] = useState(false);

    const handleTrigger = () => {
        setIsTriggered(true);
        // In a real app, this would hit an API to send SMS/Push alerts
    };

    return (
        <ProtectedRoute allowedRoles={['general', 'asha']}>
            <div className="flex flex-col h-full p-6 lg:p-10 max-w-7xl mx-auto w-full gap-8">
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-800 tracking-tight">Emergency SOS</h1>
                        <p className="text-slate-500 font-medium mt-1">Immediate assistance and family alert system.</p>
                    </div>
                </header>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* SOS Trigger Card */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <AnimatePresence>
                            {isTriggered ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }} 
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative z-10"
                                >
                                    <div className="w-24 h-24 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(225,29,72,0.4)] animate-pulse">
                                        <AlertCircle size={48} />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-800 mb-2">SOS ACTIVATED</h2>
                                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Help is on the way. Your location and health data have been dispatched to the nearest PHC and family contacts.</p>
                                    <button 
                                        onClick={() => setIsTriggered(false)}
                                        className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                                    >
                                        Cancel Alert
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    className="relative z-10"
                                >
                                    <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-8 mx-auto border-4 border-rose-100 flex-col">
                                        <ShieldAlert size={40} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Need Urgent Help?</h2>
                                    <p className="text-slate-500 mb-10 max-w-sm mx-auto">Triggers immediate SMS alerts to family, calls local PHC, and requests nearest ambulance to your GPS location.</p>
                                    
                                    <button 
                                        onClick={handleTrigger}
                                        className="bg-rose-600 text-white px-12 py-5 rounded-full font-black text-xl shadow-[0_12px_30px_rgba(225,29,72,0.3)] hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto uppercase tracking-wide"
                                    >
                                        <AlertCircle strokeWidth={3} /> Trigger SOS
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {/* Background Pulse Effect when triggered */}
                        {isTriggered && (
                            <div className="absolute inset-0 bg-rose-50/50 flex items-center justify-center">
                                <div className="w-64 h-64 bg-rose-500/10 rounded-full animate-ping"></div>
                            </div>
                        )}
                    </div>

                    {/* Quick Response Contacts */}
                    <div className="space-y-6">
                        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <h2 className="font-heading font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                                <Users size={20} className="text-clinical" /> Emergency Network
                            </h2>
                            <div className="space-y-4">
                                {contacts.map((contact, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all shadow-sm group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-clinical">
                                                <Users size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-700">{contact.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{contact.role}</div>
                                            </div>
                                        </div>
                                        <a 
                                            href={`tel:${contact.phone}`}
                                            className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                        >
                                            <Phone size={18} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm rounded-2xl hover:border-clinical hover:text-clinical transition-all">
                                + Add Emergency Contact
                            </button>
                        </section>

                        <section className="grid grid-cols-2 gap-4">
                            <a href="tel:102" className="bg-emerald-600 text-white rounded-[2rem] p-6 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all text-center flex flex-col items-center justify-center gap-3">
                                <div className="p-3 bg-white/20 rounded-2xl"><Navigation size={24} /></div>
                                <div className="text-sm font-bold uppercase tracking-widest">Call Ambulance</div>
                            </a>
                            <a href="tel:108" className="bg-slate-800 text-white rounded-[2rem] p-6 shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all text-center flex flex-col items-center justify-center gap-3">
                                <div className="p-3 bg-white/20 rounded-2xl"><Phone size={24} /></div>
                                <div className="text-sm font-bold uppercase tracking-widest">PHC Support</div>
                            </a>
                        </section>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
