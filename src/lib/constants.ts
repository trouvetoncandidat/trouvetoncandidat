export const POLITICAL_AXES = {
    ECONOMIE: 'economie',
    SOCIAL: 'social',
    ECOLOGIE: 'ecologie',
    EUROPE: 'europe',
    SECURITE: 'securite',
    IMMIGRATION: 'immigration',
    SERVICES_PUBLICS: 'services_publics',
    ENERGIE: 'energie',
    INSTITUTIONS: 'institutions',
    INTERNATIONAL: 'international',
} as const;

export type PoliticalAxis = typeof POLITICAL_AXES[keyof typeof POLITICAL_AXES];

export const AXIS_EXTREMES: Record<PoliticalAxis, { left: string; right: string }> = {
    economie: { left: "Interventionnisme", right: "Libéralisme" },
    social: { left: "Solidarité", right: "Responsabilité" },
    ecologie: { left: "Planification", right: "Pragmatisme" },
    europe: { left: "Fédéralisme", right: "Souverainisme" },
    securite: { left: "Prévention", right: "Fermeté" },
    immigration: { left: "Accueil", right: "Contrôle" },
    services_publics: { left: "Renforcement", right: "Optimisation" },
    energie: { left: "Renouvelables", right: "Nucléaire" },
    institutions: { left: "Parlementarisme", right: "Présidentnalisme" },
    international: { left: "Multilatéralisme", right: "Indépendance" },
};

export interface WeightedScore {
    score: number;
    weight: number;
}

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
    scores: Record<string, number>;
    justifications: Record<string, string>;
    description: string;
    website?: string;
}

export interface Question {
    id: string;
    theme: string;
    text: string;
    axis: PoliticalAxis;
    reversed: boolean;
}
