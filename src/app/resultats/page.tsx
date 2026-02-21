"use client"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { calculateMatches, generateIdealCandidate, MatchResult, IdealMeasure } from '@/lib/matchAlgorithm';
import { PoliticalAxis } from '@/lib/constants';
import CandidateCard from '@/components/CandidateCard';
import IdealCandidateCard from '@/components/IdealCandidateCard';
import { Share2, RefreshCw, AlertCircle, Home, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage() {
    const [results, setResults] = useState<MatchResult[]>([]);
    const [idealMeasures, setIdealMeasures] = useState<IdealMeasure[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadAndCalculate() {
            try {
                // 1. Get user scores from sessionStorage
                const storedScores = sessionStorage.getItem('userScores');
                if (!storedScores) {
                    setError("Aucune réponse trouvée. Veuillez recommencer le test.");
                    setLoading(false);
                    return;
                }

                const userScores = JSON.parse(storedScores) as Record<PoliticalAxis, number>;

                // 2. Fetch candidates data (stored in public/ for the client)
                const response = await fetch('/candidates.json');
                if (!response.ok) {
                    throw new Error("Impossible de charger les données des candidats.");
                }

                const candidates = await response.json();

                // 3. Calculate matches
                const matches = calculateMatches(userScores, candidates);
                setResults(matches);

                // 4. Generate Ideal Candidate
                const ideal = generateIdealCandidate(userScores, candidates);
                setIdealMeasures(ideal);

            } catch (err) {
                console.error(err);
                setError("Une erreur est survenue lors du calcul des résultats.");
            } finally {
                setLoading(false);
            }
        }

        loadAndCalculate();
    }, []);

    const handleShare = async () => {
        const shareText = `Je viens de générer mon programme idéal pour 2027 ! 🇫🇷 Mon match principal est avec ${results[0]?.candidate.name} à ${results[0]?.globalMatch}%. Découvre ton mix politique sur :`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'TrouveTonCandidat.fr',
                    text: shareText,
                    url: 'https://trouvetoncandidat.fr',
                });
            } catch (err) {
                console.log('Erreur de partage', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(`${shareText} https://trouvetoncandidat.fr`);
            alert("Message de partage copié !");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto" />
                    <p className="text-xl font-bold gradient-text">Calcul de votre profil politique...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="glass p-8 rounded-3xl max-w-md text-center space-y-6">
                    <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
                    <h1 className="text-2xl font-black">{error}</h1>
                    <Link href="/questionnaire" className="block w-full py-4 bg-primary text-primary-foreground rounded-full font-bold">
                        Retour au test
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white pb-24">
            {/* French Top Bar */}
            <div className="w-full h-1 gradient-french" />

            <div className="max-w-4xl mx-auto px-6 pt-16 space-y-16 relative z-10">
                <header className="space-y-6 text-center md:text-left border-b border-border pb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary text-primary text-xs font-bold uppercase tracking-widest">
                        Résultats d'analyse
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
                        Votre profil <br />
                        <span className="text-primary">électoral.</span>
                    </h1>
                    <p className="text-xl text-foreground/60 max-w-2xl leading-relaxed">
                        Basé sur vos réponses aux 10 axes thématiques clés des élections de 2027.
                    </p>
                </header>

                {/* Ideal Candidate Section */}
                {idealMeasures.length > 0 && (
                    <section className="space-y-6">
                        <IdealCandidateCard measures={idealMeasures} />
                        <div className="flex items-center gap-4 py-4">
                            <div className="h-px bg-border flex-1" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Et maintenant, les vrais candidats</span>
                            <div className="h-px bg-border flex-1" />
                        </div>
                    </section>
                )}

                {/* Podium Section */}
                <section className="space-y-12">
                    {results.map((result, index) => (
                        <CandidateCard key={result.candidate.id} result={result} rank={index + 1} />
                    ))}
                </section>

                {/* CTA Section */}
                <section className="pt-12 flex flex-col items-center gap-8 border-t border-border">
                    <div className="text-center space-y-2">
                        <h4 className="text-lg font-bold">Éclairez le débat</h4>
                        <p className="text-sm text-foreground/50">Partagez ce test pour aider d'autres citoyens à décrypter les programmes.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center gap-3 px-10 py-5 bg-secondary text-white font-black text-lg hover:bg-secondary/90 transition-all shadow-md"
                        >
                            <Share2 size={20} />
                            Partager mes résultats
                        </button>

                        <Link href="/" className="flex items-center justify-center gap-3 px-10 py-5 border-2 border-primary text-primary font-black text-lg hover:bg-primary/5 transition-all">
                            <Home size={20} />
                            Recommencer
                        </Link>
                    </div>
                </section>

                <footer className="pt-12">
                    <div className="p-8 bg-accent border border-border">
                        <p className="text-xs text-foreground/50 font-bold uppercase tracking-[0.1em] leading-relaxed text-center">
                            Avertissement : Ce test est un outil d'aide à la réflexion et ne constitue pas une consigne de vote.
                            Les scores sont automatisés à partir des programmes officiels via un algorithme neutre et open-source.
                        </p>
                    </div>
                </footer>
            </div>
        </main>
    );
}
