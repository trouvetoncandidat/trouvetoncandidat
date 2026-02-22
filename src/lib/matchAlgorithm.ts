import { Candidate, PoliticalAxis, WeightedScore, MasterMatrix } from './constants';

export interface MatchResult {
    candidate: Candidate;
    globalMatch: number; // 0 to 100
    axisMatches: Record<PoliticalAxis, number>; // 0 to 100 per axis
}

/**
 * NOUVEAU : Référentiel de Vérité (Atomic Match)
 * Calcule l'affinité question par question en utilisant la Master Matrix.
 */
export function calculateAffinity(
    userAnswers: Record<string, number>,
    masterMatrix: MasterMatrix,
    candidates: Candidate[]
): MatchResult[] {
    const results = candidates.map(candidate => {
        let totalAffinity = 0;
        let totalWeight = 0;
        const axisMatches: Record<string, number> = {};
        const axisTotals: Record<string, { sum: number; count: number; weight: number }> = {};

        masterMatrix.matrix.forEach(q => {
            const userChoice = userAnswers[q.id];
            if (userChoice === undefined) return;

            const candidateEntry = q.candidates[candidate.id];
            if (!candidateEntry) return;

            // Poids basé sur l'intensité du choix de l'utilisateur (0.5 pour Neutre, 2 pour D'accord/Contre)
            let weight = 0.5;
            const absVal = Math.abs(userChoice);
            if (absVal === 1) weight = 2;
            else if (absVal === 0.5) weight = 1;

            // Conversion du score axe du candidat en équivalent "choix"
            const candidateChoice = q.reversed ? -candidateEntry.score : candidateEntry.score;

            // Calcul de l'affinité atomique
            const distance = Math.abs(userChoice - candidateChoice);
            const affinity = 1 - (distance / 2);

            totalAffinity += (affinity * weight);
            totalWeight += weight;

            // Agrégation par axe
            if (!axisTotals[q.axis]) axisTotals[q.axis] = { sum: 0, count: 0, weight: 0 };
            axisTotals[q.axis].sum += (affinity * weight);
            axisTotals[q.axis].weight += weight;
            axisTotals[q.axis].count++;
        });

        // Calcul des scores par axe
        Object.entries(axisTotals).forEach(([axis, data]) => {
            axisMatches[axis] = data.weight > 0
                ? Math.round((data.sum / data.weight) * 100)
                : 50;
        });

        return {
            candidate,
            globalMatch: totalWeight > 0 ? Math.round((totalAffinity / totalWeight) * 100) : 0,
            axisMatches: axisMatches as Record<PoliticalAxis, number>
        };
    });

    return results.sort((a, b) => b.globalMatch - a.globalMatch);
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
 * Génère un programme fictif "Idéal" (Utopie)
 * En piochant les mesures les plus proches des choix de l'utilisateur dans la Matrix.
 */
export function generateIdealCandidate(
    userAnswers: Record<string, number>,
    masterMatrix: MasterMatrix,
    candidates: Candidate[]
): IdealMeasure[] {
    const idealProgram: IdealMeasure[] = [];
    // On veut une seule mesure "phare" par axe politique
    const bestMeasuresPerAxis: Record<string, { affinity: number; measure: IdealMeasure }> = {};

    masterMatrix.matrix.forEach(q => {
        const userChoice = userAnswers[q.id];
        if (userChoice === undefined) return;

        candidates.forEach(candidate => {
            const entry = q.candidates[candidate.id];
            if (!entry || !entry.justification) return;

            const candidateChoice = q.reversed ? -entry.score : entry.score;
            const distance = Math.abs(userChoice - candidateChoice);
            const affinity = 1 - (distance / 2);

            // Si c'est le meilleur match pour cet axe jusqu'à présent
            if (!bestMeasuresPerAxis[q.axis] || affinity > bestMeasuresPerAxis[q.axis].affinity) {
                bestMeasuresPerAxis[q.axis] = {
                    affinity,
                    measure: {
                        axis: q.axis,
                        content: entry.justification,
                        sourceCandidate: candidate.name,
                        sourceParty: candidate.party,
                        score: entry.score
                    }
                };
            }
        });
    });

    // Transformer la map en tableau ordonné
    Object.values(bestMeasuresPerAxis).forEach(val => {
        idealProgram.push(val.measure);
    });

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
    { id: 1, label: "Gauche Radicale", range: [-1.0, -0.85], color: "#b91c1c" },
    { id: 2, label: "Gauche", range: [-0.85, -0.6], color: "#e1000f" },
    { id: 3, label: "Centre-Gauche", range: [-0.6, -0.15], color: "#f87171" },
    { id: 4, label: "Centre", range: [-0.15, 0.15], color: "#94a3b8" },
    { id: 5, label: "Centre-Droit", range: [0.15, 0.6], color: "#60a5fa" },
    { id: 6, label: "Droite", range: [0.6, 0.85], color: "#000091" },
    { id: 7, label: "Droite Nationale", range: [0.85, 1.0], color: "#1e1b4b" },
];

export function getSegmentationZone(score: number): PoliticalZone {
    const zone = POLITICAL_ZONES.find(z => score >= z.range[0] && score <= z.range[1]);
    return zone || POLITICAL_ZONES[3]; // Default to center if not found
}
