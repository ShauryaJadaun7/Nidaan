'use client';
import { BarChart3, Users, Activity, Shield, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import PageHero from '@/components/layout/PageHero';

const DynamicMap = dynamic(() => import('@/components/admin/DiseaseMap'), { 
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-clinical-50/50 animate-pulse rounded-[2.5rem] flex items-center justify-center text-clinical-400 font-bold uppercase tracking-widest">Loading Live Disease Map...</div>
});

const stats = [
    { name: 'Total Patients', value: '2,842', change: '+12.5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Active Sessions', value: '154', change: '+18.2%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Health Queries', value: '12,405', change: '+5.4%', icon: BarChart3, color: 'text-clinical', bg: 'bg-clinical-50' },
    { name: 'SOS Alerts', value: '12', change: '-2 active', icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50' },
];

const entries = [
    { region: 'Sector 4 Rural', utilization: '84%', trend: 'up', status: 'Optimal' },
    { region: 'District Hospital', utilization: '92%', trend: 'up', status: 'Critical' },
    { region: 'Nagpur East', utilization: '45%', trend: 'down', status: 'Stable' },
    { region: 'Mumbai South', utilization: '67%', trend: 'up', status: 'Stable' },
];

export default function AdminDashboard() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <div className="flex flex-col p-6 lg:p-10 max-w-7xl mx-auto w-full gap-16">
                <PageHero 
                    title="Platform Analytics"
                    subtitle="Monitor institution-wide health metrics, resource utilization, and predictive disease surge patterns."
                    categoryPills={['Overview', 'Usage Stats', 'PHC Performance', 'Growth']}
                    showSearch={false}
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-7 rounded-[2.5rem] border border-slate-50 shadow-[0_8px_30px_rgba(0,0,0,0.02)]"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="flex items-center gap-1 text-[11px] font-black tracking-wider text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full">
                                    <TrendingUp size={14} /> {stat.change}
                                </div>
                            </div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{stat.value}</div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.name}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Utilization Chart Placeholder */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-50 shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-10 flex flex-col min-h-[450px]">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="font-heading font-bold text-2xl text-slate-800">Resource Utilization</h2>
                            <button className="text-[11px] font-bold text-clinical uppercase tracking-widest hover:underline bg-slate-50 px-4 py-2 rounded-full border border-slate-100">Download Report</button>
                        </div>
                        <div className="flex-1 flex flex-col gap-8">
                            {entries.map((entry, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-base font-bold text-slate-700">{entry.region}</span>
                                        <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-lg ${
                                            entry.status === 'Critical' ? 'bg-rose-100 text-rose-600' : 
                                            entry.status === 'Optimal' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>{entry.status}</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: entry.utilization }}
                                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                            className={`h-full rounded-full ${
                                                entry.status === 'Critical' ? 'bg-rose-500' : 
                                                entry.status === 'Optimal' ? 'bg-blue-500' : 'bg-clinical'
                                            }`}
                                        ></motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Alerts */}
                    <div className="bg-clinical rounded-[3rem] p-10 shadow-2xl shadow-clinical/20 text-white relative overflow-hidden flex flex-col min-h-[450px]">
                        <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                        <h2 className="font-heading font-bold text-2xl mb-10 relative z-10">Triage Distribution</h2>
                        <div className="space-y-8 relative z-10">
                            {[
                                { label: '🔴 Emergency', val: '12%', color: 'bg-white/20' },
                                { label: '🟡 Visit Clinic', val: '48%', color: 'bg-white/40' },
                                { label: '🟢 Stay Home', val: '40%', color: 'bg-white/60' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold tracking-widest uppercase">
                                        <span>{item.label}</span>
                                        <span>{item.val}</span>
                                    </div>
                                    <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: item.val }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto bg-white/10 rounded-[2rem] p-6 border border-white/10 relative z-10 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <ArrowUpRight size={20} className="text-white" />
                                <span className="text-sm font-bold tracking-wide">Predictive Alert</span>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed font-medium">System predicts a 15% surge in respiratory queries in the Nagpur East region over next 48 hours.</p>
                        </div>
                    </div>
                </div>

                {/* Live Disease Hotspots Map */}
                <div className="space-y-8 pb-20">
                    <div className="flex justify-between items-center px-2">
                        <div>
                            <h2 className="font-heading font-bold text-3xl text-slate-900 tracking-tight">Disease Hotspots</h2>
                            <p className="text-slate-500 font-medium text-base mt-2">Real-time geospatial tracking of suspected outbreaks and regional health alerts.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-rose-50 px-6 py-3 rounded-full border border-rose-100 shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                <span className="text-[11px] font-black tracking-[0.2em] text-rose-600 uppercase">12 Active Alerts</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-[600px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white">
                        <DynamicMap />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
