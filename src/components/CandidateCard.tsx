"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { MatchResult } from '@/lib/matchAlgorithm';

interface CandidateCardProps {
    result: MatchResult;
    rank: number;
}

export default function CandidateCard({ result, rank }: CandidateCardProps) {
    const { candidate, globalMatch } = result;

    const getMatchColor = (score: number) => {
        if (score >= 80) return 'text-primary';
        if (score >= 50) return 'text-amber-600';
        return 'text-secondary';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.1 }}
            className={`relative w-full overflow-hidden bg-white border-2 rounded-[2.5rem] shadow-sm ${rank === 1 ? 'border-primary' : 'border-border'
                }`}
        >
            <div className="p-6 md:p-8">
                <div className="flex items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 flex items-center justify-center text-xl font-black rounded-2xl ${rank === 1 ? 'bg-primary text-white' : 'bg-gray-100 text-foreground/40'
                            }`}>
                            {rank}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight leading-none">{candidate.name}</h3>
                            <p className="text-primary font-bold text-xs uppercase tracking-wider mt-1">{candidate.party}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className={`text-4xl font-black ${getMatchColor(globalMatch)}`}>
                            {globalMatch}%
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30">Match</p>
                    </div>
                </div>

                {candidate.description && (
                    <div className="p-5 bg-accent/50 rounded-2xl border border-border/50">
                        <p className="text-xs font-medium text-foreground/60 italic leading-relaxed">
                            {candidate.description}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
