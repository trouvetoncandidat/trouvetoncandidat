"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { MatchResult, getSegmentationZone } from '@/lib/matchAlgorithm';
import { Trophy, Target, ShieldCheck, MapPin } from 'lucide-react';

interface CandidateCardProps {
    result: MatchResult;
    rank: number;
}

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

export default function CandidateCard({ result, rank }: CandidateCardProps) {
    const { candidate, globalMatch } = result;

    const getMatchColor = (score: number) => {
        if (score >= 65) return 'text-primary';
        if (score <= 35) return 'text-secondary';
        return 'text-amber-600';
    };

    const getMatchBg = (score: number) => {
        if (score >= 65) return 'bg-primary/5';
        if (score <= 35) return 'bg-secondary/5';
        return 'bg-amber-50';
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: rank % 2 === 0 ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full"
        >
            <div className="collectible-card glass-morphism rounded-[2rem] p-6 md:p-10 border-2 border-primary/10 overflow-hidden relative h-full">
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-6 text-center md:text-left">
                            <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl md:text-3xl font-[1000] rounded-[1.2rem] shrink-0 shadow-lg ${rank === 1 ? 'bg-primary text-white neon-glow-primary' : 'bg-white text-foreground/20 border border-border'}`}>
                                {rank}
                            </div>
                            <div className="space-y-1 text-left">
                                <h3 className="text-2xl md:text-3xl font-[1000] tracking-tighter leading-none text-foreground uppercase">{candidate.name}</h3>
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <span className="text-primary font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">{candidate.party}</span>
                                    <div className="w-1 h-1 bg-border rounded-full" />
                                    {(() => {
                                        const scores = Object.values(candidate.scores);
                                        const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
                                        const zone = getSegmentationZone(avg);
                                        return (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-black/5 bg-black/[0.02]">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: zone.color }} />
                                                <span className="text-[9px] font-black uppercase tracking-wider opacity-60" style={{ color: zone.color }}>
                                                    {zone.label}
                                                </span>
                                            </div>
                                        );
                                    })()}
                                </div>
                                {candidate.description && (
                                    <p className="mt-3 text-[11px] md:text-xs font-medium text-foreground/50 italic leading-relaxed max-w-md">
                                        &quot;{candidate.description}&quot;
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-end">
                            <div className={`text-5xl md:text-7xl font-[1000] tracking-tighter leading-none ${getMatchColor(globalMatch)} glow-text-primary`}>
                                {globalMatch}%
                            </div>
                            <div className="mt-2 px-3 py-1 bg-primary/5 rounded-full">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">Affinité Totale</p>
                            </div>
                        </div>
                    </div>

                    {/* Thematic Pillars - With Progress Bars for "Game" Feel */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-[1px] flex-1 bg-black/5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">Analyse Thématique</span>
                            <div className="h-[1px] flex-1 bg-black/5" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {Object.entries(AXIS_LABELS).map(([key, label]) => {
                                const axisKey = key as keyof typeof result.axisMatches;
                                const axisMatch = result.axisMatches[axisKey] || 0;
                                const candidateScore = candidate.scores[key] || 0;
                                const axisZone = getSegmentationZone(candidateScore);
                                return (
                                    <div key={key} className={`rounded-2xl p-4 border border-white/60 transition-all ${getMatchBg(axisMatch)}`}>
                                        <div className="space-y-3">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-foreground/40 leading-none h-4 flex items-center justify-center text-center">
                                                {label}
                                            </span>
                                            <div className="relative h-1 w-full bg-black/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${axisMatch}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={`absolute top-0 left-0 h-full rounded-full ${axisMatch >= 65 ? 'bg-primary' :
                                                        axisMatch <= 35 ? 'bg-secondary' :
                                                            'bg-amber-500'
                                                        }`}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className={`text-base font-[1000] tracking-tighter ${getMatchColor(axisMatch)}`}>
                                                    {axisMatch}%
                                                </div>
                                                <div className="text-[7px] font-black px-1.5 py-0.5 rounded shadow-sm text-white uppercase" style={{ backgroundColor: axisZone.color }}>
                                                    {axisZone.label.split(' ').map(w => w[0]).join('')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Highlight Line */}
                <div className={`h-1.5 w-full absolute bottom-0 left-0 opacity-20 ${rank === 1 ? 'bg-primary' : 'bg-foreground/10'}`} />
            </div>
        </motion.div>
    );
}
