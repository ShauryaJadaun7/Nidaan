'use client';
import { Camera, FileUp, CheckCircle2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScannerPanel() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5 h-full overflow-y-auto scrollbar-hide pb-2"
        >
            {/* Top: Scanner Box */}
            <div className="shrink-0 bg-white rounded-[2.5rem] border border-dashed border-emerald-200 shadow-sm p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent"></div>
                
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-6 z-10 text-clinical relative group-hover:scale-110 transition-transform duration-300">
                    <Camera size={28} strokeWidth={2.5} />
                </div>
                
                <h3 className="font-heading font-bold text-xl text-slate-800 z-10 mb-3">Prescription<br/>Scanner</h3>
                <p className="text-slate-500 font-medium text-sm max-w-[180px] z-10 mb-8 leading-relaxed">
                    Drop prescription image here or click to trigger camera scan
                </p>
                
                <button className="bg-clinical text-white px-8 py-3.5 rounded-full font-bold shadow-[0_8px_20px_rgba(15,118,110,0.25)] hover:bg-clinical-dark transition-all transform hover:-translate-y-1 z-10 flex items-center gap-2">
                    <FileUp size={18} strokeWidth={2.5} /> SCAN NOW
                </button>

                <div className="mt-8 w-full flex justify-between items-end z-10 border-t border-emerald-50 pt-4 px-2">
                    <div className="text-left">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Accuracy</p>
                        <p className="font-bold text-clinical text-lg">98.4%</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Language</p>
                        <p className="font-bold text-clinical text-lg">Auto</p>
                    </div>
                </div>
            </div>

            {/* Bottom: Extracted Data */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="font-heading font-bold text-xl text-slate-800 leading-tight">Extracted Medication<br/>Regime</h3>
                    <button className="flex items-center gap-1 text-clinical font-bold text-xs hover:text-clinical-dark uppercase tracking-wider">
                        <Edit2 size={14} /> EDIT DATA
                    </button>
                </div>

                <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
                    <div className="col-span-4">Medicine</div>
                    <div className="col-span-3 text-center">Dosage</div>
                    <div className="col-span-3 text-center">Duration</div>
                    <div className="col-span-2 text-center">Intake</div>
                </div>

                <div className="space-y-4 overflow-y-auto pr-2">
                    {/* Item 1 */}
                    <div className="grid grid-cols-12 gap-2 items-center py-2 px-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="col-span-4">
                            <h4 className="font-bold text-slate-800 text-sm">Paracetamol</h4>
                            <p className="text-xs text-slate-500 font-medium">500mg <span className="text-[10px] text-slate-400 block mt-0.5">Post-meal</span></p>
                        </div>
                        <div className="col-span-3 flex justify-center">
                            <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-lg text-xs tracking-widest text-center shadow-sm">1 - 1 - 1</span>
                        </div>
                        <div className="col-span-3 text-center font-semibold text-slate-700 text-sm mt-1">
                            5 Days
                        </div>
                        <div className="col-span-2 flex justify-center mt-1">
                            <CheckCircle2 size={20} className="text-emerald-500" />
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="grid grid-cols-12 gap-2 items-center py-2 px-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="col-span-4">
                            <h4 className="font-bold text-slate-800 text-sm">Amoxicillin</h4>
                            <p className="text-xs text-slate-500 font-medium">250mg <span className="text-[10px] text-slate-400 block mt-0.5">Pre-meal</span></p>
                        </div>
                        <div className="col-span-3 flex justify-center">
                            <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-lg text-xs tracking-widest text-center shadow-sm">1 - 0 - 1</span>
                        </div>
                        <div className="col-span-3 text-center font-semibold text-slate-700 text-sm mt-1">
                            7 Days
                        </div>
                        <div className="col-span-2 flex justify-center mt-1">
                            <CheckCircle2 size={20} className="text-emerald-500" />
                        </div>
                    </div>
                </div>

                {/* System Status Node */}
                <div className="mt-auto pt-6">
                    <div className="bg-gradient-to-br from-clinical to-clinical-dark rounded-3xl p-6 relative overflow-hidden text-white shadow-[0_8px_20px_rgba(15,118,110,0.3)]">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase inline-block mb-3 border border-white/20">System Status</span>
                        <h4 className="font-bold text-lg leading-tight mb-1">Real-time Clinical<br/>Node Active</h4>
                        <p className="text-xs text-teal-100/80 font-medium">Connected to National Health Stack v2.1</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
