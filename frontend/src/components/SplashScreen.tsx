import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Start exit animation slightly before calling onComplete
        const exitTimer = setTimeout(() => {
            setIsVisible(false);
        }, 2000); // Show for 2 seconds

        const completeTimer = setTimeout(() => {
            onComplete();
        }, 2500); // 2 seconds + 0.5s exit animation

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-900"
            initial={{ opacity: 1 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="flex flex-col items-center"
            >
                <img
                    src="/brand-full.png"
                    alt="2BeFit"
                    className="w-64 h-auto object-contain drop-shadow-xl"
                />

                {/* Optional Tagline or Loading Indicator could go here */}
            </motion.div>
        </motion.div>
    );
}
