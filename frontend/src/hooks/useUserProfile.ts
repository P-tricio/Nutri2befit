import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import type { Targets } from '../data/categoryDetails';

export interface UserProfile {
    email: string;
    displayName: string;
    photoURL: string;
    createdAt: number;
    settings: {
        theme: 'light' | 'dark' | 'system';
        targets: Targets;
        // extended settings can go here
    };
    onboardingCompleted?: boolean;
}

export const DEFAULT_TARGETS: Targets = {
    protein: 4,
    carbs: 4,
    fats: 2,
    veggies: 2,
    fruit: 0
};

export function useUserProfile() {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const userRef = doc(db, 'users', currentUser.uid);

        // Subscribe to real-time updates
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                setProfile(docSnap.data() as UserProfile);
            } else {
                // Document doesn't exist yet, we can create it or wait for manual creation
                // For now, let's auto-create if missing to ensure smooth onboarding
                initializeProfile(currentUser);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching user profile:", error);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    const initializeProfile = async (user: any) => {
        try {
            const userRef = doc(db, 'users', user.uid);
            const newProfile: UserProfile = {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: Date.now(),
                settings: {
                    theme: 'system',
                    targets: DEFAULT_TARGETS
                },
                onboardingCompleted: false
            };
            await setDoc(userRef, newProfile);
        } catch (error) {
            console.error("Error initializing profile:", error);
        }
    };

    const updateTargets = async (newTargets: Targets) => {
        if (!currentUser) return;
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
            'settings.targets': newTargets
        });
    };

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!currentUser) return;
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, data);
    };

    return { profile, loading, updateTargets, updateProfile };
}
