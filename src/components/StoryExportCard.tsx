"use client"

import React from 'react';
import { IdealMeasure } from '@/lib/matchAlgorithm';
import { Sparkles, Target } from 'lucide-react';
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
    const displayMeasures = measures.slice(0, 5);

    return (
        <div
            id={`story-card-${type}`}
            className="w-[1080px] h-[1920px] bg-white flex flex-col p-20 relative overflow-hidden"
            style={{ fontFamily: 'sans-serif' }}
        >
            {/* Background Decor */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] -mr-40 -mt-40 ${type === 'REAL' ? 'bg-primary/10' : 'bg-secondary/10'}`} />
            <div className="absolute top-0 left-0 right-0 h-4 flex">
                <div className="flex-1 bg-[#000091]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#E1000F]" />
            </div>

            <div className="flex-1 flex flex-col justify-between relative z-10">
                <div className="space-y-16">
                    <div className="flex justify-between items-start">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-4 px-6 py-2 bg-foreground text-white text-2xl font-black uppercase tracking-[0.2em]">
                                {type === 'REAL' ? <Target size={32} /> : <Sparkles size={32} />}
                                {type === 'REAL' ? 'Verdict 2027' : 'Mon Utopie'}
                            </div>
                            <h1 className="text-[110px] font-black leading-[0.9] tracking-tighter text-[#1D1D1F]">
                                {type === 'REAL' ? 'Mon Vrai' : 'Mon Mix'} <br />
                                <span className={type === 'REAL' ? 'text-[#000091] italic' : 'text-[#E1000F] italic'}>
                                    {type === 'REAL' ? 'Match.' : 'Politique.'}
                                </span>
                            </h1>
                        </div>

                        <div className="bg-white p-4 border-4 border-border shadow-xl">
                            <QRCodeSVG value="https://trouvetoncandidat.fr" size={180} />
                        </div>
                    </div>

                    {/* Badge Profil */}
                    <div className="p-10 bg-accent rounded-[40px] border-4 border-white shadow-lg space-y-2">
                        <p className="text-3xl font-black text-foreground/30 uppercase tracking-[0.3em]">Votre Profil :</p>
                        <h2 className="text-6xl font-black text-foreground">{profileBadge.title}</h2>
                        <p className="text-3xl font-bold text-foreground/60">{profileBadge.subtitle}</p>
                    </div>

                    <div className="space-y-8">
                        <p className="text-3xl font-bold text-foreground/40 uppercase tracking-widest">
                            {type === 'REAL' ? 'Mes Scores Clés :' : 'Mes Mesures Favorites :'}
                        </p>
                        <div className="space-y-6">
                            {displayMeasures.map((m, i) => (
                                <div key={i} className="bg-white border-4 border-border p-8 rounded-[40px] shadow-sm flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-black text-[#000091] uppercase tracking-widest">{m.axis}</span>
                                        {type === 'IDEAL' && <span className="text-xl font-bold text-foreground/30">Emprunté à {m.sourceCandidate}</span>}
                                    </div>
                                    <p className="text-4xl font-extrabold leading-tight text-foreground">
                                        « {m.content.slice(0, 100)}{m.content.length > 100 ? '...' : ''} »
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    {type === 'REAL' && (
                        <div className="p-12 bg-[#000091] text-white rounded-[60px] flex items-center justify-between shadow-2xl">
                            <div>
                                <p className="text-3xl font-bold opacity-60 uppercase tracking-widest mb-2">Candidat Compatible</p>
                                <h2 className="text-7xl font-black">{topMatchName}</h2>
                            </div>
                            <div className="text-[120px] font-black leading-none">
                                {topMatchPercent}%
                            </div>
                        </div>
                    )}

                    <div className="text-center space-y-4">
                        <p className="text-4xl font-black tracking-tighter text-foreground">
                            Fais le test sur <span className="text-[#E1000F] underline decoration-8 underline-offset-8">TrouveTonCandidat.fr</span>
                        </p>
                        <p className="text-2xl font-bold text-foreground/20 uppercase tracking-[0.5em]">100% Anonyme • Open Source • Citoyen</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
