"use client"

import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full py-12 mt-auto flex flex-col items-center border-t border-border/50 bg-white/30 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 text-center px-6">
                {/* Ligne du haut : Grand & Solennel */}
                <p className="text-[11px] md:text-xs font-black text-foreground/30 uppercase tracking-[0.3em] flex items-center gap-2">
                    🇫🇷 Fait par des citoyens pour la République
                </p>

                {/* Ligne du milieu : Lien discret */}
                <Link href="/mentions-legales" className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors hover:underline underline-offset-4">
                    Mentions Légales
                </Link>

                {/* Ligne du bas : Copyright petit */}
                <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">
                    2026 - TrouveTonCandidat - Tous droits réservés
                </p>
            </div>
        </footer>
    );
}
