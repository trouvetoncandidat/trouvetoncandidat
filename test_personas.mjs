
import fs from 'fs';
const questions = JSON.parse(fs.readFileSync('./data/questions.json', 'utf8'));
const candidates = JSON.parse(fs.readFileSync('./data/candidates.json', 'utf8'));

// Logic replicated from src/lib/matchAlgorithm.ts
function calculateMatches(userScores, candidates) {
    return candidates.map((candidate) => {
        const axisMatches = {};
        let weightedScoreSum = 0;
        let totalWeight = 0;

        for (const [axis, weightedUserScore] of Object.entries(userScores)) {
            const { score: userScore, weight } = weightedUserScore;
            const candidateScore = candidate.scores[axis] ?? 0;

            if (userScore === 0 && weight <= 0.5) {
                axisMatches[axis] = 50;
                continue;
            }

            const diff = Math.abs(userScore - candidateScore);
            const matchLevel = 1 - (diff / 2);
            const matchPercentage = Math.round(matchLevel * 100);

            axisMatches[axis] = matchPercentage;
            weightedScoreSum += (matchPercentage * weight);
            totalWeight += weight;
        }

        const globalMatch = totalWeight > 0 ? Math.round(weightedScoreSum / totalWeight) : 0;

        return {
            candidate,
            globalMatch,
            axisMatches,
        };
    }).sort((a, b) => b.globalMatch - a.globalMatch);
}

function simulate(answers) {
    const aggregated = {};
    const weightsAggregated = {};
    const counts = {};

    Object.entries(answers).forEach(([qId, val]) => {
        const questionData = questions.find(item => item.id === qId);
        if (questionData) {
            const actualValue = questionData.reversed ? -val : val;
            const axis = questionData.axis;
            aggregated[axis] = (aggregated[axis] || 0) + actualValue;

            let weight = 0.5;
            const absVal = Math.abs(val);
            if (absVal === 1) weight = 2;
            else if (absVal === 0.5) weight = 1;

            weightsAggregated[axis] = (weightsAggregated[axis] || 0) + weight;
            counts[axis] = (counts[axis] || 0) + 1;
        }
    });

    const finalScores = Object.fromEntries(
        Object.entries(aggregated).map(([axis, sum]) => [
            axis,
            {
                score: sum / counts[axis],
                weight: weightsAggregated[axis] / counts[axis]
            }
        ])
    );

    return calculateMatches(finalScores, candidates);
}

// 1. 100% Left Persona
const leftAnswers = {};
questions.forEach(q => { leftAnswers[q.id] = q.reversed ? 1 : -1; });
const leftResults = simulate(leftAnswers);
console.log("=== 100% LEFT PERSONA ===");
leftResults.slice(0, 3).forEach(r => console.log(`- ${r.candidate.name}: ${r.globalMatch}%`));

// 2. 100% Right Persona
const rightAnswers = {};
questions.forEach(q => { rightAnswers[q.id] = q.reversed ? -1 : 1; });
const rightResults = simulate(rightAnswers);
console.log("\n=== 100% RIGHT PERSONA ===");
rightResults.slice(0, 3).forEach(r => console.log(`- ${r.candidate.name}: ${r.globalMatch}%`));

// 3. 100% Neutral Persona
const neutralAnswers = {};
questions.forEach(q => { neutralAnswers[q.id] = 0; });
const neutralResults = simulate(neutralAnswers);
console.log("\n=== 100% NEUTRAL PERSONA ===");
neutralResults.slice(0, 3).forEach(r => console.log(`- ${r.candidate.name}: ${r.globalMatch}%`));
