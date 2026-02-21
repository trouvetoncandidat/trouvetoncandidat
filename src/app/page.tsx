import Link from 'next/link';
import { Vote, Shield, Zap, Search } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center">
      {/* French Top Bar */}
      <div className="w-full h-1 gradient-french" />

      <header className="w-full max-w-6xl px-6 py-24 md:py-32 space-y-12 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary text-primary text-sm font-bold uppercase tracking-wider">
            Élections Présidentielles 2027
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Trouve Ton <br />
            <span className="text-primary">Candidat Idéal.</span>
          </h1>

          <p className="text-xl md:text-2xl text-foreground/70 max-w-xl leading-relaxed">
            La plateforme citoyenne pour comparer les programmes de manière <span className="text-foreground font-bold underline decoration-secondary decoration-2">neutre</span> et <span className="text-foreground font-bold underline decoration-primary decoration-2">anonyme</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/questionnaire"
              className="px-8 py-4 bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-colors shadow-md text-center"
            >
              Lancer le comparateur
            </Link>
            <button className="px-8 py-4 border-2 border-primary text-primary font-bold text-lg hover:bg-primary/5 transition-colors text-center">
              Consulter les programmes
            </button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md">
          <div className="french-card p-8 space-y-6">
            <div className="flex items-center gap-3 text-primary font-bold">
              <Search size={20} />
              <span>Transparence Totale</span>
            </div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Toutes les données proviennent exclusivement des professions de foi officielles. Chaque score est justifié par une citation directe du programme candidat.
            </p>
            <div className="h-px bg-border w-full" />
            <div className="flex items-center gap-3 text-secondary font-bold">
              <Shield size={20} />
              <span>Anonymat Garanti</span>
            </div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Aucun cookie, aucun stockage serveur. Vos choix restent dans votre navigateur.
            </p>
          </div>
        </div>
      </header>

      <section className="w-full bg-accent py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<Shield className="text-primary" />}
            title="Souveraineté des données"
            description="L'application fonctionne en local. Vos convictions ne sont pas des marchandises."
          />
          <FeatureCard
            icon={<Zap className="text-secondary" />}
            title="Analyse Objective"
            description="Une intelligence artificielle au service de la neutralité pour décrypter les programmes."
          />
          <FeatureCard
            icon={<Vote className="text-primary" />}
            title="Engagement Citoyen"
            description="Outil open-source pour éclairer le vote des électeurs de 2027."
          />
        </div>
      </section>

      <footer className="w-full py-12 border-t border-border px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-foreground/50 text-sm font-medium">
          <div className="flex items-center gap-4">
            <span className="font-bold text-primary">TrouveTonCandidat.fr</span>
            <span>© 2026 - Outil Indépendant</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Méthodologie</a>
            <a href="#" className="hover:text-primary transition-colors">Code Source</a>
            <a href="#" className="hover:text-primary transition-colors">Accessibilité</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 flex items-center justify-center bg-white border border-border shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="text-foreground/60 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
