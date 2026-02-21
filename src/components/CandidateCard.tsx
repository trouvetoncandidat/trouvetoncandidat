"use client"

import React from 'react';
import { motion } from 'framer-motion';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { MatchResult } from '@/lib/matchAlgorithm';
import { Target } from 'lucide-react';

interface CandidateCardProps {
    result: MatchResult;
    rank: number;
}

export default function CandidateCard({ result, rank }: CandidateCardProps) {
    const { candidate, globalMatch, axisMatches } = result;

    const getMatchColor = (score: number) => {
        if (score >= 80) return 'text-primary';
        if (score >= 50) return 'text-amber-600';
        return 'text-secondary';
    };

    const getMatchBg = (score: number) => {
        if (score >= 80) return 'bg-primary';
        if (score >= 50) return 'bg-amber-600';
        return 'bg-secondary';
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.1 }}
            className={`relative w-full overflow-hidden bg-white border-2 ${rank === 1 ? 'border-primary' : 'border-border'
                }`}
        >
            <div className="p-6 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                    <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 flex items-center justify-center text-2xl font-black border-2 ${rank === 1 ? 'bg-primary text-white border-primary' : 'bg-white text-foreground/40 border-border'
                            }`}>
                            {rank}
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold tracking-tight">{candidate.name}</h3>
                            <p className="text-primary font-bold text-sm uppercase tracking-wider">{candidate.party}</p>
                        </div>
                    </div>

                    <div className="md:text-right">
                        <div className={`text-5xl font-black ${getMatchColor(globalMatch)}`}>
                            {globalMatch}%
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30">Compatibilité Globale</p>
                    </div>
                </div>

                {candidate.description && (
                    <div className="mb-10 p-6 bg-accent/30 border-l-4 border-primary/20">
                        <p className="text-sm font-medium text-foreground/70 italic leading-relaxed">
                            {candidate.description}
                        </p>
                    </div>
                )}

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="details" className="border-none">
                        <AccordionTrigger className="hover:no-underline border border-border px-6 py-4 flex items-center gap-2 transition-colors hover:bg-gray-50">
                            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-foreground/60">
                                <Target size={14} className="text-primary" />
                                Dépouillement des axes
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-8 space-y-8 px-2">
                            {Object.entries(axisMatches).map(([axis, match]) => (
                                <div key={axis} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black uppercase tracking-widest text-foreground/80">{axis.replace('_', ' ')}</span>
                                        <span className={`text-sm font-bold ${getMatchColor(match)}`}>{match}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100">
                                        <motion.div
                                            className={`h-full ${getMatchBg(match)}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${match}%` }}
                                        />
                                    </div>

                                    {candidate.justifications[axis] && (
                                        <div className="mt-4 p-5 bg-accent border-l-4 border-primary">
                                            <div className="space-y-3">
                                                <p className="text-sm font-medium text-foreground leading-relaxed">
                                                    {candidate.justifications[axis]}
                                                </p>
                                                <div className="h-px bg-primary/10 w-12" />
                                                <p className="text-[10px] text-foreground/50 font-black uppercase tracking-widest">
                                                    Position officielle 2027
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </motion.div>
    );
}
