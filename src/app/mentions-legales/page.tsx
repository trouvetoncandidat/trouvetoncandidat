"use client"

import Link from 'next/link';
import { ChevronLeft, ShieldCheck, Github, AlertTriangle, Scale, Info } from 'lucide-react';
import TopBanner from '@/components/TopBanner';
import Footer from '@/components/Footer';

export default function LegalPage() {
    return (
        <main className="min-h-screen bg-white flex flex-col">
            <TopBanner />

            <div className="max-w-3xl mx-auto px-6 pt-32 md:pt-40 pb-16 space-y-12 flex-1">
                <Link href="/" className="inline-flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest hover:translate-x-[-4px] transition-transform">
                    <ChevronLeft size={16} />
                    Retour à l'accueil
                </Link>

                <header className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Mentions Légales & <br /><span className="text-[#E1000F] italic">Avis de Non-Responsabilité.</span></h1>
                    <p className="text-foreground/50 font-medium text-sm">Version effective au : 21 Février 2026</p>
                </header>

                {/* ALERTE CRUCIALE */}
                <div className="bg-[#E1000F]/5 border-l-4 border-[#E1000F] p-6 rounded-r-2xl space-y-3">
                    <div className="flex items-center gap-3 text-[#E1000F]">
                        <AlertTriangle size={24} />
                        <span className="font-black uppercase tracking-wider text-sm">Clause de Non-Responsabilité majeure</span>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                        L'utilisation de ce site implique l'acceptation pleine et entière des présentes conditions.
                        <strong> Les données sont fournies "en l'état" sans aucune garantie de résultat, d'exactitude ou de fiabilité.</strong>
                    </p>
                </div>

                <section className="space-y-12 prose prose-slate max-w-none">

                    {/* 1. LIMITATION DE RESPONSABILITÉ */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                            <Scale className="text-primary" size={20} />
                            1. Limitation de Responsabilité
                        </h2>
                        <div className="text-foreground/70 space-y-4 text-sm leading-relaxed">
                            <p>
                                <strong>Exactitude des données :</strong> Bien que les informations soient extraites des programmes officiels et déclarations publiques, l'éditeur ne garantit pas l'absence d'erreurs, d'omissions, d'imprécisions techniques ou typographiques. L'éditeur ne pourra être tenu responsable de toute information erronée ou fausse concernant les candidats ou leurs programmes.
                            </p>
                            <p>
                                <strong>Évolution des programmes :</strong> Les programmes politiques sont susceptibles de changer. L'éditeur n'est aucunement tenu de mettre à jour le contenu en temps réel et décline toute responsabilité en cas de décalage entre les résultats du test et l'actualité politique.
                            </p>
                            <p>
                                <strong>Usage des résultats :</strong> Les résultats générés par l'algorithme sont purement indicatifs. Ils ne constituent en aucun cas une consigne de vote, un conseil politique ou une incitation à agir. L'utilisateur est seul responsable de ses décisions et choix électoraux.
                            </p>
                            <p>
                                <strong>Dommages :</strong> L'éditeur décline toute responsabilité pour tout dommage direct ou indirect (perte de données, bug technique, interruption de service) résultant de l'accès ou de l'utilisation du site.
                            </p>
                        </div>
                    </div>

                    {/* 2. ÉDITION ET HÉBERGEMENT */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-lg font-black uppercase tracking-widest text-[#000091]">2. Édition</h2>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                                Plateforme 100% citoyenne et indépendante. <br />
                                <strong>Éditeur :</strong> [NOM / PRÉNOM OU RAISON SOCIALE] <br />
                                <strong>Contact :</strong> [EMAIL DE CONTACT]
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-lg font-black uppercase tracking-widest text-[#000091]">3. Hébergement</h2>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                                <strong>Vercel Inc.</strong> <br />
                                440 N Barranca Ave #4133 <br />
                                Covina, CA 91723.
                            </p>
                        </div>
                    </div>

                    {/* 4. PROTECTION DES DONNÉES (RGPD) */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                            <ShieldCheck className="text-green-600" size={20} />
                            4. Protection des Données (RGPD)
                        </h2>
                        <div className="bg-slate-50 p-6 rounded-2xl">
                            <p className="text-sm text-foreground/70 font-medium">
                                <strong>Garantie Anonymat :</strong> Nous ne collectons aucune donnée personnelle. Les réponses au questionnaire sont traitées localement dans votre navigateur et ne sont jamais transmises à nos serveurs. Aucun cookie tiers (tracking) n'est utilisé.
                            </p>
                        </div>
                    </div>

                    {/* 5. PROPRIÉTÉ INTELLECTUELLE */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                            <Info className="text-primary" size={20} />
                            5. Propriété & Transparence
                        </h2>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                            L'algorithme de calcul est public et auditable sur <a href="https://github.com/trouvetoncandidat/trouvetoncandidat" className="underline font-bold text-primary">GitHub</a>. Le nom "TrouveTonCandidat.fr" et les éléments visuels sont protégés au titre du droit d'auteur.
                        </p>
                    </div>

                    {/* 6. DROIT APPLICABLE */}
                    <div className="border-t pt-8">
                        <p className="text-xs text-foreground/40 italic">
                            Les présentes mentions sont régies par le droit français. Tout litige relatif à l'utilisation du site sera soumis à la compétence exclusive des tribunaux français.
                        </p>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
