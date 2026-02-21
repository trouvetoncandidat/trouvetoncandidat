"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { IdealMeasure } from '@/lib/matchAlgorithm';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface IdealCandidateCardProps {
    measures: IdealMeasure[];
}

export default function IdealCandidateCard({ measures }: IdealCandidateCardProps) {
    if (measures.length === 0) return null;

    const AXIS_LABELS: Record<string, string> = {
        economie: 'Économie',
        social: 'Social',
        ecologie: 'Écologie',
        europe: 'Europe',
        securite: 'Sécurité',
        immigration: 'Immigration',
        services_publics: 'Services Publics',
        energie: 'Énergie',
        institutions: 'Institutions',
        international: 'International',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <div className="collectible-card glass-morphism rounded-[2rem] p-6 md:p-10 border-2 border-secondary/10 relative">
                <div className="flex flex-col gap-6 relative z-10">
                    <div className="space-y-3 text-center">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-secondary">
                            <Sparkles size={12} /> Mode Utopie Activé
                        </span>
                        <h2 className="text-2xl md:text-4xl font-[1000] tracking-tighter uppercase leading-none text-foreground">
                            Votre Gouvernement <span className="text-secondary">Idéal</span>
                        </h2>
                        <p className="text-foreground/40 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] max-w-sm mx-auto">
                            Le meilleur de chaque programme pioché pour vos convictions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        {measures.map((measure, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/60 shadow-sm transition-all group"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-foreground/30 leading-none mb-1">
                                        {AXIS_LABELS[measure.axis] || measure.axis.replace('_', ' ')}
                                    </span>
                                    <span className="text-[13px] font-[900] text-foreground tracking-tight">
                                        {measure.sourceParty}
                                    </span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center text-secondary/40 transition-colors">
                                    <ArrowRight size={14} />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </motion.div>
    );
}
