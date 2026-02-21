"use client"

import React from 'react';
import { IdealMeasure } from '@/lib/matchAlgorithm';
import { Sparkles, Target, ShieldCheck, BarChart3, Fingerprint, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
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

    // Background color based on type
    const getBgTheme = () => {
        switch (type) {
            case 'IDENTITY': return 'bg-[#5F7FFF]';
            case 'MATCH': return 'bg-[#000091]';
            case 'RADAR': return 'bg-[#1D1D1F]';
            case 'IDEAL': return 'bg-[#E1000F]';
            case 'DUEL': return 'bg-[#000091]';
            default: return 'bg-white';
        }
    };

    return (
        <div
            id={`story-card-${type}`}
            className={`w-[1080px] h-[1920px] ${getBgTheme()} flex flex-col p-20 relative overflow-hidden text-white`}
            style={{ fontFamily: 'sans-serif' }}
        >
            {/* 🌈 PREMIUM DECORATIONS */}
            <div className="absolute top-0 right-0 w-[1400px] h-[1400px] rounded-full blur-[300px] -mr-80 -mt-80 opacity-40 bg-white/20" />
            <div className="absolute bottom-0 left-0 w-[1200px] h-[1200px] rounded-full blur-[250px] -ml-60 -mb-60 opacity-30 bg-black/20" />

            {/* Header: Branding */}
            <div className="flex justify-between items-center z-10 pt-10">
                <div className="bg-white/10 backdrop-blur-md px-10 py-4 rounded-full border border-white/20 flex items-center gap-4">
                    <Fingerprint size={48} />
                    <span className="text-4xl font-black uppercase tracking-[0.3em]">TrouveTonCandidat.fr</span>
                </div>
                <div className="bg-white p-6 rounded-3xl flex flex-col items-center gap-2">
                    <QRCodeSVG value="https://trouvetoncandidat.fr" size={160} />
                    <span className="text-black text-xl font-black uppercase tracking-widest">Faire le test</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center z-10 space-y-24">

                {type === 'IDENTITY' && (
                    <div className="text-center space-y-12">
                        <p className="text-5xl font-black uppercase tracking-[0.5em] opacity-60">Votre Identité Politique</p>
                        <h1 className="text-[180px] font-black leading-none tracking-tighter drop-shadow-2xl">{profileBadge.title}</h1>
                        <p className="text-6xl font-bold opacity-80 italic max-w-4xl mx-auto leading-tight">{profileBadge.subtitle}</p>
                    </div>
                )}

                {type === 'MATCH' && (
                    <div className="w-full space-y-20">
                        <div className="text-center space-y-6">
                            <p className="text-5xl font-black uppercase tracking-[0.5em] opacity-60">Mon Match Compatibilité</p>
                            <h1 className="text-[180px] font-black leading-none tracking-tighter">{topMatchName}</h1>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="bg-white/10 backdrop-blur-2xl rounded-[100px] p-24 border-8 border-white/20 shadow-2xl flex flex-col items-center">
                                <span className="text-[280px] font-black leading-none tracking-tighter">{topMatchPercent}%</span>
                                <span className="text-6xl font-black uppercase tracking-[0.3em] opacity-60 mt-4">Affinité réelle</span>
                            </div>
                        </div>
                        <div className="text-center pt-20">
                            <p className="text-4xl font-bold opacity-60 italic">« Basé sur une analyse 100% neutre des programmes »</p>
                        </div>
                    </div>
                )}

                {type === 'RADAR' && (
                    <div className="w-full space-y-16">
                        <div className="text-center space-y-6">
                            <p className="text-5xl font-black uppercase tracking-[0.5em] opacity-60">Mon ADN Politique</p>
                            <h1 className="text-[140px] font-black leading-none tracking-tighter">Profil 2027</h1>
                        </div>
                        <div className="bg-white rounded-[100px] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.3)] h-[900px]">
                            <RadarChart userScores={userScores} candidateScores={candidateScores} />
                        </div>
                        <div className="flex justify-center gap-12 pt-10">
                            <div className="flex items-center gap-6">
                                <div className="w-10 h-10 bg-[#000091] rounded-full border-4 border-white" />
                                <span className="text-4xl font-black uppercase tracking-widest">Vous</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="w-10 h-10 bg-[#E1000F] border-4 border-dashed border-white rounded-full" />
                                <span className="text-4xl font-black uppercase tracking-widest">{topMatchName}</span>
                            </div>
                        </div>
                    </div>
                )}

                {type === 'IDEAL' && (
                    <div className="w-full space-y-20">
                        <div className="text-center space-y-6">
                            <p className="text-5xl font-black uppercase tracking-[0.5em] opacity-60">Mon Programme Idéal</p>
                            <h1 className="text-[160px] font-black leading-none tracking-tighter">Mon Utopie</h1>
                        </div>
                        <div className="w-full space-y-8">
                            {measures.map((m, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-xl border-4 border-white/20 p-12 rounded-[60px] flex items-center justify-between">
                                    <span className="text-4xl font-black uppercase tracking-widest opacity-60">
                                        {AXIS_LABELS[m.axis] || m.axis.replace('_', ' ')}
                                    </span>
                                    <div className="flex items-center gap-6">
                                        <span className="text-5xl font-black tracking-tighter">{m.sourceParty}</span>
                                        <ArrowRight size={40} className="opacity-40" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {type === 'DUEL' && (
                    <div className="w-full space-y-20">
                        <div className="text-center space-y-6">
                            <p className="text-5xl font-black uppercase tracking-[0.5em] opacity-60">Duel de Programmes</p>
                            <h1 className="text-[140px] font-black leading-[0.85] tracking-tighter">{profileBadge.subtitle}</h1>
                        </div>
                        <div className="bg-white rounded-[100px] p-24 shadow-[0_50px_100px_rgba(0,0,0,0.3)] flex flex-col items-center">
                            <div className="w-full h-[650px] mb-12">
                                <RadarChart userScores={userScores} candidateScores={candidateScores} />
                            </div>
                            <div className="flex flex-col items-center p-16 bg-primary/5 rounded-[80px] border-8 border-primary/10 w-full">
                                <span className="text-[200px] font-black leading-none tracking-tighter text-primary">{topMatchPercent}%</span>
                                <span className="text-6xl font-black uppercase tracking-[0.3em] text-primary/40 mt-4">de Proximité</span>
                            </div>
                        </div>
                        <div className="flex justify-center gap-16 pt-10">
                            <div className="flex items-center gap-8">
                                <div className="w-12 h-12 bg-[#000091] rounded-full border-4 border-white" />
                                <span className="text-5xl font-black uppercase tracking-widest leading-none">Candidat A</span>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="w-12 h-12 bg-[#E1000F] border-4 border-dashed border-white rounded-full" />
                                <span className="text-5xl font-black uppercase tracking-widest leading-none">Candidat B</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer */}
            <div className="z-10 text-center space-y-6 pb-10">
                <div className="h-1 w-full bg-white/20" />
                <p className="text-4xl font-black tracking-tight">
                    Découvrez qui défend vraiment vos idées sur <span className="underline decoration-8 underline-offset-[16px]">trouvetoncandidat.fr</span>
                </p>
            </div>
        </div>
    );
}
