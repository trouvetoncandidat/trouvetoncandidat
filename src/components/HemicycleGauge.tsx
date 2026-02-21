"use client"

import React from 'react';
import { motion } from 'framer-motion';

interface HemicycleGaugeProps {
    scoreA: number; // -1 to +1
    scoreB: number; // -1 to +1
    labelLeft: string;
    labelRight: string;
    nameA: string;
    nameB: string;
    themeLabel: string;
}

export default function HemicycleGauge({
    scoreA,
    scoreB,
    labelLeft,
    labelRight,
    nameA,
    nameB,
    themeLabel
}: HemicycleGaugeProps) {

    // Convert -1/1 to 0-180 degrees (but we want Left to be 0 and Right to be 180)
    // -1 -> 0 deg, 0 -> 90 deg, 1 -> 180 deg
    const getPos = (score: number) => {
        const angle = (score + 1) * 90; // -1 -> 0, 0 -> 90, 1 -> 180
        const radius = 80;
        const radian = (angle + 180) * (Math.PI / 180); // Start from left (180 deg in SVG polar)
        const x = 100 + radius * Math.cos(radian);
        const y = 90 + radius * Math.sin(radian);
        return { x, y, angle };
    };

    const posA = getPos(scoreA);
    const posB = getPos(scoreB);

    // Unified size for better comparison
    const sizeA = 7;
    const sizeB = 7;

    return (
        <div className="w-full flex flex-col items-center bg-white rounded-3xl p-6 shadow-sm border border-border/40">
            <div className="w-full flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">{themeLabel}</span>
            </div>

            <div className="relative w-full aspect-[2/1] max-w-[300px]">
                <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
                    {/* Definitions for gradients */}
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#E1000F" />
                            <stop offset="50%" stopColor="#cbd5e1" />
                            <stop offset="100%" stopColor="#000091" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Main Arc */}
                    <path
                        d="M 20 90 A 80 80 0 0 1 180 90"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="opacity-20"
                    />

                    {/* Connection Line (Beam) */}
                    <motion.line
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        x1={posA.x} y1={posA.y}
                        x2={posB.x} y2={posB.y}
                        stroke="currentColor"
                        className="text-primary/10"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                    />

                    {/* Point A */}
                    <motion.circle
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        cx={posA.x} cy={posA.y}
                        r={sizeA}
                        fill="#000091"
                        className="shadow-lg"
                        filter="url(#glow)"
                    />

                    {/* Point B */}
                    <motion.circle
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        cx={posB.x} cy={posB.y}
                        r={sizeB}
                        fill="#E1000F"
                        className="shadow-lg"
                        filter="url(#glow)"
                    />
                </svg>

                {/* Extremes Labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 translate-y-2">
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-secondary/60 max-w-[60px] leading-tight">{labelLeft}</span>
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-primary/60 text-right max-w-[60px] leading-tight">{labelRight}</span>
                </div>
            </div>

            {/* Legend for this gauge */}
            <div className="w-full flex justify-between mt-6 pt-4 border-t border-border/30">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#E1000F]" />
                    <span className="text-[9px] font-black text-foreground/40 uppercase">{nameB.split(' ').pop()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-foreground/40 uppercase">{nameA.split(' ').pop()}</span>
                    <div className="w-2 h-2 rounded-full bg-[#000091]" />
                </div>
            </div>
        </div>
    );
}
