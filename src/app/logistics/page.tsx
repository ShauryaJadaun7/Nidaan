import { AlertTriangle, Package, Phone, Bell, MapPin, Truck, AlertCircle } from 'lucide-react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import PageHero from '@/components/layout/PageHero';

export default function LogisticsDashboard() {
    return (
        <ProtectedRoute allowedRoles={['asha']}>
            <div className="flex flex-col p-6 lg:p-10 max-w-7xl mx-auto w-full gap-16">
                <PageHero 
                    title="Logistics Command"
                    subtitle="Manage community health inventory, patient triage records, and sub-center distribution metrics with real-time sync."
                    categoryPills={['Inventory', 'Patient Queue', 'Emergency Alerts', 'PHC Sync']}
                    showSearch={false}
                />

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 pb-20">
                    {/* Left Column */}
                    <div className="flex flex-col gap-10 pr-2">
                        {/* Inventory */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-heading font-bold text-xl text-slate-800">Local Stock Inventory</h2>
                                <button className="text-clinical font-bold text-xs uppercase hover:underline">View Report</button>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                                    <Package className="text-clinical mb-4" />
                                    <h3 className="font-bold text-slate-800 text-lg">ORS</h3>
                                    <p className="text-xs text-slate-400 mb-4 font-medium">Oral Rehydration</p>
                                    <div className="flex items-end gap-2 text-clinical">
                                        <span className="text-4xl font-black tracking-tighter">80%</span>
                                        <span className="text-[10px] font-bold mb-1.5 uppercase tracking-widest">Stable</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                                        <div className="h-full bg-clinical w-[80%] rounded-full"></div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-[2rem] p-6 border border-rose-50 shadow-[0_8px_30_rgba(225,29,72,0.06)]">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse mb-5 shadow-[0_0_10px_rgba(225,29,72,0.5)]"></div>
                                    <h3 className="font-bold text-slate-800 text-lg">Paracetamol</h3>
                                    <p className="text-xs text-slate-400 mb-4 font-medium">Fever Mgmt</p>
                                    <div className="flex items-end gap-2 text-rose-600">
                                        <span className="text-4xl font-black tracking-tighter">15%</span>
                                        <span className="text-[10px] font-bold mb-1.5 uppercase tracking-widest">Alert</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                                        <div className="h-full bg-rose-500 w-[15%] rounded-full"></div>
                                    </div>
                                </div>
                                <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100/50 shadow-sm w-full col-span-2 lg:col-span-1 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2.5 bg-amber-200/50 rounded-xl text-amber-700"><AlertTriangle size={20} /></div>
                                        <h3 className="font-bold text-slate-800 text-lg">Zinc Drops</h3>
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed mt-2">
                                        <span className="font-bold text-amber-700">42 units remaining.</span><br/>Reorder in 2 days.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Triage Queue */}
                        <section>
                            <h2 className="font-heading font-bold text-xl text-slate-800 mb-4 mt-2">Patient Triage Queue</h2>
                            <div className="space-y-4">
                                <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center justify-between transition-transform hover:-translate-y-0.5">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-14 h-14 rounded-[1rem] bg-[#f0f5ff] text-clinical font-black flex items-center justify-center text-xl">RP</div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-base">Rajesh Prasad</h4>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Needs Follow-up</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wide">10:45 AM</p>
                                        <button className="flex items-center gap-2 bg-clinical text-white px-5 py-2.5 rounded-[1rem] text-sm font-bold shadow-md shadow-clinical/20 hover:bg-clinical-dark hover:scale-105 transition-all"><Phone size={16}/> Call Patient</button>
                                        <button className="flex items-center gap-2 bg-slate-50 text-clinical px-5 py-2.5 rounded-[1rem] text-sm font-bold hover:bg-slate-100 border border-slate-100 transition-colors"><Bell size={16}/> Notify PHC</button>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center justify-between transition-transform hover:-translate-y-0.5">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-14 h-14 rounded-[1rem] bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-xl">SK</div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-base">Sita Kumari</h4>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Stable</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wide">09:15 AM</p>
                                        <button className="flex items-center gap-2 bg-clinical text-white px-5 py-2.5 rounded-[1rem] text-sm font-bold shadow-md shadow-clinical/20 hover:bg-clinical-dark hover:scale-105 transition-all"><Phone size={16}/> Call Patient</button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SOS Tree */}
                        <section className="bg-gradient-to-br from-[#f0f5ff] to-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] pb-12 mt-4 relative overflow-hidden">
                            <div className="absolute -top-32 -left-32 w-64 h-64 bg-clinical/5 rounded-full blur-3xl"></div>
                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <h2 className="font-heading font-bold text-xl text-slate-800">Family SOS Tree</h2>
                                <button className="text-clinical text-sm font-bold flex items-center gap-1 hover:underline">+ Add Member</button>
                            </div>
                            <div className="flex flex-col items-center relative z-10">
                                <div className="flex -space-x-4 mb-5">
                                    <div className="w-14 h-14 rounded-full border-[3px] border-white bg-slate-200"></div>
                                    <div className="w-14 h-14 rounded-full border-[3px] border-white bg-slate-300"></div>
                                    <div className="w-14 h-14 rounded-full border-[3px] border-white bg-slate-400"></div>
                                    <div className="w-14 h-14 rounded-full border-[3px] border-white bg-clinical text-white flex items-center justify-center font-bold text-base z-10 shadow-sm">+2</div>
                                </div>
                                <h3 className="font-bold text-slate-800 text-xl tracking-tight">Linked: Sharma Household</h3>
                                <p className="text-center text-sm font-medium text-slate-500 max-w-sm mt-3 mb-10 leading-relaxed">Immediate alerts will be sent to all 5 members and the district emergency dispatch unit.</p>
                                
                                <button className="bg-alert text-white rounded-full py-4 px-12 font-black tracking-wide text-lg shadow-[0_8px_30px_rgba(225,29,72,0.3)] hover:scale-105 hover:bg-rose-700 transition-all flex items-center gap-3">
                                    <MapPin strokeWidth={3} /> TRIGGER FAMILY SOS
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Command Center */}
                    <aside className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-50 p-8 flex flex-col h-[850px] overflow-y-auto scrollbar-hide relative">
                        <div className="flex justify-between items-center mb-8 px-2">
                            <h2 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm shadow-inner">👩🏽‍⚕️</div> Command Center</h2>
                        </div>

                        <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-4 px-2">Real-Time Logistics</h4>
                        <div className="bg-slate-200 rounded-[2rem] h-56 mb-8 relative overflow-hidden flex items-center justify-center shadow-inner">
                            <p className="text-slate-400 font-bold text-sm tracking-widest z-0">MAP INTEGRATION</p>
                            <div className="absolute inset-0 bg-clinical/5 mix-blend-multiply"></div>
                            {/* Mock Tags */}
                            <div className="absolute top-1/2 left-1/3 bg-clinical rounded-full text-white px-3 py-1.5 text-[10px] font-bold shadow-lg transform -translate-x-1/2 -translate-y-1/2 border-2 border-white flex items-center gap-1"><Truck size={12}/> VNA-382</div>
                            <div className="absolute top-1/3 right-1/4 bg-emerald-600 rounded-full text-white px-3 py-1.5 text-[10px] font-bold shadow-lg transform -translate-x-1/2 -translate-y-1/2 border-2 border-white flex items-center gap-1"><Truck size={12}/> THK-441 Mins</div>
                        </div>

                        <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-4 px-2 mt-2">Predictive Analytics</h4>
                        <div className="border-l-4 border-rose-500 bg-rose-50/50 rounded-2xl p-6 mb-8 transform hover:-translate-y-1 transition-transform">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-rose-100 px-3 py-1 rounded-full shadow-sm">High Risk</span>
                                <AlertCircle className="text-rose-400 opacity-60" size={28}/>
                            </div>
                            <h3 className="font-heading font-bold text-slate-800 text-2xl mb-1 mt-1">3 Days</h3>
                            <p className="text-sm font-semibold text-slate-600 mb-4">Paracetamol Stock-out Predicted</p>
                            <p className="text-[11px] text-rose-600 font-bold tracking-wide uppercase">Current: 142 units &nbsp;&bull;&nbsp; Usage: +15% vs Avg</p>
                        </div>

                        <div className="bg-[#f0f5ff] rounded-[2rem] p-8 mt-auto border border-blue-50/50">
                            <h4 className="font-bold text-slate-800 mb-5 text-lg">Emergency Resupply</h4>
                            <select className="w-full bg-white border-none rounded-2xl p-4 text-sm text-slate-600 font-bold mb-3 outline-none shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                <option>Select Supply Type...</option>
                                <option>Paracetamol 500mg (Batch)</option>
                                <option>ORS Packets (Box)</option>
                            </select>
                            <input type="number" placeholder="Quantity" className="w-full bg-white border-none rounded-2xl p-4 text-sm text-slate-600 font-bold mb-5 outline-none shadow-sm focus:ring-2 focus:ring-clinical/20 transition-shadow" />
                            <button className="w-full bg-clinical text-white py-4 rounded-2xl font-bold shadow-[0_8px_20px_rgba(15,118,110,0.2)] hover:bg-clinical-dark hover:shadow-[0_12px_25px_rgba(15,118,110,0.3)] transition-all tracking-wide">Submit Requisition</button>
                        </div>
                    </aside>
                </div>
            </div>
        </ProtectedRoute>
    );
}
