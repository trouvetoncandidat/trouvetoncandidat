"use client"

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Scale, Ban, MonitorOff, Github } from 'lucide-react';
import TopBanner from '@/components/TopBanner';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] flex flex-col items-center overflow-x-hidden w-full">
      <TopBanner />

      {/* Spacer to push content below fixed header */}
      <div className="h-24 md:h-28" />

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
              <Github size={12} /> Open Source
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

      <Footer />
    </main>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-center md:flex-col md:text-center gap-4 px-4 py-2 md:py-3 transition-colors group">
      <div className="p-2.5 bg-white rounded-xl border border-border group-hover:border-primary transition-colors shrink-0">{icon}</div>
      <div className="flex flex-row items-baseline gap-2 md:flex-col md:items-center min-w-0">
        <h3 className="text-[12px] md:text-sm font-black uppercase tracking-tight whitespace-nowrap">{title}</h3>
        <p className="text-foreground/50 font-medium text-[10px] md:text-xs leading-tight before:content-['•'] before:mr-2 before:opacity-30 flex items-center whitespace-nowrap">
          {description}
        </p>
      </div>
    </div>
  );
}
