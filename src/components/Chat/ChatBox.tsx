"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { AIMessage } from '../../services/api';
import { processTriage } from '../../services/api';
import { speechToText, textToSpeech } from '../../services/sarvam';
import { Send, Mic, Square, Image as ImageIcon, Loader2, Globe, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatBoxProps {
  messages: AIMessage[];
  setMessages: React.Dispatch<React.SetStateAction<AIMessage[]>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
}

const LANGUAGES = [
  'English',
  'Hindi (हिंदी)',
  'Tamil (தமிழ்)',
  'Marathi (मराठी)',
  'Gujarati (ગુજરાતી)',
  'Bengali (বাংলা)',
  'Telugu (తెలుగు)',
  'Kannada (ಕನ್ನಡ)'
];

export default function ChatBox({ messages, setMessages, isTyping, setIsTyping }: ChatBoxProps) {
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: AIMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Pass the selected language explicitly to the API
      const response = await processTriage(newMessages, selectedLanguage);
      
      const assistantMessage: AIMessage = { 
        role: 'assistant', 
        content: response.message,
        triageData: response 
      };
      setMessages([...newMessages, assistantMessage]);

      // Call TTS in the background
      textToSpeech(response.message, selectedLanguage).then((base64Audio) => {
        if (base64Audio) {
           const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
           audio.play().catch(e => console.error("Audio playback failed", e));
        }
      });
    } catch (error) {
      console.error(error);
      const errorMessage: AIMessage = { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting to the network. Please try again." 
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getTriageColor = (level: string) => {
    switch(level) {
      case 'Emergency': return 'bg-[#ef4444] text-white';
      case 'Visit Doctor': return 'bg-[#f59e0b] text-white';
      case 'Home Care': return 'bg-[#10b981] text-white';
      default: return 'bg-slate-200 text-slate-800';
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        // Native browser recording is WebM format
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop()); // release mic

        setIsTyping(true); // show typing indicator while translating voice
        try {
          let transcript = await speechToText(audioBlob, selectedLanguage);
          
          if (transcript) {
            const cleanTranscript = transcript.toLowerCase().trim();
            // Expanded filter: Whisper-based models consistently hallucinate these specific words when fed pure silence or static mic-pops. 
            const hallucinations = ['yes.', 'yes', 'yes. yes.', 'yeah.', 'yeah', 'thank you.', 'thanks.', 'hmm.', 'hmm'];
            
            if (cleanTranscript !== '' && !hallucinations.includes(cleanTranscript)) {
              setInput(prev => (prev ? prev + " " + transcript : transcript));
            }
          }
        } finally {
          setIsTyping(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied", err);
      alert("Please allow microphone access to use voice input.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[32px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
      
      {/* Header */}
      <div className="flex justify-between items-center p-6 lg:px-8 border-b border-slate-100">
        <h2 className="font-display font-bold text-2xl text-slate-900">AI Health Triage</h2>
        
        {/* Language Selector */}
        <div className="relative">
          <button 
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-2 border border-slate-200 rounded-full px-4 py-2 hover:bg-slate-50 transition-colors text-slate-600 text-[14px] font-medium"
          >
            <Globe className="w-4 h-4 text-[#0f766e]" />
            <span>{selectedLanguage.split(' ')[0]}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3.5 h-3.5 ml-1 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          
          <AnimatePresence>
            {showLanguageDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowLanguageDropdown(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden z-20"
                >
                  <div className="py-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang.split(' ')[0]);
                          setShowLanguageDropdown(false);
                        }}
                        className="w-full text-left px-5 py-2.5 text-sm font-medium hover:bg-slate-50 flex items-center justify-between transition-colors"
                      >
                        <span className={selectedLanguage === lang.split(' ')[0] ? 'text-[#0f766e]' : 'text-slate-700'}>
                          {lang}
                        </span>
                        {selectedLanguage === lang.split(' ')[0] && <Check className="w-4 h-4 text-[#0f766e]" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-white custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-800 -mt-10">
            <div className="w-14 h-14 bg-[#e6f4f1] text-[#0f766e] rounded-full flex items-center justify-center mb-6">
              <Mic className="w-6 h-6" />
            </div>
            <p className="font-display font-bold text-[22px] text-slate-900 mb-3">How can I help you today?</p>
            <p className="text-[15px] max-w-sm text-slate-400 font-medium leading-relaxed">
              Describe your symptoms in your preferred language. I'll help assess the urgency and suggest next steps.
            </p>
          </div>
        ) : (
          <div className="space-y-8 max-w-3xl mx-auto">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col w-full"
                >
                  <span className={`text-[12px] font-medium text-slate-400 mb-2 ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                    {msg.role === 'user' ? 'You' : 'SwasthyaAI'}
                  </span>
                  
                  {msg.role === 'user' ? (
                    <div className="max-w-[85%] rounded-[24px] px-6 py-4 bg-[#f1f5f9] text-slate-800 text-[15px] font-medium ml-auto">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="w-full max-w-[550px] mr-auto rounded-[24px] bg-white border border-slate-200 overflow-hidden shadow-sm">
                      {/* Triage Complex View */}
                      {(msg as any).triageData && (msg as any).triageData.triage ? (
                        <div className="flex flex-col">
                          {/* Header row */}
                          <div className="px-6 pt-6 pb-4 flex justify-between items-start">
                            <span className={`px-5 py-2 rounded-full text-[14px] font-bold tracking-wide ${getTriageColor((msg as any).triageData.triage)}`}>
                              {(msg as any).triageData.triage}
                            </span>
                            <div className="text-right flex flex-col items-end leading-tight">
                              <span className="text-[12px] font-medium text-slate-400 mb-0.5">Confidence</span>
                              <span className="text-[20px] font-bold text-[#0f766e]">{(msg as any).triageData.confidence}%</span>
                            </div>
                          </div>
                          
                          {/* Main Text */}
                          <div className="px-6 pb-5 text-slate-700 text-[15px] leading-relaxed">
                            {msg.content}
                          </div>

                          {/* Key Symptoms */}
                          {((msg as any).triageData.key_symptoms && Array.isArray((msg as any).triageData.key_symptoms) && (msg as any).triageData.key_symptoms.length > 0) && (
                            <div className="px-6 pb-5">
                              <h4 className="text-[14px] font-bold text-slate-500 mb-3">Key Symptoms:</h4>
                              <div className="flex flex-wrap gap-2">
                                {(msg as any).triageData.key_symptoms.map((sym: string, i: number) => (
                                  <span key={i} className="px-4 py-1.5 bg-[#f0fdf4] text-[#0f766e] text-[13px] font-medium rounded-full">
                                    {sym}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Medical Reasoning */}
                          {(msg as any).triageData.reason && (
                            <div className="px-6 pb-4">
                              <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm">
                                <h4 className="text-[13px] font-bold text-slate-500 mb-1.5">Medical Reasoning:</h4>
                                <p className="text-[14px] text-slate-600 leading-relaxed font-medium">{(msg as any).triageData.reason}</p>
                              </div>
                            </div>
                          )}

                          {/* Suggested Care */}
                          {(msg as any).triageData.medicine && (
                            <div className="px-6 pb-6">
                              <div className="border border-[#bbf7d0] rounded-2xl p-4 bg-[#f0fdf4]">
                                <h4 className="text-[13px] font-bold text-[#0f766e] mb-1.5">Suggested Care:</h4>
                                <p className="text-[14px] text-slate-700 leading-relaxed font-medium">{(msg as any).triageData.medicine}</p>
                              </div>
                            </div>
                          )}

                          {/* Feedback Footer */}
                          <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-white">
                            <span className="text-[14px] font-semibold text-slate-500">Was this response helpful?</span>
                            <div className="flex gap-2.5">
                              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-full hover:bg-slate-50 text-slate-600 text-[13px] font-bold transition-all hover:border-slate-300">
                                <ThumbsUp className="w-4 h-4" /> Yes
                              </button>
                              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-full hover:bg-slate-50 text-slate-600 text-[13px] font-bold transition-all hover:border-slate-300">
                                <ThumbsDown className="w-4 h-4" /> No
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="px-6 py-5 text-slate-700 text-[15px] leading-relaxed">
                          {msg.content}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-start max-w-3xl mx-auto w-full"
                >
                  <span className="text-[12px] font-medium text-slate-400 mb-2">SwasthyaAI</span>
                  <div className="bg-white border border-[#e2e8f0] rounded-full px-6 py-4 shadow-sm flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-[#0f766e] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#0f766e] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#0f766e] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-[200px] w-full flex-shrink-0 pointer-events-none" />
          </div>
        )}
      </div>
      
      {/* Input Area Overlay */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-[0_8px_30px_-5px_rgba(0,0,0,0.08)] flex relative overflow-hidden">
          <textarea 
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={`Describe your symptoms in ${selectedLanguage.split(' ')[0]}...`}
            className="w-full bg-transparent px-6 py-5 focus:outline-none text-slate-700 resize-none text-[15px] custom-scrollbar"
            disabled={isTyping}
          />
          
          <div className="flex flex-col gap-2 p-3 border-l border-slate-50 bg-[#fafaf9]">
            <button 
              type="button" 
              onClick={toggleRecording}
              className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${isRecording ? 'text-white bg-red-500 hover:bg-red-600 animate-pulse' : 'text-slate-400 hover:text-[#0f766e] hover:bg-[#e6f4f1]'}`} 
              title={isRecording ? "Stop Recording" : "Voice Input"}
            >
              {isRecording ? <Square className="w-5 h-5" fill="currentColor" /> : <Mic className="w-5 h-5" />}
            </button>
            <button type="button" className="p-2.5 text-slate-400 hover:text-[#0f766e] hover:bg-[#e6f4f1] rounded-full transition-colors flex-shrink-0" title="Upload Image / Lab Report">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button 
              type="button" 
              onClick={(e) => handleSubmit(e as any)}
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-[#86cec6] text-white rounded-full hover:bg-[#0f766e] disabled:opacity-50 disabled:bg-slate-200 transition-colors shadow-sm"
            >
              {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
