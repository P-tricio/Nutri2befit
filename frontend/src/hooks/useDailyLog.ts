import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import type { Meal, DailyLog } from '../pages/History';

export function useDailyLog(date: string) {
    const { currentUser } = useAuth();
    const [log, setLog] = useState<DailyLog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser || !date) {
            setLog(null);
            setLoading(false);
            return;
        }

        const logRef = doc(db, 'users', currentUser.uid, 'daily_logs', date);

        const unsubscribe = onSnapshot(logRef, (docSnap) => {
            if (docSnap.exists()) {
                setLog(docSnap.data() as DailyLog);
            } else {
                setLog(null); // No log for this day yet
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching daily log:", error);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser, date]);

    const addMeal = async (meal: Meal, goals?: Record<string, number>) => {
        if (!currentUser) return;
        const logRef = doc(db, 'users', currentUser.uid, 'daily_logs', date);

        const updateData: any = {
            date: date,
            meals: arrayUnion(meal)
        };

        if (goals) {
            updateData.goals = goals;
        }

        try {
            await setDoc(logRef, updateData, { merge: true });
        } catch (e) {
            console.error("Error adding meal:", e);
            throw e;
        }
    };

    const deleteMeal = async (meal: Meal) => {
        if (!currentUser) return;
        const logRef = doc(db, 'users', currentUser.uid, 'daily_logs', date);
        await updateDoc(logRef, {
            meals: arrayRemove(meal)
        });
    };

    // For updating a meal, we have to remove old and add new (atomic transaction better, but simple rename works for prototype)
    // Or read, modify, write.
    const updateMeal = async (updatedMeal: Meal) => {
        if (!log || !currentUser) return;

        const newMeals = log.meals.map(m => m.id === updatedMeal.id ? updatedMeal : m);
        const logRef = doc(db, 'users', currentUser.uid, 'daily_logs', date);

        await updateDoc(logRef, {
            meals: newMeals
        });
    };

    const updateGoals = async (newGoals: Record<string, number>) => {
        if (!currentUser) return;
        const logRef = doc(db, 'users', currentUser.uid, 'daily_logs', date);

        // Use setDoc with merge in case the log doesn't exist yet (e.g., setting goals first thing)
        await setDoc(logRef, {
            date: date,
            goals: newGoals
        }, { merge: true });
    };

    return { log, loading, addMeal, deleteMeal, updateMeal, updateGoals };
}
