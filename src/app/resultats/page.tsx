"use client"

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateMatches, calculateAffinity, generateIdealCandidate, MatchResult, IdealMeasure, getPoliticalProfile, getSegmentationZone, POLITICAL_ZONES } from '@/lib/matchAlgorithm';
import { PoliticalAxis, WeightedScore, AXIS_EXTREMES } from '@/lib/constants';
import CandidateCard from '@/components/CandidateCard';
import IdealCandidateCard from '@/components/IdealCandidateCard';
import StoryExportCard from '@/components/StoryExportCard';
import TopBanner from '@/components/TopBanner';
import { RefreshCw, Share2, Sparkles, Database, Search, Zap, ShieldCheck, Award, Info, AlertCircle, BarChart3, Target, ChevronRight, Dna } from 'lucide-react';
import RadarChart from '@/components/RadarChart';
import Footer from '@/components/Footer';
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
    const [isNeutralProfile, setIsNeutralProfile] = useState(false);

    const refIdentity = useRef<HTMLDivElement>(null);
    const refMatch = useRef<HTMLDivElement>(null);
    const refRadar = useRef<HTMLDivElement>(null);
    const refIdeal = useRef<HTMLDivElement>(null);

    const [showTheatricalLoading, setShowTheatricalLoading] = useState(true);
    const [loadingStep, setLoadingStep] = useState(0);
    const [staggeredStep, setStaggeredStep] = useState(0);

    const theatricalSteps = [
        { icon: <Database size={24} />, text: "Analyse des réponses citoyennes...", color: "text-[#000091]" },
        { icon: <Search size={24} />, text: "Scan de toutes les pages de programmes officiels...", color: "text-[#000091]" },
        { icon: <Zap size={24} />, text: "Calcul des affinités sur les 10 axes...", color: "text-[#E1000F]" },
        { icon: <ShieldCheck size={24} />, text: "Vérification de la neutralité algorithmique...", color: "text-green-600" },
        { icon: <Award size={24} />, text: "Génération de votre ADN politique...", color: "text-[#FFD700]" }
    ];

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setLoadingStep(prev => {
                if (prev < theatricalSteps.length - 1) return prev + 1;
                return prev;
            });
        }, 1200);

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

                const responseMatrix = await fetch('/master_matrix.json');
                const masterMatrix = await responseMatrix.json();
                const candidates = masterMatrix.candidates;

                const rawAnswers = sessionStorage.getItem('userAnswers');
                const uAnswers = rawAnswers ? JSON.parse(rawAnswers) : {};

                // Check for neutral profile (> 50% neutral answers)
                const totalQuestions = masterMatrix.matrix.length;
                const neutralCount = Object.values(uAnswers).filter(val => val === 0).length;
                if (neutralCount > totalQuestions / 2) {
                    setIsNeutralProfile(true);
                }

                // Nouveau moteur basé sur la Master Matrix
                const matches = calculateAffinity(uAnswers, masterMatrix, candidates);
                setResults(matches);

                const ideal = generateIdealCandidate(uAnswers, masterMatrix, candidates);
                setIdealMeasures(ideal);

                const badge = getPoliticalProfile(uScores as Record<PoliticalAxis, WeightedScore>);
                setProfileBadge(badge);

                setTimeout(() => {
                    setShowTheatricalLoading(false);
                    setLoading(false);
                    // Start staggered entry sequence
                    setTimeout(() => setStaggeredStep(1), 300);
                    setTimeout(() => setStaggeredStep(2), 800);
                    setTimeout(() => setStaggeredStep(3), 1300);
                    setTimeout(() => setStaggeredStep(4), 1800);
                }, 6500);

            } catch (err) {
                setError("Une erreur est survenue lors du calcul.");
                setLoading(false);
                setShowTheatricalLoading(false);
            }
        }
        loadAndCalculate();
        return () => clearInterval(stepInterval);
    }, []);

    const handleShareImage = async (type: 'IDENTITY' | 'MATCH' | 'RADAR' | 'IDEAL') => {
        const refsMap = { IDENTITY: refIdentity, MATCH: refMatch, RADAR: refRadar, IDEAL: refIdeal };
        const ref = refsMap[type];
        if (!ref.current) return;

        setExportingType(type);
        try {
            const blob = await toBlob(ref.current, { cacheBust: true, width: 1080, height: 1920, pixelRatio: 2 });
            if (!blob) throw new Error("Génération échouée");

            const titlesMap = { IDENTITY: 'Identité', MATCH: 'Match', RADAR: 'ADN', IDEAL: 'Gouvernement' };
            const fileName = `trouvetoncandidat-${type.toLowerCase()}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: `TrouveTonCandidat - ${titlesMap[type]}`, text: 'Découvrez mon profil politique pour 2027 ! 🗳️🇫🇷' });
            } else {
                const dataUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = fileName; link.href = dataUrl; link.click(); URL.revokeObjectURL(dataUrl);
            }
        } catch (err) { console.error('Export error:', err); } finally { setExportingType(null); }
    };

    return (
        <AnimatePresence mode="wait">
            {showTheatricalLoading ? (
                <div className="min-h-screen bg-white relative flex flex-col">
                    <TopBanner />
                    <motion.div key="loader" exit={{ opacity: 0, scale: 1.05 }} className="flex-1 flex flex-col items-center justify-center p-6 space-y-12 overflow-hidden w-full pt-32">
                        <div className="relative flex items-center justify-center scale-110">
                            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute w-40 h-40 md:w-60 md:h-60 bg-primary/5 rounded-full blur-3xl text-primary" />
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="w-32 h-32 md:w-52 md:h-52 rounded-full border border-dashed border-primary/20" />
                            <motion.div animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute w-40 h-40 md:w-64 md:h-64 rounded-full border border-dashed border-secondary/10" />
                            <svg className="absolute w-36 h-36 md:w-48 md:h-48 rotate-[-90deg]">
                                <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="rgba(0,0,145,0.05)" strokeWidth="6" />
                                <motion.circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="#000091" strokeWidth="6" strokeDasharray="100 100" initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 100 - (loadingStep + 1) * 20 }} transition={{ duration: 1 }} strokeLinecap="round" />
                            </svg>
                            <div className="absolute flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.div key={loadingStep} initial={{ opacity: 0, scale: 0.5, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.5, rotate: 20 }} className={`${theatricalSteps[loadingStep].color}`}>{theatricalSteps[loadingStep].icon}</motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-8 max-w-sm w-full text-center">
                            <div className="space-y-4 w-full">
                                <AnimatePresence mode="wait">
                                    <motion.p key={loadingStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-sm font-black uppercase tracking-widest text-[#1D1D1F]">{theatricalSteps[loadingStep].text}</motion.p>
                                </AnimatePresence>
                                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em]">Phase {loadingStep + 1} / {theatricalSteps.length}</p>
                            </div>
                            <div className="flex gap-1.5 h-1">
                                {[0, 1, 2, 3, 4].map(i => (
                                    <motion.div key={i} animate={{ height: [4, i === loadingStep ? 12 : 4, 4], backgroundColor: i <= loadingStep ? '#000091' : '#E5E5E5' }} transition={{ duration: 0.6, repeat: i === loadingStep ? Infinity : 0 }} className="w-8 rounded-full shadow-sm" />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                    <Footer />
                </div>
            ) : error ? (
                <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6">
                    <AlertCircle className="text-secondary" size={64} />
                    <h2 className="text-2xl font-black uppercase tracking-tighter">{error}</h2>
                    <Link href="/" className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Retour à l'accueil</Link>
                </div>
            ) : (
                <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#F8F9FA] flex flex-col w-full pt-20 relative overflow-hidden">
                    {/* Background Decorative Elements */}
                    <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
                        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-float" />
                        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
                    </div>

                    <TopBanner />

                    {/* HIDDEN EXPORT CARDS */}
                    <div className="fixed left-[-9999px] top-0 pointer-events-none overflow-hidden text-black">
                        <div ref={refIdentity} className="w-[1080px] h-[1920px]"><StoryExportCard type="IDENTITY" profileBadge={profileBadge} userScores={userScores} /></div>
                        <div ref={refMatch} className="w-[1080px] h-[1920px]"><StoryExportCard type="MATCH" topMatchName={results[0]?.candidate.name} topMatchPercent={results[0]?.globalMatch} profileBadge={profileBadge} userScores={userScores} /></div>
                        <div ref={refRadar} className="w-[1080px] h-[1920px]"><StoryExportCard type="RADAR" userScores={userScores} profileBadge={profileBadge} topMatchName={results[0]?.candidate.name} candidateScores={results[0]?.candidate.scores} /></div>
                        <div ref={refIdeal} className="w-[1080px] h-[1920px]"><StoryExportCard type="IDEAL" measures={idealMeasures} profileBadge={profileBadge} userScores={userScores} /></div>
                    </div>

                    <div className="max-w-6xl mx-auto px-4 py-4 md:py-8 space-y-16 md:space-y-24 relative z-10">

                        {/* 1. Profil (StaggeredStep >= 1) */}
                        <AnimatePresence>
                            {staggeredStep >= 1 && (
                                <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto w-full space-y-6 text-center">
                                    <div className="flex flex-col items-center gap-4 relative">
                                        <button onClick={() => handleShareImage('IDENTITY')} className="absolute top-4 right-4 z-30 px-3 md:px-5 py-2 bg-white/90 backdrop-blur-md rounded-full transition-all shadow-md active:scale-95 text-primary border border-primary/10 flex items-center gap-2 group">
                                            {exportingType === 'IDENTITY' ? <RefreshCw className="animate-spin" size={12} /> : <Share2 className="transition-transform" size={12} />}
                                            <span className="text-[10px] font-[900] uppercase tracking-widest">Partager</span>
                                        </button>
                                        <div className="collectible-card glass-morphism rounded-[2.5rem] p-10 md:p-14 border-2 border-primary/10 space-y-6 flex flex-col items-center text-center overflow-hidden w-full relative">
                                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-white to-secondary opacity-40" />
                                            {/* Decorative Background Glow */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />

                                            <div className="space-y-4">
                                                <span className="bg-primary/10 text-primary border border-primary/20 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] inline-block mb-2">
                                                    {profileBadge.title}
                                                </span>
                                                <h1 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase leading-[0.9] glow-text-primary px-4 max-w-2xl mx-auto">
                                                    {profileBadge.subtitle}
                                                </h1>

                                                {isNeutralProfile && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-2 text-[10px] font-bold text-primary/60 uppercase tracking-widest flex items-center justify-center gap-2"
                                                    >
                                                        <Info size={12} />
                                                        <span>Votre profil est en construction, vous semblez privilégier la nuance.</span>
                                                    </motion.div>
                                                )}

                                                {(() => {
                                                    const scoresList = Object.values(userScores);
                                                    const weightedSum = scoresList.reduce((acc, s) => acc + (s.score * s.weight), 0);
                                                    const totalWeight = scoresList.reduce((acc, s) => acc + s.weight, 0);
                                                    const avg = totalWeight > 0 ? weightedSum / totalWeight : 0;
                                                    const zone = getSegmentationZone(avg);

                                                    return (
                                                        <div className="mt-4 flex flex-col items-center">
                                                            <div className={`px-4 py-1.5 rounded-full border border-black/5 shadow-sm inline-flex items-center gap-2 mb-4`} style={{ backgroundColor: `${zone.color}10` }}>
                                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }} />
                                                                <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: zone.color }}>
                                                                    Zone : {zone.label}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                {/* Political Hemicycle Positioning */}
                                                <div className="pt-2 w-full max-w-[340px] mx-auto overflow-visible">
                                                    <div className="flex justify-between items-center mb-1 px-8">
                                                        <span className="text-[10px] font-black uppercase text-[#E1000F] tracking-widest opacity-40">Gauche</span>
                                                        <span className="text-[10px] font-black uppercase text-[#000091] tracking-widest opacity-40">Droite</span>
                                                    </div>
                                                    <div className="relative h-28 flex items-center justify-center">
                                                        <div className="w-full h-full scale-[1.25] origin-center translate-y-2">
                                                            <svg viewBox="0 0 100 55" className="w-full h-full overflow-visible">
                                                                <path
                                                                    d="M 10 45 A 40 40 0 0 1 90 45"
                                                                    fill="none"
                                                                    stroke="url(#profileGaugeGradient)"
                                                                    strokeWidth="6"
                                                                    strokeLinecap="round"
                                                                    className="opacity-20"
                                                                />
                                                                {/* Zone Dividers */}
                                                                {[1, 2, 3, 4, 5, 6].map((i) => {
                                                                    const angle = i * (180 / 7);
                                                                    const radian = (angle + 180) * (Math.PI / 180);
                                                                    const x1 = 50 + 36 * Math.cos(radian);
                                                                    const y1 = 45 + 36 * Math.sin(radian);
                                                                    const x2 = 50 + 44 * Math.cos(radian);
                                                                    const y2 = 45 + 44 * Math.sin(radian);
                                                                    return (
                                                                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.5" className="opacity-80" />
                                                                    );
                                                                })}
                                                                <defs>
                                                                    <linearGradient id="profileGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                        <stop offset="0%" stopColor="#b91c1c" />
                                                                        <stop offset="14%" stopColor="#e1000f" />
                                                                        <stop offset="28%" stopColor="#f87171" />
                                                                        <stop offset="50%" stopColor="#cbd5e1" />
                                                                        <stop offset="71%" stopColor="#60a5fa" />
                                                                        <stop offset="85%" stopColor="#000091" />
                                                                        <stop offset="100%" stopColor="#1e1b4b" />
                                                                    </linearGradient>
                                                                </defs>
                                                                {(() => {
                                                                    const scoresList = Object.values(userScores);

                                                                    // Simple weighted average for smooth cursor movement
                                                                    const weightedSum = scoresList.reduce((acc, s) => acc + (s.score * s.weight), 0);
                                                                    const totalWeight = scoresList.reduce((acc, s) => acc + s.weight, 0);
                                                                    const avg = totalWeight > 0 ? weightedSum / totalWeight : 0;

                                                                    // Apply a slight "expressiveness" curve (non-linear) to avoid everything being in the center
                                                                    // but keep it within -1 and 1
                                                                    const expressiveAvg = Math.sign(avg) * Math.pow(Math.abs(avg), 0.7);

                                                                    const angle = (expressiveAvg + 1) * 90;
                                                                    const radian = (angle + 180) * (Math.PI / 180);
                                                                    const x = 50 + 40 * Math.cos(radian);
                                                                    const y = 45 + 40 * Math.sin(radian);

                                                                    return (
                                                                        <motion.g
                                                                            initial={{ opacity: 0, scale: 0 }}
                                                                            animate={{ opacity: 1, scale: 1 }}
                                                                            transition={{ delay: 0.8, duration: 0.5 }}
                                                                        >
                                                                            {/* Line to the center for orientation */}
                                                                            <line x1="50" y1="45" x2={x} y2={y} stroke={avg < 0 ? "#E1000F" : "#000091"} strokeWidth="0.5" strokeDasharray="1 1" opacity="0.3" />

                                                                            <circle cx={x} cy={y} r="5" fill={avg < 0 ? "#E1000F" : "#000091"} className="filter drop-shadow-md" />
                                                                            <circle cx={x} cy={y} r="8" fill={avg < 0 ? "#E1000F" : "#000091"} className="opacity-20 animate-pulse" />

                                                                            {/* Label for the dot */}
                                                                            <text
                                                                                x={x}
                                                                                y={y + 12}
                                                                                textAnchor="middle"
                                                                                className="text-[6px] font-black uppercase tracking-widest fill-foreground/60"
                                                                            >
                                                                                VOUS
                                                                            </text>
                                                                        </motion.g>
                                                                    );
                                                                })()}
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/20 to-transparent mx-auto mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.section>
                            )}
                        </AnimatePresence>

                        {/* 2. Le Match (StaggeredStep >= 2) */}
                        <AnimatePresence>
                            {staggeredStep >= 2 && (
                                <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto w-full space-y-6 relative">
                                    <button onClick={() => handleShareImage('MATCH')} className="absolute top-6 right-6 z-30 px-3 md:px-5 py-2 bg-white/90 backdrop-blur-md rounded-full transition-all shadow-md active:scale-95 text-primary border border-primary/10 flex items-center gap-2 group">
                                        {exportingType === 'MATCH' ? <RefreshCw className="animate-spin" size={12} /> : <Share2 className="transition-transform" size={12} />}
                                        <span className="text-[10px] font-[900] uppercase tracking-widest">Partager</span>
                                    </button>
                                    <div className="w-full">
                                        {results[0] && <CandidateCard result={results[0]} rank={1} />}
                                    </div>
                                </motion.section>
                            )}
                        </AnimatePresence>

                        {/* Grid for Radar & Ideal Candidate */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                            {/* 3. Ma Cartographie (StaggeredStep >= 3) */}
                            <AnimatePresence>
                                {staggeredStep >= 3 && (
                                    <motion.section initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="space-y-6 glass-morphism rounded-[2.5rem] p-10 md:p-12 shadow-xl border border-primary/10 relative overflow-hidden h-full flex flex-col">
                                        <button onClick={() => handleShareImage('RADAR')} className="absolute top-6 right-6 z-30 px-3 md:px-5 py-2 bg-white/90 backdrop-blur-md rounded-full transition-all shadow-md active:scale-95 text-primary border border-primary/10 flex items-center gap-2 group">
                                            {exportingType === 'RADAR' ? <RefreshCw className="animate-spin" size={12} /> : <Share2 className="transition-transform" size={12} />}
                                            <span className="text-[10px] font-[900] uppercase tracking-widest">Partager</span>
                                        </button>

                                        <div className="space-y-3 mb-8 text-center">
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-[9px] font-black uppercase tracking-widest text-primary/60 border border-primary/10">
                                                Analyse Dimensionnelle
                                            </span>
                                            <h3 className="text-2xl md:text-4xl font-[1000] uppercase tracking-tighter glow-text-primary leading-none">
                                                Mes <span className="text-primary">convictions</span>
                                            </h3>
                                        </div>

                                        <div className="flex items-center justify-center flex-1 w-full relative min-h-[400px]">
                                            {/* Radar Core Glow - Dynamic Color */}
                                            {(() => {
                                                const scoresList = Object.values(userScores).map(s => s.score);
                                                const avg = scoresList.reduce((a, b) => a + b, 0) / (scoresList.length || 1);
                                                const zone = getSegmentationZone(avg);
                                                return (
                                                    <div
                                                        className="absolute w-64 h-64 blur-[100px] rounded-full opacity-20 animate-pulse"
                                                        style={{ backgroundColor: zone.color }}
                                                    />
                                                );
                                            })()}
                                            <div className="w-full max-w-sm aspect-square relative z-20">
                                                <RadarChart userScores={userScores} />
                                            </div>
                                        </div>
                                    </motion.section>
                                )}
                            </AnimatePresence>

                            {/* 4. Mon Candidat Idéal (StaggeredStep >= 4) */}
                            <AnimatePresence>
                                {staggeredStep >= 4 && (
                                    <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative h-full">
                                        <button onClick={() => handleShareImage('IDEAL')} className="absolute top-6 right-6 z-30 px-3 md:px-5 py-2 bg-white/90 backdrop-blur-md rounded-full transition-all shadow-md active:scale-95 text-primary border border-primary/10 flex items-center gap-2 group">
                                            {exportingType === 'IDEAL' ? <RefreshCw className="animate-spin" size={12} /> : <Share2 className="transition-transform" size={12} />}
                                            <span className="text-[10px] font-[900] uppercase tracking-widest">Partager</span>
                                        </button>
                                        <div className="h-full">
                                            <IdealCandidateCard measures={idealMeasures} />
                                        </div>
                                    </motion.section>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>

                    <Footer />
                </motion.main>
            )}

            {/* FLOATING SHARE BUTTON FOR MOBILE accessibility */}
            {!loading && !showTheatricalLoading && (
                <div className="fixed bottom-6 right-6 z-[100] md:hidden">
                    <button
                        onClick={() => handleShareImage('MATCH')}
                        className="w-16 h-16 bg-[#000091] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all border-4 border-white"
                    >
                        {exportingType === 'MATCH' ? (
                            <RefreshCw size={24} className="animate-spin" />
                        ) : (
                            <div className="flex flex-col items-center gap-0.5">
                                <Share2 size={20} />
                                <span className="text-[8px] font-black uppercase tracking-[0.1em]">Share</span>
                            </div>
                        )}
                    </button>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#E1000F] rounded-full border-2 border-white animate-pulse" />
                </div>
            )}
        </AnimatePresence>
    );
}
