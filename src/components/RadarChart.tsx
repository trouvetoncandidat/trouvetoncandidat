"use client"

import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { WeightedScore } from '@/lib/constants';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface RadarChartProps {
    userScores: Record<string, WeightedScore | number>;
    candidateScores: Record<string, number>;
    isExport?: boolean;
}

const AXIS_LABELS: Record<string, string> = {
    economie: 'Économie',
    social: 'Social',
    ecologie: 'Écologie',
    europe: 'Europe',
    securite: 'Sécurité',
    immigration: 'Immigration',
    services_publics: 'Services Publics',
    energie: 'Énergie',
    institutions: 'Institutions',
    international: 'International',
};

export default function RadarChart({ userScores, candidateScores, isExport = false }: RadarChartProps) {
    const axes = Object.keys(AXIS_LABELS);

    const data: ChartData<'radar'> = {
        labels: axes.map(axis => AXIS_LABELS[axis]),
        datasets: [
            {
                label: 'Votre Profil',
                data: axes.map(axis => {
                    const val = userScores[axis];
                    if (typeof val === 'object' && val !== null) {
                        return val.score;
                    }
                    return val || 0;
                }),
                backgroundColor: 'rgba(0, 0, 145, 0.25)',
                borderColor: '#000091',
                borderWidth: isExport ? 6 : 4,
                pointBackgroundColor: '#000091',
                pointBorderColor: '#fff',
                pointRadius: isExport ? 6 : 4,
                fill: true,
            }
        ],
    };

    const options: ChartOptions<'radar'> = {
        scales: {
            r: {
                angleLines: {
                    display: true,
                    color: 'rgba(0,0,0,0.08)',
                    lineWidth: isExport ? 2 : 1.5,
                },
                grid: {
                    color: 'rgba(0,0,0,0.08)',
                    lineWidth: isExport ? 2 : 1.5,
                },
                suggestedMin: -1,
                suggestedMax: 1,
                ticks: {
                    display: false,
                    stepSize: 0.5,
                },
                pointLabels: {
                    font: {
                        size: isExport ? 28 : (typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 14),
                        weight: 'bold',
                        family: 'inherit',
                    },
                    color: '#1D1D1F',
                    padding: isExport ? 25 : 15,
                    backdropColor: 'rgba(255,255,255,0.8)',
                    backdropPadding: 4,
                    borderRadius: 4,
                }
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#000091',
                bodyColor: '#1D1D1F',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: (context) => {
                        const val = context.raw as number;
                        return `${context.dataset.label}: ${val.toFixed(2)}`;
                    }
                }
            }
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Radar
                data={data}
                options={options}
            />
        </div>
    );
}
