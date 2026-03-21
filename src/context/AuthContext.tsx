'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export type UserRole = 'general' | 'asha' | 'admin';

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    location?: string;
    ashaId?: string;
    district?: string;
    subCenter?: string;
}

interface AuthContextType {
    user: UserProfile | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    signup: (email: string, password: string, profile: Omit<UserProfile, 'uid'>) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setFirebaseUser(fbUser);
            if (fbUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
                    if (userDoc.exists()) {
                        setUser(userDoc.data() as UserProfile);
                    }
                } catch (error) {
                    console.error("AuthContext/onAuthStateChanged Error:", error);
                    // Handle offline or permission errors gracefully
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signup = async (email: string, password: string, profile: Omit<UserProfile, 'uid'>) => {
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            const userProfile: UserProfile = { ...profile, uid: cred.user.uid };
            await setDoc(doc(db, 'users', cred.user.uid), userProfile);
            setUser(userProfile);
        } catch (error: any) {
            console.error("Signup Error:", error);
            throw new Error(error.message || "Failed to create account. Please check your connection.");
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
            if (userDoc.exists()) {
                setUser(userDoc.data() as UserProfile);
            } else {
                // If auth exists but no profiling doc, log them out
                await signOut(auth);
                throw new Error("User profile not found. Contact administrator.");
            }
        } catch (error: any) {
            console.error("Login Error:", error);
            if (error.code === 'unavailable') {
                throw new Error("Server currently offline. Please try again later.");
            }
            throw new Error(error.message || "Login failed. Please verify your credentials or connection.");
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, firebaseUser, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
