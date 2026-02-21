export const POLITICAL_AXES = {
    ECONOMIE: 'économie',
    SOCIAL: 'social',
    ECOLOGIE: 'écologie',
    EUROPE: 'europe',
    SECURITE: 'sécurité',
    IMMIGRATION: 'immigration',
    SERVICES_PUBLICS: 'services publics',
    ENERGIE: 'énergie',
    INSTITUTIONS: 'institutions',
    INTERNATIONAL: 'international',
} as const;

export type PoliticalAxis = typeof POLITICAL_AXES[keyof typeof POLITICAL_AXES];

export interface Proposition {
    content: string;
    axis: PoliticalAxis;
    score: number; // -1 to +1
    justification: string;
    source: string; // e.g. "Page 12"
}

export interface Candidate {
    id: string;
    name: string;
    party: string;
    propositions: Proposition[];
    scores: Record<PoliticalAxis, number>;
}

export interface Question {
    id: number;
    text: string;
    axis: PoliticalAxis;
    reversed: boolean; // if true, "Pour" is -1 and "Contre" is +1
}

export const QUESTIONS: Question[] = [
    { id: 1, text: "Faut-il réduire les impôts sur les entreprises pour stimuler la croissance ?", axis: POLITICAL_AXES.ECONOMIE, reversed: false },
    { id: 2, text: "Faut-il reculer l'âge légal de départ à la retraite ?", axis: POLITICAL_AXES.SOCIAL, reversed: false },
    { id: 3, text: "Faut-il interdire les vols domestiques courts pour protéger l'environnement ?", axis: POLITICAL_AXES.ECOLOGIE, reversed: true },
    { id: 4, text: "La France doit-elle désobéir aux traités européens si nécessaire ?", axis: POLITICAL_AXES.EUROPE, reversed: true },
    { id: 5, text: "Faut-il armer systématiquement toutes les polices municipales ?", axis: POLITICAL_AXES.SECURITE, reversed: false },
    { id: 6, text: "Faut-il régulariser massivement les travailleurs sans-papiers ?", axis: POLITICAL_AXES.IMMIGRATION, reversed: false },
    { id: 7, text: "Faut-il privatiser certaines grandes entreprises publiques ?", axis: POLITICAL_AXES.SERVICES_PUBLICS, reversed: false },
    { id: 8, text: "Faut-il relancer massivement la construction de nouveaux réacteurs nucléaires ?", axis: POLITICAL_AXES.ENERGIE, reversed: false },
    { id: 9, text: "Faut-il instaurer le Référendum d'Initiative Citoyenne (RIC) ?", axis: POLITICAL_AXES.INSTITUTIONS, reversed: true },
    { id: 10, text: "La France doit-elle quitter le commandement intégré de l'OTAN ?", axis: POLITICAL_AXES.INTERNATIONAL, reversed: true },
];
