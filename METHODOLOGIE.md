# Méthodologie de Calcul - TrouveTonCandidat.fr

Pour garantir une expérience transparente et impartiale, cette page détaille la méthodologie scientifique et technique utilisée par TrouveTonCandidat.fr pour calculer vos affinités politiques.

---

## 1. Philosophie du projet
TrouveTonCandidat.fr est un outil citoyen dont le but est de replacer les **idées** au cœur du débat démocratique. Nous croyons que le vote devrait être basé sur les propositions concrètes et les visions de société, plutôt que sur l'image médiatique ou la personnalité des candidats. Le projet observe une **neutralité absolue** : aucune pondération humaine n'est appliquée pour favoriser un candidat ou un courant de pensée.

## 2. Origine des données
Toutes les données utilisées (questions, propositions et scores des candidats) proviennent **exclusivement des programmes officiels** publiés par les partis et candidats pour l'élection présidentielle de 2027.

Afin de garantir l'absence de biais humain lors de l'extraction, nous utilisons une technologie d'IA (**NotebookLM**) pour analyser les documents sources. L'IA extrait les positions des candidats sur chaque thématique sans interprétation subjective, se basant uniquement sur le texte brut des programmes.

## 3. Le Système des 10 Axes
Nous modélisons l'espace politique sur **10 axes thématiques** fondamentaux (Économie, Social, Écologie, Europe, Sécurité, Immigration, Services Publics, Énergie, Institutions, International).

Chaque axe est représenté sur une échelle allant de **-1 à +1** :
*   **Score -1** : Aligne le profil avec le bloc de Gauche / Écologiste / Progressiste / Interventionniste.
*   **Score +1** : Aligne le profil avec le bloc de Droite / Libéral / Conservateur / Souverainiste.

## 4. Algorithme de Calcul

### Conversion des réponses
Chaque réponse de l'utilisateur est convertie en une valeur numérique brute :
*   **D'accord** : 1
*   **Plutôt D'accord** : 0.5
*   **Neutre** : 0
*   **Plutôt Contre** : -0.5
*   **Contre** : -1

### Rôle de la Polarité (Reversed)
Chaque question possède une polarité intrinsèque (son "orientation").
*   Si une question est orientée "Gauche" (ex: "Faut-il taxer l'ISF ?") et que vous répondez **« D'accord » (1)**, l'algorithme inverse la valeur pour obtenir un score de **-1** (votre positionnement sur l'axe).
*   Si la question est orientée "Droite" et que vous répondez **« D'accord » (1)**, la valeur reste **1**.
Ce mécanisme permet de poser des questions variées tout en normalisant le résultat final sur l'échelle -1 / +1.

### Comparaison (Match)
Le calcul de compatibilité avec un candidat est basé sur la **Distance Euclidienne Normalisée** sur chaque axe :
`Match = 1 - ( |Position Utilisateur - Position Candidat| / 2 )`

*   Si vous et le candidat êtes à l'opposé (-1 vs 1), l'écart est de 2, le match est de **0%**.
*   Si vos positions sont identiques, l'écart est de 0, le match est de **100%**.
Le score global est la moyenne des pourcentages obtenus sur les axes pour lesquels vous avez exprimé un avis (les réponses "Neutre" sont exclues de la moyenne pour ne pas fausser le résultat).

## 5. Calcul du Candidat Idéal
La section "Mon Utopie" ou "Mon Programme Idéal" n'est pas un candidat existant. C'est une construction mathématique qui parcourt les 10 axes et sélectionne, pour chaque thématique, la proposition du candidat réel qui se rapproche le plus de votre score spécifique sur cet axe. Cela permet de visualiser quel serait votre programme "sur mesure" pioché dans l'offre politique réelle.

## 6. Confidentialité et Éthique
Conformément à nos valeurs citoyennes :
*   **Aucune donnée n'est envoyée vers un serveur.**
*   Tous les calculs s'effectuent localement dans votre navigateur.
*   Vos réponses sont stockées temporairement dans la `sessionStorage` de votre appareil et sont supprimées à la fermeture de l'onglet.
*   Nous ne collectons aucune donnée personnelle, tracker ou historique de navigation.

---
*Ce projet est Open Source et le code est consultable par tous pour vérification.*
