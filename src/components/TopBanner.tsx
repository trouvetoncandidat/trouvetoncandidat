"use client"

import React from 'react';
import Link from 'next/link';

export default function TopBanner() {
    return (
        <div className="fixed top-0 left-0 w-full z-[100] shadow-sm">
            {/* 1. Ligne Tricolore (République) */}
            <div className="w-full h-1.5 flex">
                <div className="flex-1 bg-[#000091]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#E1000F]" />
            </div>

            {/* 2. Barre de Navigation + Don */}
            <div className="w-full bg-white/95 backdrop-blur-md py-3 px-4 md:px-8 flex justify-between items-center border-b border-black/5">
                {/* Logo + Titre */}
                <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity min-w-0">
                    <img src="/icon" alt="Logo" className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] rounded-lg shadow-sm" />
                    <span className="font-[1000] text-sm md:text-lg uppercase tracking-tighter text-[#1D1D1F] truncate">
                        TrouveTonCandidat.fr
                    </span>
                </Link>

                {/* Demande de Don */}
                <div className="flex items-center gap-2 md:gap-4 ml-4">
                    <a
                        href="https://www.buymeacoffee.com/trouvetoncandidat"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-90 transition-opacity active:scale-95"
                    >
                        {/* Mobile : Texte court */}
                        <img
                            src="https://img.buymeacoffee.com/button-api/?text=Nous soutenir&emoji=&slug=trouvetoncandidat&button_colour=000091&font_colour=ffffff&font_family=Lato&outline_colour=ffffff&coffee_colour=FFDD00"
                            alt="Nous soutenir"
                            className="h-[32px] w-auto md:hidden"
                        />
                        {/* Desktop : Texte complet */}
                        <img
                            src="https://img.buymeacoffee.com/button-api/?text=Soutenir notre action&emoji=&slug=trouvetoncandidat&button_colour=000091&font_colour=ffffff&font_family=Lato&outline_colour=ffffff&coffee_colour=FFDD00"
                            alt="Soutenir notre action"
                            className="h-[40px] w-auto hidden md:block"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}
