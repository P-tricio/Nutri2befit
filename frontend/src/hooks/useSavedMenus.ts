import { useState, useEffect } from 'react';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import type { SavedMenu, Meal } from '../types';

export function useSavedMenus() {
    const { currentUser } = useAuth();
    const [menus, setMenus] = useState<SavedMenu[]>([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to saved_menus collection
    useEffect(() => {
        if (!currentUser) {
            setMenus([]);
            setLoading(false);
            return;
        }

        const menusRef = collection(db, 'users', currentUser.uid, 'saved_menus');
        // Order by createdAt descending (newest first)
        const q = query(menusRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const menusData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SavedMenu[];

            setMenus(menusData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching saved menus:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // --- Actions ---

    const addMenu = async (menu: SavedMenu) => {
        if (!currentUser) return;

        try {
            // Use menu.id as doc ID or auto-generate? 
            // Existing logic uses timestamp-based IDs. Let's stick to using the ID provided.
            const menuRef = doc(db, 'users', currentUser.uid, 'saved_menus', menu.id);
            await setDoc(menuRef, menu);
        } catch (error) {
            console.error("Error adding menu:", error);
            throw error;
        }
    };

    const deleteMenu = async (menuId: string) => {
        if (!currentUser) return;

        try {
            const menuRef = doc(db, 'users', currentUser.uid, 'saved_menus', menuId);
            await deleteDoc(menuRef);
        } catch (error) {
            console.error("Error deleting menu:", error);
            throw error;
        }
    };

    const updateMenu = async (menu: SavedMenu) => {
        if (!currentUser) return;

        try {
            const menuRef = doc(db, 'users', currentUser.uid, 'saved_menus', menu.id);
            await updateDoc(menuRef, {
                ...menu
            });
        } catch (error) {
            console.error("Error updating menu:", error);
            throw error;
        }
    };

    // Rename wrapper since it's a common specific action
    const renameMenu = async (menuId: string, newName: string, newDescription?: string) => {
        if (!currentUser) return;
        const menuRef = doc(db, 'users', currentUser.uid, 'saved_menus', menuId);
        await updateDoc(menuRef, { name: newName, description: newDescription || '' });
    };

    return {
        menus,
        loading,
        addMenu,
        deleteMenu,
        updateMenu,
        renameMenu
    };
}
