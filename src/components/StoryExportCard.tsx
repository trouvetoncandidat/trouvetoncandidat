"use client"

import React from 'react';
import { IdealMeasure } from '@/lib/matchAlgorithm';
import { ArrowRight, Sparkles, Target, Award, Database, Dna } from 'lucide-react';
import RadarChart from './RadarChart';
import { WeightedScore } from '@/lib/constants';

interface StoryExportCardProps {
    type: 'IDENTITY' | 'MATCH' | 'RADAR' | 'IDEAL' | 'DUEL';
    measures?: IdealMeasure[];
    topMatchName?: string;
    topMatchPercent?: number;
    profileBadge: { title: string; subtitle: string };
    userScores: Record<string, WeightedScore | number>;
    candidateScores?: Record<string, number>;
}

export default function StoryExportCard({
    type,
    measures = [],
    topMatchName = "",
    topMatchPercent = 0,
    profileBadge,
    userScores,
    candidateScores = {}
}: StoryExportCardProps) {

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

    const themes = {
        IDENTITY: { bg: 'bg-[#000091]', title: 'Mon Profil', icon: <Award size={100} /> },
        MATCH: { bg: 'bg-[#000091]', title: 'Mon Match', icon: <Target size={100} /> },
        RADAR: { bg: 'bg-[#1D1D1F]', title: 'Mon ADN', icon: <Dna size={100} /> },
        IDEAL: { bg: 'bg-[#E1000F]', title: 'Mon Gouvernement', icon: <Sparkles size={100} /> },
        DUEL: { bg: 'bg-[#000091]', title: 'Le Duel', icon: <Database size={100} /> },
    };

    const currentTheme = themes[type];

    return (
        <div
            id={`story-card-${type}`}
            className={`w-[1080px] h-[1920px] ${currentTheme.bg} flex flex-col p-24 relative overflow-hidden text-white font-sans`}
        >
            {/* 🌈 PREMIUM BACKGROUND EFFECTS */}
            <div className="absolute top-[-5%] right-[-10%] w-[1800px] h-[1800px] rounded-full blur-[400px] opacity-40 bg-white/20 animate-float" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[1400px] h-[1400px] rounded-full blur-[350px] opacity-30 bg-black/40 animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '100px 100px' }} />

            {/* HEADER: STANDARDIZED BRANDING */}
            <div className="flex justify-center z-20 pt-10">
                <div className="bg-white/10 backdrop-blur-3xl px-16 py-8 rounded-[50px] border border-white/20 flex items-center gap-10 shadow-2xl">
                    <div className="w-[120px] h-[120px] rounded-3xl bg-white flex items-center justify-center shadow-2xl">
                        <span className="text-[60px] font-black text-[#000091]">FR</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[54px] font-[1000] uppercase tracking-[0.4em] leading-tight">TrouveTonCandidat</span>
                        <span className="text-[32px] font-bold text-white/50 tracking-[0.6em] uppercase leading-none">Élection 2027</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-start items-center z-10 pt-48 space-y-32">

                {/* SECTION ICON & TITLE */}
                <div className="flex flex-col items-center gap-10">
                    <div className="text-white/20">{currentTheme.icon}</div>
                    <div className="flex items-center justify-center gap-10">
                        <div className="h-2 w-32 bg-white/20 rounded-full" />
                        <p className="text-[50px] font-black uppercase tracking-[1em] text-white/40">{currentTheme.title}</p>
                        <div className="h-2 w-32 bg-white/20 rounded-full" />
                    </div>
                </div>

                {/* DYNAMIC CONTENT */}
                {type === 'IDENTITY' && (
                    <div className="w-full space-y-24">
                        <h1
                            className="text-center font-[1000] leading-[0.85] tracking-tighter drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)] px-10 break-words"
                            style={{ fontSize: profileBadge.title.length > 12 ? '150px' : '200px' }}
                        >
                            {profileBadge.title}
                        </h1>
                        <div className="bg-white/10 backdrop-blur-2xl p-24 rounded-[120px] border border-white/20 shadow-2xl">
                            <p className="text-[72px] font-black leading-[1.2] text-white text-center italic">
                                &quot;{profileBadge.subtitle}&quot;
                            </p>
                        </div>
                    </div>
                )}

                {type === 'MATCH' && (
                    <div className="w-full space-y-24">
                        <h1
                            className="text-center font-[1000] leading-none tracking-tighter drop-shadow-2xl px-10"
                            style={{ fontSize: topMatchName.length > 12 ? '140px' : '180px' }}
                        >
                            {topMatchName}
                        </h1>
                        <div className="bg-white rounded-[150px] p-32 shadow-[0_80px_160px_rgba(0,0,0,0.6)] border-b-[30px] border-black/20 flex flex-col items-center">
                            <span className="text-[400px] font-[1000] leading-none tracking-tighter text-[#000091] tabular-nums">{topMatchPercent}%</span>
                            <span className="text-[100px] font-black uppercase tracking-[0.5em] text-[#000091]/20 mt-10">Convergence</span>
                        </div>
                    </div>
                )}

                {type === 'RADAR' && (
                    <div className="w-full space-y-24 px-10">
                        <h1 className="text-center text-[180px] font-[1000] leading-none tracking-tighter">Mon ADN</h1>
                        <div className="bg-white/10 backdrop-blur-3xl rounded-[150px] p-24 border border-white/20 shadow-2xl h-[1100px] flex flex-col justify-between">
                            <div className="flex-1 opacity-90 scale-110 translate-y-10">
                                <RadarChart userScores={userScores} candidateScores={candidateScores} isExport={true} />
                            </div>
                            <div className="bg-white/5 p-12 rounded-full border border-white/10 mt-10">
                                <div className="flex justify-center items-center gap-16">
                                    <div className="flex items-center gap-8">
                                        <div className="w-20 h-20 bg-white rounded-full shadow-2xl" />
                                        <span className="text-[50px] font-black uppercase tracking-widest text-white">MOI</span>
                                    </div>
                                    <div className="w-3 h-3 bg-white/20 rounded-full" />
                                    <span className="text-[50px] font-black uppercase tracking-widest text-white/40 leading-none">{topMatchName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {type === 'IDEAL' && (
                    <div className="w-full space-y-20 px-10">
                        <h1 className="text-center text-[160px] font-[1000] leading-none tracking-tighter px-10">Mon Choix Idéal</h1>
                        <div className="w-full space-y-8">
                            {measures.slice(0, 7).map((m, i) => (
                                <div key={i} className="bg-white p-14 rounded-[70px] flex items-center justify-between shadow-2xl border-b-[15px] border-black/10">
                                    <div className="flex flex-col gap-4">
                                        <div className="bg-[#E1000F]/10 self-start px-8 py-3 rounded-full">
                                            <span className="text-[34px] font-black uppercase tracking-[0.3em] text-[#E1000F]">
                                                {AXIS_LABELS[m.axis] || m.axis.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <span className="text-[80px] font-[1000] tracking-tighter leading-none text-black">{m.sourceParty}</span>
                                    </div>
                                    <div className="w-32 h-32 rounded-full bg-[#E1000F] shadow-2xl flex items-center justify-center">
                                        <ArrowRight size={80} className="text-white" strokeWidth={3} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* FOOTER: STANDARDIZED PROMINENT CTA */}
            <div className="z-20 text-center space-y-14 pb-32 mt-auto">
                <div className="px-32">
                    <div className="h-4 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full" />
                </div>
                <div className="space-y-8">
                    <p className="text-[50px] font-black text-white/50 tracking-[0.5em] uppercase">Testez votre affinité sur</p>
                    <p className="text-[120px] font-[1000] tracking-tighter glow-text-primary">
                        TrouveTonCandidat.fr
                    </p>
                </div>
                <div className="pt-16">
                    <div className="inline-flex items-center gap-10 bg-white text-[#000091] px-24 py-12 rounded-full text-[60px] font-[1000] uppercase tracking-[0.3em] shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-pulse-subtle">
                        C'est Votre Tour <Sparkles size={80} className="text-secondary" />
                    </div>
                </div>
            </div>

            {/* TRICOLOR SIGNATURE BAR (Thick & Modern) */}
            <div className="absolute top-0 inset-x-0 h-10 flex shadow-2xl">
                <div className="flex-1 bg-[#000091]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#E1000F]" />
            </div>
        </div>
    );
}
