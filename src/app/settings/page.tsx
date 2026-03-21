import { Settings } from 'lucide-react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

export default function SettingsPage() {
    return (
        <ProtectedRoute allowedRoles={['general', 'asha', 'admin']}>
            <div className="flex flex-col h-full p-6 lg:p-10 max-w-7xl mx-auto w-full gap-8">
                <header className="flex justify-between items-end mb-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-800 tracking-tight">Platform Settings</h1>
                        <p className="text-slate-500 font-medium mt-1">Global preferences and account management.</p>
                    </div>
                </header>
                <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-clinical/30 mb-6">
                        <Settings size={48} />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-slate-800 mb-3">Settings Configuration</h2>
                    <p className="text-slate-500 max-w-md">Edit your profile, clinic association, and API endpoints. Advanced configurations are managed via environment variables.</p>
                </div>
            </div>
        </ProtectedRoute>
    );
}
