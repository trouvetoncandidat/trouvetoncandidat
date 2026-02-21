"use client"

import React, { useState } from 'react';
import Questionnaire from '@/components/Questionnaire';
import { PoliticalAxis } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

export default function QuestionnairePage() {
    const router = useRouter();
    const [results, setResults] = useState<Record<PoliticalAxis, number> | null>(null);

    const handleComplete = (userScores: Record<PoliticalAxis, number>) => {
        console.log("Calcul des scores en cours...", userScores);

        // Sauvegarde locale pour Victor
        sessionStorage.setItem('userScores', JSON.stringify(userScores));

        // Redirection directe vers les calculs théâtraux sur la page de résultats
        router.push('/resultats');
    };

    return (
        <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Background Orbs */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[150px]" />

            <AnimatePresence mode="wait">
                <motion.div
                    key="questionnaire"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="w-full max-w-4xl z-10"
                >
                    <Questionnaire onComplete={handleComplete} />
                </motion.div>
            </AnimatePresence>
        </main>
    );
}
