import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { POLITICAL_AXES, PoliticalAxis } from '../lib/constants';

// For execution in Node environment
// Needs GOOGLE_AI_API_KEY in environment
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

async function extractTextFromPDF(pdfPath: string) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text;
}

async function analyzeProgram(candidateName: string, text: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Tu es Camille, experte en sciences politiques. Analyse le programme électoral de ${candidateName}.
    
    OBJECTIF : Extraire les propositions concrètes et les classer selon 10 axes thématiques.
    
    AXES :
    ${Object.values(POLITICAL_AXES).join(', ')}
    
    RÈGLES DE SCORING (-1 à +1) :
    - Économie : -1 (Interventionnisme) <-> +1 (Libéralisme)
    - Social : -1 (Acquis sociaux) <-> +1 (Réformes structurelles)
    - Écologie : -1 (Décroissance) <-> +1 (Croissance verte)
    - Europe : -1 (Souverainisme) <-> +1 (Fédéralisme)
    - Sécurité : -1 (Prévention) <-> +1 (Répression)
    - Immigration : -1 (Fermeté) <-> +1 (Ouverture)
    - Services Publics : -1 (Renforcement) <-> +1 (Privatisation)
    - Énergie : -1 (100% Renouvelable) <-> +1 (Pro-Nucléaire)
    - Institutions : -1 (6ème Rép / RIC) <-> +1 (Statut Quo)
    - International : -1 (Isolationnisme) <-> +1 (Atlantisme / Multilatéralisme)

    INSTRUCTIONS :
    1. Sois neutre et factuel.
    2. Pour chaque proposition, donne : le texte source, l'axe associé, un score entre -1 et +1, et une justification courte.
    3. Retourne uniquement un JSON valide sous la forme :
    {
      "propositions": [
        { "content": "...", "axis": "...", "score": 0.5, "justification": "...", "source": "Page X" }
      ]
    }

    TEXTE DU PROGRAMME :
    ${text.substring(0, 30000)} // Limite pour Gemini Flash
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text().replace(/```json|```/g, ''));
}

async function main() {
    const programsDir = path.join(process.cwd(), 'data/programs');
    const files = fs.readdirSync(programsDir).filter(f => f.endsWith('.pdf'));

    console.log(`🚀 Analyse de ${files.length} programmes...`);

    const allCandidates = [];

    for (const file of files) {
        const candidateName = file.replace('.pdf', '');
        console.log(`📄 Lecture de : ${candidateName}`);

        const text = await extractTextFromPDF(path.join(programsDir, file));
        const analysis = await analyzeProgram(candidateName, text);

        allCandidates.push({
            id: candidateName.toLowerCase().replace(/\s+/g, '-'),
            name: candidateName,
            propositions: analysis.propositions,
            // On calculera le score moyen par axe plus tard
        });
    }

    fs.writeFileSync(
        path.join(process.cwd(), 'data/candidates.json'),
        JSON.stringify(allCandidates, null, 2)
    );

    console.log('✅ Ingestion terminée. Données enregistrées dans data/candidates.json');
}

// main().catch(console.error); // Commented out to avoid auto-run without API key
