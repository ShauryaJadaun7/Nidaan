'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Paperclip, Mic, Square, Volume2, VolumeX, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StructuredResponse {
    triage: 'EMERGENCY' | 'VISIT_CLINIC' | 'STAY_HOME';
    confidence: number;
    summary: string;
    keySymptoms: string[];
    medicalReasoning: string;
    suggestedCare: string;
    nextStep: string;
}

interface Message {
    role: string;
    content: string;
    time: string;
    image?: string | null;
    structured?: StructuredResponse | null;
}

const triageConfig = {
    EMERGENCY: { label: 'Emergency', color: 'bg-red-500', textColor: 'text-red-600', bgLight: 'bg-red-50', border: 'border-red-100' },
    VISIT_CLINIC: { label: 'Visit Doctor', color: 'bg-amber-500', textColor: 'text-amber-600', bgLight: 'bg-amber-50', border: 'border-amber-100' },
    STAY_HOME: { label: 'Stay Home', color: 'bg-emerald-500', textColor: 'text-emerald-600', bgLight: 'bg-emerald-50', border: 'border-emerald-100' },
};

const LANGUAGES = [
    { name: 'English', code: 'en-IN', native: 'English' },
    { name: 'Hindi', code: 'hi-IN', native: 'हिन्दी' },
    { name: 'Marathi', code: 'mr-IN', native: 'मराठी' },
    { name: 'Bengali', code: 'bn-IN', native: 'বাংলা' },
    { name: 'Telugu', code: 'te-IN', native: 'తెలుగు' },
];


function parseStructuredResponse(content: string): StructuredResponse | null {
    try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.triage && parsed.summary) {
                return parsed as StructuredResponse;
            }
        }
    } catch (e) {
        // Not a JSON response
    }
    return null;
}

