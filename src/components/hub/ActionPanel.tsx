'use client';
import { AlertTriangle, MapPin, Pause, Save } from 'lucide-react';

import { motion } from 'framer-motion';

export default function ActionPanel() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-5 h-full overflow-y-auto scrollbar-hide pb-2"
        >
            {/* Urgent Advisory Card */}
            <div className="shrink-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-[2.5rem] p-6 text-white shadow-[0_8px_30px_rgba(217,119,6,0.25)] relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase mb-4 opacity-90">
                    <AlertTriangle size={16} strokeWidth={3} /> URGENT ADVISORY
                </div>
                
                <h3 className="font-heading font-bold text-xl mb-3 leading-tight shadow-sm">Patient Sensitivity<br/>Detected</h3>
                <p className="text-xs text-amber-50 font-medium leading-relaxed mb-6">
                    Prescription contains Penicillin.<br/>
                    Patient history indicates potential allergic reaction.
                </p>
                
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white font-bold text-sm py-3.5 rounded-xl transition-colors shadow-sm tracking-wide">
                    VERIFY RECORD
                </button>
            </div>

            {/* Voice Diagnostics */}
            <div className="shrink-0 bg-white rounded-[2.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 p-6 relative flex-1 flex flex-col">
                <div className="absolute top-8 right-8 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_12px_rgba(225,29,72,0.5)]"></div>
                <h4 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-6">Voice Diagnostics</h4>
                
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h3 className="font-heading font-bold text-xl text-slate-800">Doctor Notes</h3>
                        <p className="text-xs font-semibold text-slate-400 mt-1">00:42 / 03:00</p>
                    </div>
                </div>

                {/* Waveform Mockup */}
                <div className="flex items-center justify-center gap-1.5 h-16 mb-10 px-2">
                    {[12,24,16,32,48,24,36,18,12,32,48,24,36,18,24,12].map((h, i) => (
                        <div key={i} className="w-2 bg-clinical rounded-full transition-all duration-300" style={{ height: `${h}px`, opacity: i % 3 === 0 ? 0.3 : 1 }}></div>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button className="w-14 h-14 rounded-full bg-slate-50 text-clinical flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm border border-slate-100 shrink-0">
                        <Pause size={20} fill="currentColor" />
                    </button>
                    <button className="flex-1 bg-clinical text-white font-bold text-sm rounded-full shadow-[0_8px_20px_rgba(15,118,110,0.2)] hover:bg-clinical-dark hover:shadow-[0_8px_25px_rgba(15,118,110,0.3)] transition-all flex items-center justify-center gap-2 tracking-wide">
                        <Save size={18} strokeWidth={2.5} /> SAVE
                    </button>
                </div>
            </div>

            {/* Emergency SOS */}
            <div className="mt-auto shrink-0">
                <a href="tel:112" className="w-full bg-gradient-to-b from-alert to-rose-700 text-white rounded-[2.5rem] p-6 flex flex-col items-center justify-center shadow-[0_12px_40px_rgba(225,29,72,0.3)] hover:shadow-[0_16px_50px_rgba(225,29,72,0.4)] transition-all transform hover:-translate-y-1 relative overflow-hidden group block text-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner mx-auto">
                        <MapPin size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase mb-1.5 opacity-90 text-rose-100 block">Critical Action</span>
                    <h3 className="font-heading font-black text-xl tracking-wide">EMERGENCY SOS</h3>
                </a>
                <p className="text-center text-[10px] font-bold text-slate-400 mt-4 px-4 leading-relaxed">
                    Tap to instantly call local emergency response & hospital network.
                </p>
            </div>
        </motion.div>
    );
}
