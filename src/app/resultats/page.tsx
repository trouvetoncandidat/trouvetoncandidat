"use client"

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateMatches, generateIdealCandidate, getPoliticalProfile, MatchResult, IdealMeasure } from '@/lib/matchAlgorithm';
import { PoliticalAxis } from '@/lib/constants';
import CandidateCard from '@/components/CandidateCard';
import IdealCandidateCard from '@/components/IdealCandidateCard';
import StoryExportCard from '@/components/StoryExportCard';
import { Share2, RefreshCw, AlertCircle, Home, Sparkles, Download, Heart, Coffee, ShieldCheck, Target, MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { toPng, toBlob } from 'html-to-image';

export default function ResultsPage() {
    const [results, setResults] = useState<MatchResult[]>([]);
    const [idealMeasures, setIdealMeasures] = useState<IdealMeasure[]>([]);
    const [profileBadge, setProfileBadge] = useState({ title: "Citoyen", subtitle: "En quête de repères" });
    const [loading, setLoading] = useState(true);
    const [exportingType, setExportingType] = useState<'REAL' | 'IDEAL' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const storyRealRef = useRef<HTMLDivElement>(null);
    const storyIdealRef = useRef<HTMLDivElement>(null);

    const [showTheatricalLoading, setShowTheatricalLoading] = useState(true);
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

    const loadingMessages = [
        "Analyse de vos réponses...",
        "Calcul des affinités sur les 10 axes thématiques...",
        "Comparaison avec 1200 pages de programmes officiels...",
        "Filtrage des propositions concrètes...",
        "Élimination des éléments de langage marketing...",
        "Mesure de compatibilité en cours...",
        "Génération de votre profil citoyen...",
        "Finalisation de votre match idéal..."
    ];

    useEffect(() => {
        // Message rotation logic
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

                const userScores = JSON.parse(storedScores) as Record<PoliticalAxis, number>;

                const response = await fetch('/candidates.json');
                if (!response.ok) {
                    throw new Error("Impossible de charger les données des candidats.");
                }

                const candidates = await response.json();

                const matches = calculateMatches(userScores, candidates);
                setResults(matches);

                const ideal = generateIdealCandidate(userScores, candidates);
                setIdealMeasures(ideal);

                const badge = getPoliticalProfile(userScores);
                setProfileBadge(badge);

                // Artificial delay for theatrical effect
                setTimeout(() => {
                    setShowTheatricalLoading(false);
                    setLoading(false);
                }, 3500);

            } catch (err) {
                console.error(err);
                setError("Une erreur est survenue lors du calcul des résultats.");
                setLoading(false);
                setShowTheatricalLoading(false);
            }
        }

        loadAndCalculate();

        return () => clearInterval(messageInterval);
    }, []);

    const handleShareImage = async (type: 'REAL' | 'IDEAL') => {
        const ref = type === 'REAL' ? storyRealRef : storyIdealRef;
        if (!ref.current) return;

        setExportingType(type);
        try {
            const blob = await toBlob(ref.current, {
                cacheBust: true,
                width: 1080,
                height: 1920,
                pixelRatio: 2
            });

            if (!blob) throw new Error("Génération de l'image échouée");

            const fileName = `trouvetoncandidat-${type === 'REAL' ? 'mon-match' : 'mon-utopie'}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: type === 'REAL' ? 'Mon Match Politique' : 'Mon Mix Politique',
                        text: 'Découvre mon candidat idéal pour 2027 ! 🗳️🇫🇷',
                    });
                    return;
                } catch (shareErr) {
                    console.log('Share canceled or failed', shareErr);
                }
            }

            const dataUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = fileName;
            link.href = dataUrl;
            link.click();
            URL.revokeObjectURL(dataUrl);
        } catch (err) {
            console.error('Export error:', err);
        } finally {
            setExportingType(null);
        }
    };

    const handleInviteFriend = async () => {
        const text = "🗳️🇫🇷 Et toi, pour qui voterais-tu vraiment si on ne regardait que le programme ? J'ai découvert mon match politique sur TrouveTonCandidat.fr, c'est super bien fait et 100% anonyme. \n\nFais le test ici :";
        const url = 'https://trouvetoncandidat.fr';

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'TrouveTonCandidat.fr',
                    text: text,
                    url: url,
                });
            } catch (err) {
                console.log('Sharing error', err);
            }
        } else {
            const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + url)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    return (
        <AnimatePresence mode="wait">
            {showTheatricalLoading ? (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="min-h-screen bg-white fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 space-y-12 overflow-hidden w-full"
                >
                    {/* Premium Background Ambient */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent pointer-events-none" />
                    {/* Pulsing Tricolor Ring */}
                    <div className="relative flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="w-32 h-32 md:w-48 md:h-48 rounded-full border-8 border-transparent border-t-[#000091] border-r-white border-b-[#E1000F] shadow-2xl"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute font-black text-xl md:text-3xl tracking-tighter text-[#1D1D1F]"
                        >
                            <Sparkles size={40} className="text-secondary animate-pulse" />
                        </motion.div>
                    </div>

                    <div className="flex flex-col items-center gap-6 max-w-sm w-full text-center">
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3.5, ease: "easeInOut" }}
                                className="h-full bg-primary"
                            />
                        </div>

                        <div className="h-12 flex flex-col items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={loadingMessageIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-sm md:text-base font-black uppercase tracking-widest text-[#1D1D1F]/60 px-4"
                                >
                                    {loadingMessages[loadingMessageIndex]}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>

                    <p className="fixed bottom-12 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 animate-pulse">
                        Calcul Intelligent • 100% Neutre
                    </p>
                </motion.div>
            ) : error ? (
                <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6"
                >
                    <AlertCircle className="text-secondary" size={64} />
                    <h2 className="text-2xl font-black">{error}</h2>
                    <Link href="/" className="px-8 py-4 bg-primary text-white rounded-full font-bold">Retour à l'accueil</Link>
                </motion.div>
            ) : (
                <motion.main
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="min-h-screen bg-white pb-32 overflow-x-hidden w-full"
                >
                    {/* Hidden Story Cards for Export */}
                    <div className="fixed left-[-9999px] top-0 pointer-events-none">
                        <div ref={storyRealRef}>
                            <StoryExportCard
                                type="REAL"
                                measures={idealMeasures}
                                topMatchName={results[0]?.candidate.name || ""}
                                topMatchPercent={results[0]?.globalMatch || 0}
                                profileBadge={profileBadge}
                            />
                        </div>
                        <div ref={storyIdealRef}>
                            <StoryExportCard
                                type="IDEAL"
                                measures={idealMeasures}
                                topMatchName={results[0]?.candidate.name || ""}
                                topMatchPercent={results[0]?.globalMatch || 0}
                                profileBadge={profileBadge}
                            />
                        </div>
                    </div>

                    <div className="fixed top-0 left-0 w-full z-50">
                        {/* Top Banner Tricolore (République) */}
                        <div className="w-full h-2 flex">
                            <div className="flex-1 bg-[#000091]" />
                            <div className="flex-1 bg-white" />
                            <div className="flex-1 bg-[#E1000F]" />
                        </div>

                        {/* Support Banner Citoyen */}
                        <div className="w-full bg-[#5F7FFF] py-2 px-4 flex justify-center items-center gap-4 text-white text-[10px] md:text-xs font-bold shadow-md">
                            <div className="flex items-center gap-2">
                                <Heart size={14} className="fill-white" />
                                <span className="hidden xs:inline">Ce projet est 100% citoyen & indépendant.</span>
                                <span className="xs:hidden">Indépendant & Citoyen</span>
                            </div>
                            <a
                                href="https://buymeacoffee.com/trouvetoncandidat"
                                target="_blank"
                                className="bg-white text-[#5F7FFF] px-3 py-1 rounded-full hover:bg-white/90 transition-colors uppercase tracking-widest text-[9px] flex-shrink-0"
                            >
                                Soutenir ☕
                            </a>
                        </div>
                    </div>

                    {/* Spacer to push content below fixed header */}
                    <div className="h-16 md:h-12" />

                    <div className="max-w-4xl mx-auto px-6 pt-16 space-y-16 relative z-10">
                        <header className="space-y-8 text-center pb-12">

                            <div className="flex flex-col items-center gap-4">
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-foreground/30">Votre Identité Politique</p>
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="p-8 bg-accent border-2 border-primary rounded-[2.5rem] shadow-xl inline-block text-center relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 text-primary/5 -mr-4 -mt-4">
                                        <ShieldCheck size={120} />
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter relative z-10">{profileBadge.title}</h3>
                                    <p className="text-lg font-medium text-foreground/60 relative z-10">{profileBadge.subtitle}</p>
                                </motion.div>
                            </div>
                        </header>

                        <section className="space-y-8">
                            <div className="text-center space-y-2">
                                <h2 className="text-sm font-black text-primary uppercase tracking-[0.4em]">Le Match Principal</h2>
                                <h3 className="text-3xl font-black tracking-tighter">Votre candidat idéal pour 2027</h3>
                            </div>

                            {results.length > 0 && (
                                <div className="space-y-6">
                                    <CandidateCard result={results[0]} rank={1} />
                                    <button
                                        onClick={() => handleShareImage('REAL')}
                                        disabled={!!exportingType}
                                        className="w-full max-w-sm mx-auto flex items-center justify-center gap-4 px-8 h-16 bg-[#000091] text-white rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg group"
                                    >
                                        {exportingType === 'REAL' ? <RefreshCw className="animate-spin" size={20} /> : <Share2 size={20} />}
                                        Partager mon Match
                                    </button>
                                </div>
                            )}
                        </section>

                        <section className="p-8 md:p-12 bg-[#5F7FFF]/5 rounded-[2.5rem] border-2 border-[#5F7FFF]/20 space-y-6 text-center">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black tracking-tighter">Pas de pub. Pas de biais. <span className="text-[#5F7FFF]">Juste vous.</span></h2>
                                <p className="text-base text-foreground/60 max-w-md mx-auto font-medium leading-tight">
                                    Aidez-nous à rester 100% indépendant en offrant un café à l'équipe.
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <a href="https://buymeacoffee.com/trouvetoncandidat" target="_blank" className="flex items-center justify-center gap-3 px-8 h-14 bg-white border-2 border-[#5F7FFF] text-[#5F7FFF] rounded-2xl font-black text-lg hover:bg-[#5F7FFF] hover:text-white transition-all active:scale-95 shadow-sm">
                                    <Coffee size={22} /> Offrir un café (BMC)
                                </a>
                            </div>
                        </section>

                        {idealMeasures.length > 0 && (
                            <section className="space-y-8 pt-12 border-t border-border">
                                <div className="text-center space-y-2">
                                    <h2 className="text-sm font-black text-secondary uppercase tracking-[0.4em]">Mon Utopie</h2>
                                    <h3 className="text-3xl font-black tracking-tighter">Mon programme sur-mesure</h3>
                                    <p className="text-foreground/50 text-sm">Le mix parfait de toutes les propositions qui vous correspondent.</p>
                                </div>

                                <div className="space-y-6">
                                    <IdealCandidateCard measures={idealMeasures} />
                                    <button
                                        onClick={() => handleShareImage('IDEAL')}
                                        disabled={!!exportingType}
                                        className="w-full max-w-sm mx-auto flex items-center justify-center gap-4 px-8 h-16 bg-[#E1000F] text-white rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg group"
                                    >
                                        {exportingType === 'IDEAL' ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                                        Partager mon Programme
                                    </button>
                                </div>
                            </section>
                        )}

                        <section className="pt-12 border-t border-border">
                            <div className="max-w-sm mx-auto space-y-4">
                                <button
                                    onClick={handleInviteFriend}
                                    className="w-full flex items-center justify-center gap-3 px-8 h-16 bg-white border-2 border-primary text-primary rounded-2xl font-black text-lg transition-all active:scale-95 hover:bg-primary/5"
                                >
                                    <Heart size={20} />
                                    Inviter un proche à faire le test
                                </button>
                                <p className="text-[10px] text-center text-foreground/30 font-bold uppercase tracking-widest leading-relaxed">
                                    Aidez vos amis à sortir du vote "contre" <br /> et à découvrir leurs vraies convictions.
                                </p>
                            </div>
                        </section>


                        <section className="pt-12 flex justify-center pb-safe">
                            <Link href="/" className="flex items-center justify-center gap-3 px-10 h-16 border-2 border-border text-foreground/50 font-black text-lg rounded-2xl hover:border-foreground hover:text-foreground transition-all active:scale-95">
                                <Home size={20} /> Recommencer
                            </Link>
                        </section>

                        <footer className="pt-12">
                            <div className="p-8 bg-white border border-border rounded-2xl flex flex-col items-center gap-4">
                                <Link href="/mentions-legales" className="text-[10px] font-black uppercase text-foreground/20 hover:text-primary transition-colors tracking-widest">
                                    Mentions Légales
                                </Link>
                                <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-[0.2em] leading-relaxed text-center">
                                    🇫🇷 Fait par des citoyens pour la République
                                </p>
                            </div>
                        </footer>
                    </div>
                </motion.main>
            )}
        </AnimatePresence>
    );
}
