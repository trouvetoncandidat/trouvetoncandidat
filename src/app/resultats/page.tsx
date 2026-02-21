"use client"

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
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

    useEffect(() => {
        async function loadAndCalculate() {
            try {
                const storedScores = sessionStorage.getItem('userScores');
                if (!storedScores) {
                    setError("Aucune réponse trouvée. Veuillez recommencer le test.");
                    setLoading(false);
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

            } catch (err) {
                console.error(err);
                setError("Une erreur est survenue lors du calcul des résultats.");
            } finally {
                setLoading(false);
            }
        }

        loadAndCalculate();
    }, []);

    const handleShareImage = async (type: 'REAL' | 'IDEAL') => {
        const ref = type === 'REAL' ? storyRealRef : storyIdealRef;
        if (!ref.current) return;

        setExportingType(type);
        try {
            // High quality blob generation
            const blob = await toBlob(ref.current, {
                cacheBust: true,
                width: 1080,
                height: 1920,
                pixelRatio: 2 // Higher fidelity
            });

            if (!blob) throw new Error("Génération de l'image échouée");

            const fileName = `trouvetoncandidat-${type === 'REAL' ? 'mon-match' : 'mon-utopie'}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            // Check for Web Share API support
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: type === 'REAL' ? 'Mon Match Politique' : 'Mon Mix Politique',
                        text: 'Découvre mon candidat idéal pour 2027 ! 🗳️🇫🇷',
                    });
                    return; // Success!
                } catch (shareErr) {
                    // Fallback to download if user cancels or share fails
                    console.log('Share canceled or failed', shareErr);
                }
            }

            // Fallback: Traditional download
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

    const handleSocialShare = (platform: 'X' | 'WHATSAPP') => {
        const text = `Je viens de trouver mon match pour 2027 ! 🇫🇷 Mon candidat idéal est à ${results[0]?.globalMatch}% avec ${results[0]?.candidate.name}. Fais le test sur :`;
        const url = 'https://trouvetoncandidat.fr';

        const links = {
            X: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            WHATSAPP: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`
        };

        window.open(links[platform], '_blank');
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

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="animate-spin text-primary" size={48} />
            <p className="text-lg font-black uppercase tracking-widest text-primary">Analyse des programmes...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6">
            <AlertCircle className="text-secondary" size={64} />
            <h2 className="text-2xl font-black">{error}</h2>
            <Link href="/" className="px-8 py-4 bg-primary text-white rounded-full font-bold">Retour à l'accueil</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-white pb-32 overflow-x-hidden w-full">
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

            <div className="w-full h-1 gradient-french" />

            <div className="max-w-4xl mx-auto px-6 pt-16 space-y-16 relative z-10">
                <header className="space-y-8 text-center border-b border-border pb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary text-primary text-xs font-bold uppercase tracking-widest">
                        Analyse terminée
                    </div>

                    {/* 1. LE BADGE */}
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

                {/* 2. LE VRAI CANDIDAT IDÉAL */}
                <section className="space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-sm font-black text-primary uppercase tracking-[0.4em]">Le Match Principal</h2>
                        <h3 className="text-3xl font-black tracking-tighter">Votre candidat idéal pour 2027</h3>
                    </div>

                    {results.length > 0 && (
                        <div className="space-y-6">
                            <CandidateCard result={results[0]} rank={1} />

                            {/* 3. BOUTON DE PARTAGE - MATCH */}
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

                {/* 4. MON PROGRAMME SUR MESURE */}
                {idealMeasures.length > 0 && (
                    <section className="space-y-8 pt-12 border-t border-border">
                        <div className="text-center space-y-2">
                            <h2 className="text-sm font-black text-secondary uppercase tracking-[0.4em]">Mon Utopie</h2>
                            <h3 className="text-3xl font-black tracking-tighter">Mon programme sur-mesure</h3>
                            <p className="text-foreground/50 text-sm">Le mix parfait de toutes les propositions qui vous correspondent.</p>
                        </div>

                        <div className="space-y-6">
                            <IdealCandidateCard measures={idealMeasures} />

                            {/* 5. BOUTON DE PARTAGE - PROGRAMME */}
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

                {/* 6. INVITER UN PROCHE */}
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

                {/* PODIUM SECONDAIRE */}
                {results.length > 1 && (
                    <section className="space-y-12 pt-24 border-t border-border">
                        <div className="text-center">
                            <h3 className="text-xl font-black uppercase tracking-widest text-foreground/20 italic">Le reste du classement</h3>
                        </div>
                        {results.slice(1).map((result, index) => (
                            <CandidateCard key={result.candidate.id} result={result} rank={index + 2} />
                        ))}
                    </section>
                )}

                {/* Monetization / Support Section */}
                <section className="mt-24 p-10 md:p-16 bg-[#F8F9FA] rounded-[3rem] border-2 border-border space-y-10 text-center">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Pas de pub. Pas de biais. <br /><span className="text-secondary">Juste vous.</span></h2>
                        <p className="text-lg text-foreground/60 max-w-xl mx-auto font-medium">
                            Aidez-nous à rester 100% neutre et indépendant en offrant un café à l'équipe.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="https://ko-fi.com/trouvetoncandidat" target="_blank" className="flex items-center justify-center gap-3 px-10 h-16 bg-white border-2 border-border rounded-2xl font-black text-lg hover:border-primary transition-all active:scale-95">
                            <Coffee size={24} /> Offrir un café (2€)
                        </a>
                    </div>
                </section>

                <section className="pt-12 flex justify-center pb-safe">
                    <Link href="/" className="flex items-center justify-center gap-3 px-10 h-16 border-2 border-border text-foreground/50 font-black text-lg rounded-2xl hover:border-foreground hover:text-foreground transition-all active:scale-95">
                        <Home size={20} /> Recommencer
                    </Link>
                </section>

                <footer className="pt-12">
                    <div className="p-8 bg-white border border-border rounded-2xl">
                        <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-[0.2em] leading-relaxed text-center">
                            Zéro influence politique garantie.
                        </p>
                        <div className="mt-4 flex justify-center gap-6">
                            <Link href="/mentions-legales" className="text-[10px] font-black uppercase text-foreground/20 hover:text-primary transition-colors tracking-widest">Confidentialité</Link>
                            <Link href="/mentions-legales" className="text-[10px] font-black uppercase text-foreground/20 hover:text-primary transition-colors tracking-widest">Mentions Légales</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}
