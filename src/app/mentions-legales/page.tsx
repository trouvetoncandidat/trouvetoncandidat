"use client"

import Link from 'next/link';
import { ChevronLeft, ShieldCheck, Scale, Github } from 'lucide-react';

export default function LegalPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="w-full h-1 gradient-french fixed top-0 z-50" />

            <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 space-y-12">
                <Link href="/" className="inline-flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest hover:translate-x-[-4px] transition-transform">
                    <ChevronLeft size={16} />
                    Retour à l'accueil
                </Link>

                <header className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Mentions Légales & <br /><span className="text-primary italic">Confidentialité.</span></h1>
                    <p className="text-foreground/50 font-medium">Dernière mise à jour : 21 Février 2026</p>
                </header>

                <section className="space-y-8 prose prose-slate max-w-none">
                    {/* Section 1: Éditeur */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-widest border-l-4 border-primary pl-4">1. Édition du site</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Le site <strong>TrouveTonCandidat.fr</strong> est édité par : <br />
                            <strong>[NOM / PRÉNOM OU RAISON SOCIALE]</strong> <br />
                            Domicilié(e) à : [ADRESSE COMPLÈTE] <br />
                            Contact : [EMAIL DE CONTACT]
                        </p>
                    </div>

                    {/* Section 2: Hébergement */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-widest border-l-4 border-primary pl-4">2. Hébergement</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Le site est hébergé par <strong>Vercel Inc.</strong>, situé à : <br />
                            440 N Barranca Ave #4133 Covina, CA 91723. <br />
                            Site web : <a href="https://vercel.com" className="underline text-primary">vercel.com</a>
                        </p>
                    </div>

                    {/* Section 3: Confidentialité/RGPD */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-widest border-l-4 border-[#E1000F] pl-4">3. Protection des données (RGPD)</h2>
                        <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                            <div className="flex items-center gap-3 text-[#E1000F]">
                                <ShieldCheck size={24} />
                                <span className="font-black">Garantie "Zero Data"</span>
                            </div>
                            <p className="text-sm text-foreground/70">
                                Conformément à notre manifeste, nous ne collectons <strong>aucune donnée personnelle</strong>.
                                Le test est 100% anonyme. Les réponses aux questions sont stockées localement dans votre navigateur
                                (SessionStorage) et sont automatiquement effacées à la fermeture de l'onglet.
                                Aucune adresse IP n'est enregistrée sur nos serveurs.
                            </p>
                        </div>
                    </div>

                    {/* Section 4: Cookies */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-widest border-l-4 border-primary pl-4">4. Cookies</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Ce site n'utilise <strong>aucun cookie publicitaire</strong> ni aucun traceur tiers
                            (Google Analytics, etc.). Seul un stockage technique local (SessionStorage) est utilisé pour faire
                            fonctionner le questionnaire, ce qui dispense ce site du recueil de consentement préalable.
                        </p>
                    </div>

                    {/* Section 5: Propriété Intellectuelle */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-widest border-l-4 border-primary pl-4">5. Code Source</h2>
                        <div className="flex items-center gap-4 p-4 border border-border rounded-xl">
                            <Github size={20} />
                            <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">
                                Projet Open Source disponible sur GitHub. <br />
                                Algorithme transparent et auditable par tous.
                            </p>
                        </div>
                    </div>
                </section>

                <footer className="pt-16 border-t border-border text-center">
                    <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.2em]">Fait avec rigueur par des citoyens pour la République française 🇫🇷</p>
                </footer>
            </div>
        </main>
    );
}
