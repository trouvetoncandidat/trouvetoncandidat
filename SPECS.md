# Cahier des Charges - TrouveTonCandidat.fr (V2.0)

## Table des Matières
1. [Vision du Projet](#1-vision-du-projet)
2. [Stack Technique & Architecture](#2-stack-technique--architecture)
3. [Flux de Données (Inputs/Outputs)](#3-flux-de-données-inputsoutputs)
4. [Dictionnaire des 10 Axes Thématiques](#4-dictionnaire-des-10-axes-thématiques)
5. [Sécurité, Légal & Éthique](#5-sécurité-légal--éthique)
6. [Roadmap de Développement](#6-roadmap-de-développement)
7. [Business Model & Open-Source](#7-business-model--open-source)
8. [Annexes](#8-annexes)

---

## 1. Vision du Projet
**Objectif principal :** Créer une application web neutre, rapide et anonyme pour aider les électeurs à trouver leur compatibilité politique lors des **élections présidentielles françaises de 2027**.

* **Scope géographique et temporel :** France, Élections Présidentielles d'avril 2027.
* **Problème résolu :** La difficulté de lire et comparer des dizaines de programmes politiques denses de plus de 50 pages.
* **Métriques de succès (KPIs) :**
    * Nombre d'utilisateurs uniques.
    * Taux de complétion du questionnaire (drop-off rate).
    * Taux de partage sur les réseaux sociaux.

---

## 2. Stack Technique & Architecture
Une architecture pensée pour la montée en charge immédiate (scalabilité), le coût zéro en base de données, et la rapidité.

* **Frontend :** Next.js (React), Tailwind CSS.
* **UI/UX :** Shadcn/ui avec une stricte conformité **WCAG** (accessibilité, contrastes, balises ARIA) pour que l'app soit utilisable par tous les citoyens.
* **Base de Données Principale :** Fichier statique `candidates.json`. Pas de base de données lourde (comme PostgreSQL) pour éviter les goulots d'étranglement lors des pics de trafic post-débats télévisés.
* **Base Vectorielle (RAG) :** ChromaDB (pour stocker les embeddings des programmes).
* **Intelligence Artificielle :** API Gemini (pour l'extraction initiale des données et la classification).
* **Authentification :** **Aucune**. Utilisation exclusive du `sessionStorage` du navigateur. Les données disparaissent à la fermeture de l'onglet pour garantir un anonymat total.
* **DevOps & Monitoring :**
    * Hébergement : Vercel (avec un plan B sur un VPS OVH en cas de blocage/censure).
    * Tracking d'erreurs : Sentry.
    * Analytics : Vercel Analytics (cookieless).

---

## 3. Flux de Données (Inputs/Outputs)

### Les Inputs (Sources des données)
Pour garantir l'intégrité, les données ne proviennent que de sources vérifiables :
1.  **Professions de foi officielles** (publiées par le Ministère de l'Intérieur).
2.  **Sites de campagne officiels** des candidats.
3.  **Vérification anti-fake :** Un hash (SHA-256) est généré pour chaque PDF source au moment de son téléchargement pour prouver qu'il n'a pas été altéré.

### Les Outputs (Résultats utilisateur)
1.  **Score de compatibilité :** Pourcentage d'affinité globale avec les candidats.
2.  **Impact Portefeuille :** Simulation fiscale basique.
    * *Disclaimer légal obligatoire :* "Estimation non contractuelle basée sur des hypothèses simplifiées issues des programmes. Ne constitue pas un conseil financier ou fiscal."

---

## 4. Dictionnaire des 10 Axes Thématiques
C'est le cœur de l'algorithme. Chaque candidat et chaque utilisateur est scoré de **-1 à +1** sur ces 10 axes.

1.  **Économie :** `-1` (Interventionnisme d'État, hausses d'impôts, nationalisations) ↔ `+1` (Libéralisme, baisse d'impôts, dérégulation).
2.  **Social :** `-1` (Extension des acquis sociaux, retraite anticipée) ↔ `+1` (Réformes structurelles, recul de l'âge de départ).
3.  **Écologie :** `-1` (Décroissance, planification stricte) ↔ `+1` (Techno-solutionnisme, croissance verte).
4.  **Europe :** `-1` (Souverainisme, Frexit, désobéissance aux traités) ↔ `+1` (Fédéralisme européen, intégration renforcée).
5.  **Sécurité :** `-1` (Prévention, justice sociale, désarmement de la police) ↔ `+1` (Répression, tolérance zéro, armement renforcé).
6.  **Immigration :** `-1` (Fermeture des frontières, quotas stricts, expulsions) ↔ `+1` (Ouverture, régularisation, accueil inconditionnel).
7.  **Services Publics :** `-1` (Renforcement massif, création de postes publics) ↔ `+1` (Privatisations, réduction du nombre de fonctionnaires).
8.  **Énergie :** `-1` (Sortie du nucléaire, 100% renouvelable) ↔ `+1` (Relance massive du programme nucléaire).
9.  **Institutions :** `-1` (Passage à une 6ème République, Référendum d'Initiative Citoyenne) ↔ `+1` (Statu quo constitutionnel, maintien de la 5ème République).
10. **International :** `-1` (Isolationnisme, non-alignement, sortie de l'OTAN) ↔ `+1` (Multilatéralisme, atlantisme, soutien renforcé aux alliances).

---

## 5. Sécurité, Légal & Éthique
* **Biais IA :** Une phase d'audit manuel est imposée. Des prompts "extrêmes" seront testés pour s'assurer que l'IA ne lisse pas les positions radicales ou ne favorise pas le centrisme par défaut.
* **CNIL & RGPD :** L'application est "Privacy by Design". Pas de base de données utilisateurs, pas de cookies traceurs publicitaires, pas de création de compte.
* **Lutte contre la désinformation :** En accord avec les lois françaises sur les périodes électorales, l'application affichera un lien direct vers le paragraphe exact du programme source pour chaque position attribuée à un candidat.

---

## 6. Roadmap de Développement
*Note : Adaptée pour un lancement en amont des élections présidentielles d'avril 2027.*

* **[Q2 2026] Étape 0 : Setup Initial**
    * Initialisation du repo GitHub (licence MIT).
    * Configuration des variables d'environnement (API keys) et du CI/CD sur Vercel.
* **[Q3 2026] Étape 1 : Data Ingestion & Structuration**
    * Collecte des premiers programmes ou manifestes.
    * Passage dans l'API Gemini et génération du `candidates.json`.
* **[Q4 2026] Étape 2 : Moteur de Calcul (Backend logic)**
    * Développement de la fonction de distance algorithmique (calcul de la compatibilité utilisateur/candidat sur les 10 axes).
* **[Janvier 2027] Étape 3 : Frontend & UI**
    * Intégration Next.js / Shadcn.
    * Développement du questionnaire interactif et du dashboard de résultats.
* **[Février 2027] Étape 4 : End-to-End Testing & Audit**
    * Tests Cypress pour valider les parcours utilisateurs.
    * Audit manuel des biais électoraux.
* **[Mars 2027] Étape 5 : Lancement Public**
    * Déploiement final de la V1.
    * Campagne de communication organique.
* **[Avril 2027] Étape 6 : Maintenance & Mises à jour**
    * Ajustements en temps réel si un candidat modifie son programme.

---

## 7. Business Model & Open-Source
L'outil doit rester strictement neutre et indépendant.
* **Licence :** Open-Source (MIT) pour garantir la transparence de l'algorithme de calcul et encourager les contributions citoyennes (fact-checking du JSON).
* **Monétisation :** Aucune publicité. Le financement de l'API IA et des serveurs se fera uniquement par un système de dons libres (Stripe, Ko-fi) affiché à la fin des résultats de l'utilisateur.

---

## 8. Annexes

### Exemple de structure `candidates.json`
```json
{
  "candidats": [
    {
      "id": "candidat_1",
      "nom": "Jean Exemple",
      "parti": "Parti de l'Avenir",
      "scores": {
        "economie": 0.5,
        "ecologie": -0.2,
        "europe": 0.8
      },
      "sources": {
        "economie": "Programme 2027, Page 12, Paragraphe 3",
        "hash_pdf": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      }
    }
  ]
}