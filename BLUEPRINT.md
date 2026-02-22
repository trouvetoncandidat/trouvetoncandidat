# 🧠 Blueprint Technique : Moteur de Décision (v7-Zones)
**Projet : TrouveTonCandidat.fr**  
**Équipe : Archie, Ada & Lumina**

---

## 1. Logique du Moteur de Scoring (Scoring Engine)

### Pondération des Réponses (Matrix de Conviction)
Le système n'utilise pas une moyenne simple, mais une **Moyenne Pondérée par l'Intensité**. Plus l'utilisateur est tranché, plus son poids dans la thématique est fort.

| Choix Utilisateur | Valeur Mathématique ($S$) | Poids de Conviction ($W$) | Impact sur la Zone |
| :--- | :---: | :---: | :--- |
| **Tout à fait d'accord** | $+1.0$ (ou $-1.0$ si inversé) | **2.0** | Accélération vers l'Extrême |
| **Plutôt d'accord** | $+0.5$ (ou $-0.5$ si inversé) | **1.0** | Glissement vers la zone modérée |
| **Neutre / Ne sait pas** | $0.0$ | **0.5** | Stabilisation au centre (poids réduit) |
| **Plutôt pas d'accord** | $-0.5$ (ou $+0.5$ si inversé) | **1.0** | Glissement vers la zone modérée opposée |
| **Tout à fait pas d'accord** | $-1.0$ (ou $+1.0$ si inversé) | **2.0** | Accélération vers l'Extrême opposé |

> **Formule de Score par Axe ($A_x$) :**  
> $A_x = \frac{\sum (S_i \times W_i)}{\sum W_i}$  
> *Note : Si la question est marquée `reversed: true`, le signe de $S$ est multiplié par $-1$.*

---

## 2. Matrice d'Impact "7 Zones"

Le spectre politique est découpé en 7 segments précis. Le score global $G$ (moyenne pondérée de tous les axes) détermine le positionnement.

| Zone | Identifiant | Bornes Mathématiques (Score $G$) | Nom de la Zone | Couleur (Hex) | Phrase de Partage |
| :---: | :--- | :---: | :--- | :---: | :--- |
| **1** | **EG** | $[-1.00, -0.71]$ | **Extrême Gauche** | `#b91c1c` | "Mon ADN est 100% Radical et Social." |
| **2** | **G** | $[-0.71, -0.43]$ | **Gauche** | `#e1000f` | "Je défends un projet de Progrès Social." |
| **3** | **CG** | $[-0.43, -0.14]$ | **Centre-Gauche** | `#f87171` | "Mon idéal est une Gauche Réformiste." |
| **4** | **C** | $[-0.14, +0.14]$ | **Centre** | `#94a3b8` | "Je mise sur le Pragmatisme Central." |
| **5** | **CD** | $[+0.14, +0.43]$ | **Centre-Droit** | `#60a5fa` | "Je soutiens un Libéralisme Modéré." |
| **6** | **D** | $[+0.43, +0.71]$ | **Droite** | `#000091` | "Mon ADN est l'Ordre et la Liberté." |
| **7** | **ED** | $[+0.71, +1.00]$ | **Extrême Droite** | `#1e1b4b` | "Souverainiste Radical avant tout." |

---

## 3. Logique des Graphiques (DataViz)

### Le Radar (ADN Politique)
*   **Axes** : 10 thématiques (Économie, Social, Écologie, Europe, Sécurité, Immigration, Services Publics, Énergie, Institutions, International).
*   **Échelle** :
    *   **Centre (0 sur le graph)** : Équivaut au score $-1.0$ (Position de Gauche).
    *   **Bordure (100 sur le graph)** : Équivaut au score $+1.0$ (Position de Droite).
*   **Affichage** : Seul le profil utilisateur est affiché (dataset "Vous") pour éviter de surcharger la lecture.

### L'Hémicycle (Placement de Siège)
L'hémicycle est un arc de 180° tracé de gauche à droite.

*   **Calcul de l'Angle ($\theta$)** :  
    $\theta = (G + 1) \times 90^\circ$  
    *(Où $G$ est le score global [-1, 1])*
*   **Bornes visuelles (Filets Blancs)** : Un filet est placé tous les $25.7^\circ$ ($\frac{180}{7}$) pour marquer physiquement le basculement d'une zone à l'autre.
*   **Ligne de force** : Une ligne en pointillés relie le pivot central (50, 45) aux coordonnées du curseur $(x, y)$ pour indiquer la "direction" politique.

---

## 4. Logique du Match Candidat

### Calcul de la Distance
Le pourcentage de match ($M$) sur un axe n'est pas une simple ressemblance binaire, mais une mesure de distance linéaire :
$$M_{axe} = \left( 1 - \frac{|Score_{User} - Score_{Candidate}|}{2} \right) \times 100$$

### Génération du Podium
Le podium est classé par **Indice de Convergence Totale**, qui est la moyenne pondérée des $M_{axe}$ par les poids $W$ de l'utilisateur.
*   **Si affinité > 65%** : Zone "Match Fort" (Bleu/Primaire).
*   **Si affinité < 35%** : Zone "Match Faible / Rupture" (Rouge/Secondaire).

---

## 5. Logique du "Candidat Idéal" (L'Utopie)

Pour chaque thématique, le moteur scanne la base de données de tous les candidats réels et pioche la mesure dont le score est mathématiquement le plus proche de celui de l'utilisateur.

**Algorithme :**
1. **SI** Utilisateur a un score de $-0.9$ en Économie (Très à gauche).
2. **ALORS** Le moteur cherche le candidat ayant le score le plus proche de $-0.9$ (ex: LFI à -1.0 ou EELV à -0.8).
3. **EXTRACTION** : Le texte de la justification du candidat sélectionné devient la "Mesure Idéale" de l'utilisateur.
4. **ATTRIBUTION** : On affiche le parti source pour que l'utilisateur sache d'où vient son utopie.

---
**Audit validé par l'équipe technique.**  
*Signature : Archie (System), Ada (Data), Lumina (UI).*
