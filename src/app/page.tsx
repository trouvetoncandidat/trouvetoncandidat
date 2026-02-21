"use client"

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Scale, Ban, MonitorOff, Github, Heart, Coffee } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] flex flex-col items-center overflow-x-hidden w-full">
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

      <header className="w-full max-w-5xl px-6 py-6 md:py-12 flex flex-col items-center text-center space-y-6 md:space-y-8 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-[#000091] font-black text-[9px] md:text-xs uppercase tracking-[0.2em]"
        >
          <Sparkles size={12} />
          <span>Boussole Électorale 2027</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-7xl font-black tracking-tighter leading-[1] text-[#1D1D1F] max-w-4xl"
        >
          Votez pour un <span className="text-[#000091]">programme.</span> <br className="hidden md:block" />
          Pas pour un <span className="text-[#E1000F] italic">visage.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-base md:text-xl text-foreground/70 max-w-2xl font-medium leading-tight md:leading-normal"
        >
          100% impartial. Basé sur les engagements officiels des candidats. <br className="hidden md:block" />
          <span className="text-foreground font-extrabold underline decoration-[#000091] decoration-2 underline-offset-4">Découvrez qui défend vraiment vos convictions.</span>
        </motion.p>

        <div className="pt-2 flex flex-col items-center gap-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/questionnaire">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center text-center px-10 md:px-14 py-4 md:py-5 bg-[#000091] text-white rounded-full font-black text-base md:text-xl shadow-xl transition-all"
              >
                Lancer le test (3 min) 🚀
              </motion.div>
            </Link>

            <Link href="/comparer">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center text-center px-8 md:px-10 py-4 md:py-5 bg-white border-2 border-primary/20 text-primary rounded-full font-black text-base md:text-xl shadow-sm hover:shadow-md transition-all"
              >
                Comparer les candidats ⚖️
              </motion.div>
            </Link>
          </div>

          <div className="flex items-center gap-6 text-[9px] font-bold text-foreground/30 uppercase tracking-[0.1em]">
            <span>Gratuit • Anonyme • Sans Pub</span>
            <Link href="https://github.com/trouvetoncandidat/trouvetoncandidat" target="_blank" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Github size={12} /> Source
            </Link>
          </div>
        </div>
      </header>

      <section className="w-full max-w-5xl px-6 py-4 md:py-6 border-y border-border bg-white/30 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <ValueCard
            icon={<Scale size={20} className="text-[#000091]" />}
            title="Impartialité"
            description="Basé sur les faits."
          />
          <ValueCard
            icon={<Ban size={20} className="text-[#E1000F]" />}
            title="Utilité"
            description="Votez pour des idées."
          />
          <ValueCard
            icon={<MonitorOff size={20} className="text-foreground" />}
            title="Fond & Forme"
            description="Seul l'écrit compte."
          />
        </div>
      </section>

      <footer className="w-full py-8 mt-auto flex flex-col items-center gap-4 border-t border-border/50">
        <Link href="/mentions-legales" className="text-[9px] font-black uppercase text-foreground/40 tracking-[0.2em] hover:text-primary transition-colors">
          Mentions Légales
        </Link>
        <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.1em]">
          🇫🇷 Fait par des citoyens pour la République
        </p>
      </footer>
    </main>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-center md:flex-col md:text-center gap-3 md:gap-2 px-4 py-2 md:py-3 transition-colors group">
      <div className="p-2 bg-white rounded-xl border border-border group-hover:border-primary transition-colors">{icon}</div>
      <div className="flex flex-col md:items-center">
        <h3 className="text-[11px] md:text-sm font-black uppercase tracking-tight">{title}</h3>
        <p className="text-foreground/50 font-medium text-[10px] md:text-xs leading-none">{description}</p>
      </div>
    </div>
  );
}
