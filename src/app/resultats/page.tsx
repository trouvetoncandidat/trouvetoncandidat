"use client"

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateMatches, generateIdealCandidate, getPoliticalProfile, MatchResult, IdealMeasure } from '@/lib/matchAlgorithm';
import { PoliticalAxis, WeightedScore } from '@/lib/constants';
import CandidateCard from '@/components/CandidateCard';
import IdealCandidateCard from '@/components/IdealCandidateCard';
import StoryExportCard from '@/components/StoryExportCard';
import { Share2, RefreshCw, AlertCircle, Home, Sparkles, Download, Heart, Coffee, ShieldCheck, Target, MessageCircle, Send, BarChart3, Fingerprint, Award } from 'lucide-react';
import RadarChart from '@/components/RadarChart';
import Link from 'next/link';
import { toBlob } from 'html-to-image';

export default function ResultsPage() {
    const [results, setResults] = useState<MatchResult[]>([]);
    const [idealMeasures, setIdealMeasures] = useState<IdealMeasure[]>([]);
    const [profileBadge, setProfileBadge] = useState({ title: "Citoyen", subtitle: "En quête de repères" });
    const [loading, setLoading] = useState(true);
    const [exportingType, setExportingType] = useState<'IDENTITY' | 'MATCH' | 'RADAR' | 'IDEAL' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userScores, setUserScores] = useState<Record<string, WeightedScore>>({});

    // 4 Refs for 4 different exports
    const refIdentity = useRef<HTMLDivElement>(null);
    const refMatch = useRef<HTMLDivElement>(null);
    const refRadar = useRef<HTMLDivElement>(null);
    const refIdeal = useRef<HTMLDivElement>(null);

    const [showTheatricalLoading, setShowTheatricalLoading] = useState(true);
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

    const loadingMessages = [
        "Analyse de vos réponses...",
        "Calcul des affinités sur les 10 axes thématiques...",
        "Comparaison avec 1200 pages de programmes officiels...",
        "Génération de votre profil citoyen...",
        "Finalisation de votre match idéal..."
    ];

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
        }, 800);

        async function loadAndCalculate() {
            try {
                const storedScores = sessionStorage.getItem('userScores');
                if (!storedScores) {
                    setError("Aucune réponse trouvée. Veuillez recommencer le test.");
                    setLoading(false);
                    setShowTheatricalLoading(false);
                    return;
                }

                const rawScores = JSON.parse(storedScores);
                const uScores: Record<string, WeightedScore> = {};
                Object.entries(rawScores).forEach(([axis, val]) => {
                    uScores[axis] = typeof val === 'number' ? { score: val, weight: 1 } : val as WeightedScore;
                });
                setUserScores(uScores);

                const response = await fetch('/candidates.json');
                const candidates = await response.json();

                const matches = calculateMatches(uScores as Record<PoliticalAxis, WeightedScore>, candidates);
                setResults(matches);

                const ideal = generateIdealCandidate(uScores as Record<PoliticalAxis, WeightedScore>, candidates);
                setIdealMeasures(ideal);

                const badge = getPoliticalProfile(uScores as Record<PoliticalAxis, WeightedScore>);
                setProfileBadge(badge);

                setTimeout(() => {
                    setShowTheatricalLoading(false);
                    setLoading(false);
                }, 3000);

            } catch (err) {
                setError("Une erreur est survenue lors du calcul.");
                setLoading(false);
                setShowTheatricalLoading(false);
            }
        }
        loadAndCalculate();
        return () => clearInterval(messageInterval);
    }, []);

    const handleShareImage = async (type: 'IDENTITY' | 'MATCH' | 'RADAR' | 'IDEAL') => {
        const refsMap = { IDENTITY: refIdentity, MATCH: refMatch, RADAR: refRadar, IDEAL: refIdeal };
        const ref = refsMap[type];
        if (!ref.current) return;

        setExportingType(type);
        try {
            const blob = await toBlob(ref.current, {
                cacheBust: true,
                width: 1080,
                height: 1920,
                pixelRatio: 2
            });

            if (!blob) throw new Error("Génération échouée");

            const titlesMap = { IDENTITY: 'Identité', MATCH: 'Match', RADAR: 'ADN', IDEAL: 'Utopie' };
            const fileName = `trouvetoncandidat-${type.toLowerCase()}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `TrouveTonCandidat - ${titlesMap[type]}`,
                    text: 'Découvrez mon profil politique pour 2027 ! 🗳️🇫🇷',
                });
            } else {
                const dataUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = fileName;
                link.href = dataUrl;
                link.click();
                URL.revokeObjectURL(dataUrl);
            }
        } catch (err) {
            console.error('Export error:', err);
        } finally {
            setExportingType(null);
        }
    };

    const handleInviteFriend = async () => {
        const text = "🗳️🇫🇷 Découvre ton match politique sur TrouveTonCandidat.fr ! C'est neutre, gratuit et anonyme.";
        const url = 'https://trouvetoncandidat.fr';
        if (navigator.share) {
            await navigator.share({ title: 'TrouveTonCandidat.fr', text: text, url: url });
        } else {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
        }
    };

    return (
        <AnimatePresence mode="wait">
            {showTheatricalLoading ? (
                <motion.div
                    key="loader"
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="min-h-screen bg-white fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 space-y-12 overflow-hidden w-full"
                >
                    <div className="relative flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="w-32 h-32 md:w-48 md:h-48 rounded-full border-8 border-transparent border-t-[#000091] border-r-white border-b-[#E1000F] shadow-2xl"
                        />
                        <div className="absolute"><Sparkles size={40} className="text-secondary animate-pulse" /></div>
                    </div>
                    <div className="flex flex-col items-center gap-6 max-w-sm w-full text-center">
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3 }} className="h-full bg-primary" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest text-[#1D1D1F]/60">
                            {loadingMessages[loadingMessageIndex]}
                        </p>
                    </div>
                </motion.div>
            ) : error ? (
                <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6">
                    <AlertCircle className="text-secondary" size={64} />
                    <h2 className="text-2xl font-black">{error}</h2>
                    <Link href="/" className="px-8 py-4 bg-primary text-white rounded-full font-bold">Retour</Link>
                </div>
            ) : (
                <motion.main
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="min-h-screen bg-[#F8F9FA] pb-32 w-full"
                >
                    {/* HIDDEN STORY CARDS FOR 4 TYPES OF EXPORTS */}
                    <div className="fixed left-[-9999px] top-0 pointer-events-none">
                        <div ref={refIdentity}><StoryExportCard type="IDENTITY" profileBadge={profileBadge} userScores={userScores} /></div>
                        <div ref={refMatch}><StoryExportCard type="MATCH" topMatchName={results[0]?.candidate.name} topMatchPercent={results[0]?.globalMatch} profileBadge={profileBadge} userScores={userScores} /></div>
                        <div ref={refRadar}><StoryExportCard type="RADAR" topMatchName={results[0]?.candidate.name} userScores={userScores} candidateScores={results[0]?.candidate.scores} profileBadge={profileBadge} /></div>
                        <div ref={refIdeal}><StoryExportCard type="IDEAL" measures={idealMeasures} userScores={userScores} profileBadge={profileBadge} /></div>
                    </div>

                    {/* TOP NAVIGATION / HEADER */}
                    <div className="fixed top-0 left-0 w-full z-50">
                        <div className="w-full h-1.5 flex"><div className="flex-1 bg-[#000091]" /><div className="flex-1 bg-white" /><div className="flex-1 bg-[#E1000F]" /></div>
                        <div className="w-full bg-white/80 backdrop-blur-md py-3 px-6 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-2 text-primary">
                                <Fingerprint size={20} />
                                <span className="font-black text-sm uppercase tracking-tighter">TrouveTonCandidat.fr</span>
                            </div>
                            <button onClick={handleInviteFriend} className="text-[10px] font-black uppercase tracking-widest text-primary/60 border border-primary/20 px-3 py-1 rounded-full flex items-center gap-2">
                                <Heart size={10} className="fill-primary/20" /> Inviter un ami
                            </button>
                        </div>
                    </div>

                    <div className="max-w-xl mx-auto px-6 pt-24 space-y-6">

                        {/* SECTION 1: IDENTITY */}
                        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border/40 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em]">Section 01 • Identité</h2>
                                <button onClick={() => handleShareImage('IDENTITY')} className="p-2 text-primary/40 hover:text-primary transition-colors">
                                    {exportingType === 'IDENTITY' ? <RefreshCw className="animate-spin" size={18} /> : <Share2 size={18} />}
                                </button>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center justify-center p-4 bg-primary/5 rounded-full mb-2">
                                    <Award className="text-primary" size={32} />
                                </div>
                                <h3 className="text-4xl font-black tracking-tighter">{profileBadge.title}</h3>
                                <p className="text-sm font-medium text-foreground/50 leading-tight">{profileBadge.subtitle}</p>
                            </div>
                        </section>

                        {/* SECTION 2: TOP MATCH */}
                        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border/40 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em]">Section 02 • Votre Match</h2>
                                <button onClick={() => handleShareImage('MATCH')} className="p-2 text-primary/40 hover:text-primary transition-colors">
                                    {exportingType === 'MATCH' ? <RefreshCw className="animate-spin" size={18} /> : <Share2 size={18} />}
                                </button>
                            </div>
                            {results[0] && <CandidateCard result={results[0]} rank={1} />}
                        </section>

                        {/* SECTION 3: ANALYSE RADAR */}
                        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border/40 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em]">Section 03 • Analyse ADN</h2>
                                <button onClick={() => handleShareImage('RADAR')} className="p-2 text-primary/40 hover:text-primary transition-colors">
                                    {exportingType === 'RADAR' ? <RefreshCw className="animate-spin" size={18} /> : <Share2 size={18} />}
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="h-[300px] w-full">
                                    <RadarChart userScores={userScores} candidateScores={results[0]?.candidate.scores || {}} />
                                </div>
                                <div className="flex justify-center gap-6">
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#000091] rounded-full" /><span className="text-[9px] font-black uppercase text-primary/40">Vous</span></div>
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#E1000F] border border-dashed border-[#E1000F] rounded-full" /><span className="text-[9px] font-black uppercase text-secondary/40">{results[0]?.candidate.name}</span></div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 4: MON UTOPIE */}
                        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border/40 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em]">Section 04 • Mon Utopie</h2>
                                <button onClick={() => handleShareImage('IDEAL')} className="p-2 text-primary/40 hover:text-primary transition-colors">
                                    {exportingType === 'IDEAL' ? <RefreshCw className="animate-spin" size={18} /> : <Share2 size={18} />}
                                </button>
                            </div>
                            {idealMeasures.length > 0 && <IdealCandidateCard measures={idealMeasures} />}
                        </section>

                        {/* FINAL ACTIONS */}
                        <div className="pt-8 space-y-4">
                            <Link href="/" className="w-full h-16 bg-white border-2 border-border rounded-2xl flex items-center justify-center gap-3 font-black text-foreground/40 active:scale-95 transition-all">
                                <Home size={20} /> Recommencer le test
                            </Link>
                            <a href="https://buymeacoffee.com/trouvetoncandidat" target="_blank" className="w-full h-16 bg-[#FFDD00] rounded-2xl flex items-center justify-center gap-3 font-black text-[#1D1D1F] active:scale-95 transition-all shadow-md">
                                <Coffee size={20} /> Soutenir avec un café
                            </a>
                        </div>

                    </div>
                </motion.main>
            )}
        </AnimatePresence>
    );
}
