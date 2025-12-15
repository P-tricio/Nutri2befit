import { useState } from 'react';
import { doc, writeBatch, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export function useDataMigration() {
    const { currentUser } = useAuth();
    const [isMigrating, setIsMigrating] = useState(false);
    const [migrationError, setMigrationError] = useState<string | null>(null);

    const checkForLocalData = () => {
        const logs = localStorage.getItem('daily_logs');
        const menus = localStorage.getItem('saved_menus');
        return !!(logs || menus);
    };

    const migrateData = async () => {
        if (!currentUser) return;
        setIsMigrating(true);
        setMigrationError(null);

        try {
            const batch = writeBatch(db);
            let operationCount = 0;

            // 1. Migrate Daily Logs
            const localLogs = JSON.parse(localStorage.getItem('daily_logs') || '{}');
            Object.entries(localLogs).forEach(([dateKey, logData]: [string, any]) => {
                const docRef = doc(db, 'users', currentUser.uid, 'daily_logs', dateKey);
                // Ensure data structure matches expected schema
                batch.set(docRef, {
                    ...logData, // Assuming structure is compatible
                    date: dateKey,
                    migratedAt: Date.now()
                });
                operationCount++;
            });

            // 2. Migrate Saved Menus
            const localMenus = JSON.parse(localStorage.getItem('saved_menus') || '[]');
            localMenus.forEach((menu: any) => {
                // Use existing ID or generate one if missing
                const menuId = menu.id || Date.now().toString();
                const docRef = doc(db, 'users', currentUser.uid, 'saved_menus', menuId);
                batch.set(docRef, {
                    ...menu,
                    migratedAt: Date.now()
                });
                operationCount++;
            });

            if (operationCount > 0) {
                await batch.commit();

                // clear local data after successful migration
                localStorage.removeItem('daily_logs');
                localStorage.removeItem('saved_menus');

                // Also migrate onboarding status if needed
                if (localStorage.getItem('onboarding_completed')) {
                    // Maybe update profile settings? skipped for now
                }
            }

            setIsMigrating(false);
            return true;
        } catch (error: any) {
            console.error("Migration failed:", error);
            setMigrationError(error.message);
            setIsMigrating(false);
            return false;
        }
    };

    return {
        checkForLocalData,
        migrateData,
        isMigrating,
        migrationError
    };
}
