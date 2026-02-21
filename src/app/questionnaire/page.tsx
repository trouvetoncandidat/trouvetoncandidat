"use client"

import React, { useState } from 'react';
import Questionnaire from '@/components/Questionnaire';
import { PoliticalAxis } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function QuestionnairePage() {
    const [isCompleted, setIsCompleted] = useState(false);
    const [results, setResults] = useState<Record<PoliticalAxis, number> | null>(null);

    const handleComplete = (userScores: Record<PoliticalAxis, number>) => {
        console.log("Calcul des scores en cours...", userScores);

        // Sauvegarde locale pour Victor
        sessionStorage.setItem('userScores', JSON.stringify(userScores));

        setResults(userScores);
        setIsCompleted(true);
    };

    return (
        <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Background Orbs */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[150px]" />

            <AnimatePresence mode="wait">
                {!isCompleted ? (
                    <motion.div
                        key="questionnaire"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full max-w-4xl z-10"
                    >
                        <Questionnaire onComplete={handleComplete} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-8 z-10"
                    >
                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <span className="text-4xl">🎉</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black">Analyse Terminée !</h1>
                        <p className="text-xl text-foreground/60 max-w-md mx-auto">
                            Nous avons calculé votre positionnement sur les 10 axes. Prêt à découvrir vos candidats ?
                        </p>
                        <div className="pt-8">
                            <Link
                                href="/resultats"
                                className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:scale-105 transition-transform inline-block"
                            >
                                Voir mes résultats
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
