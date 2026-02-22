import { Candidate, PoliticalAxis, WeightedScore } from './constants';

export interface MatchResult {
    candidate: Candidate;
    globalMatch: number; // 0 to 100
    axisMatches: Record<PoliticalAxis, number>; // 0 to 100 per axis
}

/**
 * Calcule la compatibilité entre l'utilisateur et tous les candidats.
 * Logique : Moyenne pondérée par l'intensité des convictions de l'utilisateur.
 */
export function calculateMatches(
    userScores: Record<PoliticalAxis, WeightedScore>,
    candidates: Candidate[]
): MatchResult[] {

    return candidates.map((candidate) => {
        const axisMatches: Record<string, number> = {};
        let weightedScoreSum = 0;
        let totalWeight = 0;

        // Parcourir tous les axes du score utilisateur
        for (const [axis, weightedUserScore] of Object.entries(userScores)) {
            const polAxis = axis as PoliticalAxis;
            const { score: userScore, weight } = weightedUserScore;
            const candidateScore = candidate.scores[polAxis] ?? 0;

            // Règle "Neutre" : si l'utilisateur est neutre et que le poids est faible
            if (userScore === 0 && weight <= 0.5) {
                axisMatches[polAxis] = 50;
                continue;
            }

            // Calcul du match sur cet axe
            const diff = Math.abs(userScore - candidateScore);
            const matchLevel = 1 - (diff / 2);
            const matchPercentage = Math.round(matchLevel * 100);

            axisMatches[polAxis] = matchPercentage;

            // Application du poids de l'intensité (matrice de conviction)
            weightedScoreSum += (matchPercentage * weight);
            totalWeight += weight;
        }

        // Moyenne pondérée
        const globalMatch = totalWeight > 0
            ? Math.round(weightedScoreSum / totalWeight)
            : 0;

        return {
            candidate,
            globalMatch,
            axisMatches: axisMatches as Record<PoliticalAxis, number>,
        };
    }).sort((a, b) => b.globalMatch - a.globalMatch);
}

export interface IdealMeasure {
    axis: PoliticalAxis;
    content: string;
    sourceCandidate: string;
    sourceParty: string;
    score: number;
}

/**
 * Génère un programme fictif "Idéal" en piochant les mesures les plus proches
 * du positionnement de l'utilisateur chez les vrais candidats.
 */
export function generateIdealCandidate(
    userScores: Record<PoliticalAxis, WeightedScore>,
    candidates: Candidate[]
): IdealMeasure[] {
    const idealProgram: IdealMeasure[] = [];

    for (const [axis, weightedUserScore] of Object.entries(userScores)) {
        const polAxis = axis as PoliticalAxis;
        const { score: userScore } = weightedUserScore;

        let bestMeasure: IdealMeasure | null = null;
        let minDiff = Infinity;

        for (const candidate of candidates) {
            const candidateScore = candidate.scores[polAxis] ?? 0;
            const diff = Math.abs(userScore - candidateScore);

            if (diff < minDiff) {
                minDiff = diff;
                const justification = candidate.justifications[polAxis];
                if (justification) {
                    bestMeasure = {
                        axis: polAxis,
                        content: justification,
                        sourceCandidate: candidate.name,
                        sourceParty: candidate.party,
                        score: candidateScore
                    };
                }
            }
        }

        if (bestMeasure) {
            idealProgram.push(bestMeasure);
        }
    }

    return idealProgram;
}

/**
 * Détermine un "Badge de Profil" basé sur les scores de l'utilisateur.
 */
export function getPoliticalProfile(scores: Record<PoliticalAxis, WeightedScore>): { title: string; subtitle: string } {
    const eco = scores['economie']?.score || 0;
    const ecoG = scores['ecologie']?.score || 0;
    const eur = scores['europe']?.score || 0;
    const soc = scores['social']?.score || 0;

    let title = "Le Citoyen";
    let subtitle = "En quête de repères";

    if (eco > 0.4 && eur > 0.4) {
        title = "Le Libéral Européen";
        subtitle = "Marché libre et destin commun";
    } else if (eco < -0.4 && soc < -0.4) {
        title = "Le Progressiste Social";
        subtitle = "Solidarité et justice d'État";
    } else if (ecoG < -0.4) {
        title = "L'Éclaireur Écolo";
        subtitle = "La planète avant tout";
    } else if (eur > 0.4) {
        title = "Le Souverainiste";
        subtitle = "La France d'abord";
    } else if (Math.abs(eco) < 0.2 && Math.abs(soc) < 0.2) {
        title = "Le Centriste Pragmatique";
        subtitle = "L'équilibre des solutions";
    } else if (eco > 0.4) {
        title = "L'Économiste";
        subtitle = "Croissance et efficacité";
    } else {
        title = "Le Profil Nuancé";
        subtitle = "Une vision complexe de 2027";
    }

    return { title, subtitle };
}

export type PoliticalZone = {
    id: number;
    label: string;
    range: [number, number];
    color: string;
};

export const POLITICAL_ZONES: PoliticalZone[] = [
    { id: 1, label: "Extrême Gauche", range: [-1.0, -0.71], color: "#b91c1c" },
    { id: 2, label: "Gauche", range: [-0.71, -0.43], color: "#e1000f" },
    { id: 3, label: "Centre-Gauche", range: [-0.43, -0.14], color: "#f87171" },
    { id: 4, label: "Centre", range: [-0.14, 0.14], color: "#94a3b8" },
    { id: 5, label: "Centre-Droit", range: [0.14, 0.43], color: "#60a5fa" },
    { id: 6, label: "Droite", range: [0.43, 0.71], color: "#000091" },
    { id: 7, label: "Extrême Droite", range: [0.71, 1.0], color: "#1e1b4b" },
];

export function getSegmentationZone(score: number): PoliticalZone {
    const zone = POLITICAL_ZONES.find(z => score >= z.range[0] && score <= z.range[1]);
    return zone || POLITICAL_ZONES[3]; // Default to center if not found
}
