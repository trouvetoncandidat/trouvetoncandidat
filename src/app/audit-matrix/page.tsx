"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { MasterMatrix, Candidate, MatrixQuestion, PoliticalAxis } from '@/lib/constants';
import { calculateAffinity } from '@/lib/matchAlgorithm';
import TopBanner from '@/components/TopBanner';
import Footer from '@/components/Footer';
import {
    ShieldCheck,
    Search,
    Filter,
    AlertTriangle,
    CheckCircle2,
    User,
    Trophy,
    Info,
    ArrowLeftRight,
    X,
    FileText,
    MessageSquareQuote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectedCell {
    question: MatrixQuestion;
    candidate: Candidate;
    score: number;
    justification: string;
}

export default function AuditMatrixPage() {
    const [matrix, setMatrix] = useState<MasterMatrix | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTheme, setFilterTheme] = useState('Tous');
    const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);

    // Sandbox State
    const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

    useEffect(() => {
        async function fetchData() {
            const matrixRes = await fetch('/master_matrix.json');
            const data: MasterMatrix = await matrixRes.json();
            setMatrix(data);
        }
        fetchData();
    }, []);

    const filteredMatrix = useMemo(() => {
        if (!matrix) return [];
        return matrix.matrix.filter(q => {
            const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTheme = filterTheme === 'Tous' || q.theme === filterTheme;
            return matchesSearch && matchesTheme;
        });
    }, [matrix, searchTerm, filterTheme]);

    const podium = useMemo(() => {
        if (!matrix) return [];
        return calculateAffinity(userAnswers, matrix, matrix.candidates).slice(0, 3);
    }, [matrix, userAnswers]);

    if (!matrix) return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="mb-8 opacity-20">
                <ShieldCheck size={120} />
            </motion.div>
            <h2 className="text-2xl font-black uppercase tracking-[0.3em] animate-pulse">Initialisation du Socle de Vérité...</h2>
        </div>
    );

    const themes = ["Tous", ...new Set(matrix.matrix.map(q => q.theme))];

    const getScoreColor = (score: number) => {
        if (score <= -0.8) return "bg-[#E1000F] text-white border-transparent shadow-lg shadow-red-500/20";
        if (score <= -0.4) return "bg-[#F87171] text-white border-transparent";
        if (score >= 0.8) return "bg-[#000091] text-white border-transparent shadow-lg shadow-blue-500/20";
        if (score >= 0.4) return "bg-[#60A5FA] text-white border-transparent";
        return "bg-slate-100 text-slate-500 border-slate-200";
    };

    return (
        <main className="min-h-screen bg-[#F1F5F9] pt-24 pb-12 font-sans selection:bg-primary selection:text-white relative overflow-x-hidden">
            <TopBanner />

            {/* BACKGROUND DECORATION */}
            <div className="fixed top-0 right-0 w-1/3 h-screen bg-gradient-to-l from-primary/5 to-transparent pointer-events-none -z-10" />

            <div className="max-w-[1600px] mx-auto px-6 space-y-8">

                {/* 1. HEADER & PODIUM */}
                <div className="flex flex-col xl:flex-row gap-8 items-stretch justify-between">
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-6">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-4 bg-slate-900 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <ShieldCheck size={40} className="relative z-10" />
                            </motion.div>
                            <div className="space-y-1">
                                <h1 className="text-5xl font-[1000] uppercase tracking-tighter leading-none text-slate-900">
                                    Matrix <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-4">Viewer</span>
                                </h1>
                                <p className="text-slate-500 font-bold text-sm tracking-[0.3em] uppercase flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Statut : Socle de Vérité v{matrix.metadata.version} • Sync Live
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Simulation Podium */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-xl flex items-center gap-8 min-w-[500px]"
                    >
                        <div className="flex items-center gap-4 border-r border-slate-100 pr-8">
                            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                <Trophy size={24} />
                            </div>
                            <div className="text-left">
                                <span className="font-black text-[10px] uppercase tracking-widest text-slate-400 block leading-tight">Moteur de</span>
                                <span className="font-black text-xs uppercase tracking-tight text-slate-900 block">Match Test</span>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-around items-end h-16">
                            {podium.map((p, i) => (
                                <motion.div
                                    key={p.candidate.id}
                                    layout
                                    className="flex flex-col items-center gap-2"
                                >
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: i === 0 ? 40 : i === 1 ? 30 : 20 }}
                                        className={`w-1 shadow-inner rounded-t-full ${i === 0 ? 'bg-primary' : 'bg-slate-300'}`}
                                    />
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-slate-300'}`} />
                                        <span className="text-[10px] font-black uppercase text-slate-900 whitespace-nowrap">{p.candidate.name.split(' ')[0]}</span>
                                        <span className="text-[10px] font-black text-primary">{p.globalMatch}%</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <button
                            onClick={() => setUserAnswers({})}
                            className="p-3 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-100"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>

                {/* 2. FILTERS & SEARCH */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Filtrer par question ID ou mot-clé..."
                            className="w-full pl-14 pr-6 py-4 rounded-3xl border-2 border-white bg-white/60 backdrop-blur-md focus:border-primary/20 focus:bg-white outline-none shadow-sm font-bold text-slate-700 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2 flex gap-4">
                        <div className="flex-1 flex items-center gap-3 bg-white/60 backdrop-blur-md px-6 py-4 rounded-3xl border-2 border-white shadow-sm">
                            <Filter size={18} className="text-slate-400" />
                            <select
                                className="bg-transparent outline-none font-black text-slate-700 text-sm py-1 cursor-pointer pr-4 w-full uppercase tracking-widest"
                                value={filterTheme}
                                onChange={(e) => setFilterTheme(e.target.value)}
                            >
                                {themes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-6 px-8 py-4 rounded-3xl border-2 border-white bg-slate-50/50 backdrop-blur-md shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[10px]">🤝</div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alignement (2 items)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-amber-500 shadow-sm flex items-center justify-center text-[10px]">🤝</div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Consensus (3+ items)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MAIN PIVOT TABLE */}
                <div className="bg-white rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden mb-12">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr className="bg-slate-900">
                                    <th className="p-8 font-black uppercase text-[11px] tracking-[0.3em] text-white w-[450px] border-r border-white/5">
                                        Critères & Polarité
                                    </th>
                                    {matrix.candidates.map(c => (
                                        <th key={c.id} className="p-8 font-black uppercase text-[10px] tracking-[0.2em] text-white/60 text-center border-r border-white/5 bg-slate-800/50">
                                            {c.name}
                                        </th>
                                    ))}
                                    <th className="p-8 font-black uppercase text-[11px] tracking-[0.3em] text-white text-center bg-primary">
                                        Simulator
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMatrix.map((q, idx) => (
                                    <tr key={q.id} className={`group ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-100/50 hover:bg-blue-50/30 transition-colors`}>
                                        <td className="p-8 space-y-4 border-r border-slate-100">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest leading-none">
                                                    {q.id}
                                                </span>
                                                <span className="px-3 py-1 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest leading-none">
                                                    {q.theme}
                                                </span>
                                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 border leading-none ${q.reversed ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                    <ArrowLeftRight size={12} />
                                                    {q.reversed ? 'REVERSED' : 'DIRECT'}
                                                </span>
                                            </div>
                                            <p className="text-base font-black text-slate-800 leading-tight pr-4">
                                                {q.text}
                                            </p>
                                        </td>

                                        {matrix.candidates.map(c => {
                                            const entry = q.candidates[c.id];
                                            const score = entry?.score || 0;

                                            // Calcul du consensus sur cette ligne
                                            const scoreFrequencies: Record<number, number> = {};
                                            Object.values(q.candidates).forEach(cand => {
                                                scoreFrequencies[cand.score] = (scoreFrequencies[cand.score] || 0) + 1;
                                            });
                                            const isAligned = scoreFrequencies[score] >= 2;
                                            const isConsensus = scoreFrequencies[score] >= 3;

                                            return (
                                                <td key={c.id} className="p-0 border-r border-slate-100 relative group/cell">
                                                    <button
                                                        onClick={() => setSelectedCell({ question: q, candidate: c, score, justification: entry?.justification || "" })}
                                                        className="h-full w-full p-6 flex flex-col items-center justify-center transition-all duration-300 relative"
                                                    >
                                                        <motion.div
                                                            whileHover={{ scale: 1.15 }}
                                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-[1000] text-lg border-2 shadow-sm transition-all relative
                                                                ${getScoreColor(score)}
                                                                ${isAligned ? 'ring-2 ring-primary/10' : ''}
                                                            `}
                                                        >
                                                            {score > 0 ? `+${score}` : score === 0 ? '0' : score}

                                                            {isAligned && (
                                                                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-[10px]
                                                                    ${isConsensus ? 'bg-amber-500 text-white' : 'bg-white text-primary'}
                                                                `}>
                                                                    🤝
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                        {entry?.justification && (
                                                            <div className="absolute top-2 right-2 opacity-0 group-hover/cell:opacity-100 transition-opacity">
                                                                <FileText size={12} className="text-slate-300" />
                                                            </div>
                                                        )}
                                                    </button>
                                                </td>
                                            );
                                        })}

                                        {/* SANDBOX CELL */}
                                        <td className="p-6 bg-primary/[0.01] border-l-2 border-primary/10">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-center gap-1">
                                                    {[-1, -0.5, 0, 0.5, 1].map((val) => (
                                                        <button
                                                            key={val}
                                                            onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: val }))}
                                                            className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all border-2
                                                                ${userAnswers[q.id] === val
                                                                    ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-110 z-10'
                                                                    : 'bg-white text-slate-400 border-slate-100 hover:border-primary/30'
                                                                }
                                                            `}
                                                        >
                                                            {val === 0 ? '0' : val > 0 ? `+${val}` : val}
                                                        </button>
                                                    ))}
                                                </div>
                                                {userAnswers[q.id] !== undefined && (
                                                    <button
                                                        onClick={() => {
                                                            const newAnswers = { ...userAnswers };
                                                            delete newAnswers[q.id];
                                                            setUserAnswers(newAnswers);
                                                        }}
                                                        className="text-[9px] font-black uppercase text-red-400 hover:text-red-500 transition-colors py-1 bg-red-50/50 rounded-lg border border-red-100"
                                                    >
                                                        Reset Question
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 4. JUSTIFICATION SIDE PANEL (INSPECTOR) */}
            <AnimatePresence>
                {selectedCell && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCell(null)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-screen w-full max-w-lg bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-[101] p-10 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-primary text-white rounded-[1.5rem] shadow-xl shadow-primary/20">
                                        <MessageSquareQuote size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-[1000] tracking-tighter uppercase leading-none text-slate-900">Inspecteur</h2>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Justification du socle</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCell(null)}
                                    className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-[1.2rem] transition-all border border-slate-100"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 space-y-10 overflow-y-auto pr-4 scrollbar-hide">
                                {/* Header Info */}
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Candidat</span>
                                            <p className="text-xl font-black text-slate-900">{selectedCell.candidate.name}</p>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{selectedCell.candidate.party}</p>
                                        </div>
                                        <div className="ml-auto flex items-center gap-4">
                                            <div className="h-12 w-px bg-slate-200" />
                                            <div className="text-center">
                                                <span className="text-[10px] font-black uppercase text-slate-400 block">Score</span>
                                                <span className={`text-2xl font-[1000] ${selectedCell.score < 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                                    {selectedCell.score > 0 ? `+${selectedCell.score}` : selectedCell.score}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white rounded-[2rem] border-2 border-slate-100 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest leading-none">
                                                {selectedCell.question.id}
                                            </span>
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{selectedCell.question.theme}</span>
                                        </div>
                                        <p className="text-xl font-black text-slate-900 leading-tight">
                                            {selectedCell.question.text}
                                        </p>
                                    </div>
                                </div>

                                {/* The Quote */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-4">
                                        <span className="w-8 h-[2px] bg-slate-100" /> Citation Officielle
                                    </h4>
                                    <div className="relative group">
                                        <div className="absolute -left-2 top-0 bottom-0 w-2 bg-primary/20 rounded-full" />
                                        <p className="text-2xl md:text-3xl font-black italic text-slate-800 leading-[1.3] px-6">
                                            &ldquo;{selectedCell.justification || "Aucune citation disponible pour ce candidat sur ce sujet spécifique."}&rdquo;
                                        </p>
                                        <div className="mt-8 flex items-center justify-end px-6">
                                            <p className="text-[11px] font-black uppercase text-primary tracking-widest">
                                                — Programme Officiel 2027
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedCell(null)}
                                className="mt-10 w-full p-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all"
                            >
                                Fermer l'Inspecteur
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
