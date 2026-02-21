"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Candidate, AXIS_EXTREMES } from '@/lib/constants';
import HemicycleGauge from '@/components/HemicycleGauge';
import { Share2, RefreshCw, ArrowLeftRight, Fingerprint, Info, Target, Home, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import StoryExportCard from '@/components/StoryExportCard';
import { toBlob } from 'html-to-image';

export default function ComparePage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [comparisonMode, setComparisonMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const storyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchCandidates() {
            try {
                const res = await fetch('/candidates.json');
                const data = await res.json();
                // Shuffle data for neutrality
                const shuffled = [...data].sort(() => Math.random() - 0.5);
                setCandidates(shuffled);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }
        fetchCandidates();
    }, []);

    const handleSelectCandidate = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else if (selectedIds.length < 2) {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const candA = candidates.find(c => c.id === selectedIds[0]);
    const candB = candidates.find(c => c.id === selectedIds[1]);

    // Calculate proximity score
    const calculateProximity = () => {
        if (!candA || !candB) return 0;
        let totalDiff = 0;
        const axes = Object.keys(AXIS_EXTREMES);
        axes.forEach(axis => {
            const valA = candA.scores[axis] ?? 0;
            const valB = candB.scores[axis] ?? 0;
            totalDiff += Math.abs(valA - valB);
        });
        const avgDiff = totalDiff / axes.length;
        return Math.round((1 - (avgDiff / 2)) * 100);
    };

    const proximity = calculateProximity();

    const handleShare = async () => {
        if (!storyRef.current) return;
        setExporting(true);
        try {
            const blob = await toBlob(storyRef.current, {
                cacheBust: true,
                width: 1080,
                height: 1920,
                pixelRatio: 2
            });
            if (!blob) throw new Error("Export failed");

            const file = new File([blob], `duel-${selectedIds[0]}-vs-${selectedIds[1]}.png`, { type: 'image/png' });

            if (navigator.share) {
                await navigator.share({
                    files: [file],
                    title: `Duel Politique : ${candA?.name} vs ${candB?.name}`,
                    text: `Qui est le plus proche de vos idées ? Le duel sur TrouveTonCandidat.fr 🗳️`,
                });
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `duel-${selectedIds[0]}-vs-${selectedIds[1]}.png`;
                a.click();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setExporting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <RefreshCw className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <main className="min-h-screen bg-[#F8F9FA] pb-32">
            {/* Hidden Export Card */}
            <div className="fixed left-[-9999px] top-0 pointer-events-none">
                <div ref={storyRef}>
                    {candA && candB && (
                        <StoryExportCard
                            type="DUEL"
                            profileBadge={{ title: "Duel Politique", subtitle: `${candA.name} vs ${candB.name}` }} // Fixed profileBadge format
                            userScores={Object.fromEntries(Object.entries(candA.scores).map(([k, v]) => [k, { score: v, weight: 1 }]))}
                            candidateScores={candB.scores}
                            topMatchName={candA.name}
                            topMatchPercent={proximity}
                        />
                    )}
                </div>
            </div>

            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50">
                <div className="w-full h-1.5 flex"><div className="flex-1 bg-[#000091]" /><div className="flex-1 bg-white" /><div className="flex-1 bg-[#E1000F]" /></div>
                <div className="w-full bg-white/80 backdrop-blur-md py-3 px-6 flex justify-between items-center shadow-sm">
                    <Link href="/" className="flex items-center gap-2 text-primary">
                        <Fingerprint size={20} />
                        <span className="font-black text-sm uppercase tracking-tighter">TrouveTonCandidat.fr</span>
                    </Link>
                    {comparisonMode ? (
                        <button
                            onClick={() => setComparisonMode(false)}
                            className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2"
                        >
                            <ArrowLeftRight size={14} /> Changer
                        </button>
                    ) : (
                        <Link href="/" className="p-2 text-foreground/40 hover:text-foreground">
                            <Home size={20} />
                        </Link>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!comparisonMode ? (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-4xl mx-auto px-6 pt-24 space-y-8"
                    >
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                                Choisissez <span className="text-primary">2 candidats</span> <br /> pour le duel.
                            </h1>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full text-primary/60 font-black text-[9px] uppercase tracking-widest border border-primary/5">
                                <ShieldCheck size={12} />
                                <span>Ordre d'affichage aléatoire pour une neutralité totale ⚖️</span>
                            </div>
                            <p className="text-foreground/40 font-bold text-sm uppercase tracking-widest">
                                {selectedIds.length === 0 ? "Sélectionnez un premier candidat" :
                                    selectedIds.length === 1 ? "Sélectionnez un deuxième candidat" :
                                        "Prêt pour le duel !"}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {candidates.map((candidate) => {
                                const isSelected = selectedIds.includes(candidate.id);
                                const isFirstSelected = selectedIds[0] === candidate.id;

                                // Calculate average score for the mini-hemicycle
                                const scores = Object.values(candidate.scores);
                                const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

                                return (
                                    <motion.div
                                        key={candidate.id}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => handleSelectCandidate(candidate.id)}
                                        className={`relative flex flex-col items-start p-8 rounded-[2.5rem] text-left transition-all border-4 cursor-pointer ${isSelected
                                            ? isFirstSelected ? 'border-[#000091] bg-white shadow-xl' : 'border-[#E1000F] bg-white shadow-xl'
                                            : 'border-transparent bg-white shadow-sm hover:shadow-md'
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white z-10 ${isFirstSelected ? 'bg-[#000091]' : 'bg-[#E1000F]'
                                                }`}>
                                                {isFirstSelected ? "A" : "B"}
                                            </div>
                                        )}

                                        <div className="w-full mb-2 min-h-[40px]">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 leading-tight">{candidate.party}</p>
                                        </div>

                                        <div className="w-full mb-6 min-h-[64px] flex items-center">
                                            <h3 className="text-2xl font-black tracking-tight leading-[1.1]">{candidate.name}</h3>
                                        </div>

                                        {/* Mini Hemicycle */}
                                        <div className="w-full mb-6">
                                            <div className="flex justify-between items-center mb-2 px-1">
                                                <span className="text-[9px] font-black uppercase text-foreground/30 tracking-widest">Échiquier Politique</span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${avgScore < -0.3 ? "text-[#E1000F]" : avgScore > 0.3 ? "text-[#000091]" : "text-foreground/40"
                                                    }`}>
                                                    {avgScore < -0.3 ? "Gauche" : avgScore > 0.3 ? "Droite" : "Centre"}
                                                </span>
                                            </div>
                                            <div className="h-20 w-full flex items-center justify-center bg-accent/20 rounded-2xl p-4">
                                                <svg viewBox="0 0 100 55" className="h-full w-full overflow-visible">
                                                    <path
                                                        d="M 10 45 A 40 40 0 0 1 90 45"
                                                        fill="none"
                                                        stroke="url(#gaugeGradientMiniCard)"
                                                        strokeWidth="6"
                                                        strokeLinecap="round"
                                                        className="opacity-10"
                                                    />
                                                    <defs>
                                                        <linearGradient id="gaugeGradientMiniCard" x1="0%" y1="0%" x2="100%" y2="0%">
                                                            <stop offset="0%" stopColor="#E1000F" />
                                                            <stop offset="50%" stopColor="#cbd5e1" />
                                                            <stop offset="100%" stopColor="#000091" />
                                                        </linearGradient>
                                                    </defs>
                                                    {/* Indicator dot */}
                                                    {(() => {
                                                        const angle = (avgScore + 1) * 90;
                                                        const radian = (angle + 180) * (Math.PI / 180);
                                                        const x = 50 + 40 * Math.cos(radian);
                                                        const y = 45 + 40 * Math.sin(radian);
                                                        return (
                                                            <>
                                                                <circle cx={x} cy={y} r="5" fill={avgScore < 0 ? "#E1000F" : "#000091"} className="filter drop-shadow-sm" />
                                                                <circle cx={x} cy={y} r="8" fill={avgScore < 0 ? "#E1000F" : "#000091"} className="opacity-20 animate-pulse" />
                                                            </>
                                                        );
                                                    })()}
                                                </svg>
                                            </div>
                                        </div>

                                        <p className="text-xs font-semibold text-foreground/40 line-clamp-2 mb-6">{candidate.description}</p>

                                        {candidate.website && (
                                            <a
                                                href={candidate.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="mt-auto inline-flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary transition-colors border border-primary/10"
                                            >
                                                Voir le programme <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="fixed bottom-8 left-0 w-full px-6 z-40 pointer-events-none">
                            <div className="max-w-md mx-auto pointer-events-auto">
                                <button
                                    disabled={selectedIds.length < 2}
                                    onClick={() => setComparisonMode(true)}
                                    className={`w-full h-16 rounded-2xl font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-all ${selectedIds.length < 2
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-primary text-white active:scale-95'
                                        }`}
                                >
                                    Comparer ces programmes
                                    <ArrowLeftRight size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="comparison"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto px-6 pt-24 space-y-8"
                    >
                        {/* Selected Candidates Header */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border/40 flex items-center justify-between gap-4">
                            <div className="flex-1 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#000091] mb-1">Candidat A</p>
                                <h3 className="font-black tracking-tight truncate">{candA?.name}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary/40 font-black text-xs shrink-0">VS</div>
                            <div className="flex-1 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#E1000F] mb-1">Candidat B</p>
                                <h3 className="font-black tracking-tight truncate">{candB?.name}</h3>
                            </div>
                        </div>

                        {/* Proximity Score Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-[#000091] text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden text-center"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Target size={120} />
                            </div>
                            <p className="text-xs font-black uppercase tracking-[0.4em] opacity-60 mb-2">Indice de Convergence</p>
                            <div className="text-6xl font-black tracking-tighter mb-1">{proximity}%</div>
                            <p className="text-sm font-medium opacity-80">de proximité de programme</p>

                            <button
                                onClick={handleShare}
                                disabled={exporting}
                                className="mt-8 w-full h-14 bg-white text-[#000091] rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg"
                            >
                                {exporting ? <RefreshCw className="animate-spin" size={20} /> : <Share2 size={20} />}
                                Partager ce Duel
                            </button>
                        </motion.div>

                        {/* Gauges Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {candA && candB && Object.entries(AXIS_EXTREMES).map(([axis, labels]) => (
                                <HemicycleGauge
                                    key={axis}
                                    themeLabel={axis.replace('_', ' ')}
                                    scoreA={candA.scores[axis] ?? 0}
                                    scoreB={candB.scores[axis] ?? 0}
                                    labelLeft={labels.left}
                                    labelRight={labels.right}
                                    nameA={candA.name}
                                    nameB={candB.name}
                                />
                            ))}
                        </div>

                        {/* Info Card */}
                        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-dashed border-border flex gap-4">
                            <Info className="text-primary/40 shrink-0" size={24} />
                            <p className="text-xs font-medium text-foreground/50 leading-relaxed">
                                Cette comparaison est uniquement basée sur les engagements écrits officiels. Elle ne présage pas des alliances futures.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
