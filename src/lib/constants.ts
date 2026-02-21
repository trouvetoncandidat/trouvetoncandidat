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
    SOCIETE: 'société',
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
    id: string;
    theme: string;
    text: string;
    axis: PoliticalAxis;
    reversed: boolean;
}
