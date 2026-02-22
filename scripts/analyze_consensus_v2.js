const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/master_matrix.json', 'utf8'));
const questions = data.matrix;

const alignments = [];

questions.forEach(q => {
    const scores = Object.entries(q.candidates).map(([id, c]) => ({ id, score: c.score }));
    const scoreMap = {};
    scores.forEach(s => {
        scoreMap[s.score] = scoreMap[s.score] || [];
        scoreMap[s.score].push(s.id);
    });

    Object.entries(scoreMap).forEach(([score, ids]) => {
        if (ids.length >= 2) {
            alignments.push({ id: q.id, theme: q.theme, score: parseFloat(score), candidates: ids });
        }
    });
});

console.log('ALIGNMENTS (2+ candidates):');
alignments.forEach(a => console.log(`- ${a.id} (${a.theme}): ${a.score} [${a.candidates.join(', ')}]`));

const lfiRn = alignments.filter(a => a.candidates.includes('lfi') && a.candidates.includes('rn'));
console.log('\nLFI/RN ALIGNMENTS:');
lfiRn.forEach(a => console.log(`- ${a.id} (${a.theme}): ${a.score}`));
