import { HelpCircle } from 'lucide-react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

export default function HelpPage() {
    return (
        <ProtectedRoute allowedRoles={['general', 'asha', 'admin']}>
            <div className="flex flex-col h-full p-6 lg:p-10 max-w-7xl mx-auto w-full gap-8">
                <header className="flex justify-between items-end mb-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-800 tracking-tight">Help & Documentation</h1>
                        <p className="text-slate-500 font-medium mt-1">Nirdaan Knowledge Base and Support Center.</p>
                    </div>
                </header>
                <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-clinical/30 mb-6">
                        <HelpCircle size={48} />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-slate-800 mb-3">Support Gateway</h2>
                    <p className="text-slate-500 max-w-md">Review the standard operating procedures for diagnostics triage, AI assistant handling, and Logistics re-ordering.</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
