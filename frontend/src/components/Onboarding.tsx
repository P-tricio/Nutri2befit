import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

import { useTranslation } from 'react-i18next';

interface OnboardingProps {
    onClose: () => void;
}

export default function Onboarding({ onClose }: OnboardingProps) {
    const { t } = useTranslation();
    const [step, setStep] = useState(0);

    const STEPS = [
        {
            title: t('onboarding.step_0.title'),
            icon: "waving_hand",
            content: t('onboarding.step_0.content'),
            action: t('onboarding.step_0.action')
        },
        {
            title: t('onboarding.step_1.title'),
            icon: "dashboard",
            content: t('onboarding.step_1.content'),
            action: t('onboarding.step_1.action')
        },
        {
            title: t('onboarding.step_2.title'),
            icon: "restaurant",
            content: t('onboarding.step_2.content'),
            action: t('onboarding.step_2.action')
        },
        {
            title: t('onboarding.step_3.title'),
            icon: "menu_book",
            content: t('onboarding.step_3.content'),
            action: t('onboarding.step_3.action')
        }
    ];

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(prev => prev + 1);
        } else {
            onClose();
        }
    };

    const currentStepData = STEPS[step];

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
            <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative"
            >
                {/* Visual Header */}
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 relative flex items-center justify-center">
                    <div className="size-20 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-lg shadow-primary/10">
                        <span className="material-symbols-outlined text-4xl text-primary">{currentStepData.icon}</span>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-[-20%] right-[-10%] size-32 bg-primary/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-[-20%] left-[-10%] size-24 bg-emerald-400/10 rounded-full blur-xl" />
                </div>

                {/* Content */}
                <div className="p-8 text-center bg-white dark:bg-slate-900">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                        {currentStepData.title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                        {currentStepData.content}
                    </p>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mb-8">
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={clsx(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    i === step ? "w-6 bg-primary" : "w-1.5 bg-slate-200 dark:bg-white/10"
                                )}
                            />
                        ))}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleNext}
                        className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-xl shadow-slate-900/10 active:scale-95 transition-all hover:shadow-2xl"
                    >
                        {currentStepData.action}
                    </button>

                    {step < STEPS.length - 1 && (
                        <button onClick={onClose} className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-300">
                            {t('onboarding.skip')}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
