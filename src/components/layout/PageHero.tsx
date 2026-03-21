'use client';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface PageHeroProps {
    title: string;
    subtitle: string;
    categoryPills?: string[];
    showSearch?: boolean;
}

export default function PageHero({ title, subtitle, categoryPills, showSearch = true }: PageHeroProps) {
    return (
        <section className="relative w-full rounded-[2.5rem] overflow-hidden bg-[#042f2e] py-20 px-10 mb-12 shadow-2xl border border-white/5 group">
            {/* Honeycomb/Texture Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none transition-transform duration-1000 group-hover:scale-105" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-rule='evenodd' stroke='%23ffffff' stroke-width='1' fill='none'/%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-clinical-dark/20 to-transparent" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/5 to-transparent blur-3xl rounded-full" />

            <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-black tracking-[0.3em] text-emerald-400 uppercase">Sanctuary Online</span>
                </motion.div>

                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-6"
                >
                    {title}
                </motion.h1>
                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-clinical-100/60 text-lg lg:text-xl font-medium max-w-3xl leading-relaxed"
                >
                    {subtitle}
                </motion.p>

                {showSearch && (
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 w-full max-w-3xl relative p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10"
                    >
                        <div className="bg-white rounded-full p-2 flex items-center shadow-2xl">
                            <Search className="ml-6 text-slate-400 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search medical database, symptoms, or phc locations..."
                                className="flex-1 bg-transparent px-6 py-3 outline-none text-slate-800 font-bold text-sm placeholder:text-slate-300 placeholder:font-medium"
                            />
                            <button className="bg-[#042f2e] text-white px-10 py-4 rounded-full font-black text-xs tracking-widest hover:bg-clinical-dark hover:scale-[0.98] transition-all flex items-center gap-2 group/btn">
                                SEARCH HUB
                                <motion.span className="group-hover/btn:translate-x-1 transition-transform inline-block">→</motion.span>
                            </button>
                        </div>
                    </motion.div>
                )}

                {categoryPills && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-4 mt-12"
                    >
                        {categoryPills.map((pill, i) => (
                            <button 
                                key={pill}
                                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                                    i === 0 
                                    ? 'bg-white text-clinical-950 border-white shadow-xl shadow-white/5' 
                                    : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10'
                                }`}
                            >
                                {pill}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
