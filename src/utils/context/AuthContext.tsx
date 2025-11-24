"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { UserAccount, AuthContextType } from '@/types/Auth';

import { auth, db } from '@/utils/firebase/firebase';

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';

import { toast } from 'react-hot-toast';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserAccount | null>(null);
    const [loading, setLoading] = useState(true);
    const [showInactiveModal, setShowInactiveModal] = useState(false);
    const router = useRouter();

    const getDashboardUrl = () => {
        return '/dashboard';
    };

    const handleRedirect = () => {
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
            localStorage.removeItem('redirectAfterLogin');
            router.push(redirectUrl);
            return;
        }
        router.push('/dashboard');
    };

    const login = async (email: string, password: string): Promise<UserAccount> => {
        try {
            if (!email || !password) {
                throw new Error('Email dan password harus diisi');
            }

            const emailString = String(email).trim();
            const userCredential = await signInWithEmailAndPassword(auth, emailString, password);

            const userDoc = await getDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, userCredential.user.uid));
            const userData = userDoc.data() as UserAccount;

            if (!userData) {
                throw new Error('User account not found');
            }

            // Get Firebase auth token and create session
            const idToken = await userCredential.user.getIdToken();
            await fetch('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            setUser(userData);
            const welcomeMessage = getWelcomeMessage(userData);
            toast.success(welcomeMessage);
            handleRedirect();

            return userData;
        } catch (error) {
            if (error instanceof Error) {
                // Check if the error is due to disabled account
                if (error.message.includes('auth/user-disabled')) {
                    setShowInactiveModal(true);
                } else {
                    toast.error('Login gagal: ' + error.message);
                }
            } else {
                toast.error('Terjadi kesalahan saat login');
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Sign out from Firebase
            await signOut(auth);
            setUser(null);

            // Clear the session cookie through an API call
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include', // Important: This ensures cookies are included
            });

            // Clear any stored redirect URLs
            localStorage.removeItem('redirectAfterLogin');

            // Force reload the page to clear any remaining state
            window.location.href = '/signin';

            toast.success('Anda berhasil logout');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Terjadi kesalahan saat logout');
        }
    };

    const deleteAccount = async () => {
        try {
            if (!user) {
                throw new Error('No user logged in');
            }

            const idToken = await auth.currentUser?.getIdToken();
            if (!idToken) {
                throw new Error('Failed to get authentication token');
            }

            const response = await fetch('/api/user/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete account');
            }

            setUser(null);
            toast.success('Akun berhasil dihapus');
            router.push('/signin');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus akun');
            throw error;
        }
    };

    const hasRole = () => {
        // Karena hanya ada role user, fungsi ini selalu true jika user login
        return !!user;
    };

    const getWelcomeMessage = (userData: UserAccount): string => {
        const { displayName } = userData;
        return `Selamat datang, ${displayName}!`;
    };

    const forgotPassword = async (email: string): Promise<void> => {
        try {
            // Send OTP for password reset
            const otpResponse = await fetch('/api/auth/send-reset-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!otpResponse.ok) {
                const data = await otpResponse.json();
                throw new Error(data.error || 'Failed to send reset OTP');
            }

            toast.success('Password reset OTP sent! Please check your email.');
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('auth/user-not-found')) {
                    toast.error('No account found with this email address.');
                } else {
                    toast.error('Failed to send reset OTP: ' + error.message);
                }
            } else {
                toast.error('Failed to send reset OTP.');
            }
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser && process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS) {
                    const userDoc = await getDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, firebaseUser.uid));
                    const userData = userDoc.data() as UserAccount;
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        login,
        logout,
        deleteAccount,
        hasRole,
        getDashboardUrl,
        forgotPassword,
        showInactiveModal,
        setShowInactiveModal,
    };
    return (
        <AuthContext.Provider value={value as AuthContextType}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};