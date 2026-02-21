"use client"

import React, { useState } from 'react';
import Questionnaire from '@/components/Questionnaire';
import { PoliticalAxis, WeightedScore } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Scale, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TopBanner from '@/components/TopBanner';
import Footer from '@/components/Footer';

export default function QuestionnairePage() {
    const router = useRouter();
    const [results, setResults] = useState<Record<PoliticalAxis, WeightedScore> | null>(null);

    const handleComplete = (userScores: Record<PoliticalAxis, WeightedScore>) => {
        // Sauvegarde locale
        sessionStorage.setItem('userScores', JSON.stringify(userScores));
        router.push('/resultats');
    };

    return (
        <main className="min-h-screen relative flex flex-col bg-white">
            <TopBanner />

            <div className="flex-1 flex flex-col items-center justify-center pt-24 md:pt-32 p-4">
                {/* Background Orbs */}
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />

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
            </div>

            <Footer />
        </main>
    );
}
