import { Candidate, PoliticalAxis } from './constants';

export interface MatchResult {
    candidate: Candidate;
    globalMatch: number; // 0 to 100
    axisMatches: Record<PoliticalAxis, number>; // 0 to 100 per axis
}

/**
 * Calcule la compatibilité entre l'utilisateur et tous les candidats.
 * Logique : Différence absolue normalisée, exclusion des axes neutres.
 */
export function calculateMatches(
    userScores: Record<PoliticalAxis, number>,
    candidates: Candidate[]
): MatchResult[] {

    return candidates.map((candidate) => {
        const axisMatches: Record<string, number> = {};
        let totalScoreSum = 0;
        let relevantAxesCount = 0;

        // Parcourir tous les axes du score utilisateur
        for (const [axis, userScore] of Object.entries(userScores)) {
            const polAxis = axis as PoliticalAxis;
            const candidateScore = candidate.scores[polAxis] ?? 0;

            // Règle "Passer" : si userScore est 0, on n'inclut pas dans la moyenne globale
            if (userScore === 0) {
                axisMatches[polAxis] = 50; // Valeur neutre visuelle
                continue;
            }

            // Formule demandée : 1 - (Math.abs(userScore - candidateScore) / 2)
            const diff = Math.abs(userScore - candidateScore);
            const matchLevel = 1 - (diff / 2);
            const matchPercentage = Math.round(matchLevel * 100);

            axisMatches[polAxis] = matchPercentage;
            totalScoreSum += matchPercentage;
            relevantAxesCount++;
        }

        const globalMatch = relevantAxesCount > 0
            ? Math.round(totalScoreSum / relevantAxesCount)
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
    userScores: Record<PoliticalAxis, number>,
    candidates: Candidate[]
): IdealMeasure[] {
    const idealProgram: IdealMeasure[] = [];

    for (const [axis, userScore] of Object.entries(userScores)) {
        const polAxis = axis as PoliticalAxis;
        if (userScore === 0) continue; // On ignore les axes neutres

        let bestMeasure: IdealMeasure | null = null;
        let minDiff = Infinity;

        for (const candidate of candidates) {
            const candidateScore = candidate.scores[polAxis] ?? 0;
            const diff = Math.abs(userScore - candidateScore);

            if (diff < minDiff) {
                minDiff = diff;
                const matchingProp = candidate.propositions.find(p => p.axis === polAxis);
                if (matchingProp) {
                    bestMeasure = {
                        axis: polAxis,
                        content: matchingProp.content,
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
