"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { IdealMeasure } from '@/lib/matchAlgorithm';
import { Sparkles, ArrowRight } from 'lucide-react';

interface IdealCandidateCardProps {
    measures: IdealMeasure[];
}

export default function IdealCandidateCard({ measures }: IdealCandidateCardProps) {
    if (measures.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full overflow-hidden bg-white border-4 border-double border-primary p-1"
        >
            {/* Tricolor Border Corner Decor */}
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                <div className="absolute top-[-25px] right-[-25px] w-[50px] h-[100px] bg-secondary rotate-45" />
            </div>

            <div className="border border-border p-6 md:p-10 space-y-10">
                <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                            <Sparkles size={12} />
                            Concept Viral
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                            Votre Programme <span className="text-primary italic">Sur-Mesure.</span>
                        </h2>
                        <p className="text-foreground/50 font-bold text-sm">
                            Voici à quoi ressemblerait le candidat idéal selon nos calculs.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {measures.map((measure, idx) => (
                        <div key={idx} className="group flex flex-col md:flex-row gap-4 p-6 bg-accent border border-border hover:border-primary transition-colors">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-white px-2 py-0.5 border border-primary/20">
                                        {measure.axis}
                                    </span>
                                </div>
                                <p className="text-lg font-extrabold leading-tight text-foreground">
                                    « {measure.content} »
                                </p>
                            </div>
                            <div className="flex items-center md:justify-end gap-3 text-right">
                                <div className="bg-white border border-border px-4 py-2 space-y-1">
                                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-tighter">Emprunté à</p>
                                    <p className="text-sm font-black text-foreground">{measure.sourceCandidate}</p>
                                </div>
                                <ArrowRight className="text-primary/20 hidden md:block" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
