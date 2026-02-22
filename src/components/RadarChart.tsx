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
import { getSegmentationZone } from '@/lib/matchAlgorithm';

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

export default function RadarChart({ userScores, isExport = false }: RadarChartProps) {
    const axes = Object.keys(AXIS_LABELS);

    // Calculate global zone for color
    const scoresList = Object.values(userScores).map(s => typeof s === 'object' ? s.score : s);
    const avg = scoresList.reduce((a, b) => a + b, 0) / (scoresList.length || 1);
    const zone = getSegmentationZone(avg);

    // Convert hex to rgba for transparency
    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const radarColor = zone.color;
    const radarBg = hexToRgba(radarColor, 0.3);

    const data: ChartData<'radar'> = {
        labels: axes.map(axis => AXIS_LABELS[axis]),
        datasets: [
            {
                label: 'Force de Conviction',
                data: axes.map(axis => {
                    const val = userScores[axis];
                    const score = typeof val === 'object' && val !== null ? val.score : (val || 0);
                    return Math.abs(score);
                }),
                backgroundColor: radarBg,
                borderColor: radarColor,
                borderWidth: isExport ? 6 : 4,
                pointBackgroundColor: radarColor,
                pointBorderColor: '#fff',
                pointRadius: isExport ? 6 : 4,
                fill: true,
                tension: 0.15, // Smooth but not too loose
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
                suggestedMin: 0,
                suggestedMax: 1,
                ticks: {
                    display: false,
                    stepSize: 0.25,
                },
                pointLabels: {
                    font: {
                        size: isExport ? 28 : (typeof window !== 'undefined' && window.innerWidth < 768 ? 9 : 11),
                        weight: 'bold',
                        family: 'inherit',
                    },
                    color: '#1D1D1F',
                    padding: isExport ? 25 : 10,
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
                titleColor: radarColor,
                bodyColor: '#1D1D1F',
                borderColor: radarColor,
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: (context) => {
                        const axis = axes[context.dataIndex];
                        const val = userScores[axis];
                        const score = typeof val === 'object' && val !== null ? val.score : (val || 0);
                        const intensity = Math.abs(score).toFixed(2);
                        const direction = score < 0 ? "Gauche" : score > 0 ? "Droite" : "Neutre";
                        return `Intensité: ${intensity} (Profil: ${direction})`;
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