function ResponseCard({ data }: { data: StructuredResponse }) {
    const config = triageConfig[data.triage] || triageConfig.STAY_HOME;
    
    return (
        <div className="w-full max-w-[95%] bg-white rounded-2xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Triage Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <span className={`${config.color} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm`}>
                    {config.label}
                </span>
                <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Confidence</div>
                    <div className={`text-lg font-bold ${config.textColor}`}>{data.confidence}%</div>
                </div>
            </div>

            {/* Summary */}
            <div className="px-5 pb-4">
                <p className="text-slate-700 text-[15px] leading-relaxed">{data.summary}</p>
            </div>

            {/* Key Symptoms */}
            {data.keySymptoms && data.keySymptoms.length > 0 && (
                <div className="px-5 pb-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Symptoms:</div>
                    <div className="flex flex-wrap gap-2">
                        {data.keySymptoms.map((s, i) => (
                            <span key={i} className={`text-xs font-semibold px-3 py-1 rounded-full ${config.bgLight} ${config.textColor} ${config.border} border`}>
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Medical Reasoning */}
            {data.medicalReasoning && (
                <div className="mx-5 mb-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Medical Reasoning:</div>
                    <p className="text-slate-600 text-sm leading-relaxed">{data.medicalReasoning}</p>
                </div>
            )}

            {/* Suggested Care */}
            {data.suggestedCare && (
                <div className="px-5 pb-4">
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1.5">Suggested Care:</div>
                    <p className="text-slate-600 text-sm leading-relaxed">{data.suggestedCare}</p>
                </div>
            )}

            {/* Feedback */}
            <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Was this response helpful?</span>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition-colors border border-slate-200 hover:border-emerald-200">
                        <ThumbsUp size={12} /> Yes
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors border border-slate-200 hover:border-red-200">
                        <ThumbsDown size={12} /> No
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ChatPanel() {
    const [mode, setMode] = useState<'physical' | 'mental'>('physical');
    const [language, setLanguage] = useState('hi-IN'); // Default to Hindi as per screenshot
    const [messages, setMessages] = useState<Message[]>([{ 
        role: 'assistant', 
        content: 'नमस्ते! मैं आपकी रिपोर्ट विश्लेषण, दवा योजना और लक्षणों की जांच में मदद कर सकता हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?', 
        time: '10:42 AM',
        structured: null
    }]);

    // Handle mode toggle
    const toggleMode = (newMode: 'physical' | 'mental') => {
        if (newMode === mode) return;
        setMode(newMode);
        setMessages([{
            role: 'assistant',
            content: newMode === 'physical' 
                ? (language === 'hi-IN' ? 'नमस्ते! मैं आपकी रिपोर्ट विश्लेषण, दवा योजना और लक्षणों की जांच में मदद कर सकता हूँ।' : 'Namaste! I can help you analyze patient reports or assess symptoms.')
                : (language === 'hi-IN' ? 'नमस्ते। मैं आपकी मानसिक स्थिति को समझने में मदद करने के लिए यहाँ हूँ।' : 'Namaste. I am here to help you understand your mental well-being.'),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            structured: null
        }]);
    };

    const handleLanguageChange = (code: string) => {
        setLanguage(code);
        // Reset or just update greeting? Resetting for a clean start in new lang
        const langName = LANGUAGES.find(l => l.code === code)?.name;
        setMessages([{
            role: 'assistant',
            content: code === 'hi-IN' ? 'नमस्ते! मैं आपकी मदद कैसे कर सकता हूँ?' : `Namaste! I am now ready to assist you in ${langName}. How can I help?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            structured: null
        }]);
    };


    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(true);
    const [attachedImage, setAttachedImage] = useState<string | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(scrollToBottom, [messages]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setAttachedImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const playTTS = async (text: string) => {
        if (!isVoiceMode) return;
        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, languageCode: language })
            });
            const data = await res.json();
            if (data.audioBase64) {
                const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
                audioPlayerRef.current = audio;
                setIsPlaying(true);
                audio.play();
                audio.onended = () => setIsPlaying(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSend = async (overrideText?: string) => {
        const textToSend = overrideText || input;
        const currentImage = attachedImage;
        
        if (!textToSend.trim() && !currentImage) return;
        
        const finalText = textToSend.trim() || (currentImage ? 'Analyze this image' : '');
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMsg: Message = { role: 'user', content: finalText, time: timestamp, image: currentImage };
        setMessages(prev => [...prev, newMsg]);
        if (!overrideText) setInput('');
        setAttachedImage(null);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: [...messages, newMsg].map(m => ({ role: m.role, content: m.content })),
                    image: currentImage,
                    mode: mode,
                    language: language
                })
            });
            const data = await res.json();
            
            const rawReply = data.reply || "Sorry, I couldn't process that.";
            const structured = parseStructuredResponse(rawReply);
            
            const displayContent = structured ? structured.summary : rawReply.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^#{1,4}\s/gm, '');
            
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: displayContent, 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                structured
            }]);

            playTTS(structured ? structured.summary : displayContent);

        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'assistant', content: "Network error occurred.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } finally {
            setIsLoading(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const formData = new FormData();
                formData.append('file', audioBlob, 'audio.webm');
                formData.append('language_code', language);
                
                setIsLoading(true);
                try {
                    const sttRes = await fetch('/api/stt', { method: 'POST', body: formData });
                    const sttData = await sttRes.json();
                    if (sttData.transcript) {
                        handleSend(sttData.transcript);
                    } else {
                         setMessages(prev => [...prev, { role: 'assistant', content: "I couldn't hear you clearly.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                    }
                } catch (e) {
                    console.error("STT Failed", e);
                } finally {
                    setIsLoading(false);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            if (audioPlayerRef.current) {
                audioPlayerRef.current.pause();
                setIsPlaying(false);
            }
        } catch (err) {
            console.error("Mic access denied", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
            setIsRecording(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#f0f5ff] rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col h-full overflow-hidden"
        >
            <div className="p-4 lg:p-5 bg-white/40 border-b border-white/60 flex flex-wrap items-center justify-between gap-4 z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-clinical text-white flex items-center justify-center shadow-lg shadow-clinical/20">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">Nirdaan AI Assistant</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[9px] font-extrabold text-emerald-600 tracking-wider">ONLINE</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Language Selector */}
                    <select 
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-white/60 border border-white rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider outline-none shadow-sm cursor-pointer hover:bg-white transition-all"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code} className="font-bold py-2">
                                {lang.native}
                            </option>
                        ))}
                    </select>

                    {/* Mode Toggle */}
                    <div className="bg-white/80 p-1 rounded-full border border-white flex shadow-sm mr-2">
                        <button 
                            onClick={() => toggleMode('physical')}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'physical' ? 'bg-clinical text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Physical
                        </button>
                        <button 
                            onClick={() => toggleMode('mental')}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'mental' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Mental
                        </button>
                    </div>

                    <button 
                        onClick={() => setIsVoiceMode(!isVoiceMode)}
                        className={`p-2 rounded-full border flex items-center gap-2 text-xs font-bold transition-colors ${isVoiceMode ? 'bg-clinical-50 border-clinical-100 text-clinical' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                    >
                        {isVoiceMode ? <Volume2 size={14}/> : <VolumeX size={14} />}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 scrollbar-hide">
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            {m.role === 'user' ? (
                                // User message bubble
                                <div className="p-4 max-w-[80%] text-[14px] rounded-[1.5rem] leading-relaxed shadow-sm bg-clinical text-white rounded-tr-sm">
                                    {m.image && (
                                        <div className="mb-2 rounded-xl overflow-hidden border-2 border-white/20 shadow-sm">
                                            <img src={m.image} alt="Uploaded" className="w-full max-w-[180px] h-auto rounded-xl" />
                                        </div>
                                    )}
                                    {m.content}
                                </div>
                            ) : m.structured ? (
                                // Structured response card
                                <ResponseCard data={m.structured} />
                            ) : (
                                // Plain text assistant message
                                <div className="p-4 max-w-[90%] text-[14px] rounded-[1.5rem] leading-relaxed shadow-sm bg-white text-slate-700 rounded-tl-sm border border-slate-50 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
                                    {m.content}
                                </div>
                            )}
                            <div className="flex items-center gap-2 mt-1.5 px-2">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{m.time}</span>
                                {m.role === 'assistant' && (
                                    <button onClick={() => playTTS(m.content)} className="text-slate-400 hover:text-clinical hover:bg-clinical/10 rounded-full p-1 transition-colors" title="Listen">
                                        <Volume2 size={11} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-slate-300 text-sm p-4 bg-white max-w-[80%] rounded-[1.5rem] rounded-tl-sm w-max border border-slate-50 shadow-sm">
                        <span className="animate-bounce">●</span>
                        <span className="animate-bounce delay-100">●</span>
                        <span className="animate-bounce delay-200">●</span>
                    </motion.div>
                )}
                {isPlaying && !isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-clinical text-[10px] font-bold uppercase tracking-widest pl-2">
                        <Volume2 size={12} className="animate-pulse" /> Speaking...
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 lg:p-4 bg-gradient-to-t from-[#f0f5ff] to-transparent shrink-0">
                <div className="relative">
                    <AnimatePresence>
                        {attachedImage && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute bottom-full left-4 mb-3 border-[3px] border-white shadow-md rounded-2xl w-16 h-16 bg-slate-100 bg-cover bg-center z-20" style={{backgroundImage: `url(${attachedImage})`}}>
                                <button onClick={() => setAttachedImage(null)} className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 shadow-sm hover:bg-rose-500 transition-colors"><X size={10} strokeWidth={3} /></button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="bg-white rounded-[2rem] p-2 flex items-center gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-white pr-2.5 relative z-10">
                        <button onClick={() => fileInputRef.current?.click()} className="pl-3 pr-1 text-slate-400 hover:text-clinical shrink-0 transition-colors"><Paperclip size={18} strokeWidth={2.5} /></button>
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                        
                        <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isRecording ? (language === 'hi-IN' ? 'सुन रहा हूँ...' : "Listening...") : mode === 'mental' ? (language === 'hi-IN' ? "क्या महसूस कर रहे हैं..." :"Share how you feel...") : (language === 'hi-IN' ? "लक्षण लिखें या प्रश्न पूछें..." : "Describe symptoms...")}
                        disabled={isRecording}
                        className="flex-1 bg-transparent border-none outline-none text-[14px] text-slate-700 font-semibold placeholder:text-slate-400 placeholder:font-medium disabled:opacity-50"
                    />

                    {isRecording ? (
                        <button onClick={stopRecording} className="w-10 h-10 rounded-full bg-rose-500 text-white flex flex-col items-center justify-center hover:bg-rose-600 transition-all shadow-[0_4px_16px_rgba(225,29,72,0.3)] shrink-0 animate-pulse">
                            <Square size={14} fill="currentColor" />
                        </button>
                    ) : (
                        (input.trim() || attachedImage) ? (
                            <button onClick={() => handleSend()} className="w-10 h-10 rounded-full bg-clinical text-white flex flex-col items-center justify-center hover:bg-clinical-dark transition-all transform hover:scale-105 shadow-[0_4px_16px_rgba(15,118,110,0.3)] shrink-0">
                                <Send size={18} className="mr-0.5 mt-0.5" strokeWidth={2.5} />
                            </button>
                        ) : (
                            <button onClick={startRecording} className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex flex-col items-center justify-center hover:bg-slate-100 transition-all hover:text-clinical shrink-0 border border-slate-100">
                                <Mic size={18} strokeWidth={2.5} />
                            </button>
                        )
                    )}
                </div>
                </div>
            </div>
        </motion.div>
    );
}
