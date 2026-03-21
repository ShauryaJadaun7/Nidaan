import ChatPanel from '@/components/hub/ChatPanel';
import ScannerPanel from '@/components/hub/ScannerPanel';
import ActionPanel from '@/components/hub/ActionPanel';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import PageHero from '@/components/layout/PageHero';

export default function DiagnosticHub() {
    return (
        <ProtectedRoute allowedRoles={['general']}>
            <div className="flex flex-col p-6 lg:p-10 max-w-7xl mx-auto w-full gap-12">
                <PageHero 
                    title="Medical Directory"
                    subtitle="Access real-time clinical diagnostics, report analysis, and emergency dispatch from a single, secure portal."
                    categoryPills={['All Services', 'Physical Health', 'Mental Wellness', 'Diagnostic Labs']}
                />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 pb-20">
                    <div className="lg:col-span-3">
                        <ChatPanel />
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-10">
                        <ScannerPanel />
                        <ActionPanel />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}