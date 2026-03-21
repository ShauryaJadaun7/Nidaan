"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Phone, Share2, Lightbulb, Pill } from "lucide-react";

interface TriageProps {
    urgency: 'emergency' | 'moderate' | 'mild';
    confidence: number;
    reason: string;
    symptoms: string[];
    medicine?: string | null;
}

export default function TriageCard({ urgency, confidence, reason, symptoms, medicine }: TriageProps) {
    const [animatedConfidence, setAnimatedConfidence] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 1200;
        const increment = confidence / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= confidence) {
                setAnimatedConfidence(confidence);
                clearInterval(timer);
            } else {
                setAnimatedConfidence(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [confidence]);

    const config = {
        emergency: {
            border: 'border-l-red-600',
            bg: 'bg-red-50',
            text: 'text-red-700',
            glow: 'shadow-[0_0_20px_rgba(220,38,38,0.2)]',
            icon: <AlertTriangle size={28} className="text-red-600" />,
            label: 'EMERGENCY',
            sublabel: 'Go to hospital immediately'
        },
        moderate: {
            border: 'border-l-amber-500',
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
            icon: <AlertTriangle size={28} className="text-amber-600" />,
            label: 'MODERATE',
            sublabel: 'Consult within 24 hours'
        },
        mild: {
            border: 'border-l-green-500',
            bg: 'bg-green-50',
            text: 'text-green-700',
            glow: 'shadow-[0_0_20px_rgba(22,163,74,0.1)]',
            icon: <CheckCircle2 size={28} className="text-green-600" />,
            label: 'MILD / SELF CARE',
            sublabel: 'Rest at home'
        }
    }[urgency];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`w-full max-w-sm sm:max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-100 border-l-[8px] ${config.border} ${config.glow} my-4`}
        >
            <div className={`p-5 ${config.bg} flex justify-between items-start`}>
                <div className="flex gap-4 items-center">
                    <div className="bg-white p-2.5 rounded-2xl shadow-sm">{config.icon}</div>
                    <div>
                        <h4 className={`font-sora font-extrabold tracking-wide text-lg ${config.text}`}>
                            {config.label}
                        </h4>
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">{config.sublabel}</p>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        {/* Simple SVG Circular Progress */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="20" fill="none" className="stroke-slate-200" strokeWidth="4" />
                            <circle
                                cx="24" cy="24" r="20" fill="none"
                                className={`transition-all duration-75 ${urgency === 'emergency' ? 'stroke-red-500' : 'stroke-teal-500'}`}
                                strokeWidth="4"
                                strokeDasharray="125.6"
                                strokeDashoffset={125.6 - (125.6 * animatedConfidence) / 100}
                            />
                        </svg>
                        <span className="text-sm font-bold text-slate-800 z-10">{animatedConfidence}%</span>
                    </div>
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mt-1">AI Confidence</p>
                </div>
            </div>

            <div className="p-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                    {symptoms.map((sym, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-full font-semibold border border-slate-200">
                            {sym}
                        </span>
                    ))}
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex gap-3 shadow-inner">
                    <Lightbulb className="text-amber-500 shrink-0" size={20} />
                    <p className="text-sm text-slate-600 italic font-medium leading-relaxed">
                        {reason}
                    </p>
                </div>

                {medicine && (
                    <div className="bg-blue-50/50 border border-blue-100 p-3.5 rounded-xl flex gap-3">
                        <Pill className="text-blue-500 shrink-0" size={20} />
                        <div>
                            <p className="text-sm font-bold text-blue-900 mb-1">{medicine}</p>
                            <p className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">⚠️ Always consult a doctor first.</p>
                        </div>
                    </div>
                )}

                <div className="pt-2 space-y-3">
                    {urgency === 'emergency' && (
                        <motion.button
                            whileHover={{ y: -2 }}
                            className="w-full bg-red-600 text-white font-sora font-bold py-4 rounded-xl shadow-[0_4px_14px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
                        >
                            <Phone size={20} /> CALL 108 IMMEDIATELY
                        </motion.button>
                    )}

                    <motion.button
                        whileHover={{ y: -2 }}
                        className="w-full bg-white border-2 border-teal-600 text-teal-700 font-sora font-bold py-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-teal-50"
                    >
                        <Share2 size={18} /> Generate Doctor QR Code
                    </motion.button>
                </div>

                <p className="text-center text-[10px] font-mono text-slate-400">Case ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>
        </motion.div>
    );
}