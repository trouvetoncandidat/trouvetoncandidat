const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/master_matrix.json', 'utf8'));
const questions = data.matrix;

const consensusQs = [];
const frontCommunQs = [];

questions.forEach(q => {
    const scores = Object.entries(q.candidates).map(([id, c]) => ({ id, score: c.score }));
    const scoreMap = {};
    scores.forEach(s => {
        scoreMap[s.score] = (scoreMap[s.score] || 0) + 1;
    });

    // Consensus: 3+ candidates same score
    const consensusValue = Object.entries(scoreMap).find(([val, count]) => count >= 3);
    if (consensusValue) {
        consensusQs.push({ id: q.id, theme: q.theme, text: q.text, score: parseFloat(consensusValue[0]), count: consensusValue[1] });
    }

    // Front Commun (LFI & RN)
    const lfi = q.candidates['lfi'];
    const rn = q.candidates['rn'];
    if (lfi && rn && lfi.score === rn.score) {
        frontCommunQs.push({ id: q.id, theme: q.theme, text: q.text, score: lfi.score });
    }
});

console.log('CONSENSUS BLOCKS:');
consensusQs.forEach(c => console.log(`- ${c.id} (${c.theme}): ${c.score} [${c.count} candidates]`));

console.log('\nFRONT COMMUN (LFI/RN):');
frontCommunQs.forEach(f => console.log(`- ${f.id} (${f.theme}): ${f.score}`));

const themeClivage = {};
questions.forEach(q => {
    const scores = Object.values(q.candidates).map(c => c.score);
    const spread = Math.max(...scores) - Math.min(...scores);
    if (!themeClivage[q.theme]) themeClivage[q.theme] = { totalSpread: 0, count: 0 };
    themeClivage[q.theme].totalSpread += spread;
    themeClivage[q.theme].count++;
});

const sortedThemes = Object.entries(themeClivage)
    .map(([theme, data]) => ({ theme, avgSpread: data.totalSpread / data.count }))
    .sort((a, b) => b.avgSpread - a.avgSpread);

console.log('\nTHEME CLIVAGE:');
sortedThemes.forEach(t => console.log(`- ${t.theme}: ${t.avgSpread.toFixed(2)}`));
