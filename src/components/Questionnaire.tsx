"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PoliticalAxis, MatrixQuestion, MasterMatrix, WeightedScore } from '@/lib/constants';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';

interface QuestionnaireProps {
    onComplete: (scores: Record<PoliticalAxis, WeightedScore>) => void;
}

const CHOICE_VALUES = [
    { label: "D'accord", value: 1, color: "bg-[#000091]" },
    { label: "Plutôt D'accord", value: 0.5, color: "bg-[#000091]/70" },
    { label: "Neutre", value: 0, color: "bg-gray-100" },
    { label: "Plutôt Contre", value: -0.5, color: "bg-[#E1000F]/70" },
    { label: "Contre", value: -1, color: "bg-[#E1000F]" },
];

export default function Questionnaire({ onComplete }: QuestionnaireProps) {
    const [questions, setQuestions] = useState<MatrixQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;

        // Fetch the Single Source of Truth
        async function loadMatrix() {
            const res = await fetch('/master_matrix.json');
            const data: MasterMatrix = await res.json();
            setQuestions(data.matrix);
        }
        loadMatrix();

        return () => {
            document.body.style.overflow = originalStyle;
            document.documentElement.style.overflow = 'auto';
        };
    }, []);

    if (questions.length === 0) {
        return <div className="p-20 text-center font-black animate-pulse">Initialisation du Référentiel...</div>;
    }

    const q = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleSelectAnswer = (value: number) => {
        const newAnswers = { ...answers, [q.id]: value };
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setDirection(1);
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, 100);
        } else {
            const aggregated: Record<string, number> = {};
            const weightsAggregated: Record<string, number> = {};
            const counts: Record<string, number> = {};

            Object.entries(newAnswers).forEach(([qId, val]) => {
                const questionData = questions.find((item: MatrixQuestion) => item.id === qId);
                if (questionData) {
                    const actualValue = questionData.reversed ? -val : val;
                    const axis = questionData.axis;
                    aggregated[axis] = (aggregated[axis] || 0) + actualValue;

                    let weight = 0.5;
                    const absVal = Math.abs(val);
                    if (absVal === 1) weight = 2;
                    else if (absVal === 0.5) weight = 1;

                    weightsAggregated[axis] = (weightsAggregated[axis] || 0) + weight;
                    counts[axis] = (counts[axis] || 0) + 1;
                }
            });

            const finalScores = Object.fromEntries(
                Object.entries(aggregated).map(([axis, sum]) => [
                    axis,
                    {
                        score: sum / counts[axis],
                        weight: weightsAggregated[axis] / counts[axis]
                    }
                ])
            ) as Record<PoliticalAxis, WeightedScore>;

            // Sauvegarde des réponses brutes pour le Référentiel de Vérité
            sessionStorage.setItem('userAnswers', JSON.stringify(newAnswers));

            onComplete(finalScores);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="flex flex-col items-center justify-between w-full min-h-[70vh] select-none">
            {/* 1. TOP SECTION: Progress & Theme Context */}
            <div className="w-full max-w-xl px-6 pt-2 md:pt-4 space-y-4">
                <div className="flex items-center justify-between h-10">
                    <button
                        onClick={handleBack}
                        disabled={currentIndex === 0}
                        className={`w-10 h-10 flex items-center justify-center rounded-full border border-border bg-white active:scale-90 transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="text-center">
                        <p className="text-lg font-black text-[#000091] uppercase tracking-[0.2em] mb-0.5">
                            {q.theme}
                        </p>
                        <p className="text-[11px] font-bold text-foreground/30 uppercase tracking-widest">
                            Question {currentIndex + 1} sur {questions.length}
                        </p>
                    </div>
                    <div className="w-10" />
                </div>

                {/* Progress Bar Container */}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[#E1000F] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* 2. CENTER SECTION: The Question */}
            <div className="flex-1 w-full flex items-center justify-center px-6 py-8 relative min-h-[160px]">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        initial={{ opacity: 0, x: direction >= 0 ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction >= 0 ? -50 : 50 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 35,
                            duration: 0.2
                        }}
                        className="w-full max-w-2xl text-center"
                    >
                        <h1
                            className={`font-black tracking-tighter text-foreground leading-[1.1] md:text-4xl
                                ${q.text.length > 120 ? 'text-lg' : q.text.length > 80 ? 'text-xl' : q.text.length > 50 ? 'text-2xl' : 'text-3xl'}
                            `}
                        >
                            {q.text}
                        </h1>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 3. BOTTOM SECTION: The Thumb-Zone */}
            <div className="w-full max-w-xl px-6 pb-4 space-y-4">
                <div className="flex flex-col gap-2.5">
                    {CHOICE_VALUES.map((choice) => {
                        const isSelected = answers[q.id] === choice.value;
                        return (
                            <button
                                key={choice.value}
                                onClick={() => handleSelectAnswer(choice.value)}
                                className={`w-full h-14 md:h-16 flex items-center justify-center rounded-2xl border-2 font-black text-lg transition-all active:scale-[0.96] touch-none
                                    ${isSelected
                                        ? `${choice.color} border-transparent text-white shadow-xl scale-[1.03]`
                                        : 'bg-white border-border text-foreground/40 active:bg-gray-50'
                                    }
                                `}
                            >
                                {choice.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center justify-center gap-2 text-foreground/20">
                    <CheckCircle2 size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Anonymat total</span>
                </div>
            </div>
        </div>
    );
}
