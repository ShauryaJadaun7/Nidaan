'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname !== '/auth') {
            router.push('/auth');
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-clinical/20 border-t-clinical rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-400 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user && pathname !== '/auth') return null;

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <div className="text-center p-10">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔒</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Access Restricted</h2>
                    <p className="text-sm text-slate-500">You don't have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
