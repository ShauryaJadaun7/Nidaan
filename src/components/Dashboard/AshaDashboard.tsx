"use client";

import { Activity, Search, Users } from 'lucide-react';

export default function AshaDashboard() {
  const patients = [
    { name: 'Patient 1', age: 0, village: 'Rural Area', urgency: 'Home Care', date: '2026-03-21T11:41:55.681984+00:00' },
    { name: 'Patient 2', age: 0, village: 'Rural Area', urgency: 'Visit Doctor', date: '2026-03-21T11:41:48.614321+00:00' },
    { name: 'Patient 3', age: 0, village: 'Rural Area', urgency: 'Emergency', date: '2026-03-21T11:41:35.956780+00:00' },
  ];

  const getUrgencyBadge = (urgency: string) => {
    switch(urgency) {
      case 'Emergency': return <span className="bg-[#ef4444] text-white text-[12px] font-bold px-3 py-1 rounded-full whitespace-nowrap">Emergency</span>;
      case 'Visit Doctor': return <span className="bg-[#f59e0b] text-white text-[12px] font-bold px-3 py-1 rounded-full whitespace-nowrap">Visit Doctor</span>;
      case 'Home Care': return <span className="bg-[#10b981] text-white text-[12px] font-bold px-3 py-1 rounded-full whitespace-nowrap">Home Care</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-2">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <h2 className="font-display font-bold text-[32px] text-slate-900 leading-tight">ASHA Worker Dashboard</h2>
            <p className="text-slate-500 font-medium">आशा कार्यकर्ता डैशबोर्ड</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            <Activity className="w-5 h-5 text-slate-400" />
            Show QR Scanner
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Emergency Cases */}
          <div className="bg-[#fff1f2] border border-[#fecdd3] rounded-2xl p-6">
            <h3 className="text-slate-700 font-semibold text-[15px] mb-2">Emergency Cases</h3>
            <p className="font-display font-bold text-[40px] leading-none text-[#ef4444]">1</p>
          </div>
          
          {/* Doctor Visits */}
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-6">
            <h3 className="text-slate-700 font-semibold text-[15px] mb-2">Doctor Visits</h3>
            <p className="font-display font-bold text-[40px] leading-none text-[#f59e0b]">1</p>
          </div>
          
          {/* Home Care */}
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-6">
            <h3 className="text-slate-700 font-semibold text-[15px] mb-2">Home Care</h3>
            <p className="font-display font-bold text-[40px] leading-none text-[#10b981]">2</p>
          </div>
        </div>
      </div>

      {/* Patient Queue Card */}
      <div className="bg-white rounded-3xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display font-semibold text-xl text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#0f766e]" /> 
            Patient Queue
          </h2>
          <div className="relative w-72">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-4 font-semibold text-slate-600">Patient Name</th>
                <th className="pb-4 font-semibold text-slate-600">Age</th>
                <th className="pb-4 font-semibold text-slate-600">Village</th>
                <th className="pb-4 font-semibold text-slate-600">Urgency</th>
                <th className="pb-4 font-semibold text-slate-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-[#fafaf9] transition-colors">
                  <td className="py-5 font-bold text-slate-800">{p.name}</td>
                  <td className="py-5 text-slate-600">{p.age}</td>
                  <td className="py-5 text-slate-600">{p.village}</td>
                  <td className="py-5">{getUrgencyBadge(p.urgency)}</td>
                  <td className="py-5 text-slate-500 font-medium text-sm">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
