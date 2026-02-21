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
/**
 * Détermine un "Badge de Profil" basé sur les scores de l'utilisateur.
 */
export function getPoliticalProfile(scores: Record<PoliticalAxis, number>): { title: string; subtitle: string } {
    const eco = scores['économie'] || 0;
    const ecoG = scores['écologie'] || 0;
    const eur = scores['europe'] || 0;
    const soc = scores['social'] || 0;
    const socie = scores['société'] || 0;

    let title = "Le Citoyen";
    let subtitle = "En quête de repères";

    if (socie < -0.4) {
        title = "Le Progressiste Sociétal";
        subtitle = "Libertés individuelles et nouveaux droits";
    } else if (socie > 0.4) {
        title = "Le Conservateur";
        subtitle = "Défense des traditions et des valeurs";
    } else if (eco > 0.4 && eur > 0.4) {
        title = "Le Libéral Européen";
        subtitle = "Marché libre et destin commun";
    } else if (eco < -0.4 && soc < -0.4) {
        title = "Le Progressiste Social";
        subtitle = "Solidarité et justice d'État";
    } else if (ecoG > 0.4) {
        title = "L'Éclaireur Écolo";
        subtitle = "La planète avant tout";
    } else if (eur < -0.4) {
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
