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

export default function RadarChart({ userScores, candidateScores }: RadarChartProps) {
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
                backgroundColor: 'rgba(0, 0, 145, 0.2)',
                borderColor: '#000091',
                borderWidth: 3,
                pointBackgroundColor: '#000091',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#000091',
                fill: true,
            },
            {
                label: 'Candidat Matché',
                data: axes.map(axis => candidateScores[axis] || 0),
                backgroundColor: 'rgba(225, 0, 15, 0.05)',
                borderColor: '#E1000F',
                borderWidth: 2,
                borderDash: [5, 5],
                pointBackgroundColor: '#E1000F',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#E1000F',
                fill: true,
            },
        ],
    };

    const options: ChartOptions<'radar'> = {
        scales: {
            r: {
                angleLines: {
                    display: true,
                    color: 'rgba(0,0,0,0.05)',
                },
                grid: {
                    color: 'rgba(0,0,0,0.05)',
                },
                suggestedMin: -1,
                suggestedMax: 1,
                ticks: {
                    display: false,
                    stepSize: 0.5,
                },
                pointLabels: {
                    font: {
                        size: 11,
                        weight: 'bold',
                        family: 'Arial',
                    },
                    color: '#1D1D1F',
                }
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            }
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="w-full h-[350px] md:h-[450px] flex items-center justify-center p-4 bg-white rounded-[2rem] border border-border/50">
            <Radar data={data} options={options} />
        </div>
    );
}
