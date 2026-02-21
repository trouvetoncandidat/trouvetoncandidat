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

    // AXIS LABELS mapping for better display
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative w-full overflow-hidden bg-white border-2 border-primary/20 rounded-[2rem] p-8 shadow-sm"
        >
            <div className="space-y-8">
                <div className="flex flex-col gap-4 text-center">
                    <div className="inline-flex items-center gap-2 justify-center">
                        <Sparkles size={16} className="text-secondary" />
                        <h2 className="text-3xl font-black tracking-tighter">Votre Mix Idéal</h2>
                    </div>
                    <p className="text-foreground/40 font-bold text-xs uppercase tracking-widest max-w-xs mx-auto">
                        Le parti qui défend le mieux vos convictions sur chaque axe thématique.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {measures.map((measure, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-accent/50 rounded-2xl border border-border/50 group-hover:border-primary/10 transition-colors">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                                {AXIS_LABELS[measure.axis] || measure.axis.replace('_', ' ')}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-foreground">{measure.sourceParty}</span>
                                <ArrowRight size={14} className="text-primary/20" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-border/50">
                    <p className="text-[10px] text-center font-bold text-foreground/30 uppercase tracking-widest leading-relaxed">
                        Ce programme est une recomposition mathématique <br /> basée sur vos intensités de convictions.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
