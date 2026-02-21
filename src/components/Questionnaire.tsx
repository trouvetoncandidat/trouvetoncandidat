"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { QUESTIONS, PoliticalAxis, POLITICAL_AXES } from '@/lib/constants';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface QuestionnaireProps {
    onComplete: (scores: Record<PoliticalAxis, number>) => void;
}

const CHOICE_VALUES = [
    { label: "Tout à fait d'accord", value: 1, color: "bg-primary" },
    { label: "Plutôt d'accord", value: 0.5, color: "bg-primary/70" },
    { label: "Neutre / Je passe", value: 0, color: "bg-gray-100" },
    { label: "Plutôt contre", value: -0.5, color: "bg-secondary/70" },
    { label: "Tout à fait contre", value: -1, color: "bg-secondary" },
];

export default function Questionnaire({ onComplete }: QuestionnaireProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [direction, setDirection] = useState(0);

    const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;
    const currentQuestion = QUESTIONS[currentIndex];

    const handleAnswer = (value: number) => {
        // Apply reversal if needed
        const actualValue = currentQuestion.reversed ? -value : value;

        const newAnswers = {
            ...answers,
            [currentQuestion.axis]: actualValue
        };

        setAnswers(newAnswers);

        if (currentIndex < QUESTIONS.length - 1) {
            setDirection(1);
            setCurrentIndex(currentIndex + 1);
        } else {
            // Finalize and complete
            onComplete(newAnswers as Record<PoliticalAxis, number>);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col min-h-[600px] justify-between p-6 md:p-12 bg-white">
            {/* Top Navigation */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentIndex === 0}
                        className={`p-2 border border-border text-foreground hover:bg-gray-50 transition-colors ${currentIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-center">
                        <span className="text-xs font-bold text-foreground/40 uppercase tracking-[0.2em]">
                            Étape {currentIndex + 1} / {QUESTIONS.length}
                        </span>
                    </div>
                    <div className="w-9 h-9" />
                </div>
                <div className="h-1 w-full bg-gray-100 overflow-hidden">
                    <motion.div
                        className="h-full bg-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Question Content */}
            <div className="relative flex-1 flex items-center justify-center py-12">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="w-full text-center"
                    >
                        <h2 className="text-2xl md:text-4xl font-extrabold leading-tight text-foreground">
                            {currentQuestion.text}
                        </h2>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Choice Buttons */}
            <div className="flex flex-col gap-3 pt-6">
                {CHOICE_VALUES.map((choice, idx) => (
                    <button
                        key={choice.value}
                        onClick={() => handleAnswer(choice.value)}
                        className={`group relative flex items-center justify-center p-4 border-2 border-primary text-primary font-bold transition-all hover:bg-primary hover:text-white active:scale-[0.99]`}
                    >
                        <span className="text-lg">{choice.label}</span>
                    </button>
                ))}
            </div>

            {/* Privacy Message */}
            <div className="mt-12 text-center">
                <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    Garantie de non-conservation des données
                </p>
            </div>
        </div>
    );
}
