"use client";
import { useState } from 'react';
import { Users, AlertTriangle, MapPin, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContextPaneProps {
  onAddFamily: () => void;
}

export default function ContextPane({ onAddFamily }: ContextPaneProps) {
  const [expandedAlert, setExpandedAlert] = useState<string | null>('Cholera');

  return (
    <div className="flex flex-col gap-6 py-1 pr-2">
      
      {/* Family Profile Card */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0f766e]" /> 
            Family Profile
          </h2>
          <button 
            onClick={onAddFamily}
            className="text-[13px] bg-[#0f766e] text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 font-medium hover:bg-[#0d6b63] transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={3} /> Add
          </button>
        </div>
        
        {/* State 1: Empty state (from Image 1) - Uncomment if needed */}
        {/* <div className="text-center py-8">
          <p className="text-slate-400 text-sm">No family members added yet</p>
        </div> */}

        {/* State 2: Active members (from Image 2) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-colors group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-medium text-lg bg-[#0f766e] text-white">
                W
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-[15px]">wefw</p>
                <p className="text-[13px] text-slate-500">24 yrs • eee</p>
              </div>
            </div>
            <button className="p-2 text-rose-300 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Seasonal Alerts Card */}
      <div className="bg-white rounded-3xl pt-6 pb-4 px-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] border border-slate-100">
        <h2 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-[#f59e0b]" /> 
          Seasonal Alerts
        </h2>
        
        <div className="space-y-3">
          {/* High Alert: Dengue */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-slate-300 bg-white">
            <button 
              onClick={() => setExpandedAlert(expandedAlert === 'Dengue' ? null : 'Dengue')}
              className="w-full px-5 py-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="bg-[#ef4444] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">High</span>
                <span className="font-bold text-slate-900 text-[15px]">Dengue</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#0f766e] transition-transform ${expandedAlert === 'Dengue' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedAlert === 'Dengue' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 text-[14px] text-slate-600 leading-relaxed overflow-hidden"
                >
                  Increase in dengue cases during monsoon. Stay vigilant.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Medium Alert: Cholera */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-slate-300 bg-white">
            <button 
              onClick={() => setExpandedAlert(expandedAlert === 'Cholera' ? null : 'Cholera')}
              className="w-full px-5 py-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="bg-[#f59e0b] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Medium</span>
                <span className="font-bold text-slate-900 text-[15px]">Cholera</span>
              </div>
              <ChevronUp className={`w-5 h-5 text-[#0f766e] transition-transform ${expandedAlert !== 'Cholera' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {expandedAlert === 'Cholera' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 overflow-hidden"
                >
                  <p className="text-[14px] text-slate-600 leading-relaxed mb-4">Reports of waterborne diseases in surrounding areas.</p>
                  
                  <h4 className="font-bold text-slate-700 text-[13px] mb-2">Prevention Tips:</h4>
                  <ul className="space-y-2 text-[14px] text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#0f766e] mt-1">•</span> Drink boiled water only
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0f766e] mt-1">•</span> Wash hands before eating
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0f766e] mt-1">•</span> Maintain hygiene
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Nearby Facilities Card */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] border border-slate-100">
        <h2 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-[#0f766e]" /> 
          Nearby Facilities
        </h2>
        
        <div className="space-y-6">
          {/* PHC */}
          <div className="border border-slate-100 rounded-2xl p-4 bg-white hover:border-slate-200 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                <span className="bg-[#0f766e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">PHC</span>
                <span className="border border-rose-200 text-rose-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Ambulance</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#0f766e] text-lg leading-none">2.3</p>
                <p className="text-[10px] text-slate-400 font-medium">km</p>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 text-[15px] mb-1">Primary Health Centre Nashik</h3>
            <p className="text-[12px] text-slate-500 flex items-center gap-1.5 mb-1">
              <MapPin className="w-3 h-3" /> MG Road, Nashik
            </p>
            <p className="text-[12px] text-slate-400 flex items-center gap-1.5 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.25-3.95-6.847-6.847l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              +91-253-2345678
            </p>
            <button className="w-full py-2.5 bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#0f766e] text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-[#bbf7d0]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Get Directions
            </button>
          </div>

          {/* Hospital */}
          <div className="border border-slate-100 rounded-2xl p-4 bg-white hover:border-slate-200 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                <span className="bg-[#0f766e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Hospital</span>
                <span className="border border-rose-200 text-rose-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Ambulance</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#0f766e] text-lg leading-none">5.7</p>
                <p className="text-[10px] text-slate-400 font-medium">km</p>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 text-[15px] mb-1">Government Hospital Madurai</h3>
            <p className="text-[12px] text-slate-500 flex items-center gap-1.5 mb-1">
              <MapPin className="w-3 h-3" /> Anna Nagar, Madurai
            </p>
            <p className="text-[12px] text-slate-400 flex items-center gap-1.5 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.25-3.95-6.847-6.847l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              +91-452-2531234
            </p>
            <button className="w-full py-2.5 bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#0f766e] text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-[#bbf7d0]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Get Directions
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
