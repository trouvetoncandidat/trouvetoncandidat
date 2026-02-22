# Spécifications de la Page Résultats - TrouveTonCandidat.fr

Ce document contient l'architecture, les textes et les spécifications de design de la page de résultats. Vous pouvez modifier ce fichier pour ajuster le contenu ou le style. Une fois modifié, je l'utiliserai pour mettre à jour le code source.

## 1. Séquence de Chargement (Theatrical Loading)
*Lieu : src/app/resultats/page.tsx*

**Durée totale :** 6.5 secondes
**Étapes (Copywriting) :**
1. 🔵 "Analyse des réponses citoyennes..." (Icône: Database)
2. 🔵 "Scan de toutes les pages de programmes officiels..." (Icône: Search)
3. 🔴 "Calcul des affinités sur les 10 axes..." (Icône: Zap)
4. 🟢 "Vérification de la neutralité algorithmique..." (Icône: ShieldCheck)
5. 🟡 "Génération de votre ADN politique..." (Icône: Award)

---

## 2. Section "Profil" (Identité Politique)
*Composant : Page Principal (Section 1)*

**Badge de Titre (Logique `getPoliticalProfile`) :**
- **"Le Libéral Européen"** : Économie > 0.4 & Europe > 0.4
- **"Le Progressiste Social"** : Économie < -0.4 & Social < -0.4
- **"L'Éclaireur Écolo"** : Écologie < -0.4
- **"Le Souverainiste"** : Europe > 0.4
- **"Le Centriste Pragmatique"** : Économie | < 0.2 & Social | < 0.2
- **"L'Économiste"** : Économie > 0.4
- **"Le Profil Nuancé"** : Par défaut

---

## 3. Le Match Principal (CandidateCard)
*Composant : src/components/CandidateCard.tsx*

**Éléments visuels :**
- Classement (Rank 1) en surbrillance bleue.
- Score de match global XXL.
- Description du candidat en italique (citation).

**Piliers thématiques (Grille) :**
- 10 blocs avec mini-barres de progression.
- Couleurs conditionnelles :
    - Bleu (`#000091`) : Match >= 65%
    - Rouge (`#E1000F`) : Match <= 35%
    - Ambre : Entre les deux.

---

## 4. Mes convictions (RadarChart)
*Composant : src/components/RadarChart.tsx*

**Axes (Labels) :**
- Économie, Social, Écologie, Europe, Sécurité, Immigration, Services Publics, Énergie, Institutions, International.

**Design :**
- Zone remplie : `rgba(0, 0, 145, 0.25)`
- Bordure : `#000091`

---

## 5. Mon candidat idéal (IdealCandidateCard)
*Composant : src/components/IdealCandidateCard.tsx*

**Titre :** "Mon candidat Idéal"
**Badge :** "Mode Utopie Activé"
**Contenu :** Liste des mesures les plus proches de vos convictions, piochées chez n'importe quel candidat.

---

## 6. Export Instagram/WhatsApp (StoryExportCard)
*Composant : src/components/StoryExportCard.tsx*

**Format :** 1080x1920 (9:16)
**Branding :**
- Header avec drapeau FR stylisé ("FR").
- Texte : "TrouveTonCandidat - Élection 2027".
- CTA final : "C'est Votre Tour" sur fond blanc.

---

## 7. Configuration Système (Logic & SEO)
*Lieu : src/lib/matchAlgorithm.ts & layout.tsx*

**Algorithme :**
- Pondération doublée (x2) pour les réponses d'accord/contre total (+/- 1).
- Pondération normale (x1) pour les réponses "Plutôt" (+/- 0.5).

**SEO :**
- Title: "TrouveTonCandidat.fr | Le comparateur politique 100% neutre"
- OG Description: "Comparez les programmes des candidats à l'élection présidentielle 2027 en 2 minutes."
