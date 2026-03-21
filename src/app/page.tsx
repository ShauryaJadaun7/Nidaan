"use client";

import { useState } from 'react';
import ChatBox from '../components/Chat/ChatBox';
import ContextPane from '../components/Dashboard/ContextPane';
import AshaDashboard from '../components/Dashboard/AshaDashboard';
import { Activity, X, ChevronDown } from 'lucide-react';
import type { AIMessage } from '../services/api';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const [currentView, setCurrentView] = useState<'triage' | 'asha'>('triage');
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 lg:px-10 py-4 flex items-center justify-between sticky top-0 z-10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0f766e] rounded-full flex items-center justify-center text-white shadow-sm">
            <Activity className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-display font-bold tracking-tight text-slate-900 leading-none">SwasthyaAI</h1>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5 tracking-wide">स्वास्थ्य सहायक</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setCurrentView(currentView === 'triage' ? 'asha' : 'triage')}
            className="text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            {currentView === 'triage' ? 'ASHA Dashboard' : 'Triage'}
          </button>
          <button className="text-sm font-medium bg-[#ef4444] text-white hover:bg-red-600 transition-colors px-5 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Emergency
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        {currentView === 'triage' ? (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-[calc(100vh-120px)]">
            {/* Left Sidebar: Context (approx 320px wide) */}
            <aside className="w-full lg:w-[340px] flex-shrink-0 h-full overflow-y-auto pb-safe custom-scrollbar">
              <ContextPane onAddFamily={() => setShowAddFamilyModal(true)} />
            </aside>
            
            {/* Right Pane: AI Chat */}
            <section className="flex-1 h-full min-w-0">
              <ChatBox 
                messages={messages} 
                setMessages={setMessages} 
                isTyping={isTyping}
                setIsTyping={setIsTyping}
              />
            </section>
          </div>
        ) : (
          <AshaDashboard />
        )}
      </main>

      {/* Add Family Member Modal */}
      <AnimatePresence>
        {showAddFamilyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddFamilyModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#e4e4e7] rounded-3xl shadow-xl w-full max-w-md relative overflow-hidden"
              style={{ backgroundColor: '#e5e7eb' }} // Very specific light gray background shown in the modal screenshot
            >
              <button 
                onClick={() => setShowAddFamilyModal(false)}
                className="absolute top-5 right-5 text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-8">
                <h2 className="font-display font-bold text-2xl text-slate-900 mb-8">Add Family Member</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5">Name</label>
                    <input type="text" defaultValue="Ramesh Kumar" className="w-full bg-transparent border border-[#0f766e] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#0f766e] text-slate-700" />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-slate-700 mb-1.5">Age</label>
                      <input type="number" defaultValue="35" className="w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-400 text-slate-700" />
                    </div>
                    <div className="flex-1 relative">
                      <label className="block text-sm text-slate-700 mb-1.5">Gender</label>
                      <select className="w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-slate-400 text-slate-700">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-4 top-10 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5">Relationship</label>
                    <input type="text" placeholder="Father, Mother, Child" className="w-full bg-transparent border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-400 text-slate-500 placeholder-slate-400" />
                  </div>
                  
                  <button 
                    onClick={() => setShowAddFamilyModal(false)}
                    className="w-full bg-[#0f766e] hover:bg-[#0d6b63] text-white font-medium py-3.5 rounded-xl transition-colors mt-4"
                  >
                    Add Member
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
