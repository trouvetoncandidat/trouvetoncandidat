"use client"

import React from 'react';
import { IdealMeasure } from '@/lib/matchAlgorithm';
import { Sparkles, Target, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface StoryExportCardProps {
    type: 'REAL' | 'IDEAL';
    measures: IdealMeasure[];
    topMatchName: string;
    topMatchPercent: number;
    profileBadge: { title: string; subtitle: string };
}

export default function StoryExportCard({
    type,
    measures,
    topMatchName,
    topMatchPercent,
    profileBadge
}: StoryExportCardProps) {
    const displayMeasures = measures.slice(0, 3); // 3 measures is enough for a story layout

    return (
        <div
            id={`story-card-${type}`}
            className="w-[1080px] h-[1920px] bg-white flex flex-col p-20 relative overflow-hidden"
            style={{ fontFamily: 'sans-serif' }}
        >
            {/* 🌈 PREMIUM BACKGROUND GRADIENTS */}
            <div className={`absolute top-0 right-0 w-[1200px] h-[1200px] rounded-full blur-[200px] -mr-60 -mt-60 opacity-30 ${type === 'REAL' ? 'bg-[#000091]' : 'bg-[#E1000F]'}`} />
            <div className={`absolute bottom-0 left-0 w-[1000px] h-[1000px] rounded-full blur-[180px] -ml-40 -mb-40 opacity-20 ${type === 'REAL' ? 'bg-[#E1000F]' : 'bg-[#000091]'}`} />

            {/* French Flag Header Bar */}
            <div className="absolute top-0 left-0 right-0 h-6 flex z-50">
                <div className="flex-1 bg-[#000091]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#E1000F]" />
            </div>

            <div className="flex-1 flex flex-col justify-between relative z-10">
                <div className="space-y-20">
                    {/* Header: Title & QR Code */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-6">
                            <div className={`inline-flex items-center gap-4 px-8 py-3 rounded-full text-white text-3xl font-black uppercase tracking-[0.2em] shadow-lg ${type === 'REAL' ? 'bg-[#000091]' : 'bg-[#E1000F]'}`}>
                                {type === 'REAL' ? <Target size={40} /> : <Sparkles size={40} />}
                                {type === 'REAL' ? 'Verdict 2027' : 'Mon Utopie'}
                            </div>
                            <h1 className="text-[140px] font-black leading-[0.85] tracking-tighter text-[#1D1D1F]">
                                {type === 'REAL' ? 'Mon Vrai' : 'Mon Mix'} <br />
                                <span className={type === 'REAL' ? 'text-[#000091]' : 'text-[#E1000F]'}>
                                    {type === 'REAL' ? 'Match.' : 'Politique.'}
                                </span>
                            </h1>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center gap-4">
                            <QRCodeSVG value="https://trouvetoncandidat.fr" size={200} />
                            <p className="text-xl font-black text-foreground/40 uppercase tracking-widest text-center mt-2">Scanner <br />pour tester</p>
                        </div>
                    </div>

                    {/* Badge Profil: The Identity Sticker */}
                    <div className="relative">
                        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-4 h-32 bg-primary rounded-full" />
                        <div className="pl-10 space-y-2">
                            <p className="text-4xl font-black text-foreground/30 uppercase tracking-[0.4em]">Votre Identité :</p>
                            <h2 className="text-[100px] font-black text-foreground tracking-tight leading-none">{profileBadge.title}</h2>
                            <p className="text-[45px] font-bold text-foreground/50 italic">{profileBadge.subtitle}</p>
                        </div>
                    </div>

                    {/* Main Content: Scoring or Measures */}
                    <div className="space-y-10">
                        <div className="flex items-center gap-6">
                            <div className="h-2 w-20 bg-foreground/10 rounded-full" />
                            <p className="text-4xl font-bold text-foreground/40 uppercase tracking-[0.3em]">
                                {type === 'REAL' ? 'Mes Points de Match' : 'Mes Mesures Favorites'}
                            </p>
                        </div>

                        <div className="space-y-8">
                            {displayMeasures.map((m, i) => (
                                <div key={i} className="bg-white/60 backdrop-blur-xl border-4 border-white p-10 rounded-[60px] shadow-[0_15px_35px_rgba(0,0,0,0.05)] flex flex-col gap-4 relative overflow-hidden group">
                                    <div className="flex justify-between items-center relative z-10">
                                        <span className={`text-3xl font-black uppercase tracking-widest ${type === 'REAL' ? 'text-[#000091]' : 'text-[#E1000F]'}`}>
                                            {m.axis.replace('_', ' ')}
                                        </span>
                                        {type === 'IDEAL' && (
                                            <span className="text-2xl font-bold bg-white px-6 py-2 rounded-full text-foreground/40 border border-border shadow-sm">
                                                Inspiré par {m.sourceCandidate}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[52px] font-black leading-[1.1] text-foreground tracking-tight relative z-10">
                                        « {m.content.slice(0, 120)}{m.content.length > 120 ? '...' : ''} »
                                    </p>

                                    {/* Icon Background Decoration */}
                                    <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] rotate-12">
                                        <ShieldCheck size={250} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer: Final Call to Action */}
                <div className="space-y-16">
                    {type === 'REAL' && (
                        <div className="p-14 bg-[#000091] text-white rounded-[70px] flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,145,0.3)] border-8 border-white">
                            <div className="space-y-2">
                                <p className="text-4xl font-bold opacity-60 uppercase tracking-widest">Le Match Compatible</p>
                                <h2 className="text-[110px] font-black tracking-tighter leading-none">{topMatchName}</h2>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[160px] font-black leading-none">{topMatchPercent}%</span>
                                <span className="text-3xl font-black uppercase tracking-[0.2em] opacity-60 mt-[-10px]">Affinité</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-6">
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
                        <div className="text-center space-y-4">
                            <p className="text-5xl font-black tracking-tighter text-foreground">
                                Trouve Ton Candidat sur <span className="text-[#E1000F] underline decoration-[12px] underline-offset-[12px]">trouvetoncandidat.fr</span>
                            </p>
                            <div className="flex items-center gap-8 justify-center pt-4">
                                <span className="text-3xl font-bold text-foreground/30 uppercase tracking-[0.4em]">Anonyme</span>
                                <div className="w-4 h-4 rounded-full bg-foreground/10" />
                                <span className="text-3xl font-bold text-foreground/30 uppercase tracking-[0.4em]">Open Source</span>
                                <div className="w-4 h-4 rounded-full bg-foreground/10" />
                                <span className="text-3xl font-bold text-foreground/30 uppercase tracking-[0.4em]">Citoyen</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
