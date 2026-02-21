"use client"

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Scale, Ban, MonitorOff, Github } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] flex flex-col items-center overflow-x-hidden w-full">
      {/* Top Banner Tricolore (République) */}
      <div className="w-full h-2 flex fixed top-0 z-50">
        <div className="flex-1 bg-[#000091]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#E1000F]" />
      </div>

      <header className="w-full max-w-6xl px-6 py-24 md:py-40 flex flex-col items-center text-center space-y-12 relative">
        {/* Decorative Floating Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-[#000091] font-black text-xs uppercase tracking-[0.2em]"
        >
          <Sparkles size={16} />
          <span>Boussole Électorale 2027</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-[120px] font-black tracking-tighter leading-[0.9] text-[#1D1D1F] max-w-5xl"
        >
          Votez pour un <span className="text-[#000091]">programme.</span> <br />
          Pas pour un <span className="text-[#E1000F] italic">visage.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-3xl text-foreground/70 max-w-3xl font-medium leading-tight"
        >
          100% impartial. Basé sur les engagements réels des candidats. <br />
          <span className="text-foreground font-extrabold underline decoration-[#000091] decoration-4 underline-offset-4">Découvrez qui défend vraiment vos convictions pour 2027.</span>
        </motion.p>

        <div className="pt-8 space-y-6">
          <Link href="/questionnaire" className="group relative inline-flex items-center">
            {/* Pulsing Aura */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-[#000091] rounded-full blur-2xl"
            />

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center text-center gap-4 px-8 md:px-12 py-6 md:py-8 bg-[#000091] text-white rounded-full font-black text-lg md:text-3xl shadow-2xl transition-all h-20 md:h-28"
            >
              Trouver mon vrai match politique (3 min) 🚀
            </motion.div>
          </Link>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-bold text-foreground/30 uppercase tracking-[0.2em]">Gratuit • Anonyme • Sans Pub</p>
            <Link
              href="https://github.com/votre-compte/trouvetoncandidat"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Github size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#1D1D1F]/60">Algorithme 100% Open Source</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="w-full max-w-6xl px-6 py-16 md:py-24 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <ValueCard
            icon={<Scale className="text-[#000091]" size={48} />}
            title="Impartialité Totale"
            description="Aucun algorithme biaisé, aucun parti pris. Seulement des mathématiques et des faits tirés des programmes officiels."
          />
          <ValueCard
            icon={<Ban className="text-[#E1000F]" size={48} />}
            title="Fini le vote 'contre'"
            description="Ne votez plus par dépit ou pour faire barrage. Retrouvez le goût de voter POUR des idées qui vous correspondent."
          />
          <ValueCard
            icon={<MonitorOff className="text-foreground" size={48} />}
            title="Le fond, pas la forme"
            description="Oubliez les petites phrases, les clashs télévisés et le charisme. Ici, seuls les engagements concrets comptent."
          />
        </div>
      </section>

      {/* Social Proof / Trust Footer */}
      <footer className="w-full py-16 bg-gray-50 border-t border-border flex flex-col items-center gap-8 mt-auto">
        <div className="flex flex-wrap justify-center gap-12 px-6">
          <TrustPillar icon={<ShieldCheck size={20} />} text="Données 100% Locales" />
          <TrustPillar icon={<Zap size={20} />} text="Analyse IA Neutre" />
          <TrustPillar icon={<Sparkles size={20} />} text="Projet Citoyen" />
        </div>
        <div className="flex gap-8 text-xs font-black uppercase text-foreground/40 tracking-[0.3em]">
          <Link href="/mentions-legales" className="hover:text-[#000091] transition-colors">Confidentialité</Link>
          <Link href="/mentions-legales" className="hover:text-[#000091] transition-colors">Mentions Légales</Link>
          <a href="#" className="hover:text-[#E1000F] transition-colors">Soutenir le projet</a>
        </div>
        <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.2em]">Fait avec rigueur par des citoyens pour la République française 🇫🇷</p>
      </footer>
    </main>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center space-y-6 p-8"
    >
      <div className="p-6 bg-white rounded-3xl shadow-xl border border-border">{icon}</div>
      <h3 className="text-3xl font-black tracking-tighter">{title}</h3>
      <p className="text-foreground/60 font-medium text-lg leading-relaxed">{description}</p>
    </motion.div>
  );
}

function TrustPillar({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3 text-foreground/40 font-black text-xs uppercase tracking-widest">
      <div className="text-foreground/20">{icon}</div>
      <span>{text}</span>
    </div>
  );
}
