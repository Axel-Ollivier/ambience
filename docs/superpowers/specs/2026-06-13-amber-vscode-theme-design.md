# CITS: Amber — thème VSCode (design)

> Spec figée le 2026-06-13. Port VSCode du thème **Amber Terminal** (sombre) de
> l'OS de l'auteur (`~/.dotfiles`). Objectif : *strictement le même* ADN visuel
> que le terminal Ghostty / panel Cinnamon, adapté à un éditeur de code lisible.

## 1. Objectif & contexte

L'auteur développe un thème « Amber » pour son OS (Linux Mint / Cinnamon, terminal
Ghostty, shell zsh + Starship). Esthétique : **rétro-futur chaud** — phosphore ambré
sur noir chaud. On veut ce même thème dans VSCode, **variante sombre uniquement**.

Source de vérité : `~/.dotfiles` (`DESIGN.md`, `ghostty/.config/ghostty/config`,
`starship/.config/starship.toml`, `theme/amber-overrides.css`).

## 2. Décisions verrouillées

| Décision | Choix |
|---|---|
| Portée | **Sombre seul** — `CITS: Amber` (`vs-dark`). La variante claire *Amber Paper* est explicitement reportée (non-objectif). |
| Texte du code | **Crème lisible** `#F5E9D6` (= blanc ANSI de la palette). Ambre réservé aux accents. |
| Effets | **Aucun** glow / CRT / phosphore fake. Géré au niveau système (shader Ghostty), VSCode reste plat et net. |
| Approche | **Remap de `solaris-color-theme.json`** : cloner la structure, substituer la palette. |

## 3. Source de vérité — palette Amber

### Palette canonique (DESIGN.md + Starship)
| Rôle | Hex |
|---|---|
| Fond | `#16110D` |
| Ambre · primaire | `#FFB454` |
| Orange brûlé | `#E8743B` |
| Clay | `#CC785C` |
| Vert · succès | `#8FB36B` |
| Dim · secondaire | `#C98A52` |
| Gold (bright yellow) | `#FFD089` |

### Palette ANSI Ghostty (16 couleurs — pour le terminal intégré, à l'identique)
| # | Hex | # | Hex |
|---|---|---|---|
| 0 black | `#16110D` | 8 br-black | `#5A4632` |
| 1 red | `#E8743B` | 9 br-red | `#F0824A` |
| 2 green | `#8FB36B` | 10 br-green | `#A6C77F` |
| 3 yellow | `#FFB454` | 11 br-yellow | `#FFD089` |
| 4 blue | `#CC785C` | 12 br-blue | `#D98E6E` |
| 5 magenta | `#C2603A` | 13 br-magenta | `#D67A50` |
| 6 cyan | `#C98A52` | 14 br-cyan | `#D9A86A` |
| 7 white | `#E8D5BC` | 15 br-white | `#F5E9D6` |

Extras Ghostty : `cursor #FFB454` · `cursor-text #16110D` · `selection-bg #3A2F25` ·
`selection-fg #FFD089`.

## 4. Architecture

- **Un seul livrable** : `themes/amber-color-theme.json` (JSON écrit à la main,
  convention du repo — pas de générateur, cf. non-objectifs).
- Structure identique à Solaris : bloc `colors` (chrome UI), `tokenColors`
  (TextMate), `semanticTokenColors`. `"type": "dark"`, `"name": "CITS: Amber"`.
- **Enregistrement** : une entrée dans `contributes.themes` de `package.json`.

## 5. Mapping de substitution (Solaris → Amber)

Implémentation = copie de `solaris-color-theme.json` puis **remplacement global de
chaque hex 6-digits**. Les suffixes alpha suivent automatiquement
(`#D89B3A60` → `#FFB45460`), donc on remplace le token de base à 6 caractères.

### 5.1 Chrome — fonds (gris neutre → noir chaud ambré)
| Solaris | Amber | Rôle |
|---|---|---|
| `#0A0A0A` | `#100B07` | barres (activity/panel/status/tabs/title) |
| `#0F0F0F` | `#16110D` | **fond éditeur** (bg OS canonique) |
| `#141414` | `#1A130E` | side bar |
| `#1A1A1A` | `#1F1813` | widgets/menus/hover/inputs (= tooltip OS) |
| `#2A2A2A` | `#2A2017` | séparateurs / whitespace |
| `#3F3F3F` | `#33271A` | bordures (= border OS) |
| `#4A4A4A` | `#4A3826` | bordures de widgets |

### 5.2 Chrome — texte neutre (gris froid → taupe chaud ambré)
| Solaris | Amber | Rôle |
|---|---|---|
| `#6E6E6E` | `#5A4632` | n° de ligne, commentaires, dim (= br-black OS) |
| `#888888` | `#7E6549` | descriptions, inactif, ponctuation |
| `#A0A0A0` | `#A98A66` | icônes, secondaire, opérateurs, clés d'objet |
| `#B8B8B4` | `#C9B79A` | side bar fg, params de fonction |
| `#D8D6D0` | `#E8D5BC` | fg fort, titlebar (= white ANSI OS) |
| `#E8E6E0` | `#F5E9D6` | **texte de base / variables** (= br-white OS) |

### 5.3 Accents sémantiques
| Solaris | Amber | Rôle |
|---|---|---|
| `#D89B3A` | `#FFB454` | **ambre primaire** : curseur, boutons, badges, onglet actif, mots-clés, titres, git modified |
| `#E5B860` | `#FFD089` | gold : nombres, constantes, attributs, warnings, find-match, enumMember |
| `#9CAF6E` | `#8FB36B` | vert : fonctions, types, classes, succès, git added |
| `#B8C98A` | `#A6C77F` | vert clair (bright green) |
| `#B5B33A` | `#C98A52` | dim/info : info, untracked, liens markdown |
| `#A85A3A` | `#C2603A` | magenta brûlé : regexp, conflits, ponctuation de string |
| `#D85A50` | `#F0824A` | rouge clair : validation error fg, stage-deleted |
| `#E8A83A` | `#E8743B` | charts.orange |
| `#000000` | `#000000` | ombres — inchangé |

### 5.4 Rouge `#C44536` — à **dédoubler** (un seul hex, deux rôles dans Solaris)
1. Remplacement global `#C44536` → **orange `#E8743B`** (erreurs, invalid, git deleted,
   diff removed, self/this, testing failed, debug stop, validation, bracket #4, charts.red).
2. Puis **re-fixer les scopes « string » à clay `#CC785C`** : `tokenColors` `string` /
   `string.quoted` / `string.template`, `meta.property-value.css`,
   `punctuation.definition.string.*`, et `semanticTokenColors.string`.

### 5.5 Terminal intégré — **override explicite** (priorité sur 5.1–5.4)
Réécrire les 18 clés `terminal.*` avec les valeurs Ghostty exactes (§3) :
`ansiBlack #16110D`, `ansiBrightBlack #5A4632`, `ansiRed #E8743B`,
`ansiBrightRed #F0824A`, `ansiGreen #8FB36B`, `ansiBrightGreen #A6C77F`,
`ansiYellow #FFB454`, `ansiBrightYellow #FFD089`, `ansiBlue #CC785C`,
`ansiBrightBlue #D98E6E`, `ansiMagenta #C2603A`, `ansiBrightMagenta #D67A50`,
`ansiCyan #C98A52`, `ansiBrightCyan #D9A86A`, `ansiWhite #E8D5BC`,
`ansiBrightWhite #F5E9D6` ; `terminal.background #100B07`,
`terminal.foreground #F5E9D6`, `terminal.selectionBackground #3A2F2580`,
`terminalCursor.foreground #FFB454`, `terminalCursor.background #16110D`.
→ le terminal VSCode est *littéralement* identique à Ghostty.

### 5.6 En-tête
Remplacer le bloc de commentaire « Palette — Solaris » par une note Amber
(ADN, source dotfiles, sombre-seul).

## 6. Packaging
- `package.json` → `contributes.themes` : ajouter
  `{ "label": "CITS: Amber", "uiTheme": "vs-dark", "path": "./themes/amber-color-theme.json" }`.
  Position cohérente avec les voisins (après Solaris).
- `README.md` : ajouter une ligne « CITS: Amber » à la liste des thèmes, au format
  existant — **sans toucher** aux éditions en cours du fichier (déjà modifié).
- **Pas** de bump de version ni de packaging `.vsix` : géré par l'auteur (release).

## 7. Non-objectifs (YAGNI)
- ❌ Variante claire *Amber Paper* (`— Day`) — reportée.
- ❌ Générateur/script (les thèmes du repo sont du JSON manuel).
- ❌ Effets glow / CRT / phosphore (gérés au niveau système).
- ❌ Bump de version, `.vsix`, captures d'écran, copy marketing.

## 8. Vérification
1. **JSON valide** : le fichier parse (`python3 -m json.tool` ou équivalent).
2. **Couverture** : aucune clé `#D89B3A` / gris Solaris résiduelle (grep des hex
   sources doit être vide hors cas voulus) ; mêmes clés que Solaris présentes.
3. **Visuel dans VSCode** (Extension Dev Host ou install) : sélectionner « CITS: Amber »
   et vérifier — fond éditeur noir chaud `#16110D`, curseur ambre, mots-clés ambre,
   strings clay, fonctions vertes, nombres gold, commentaires dim chaud.
4. **« Strictement le même »** : terminal intégré comparé côte-à-côte avec Ghostty
   (doit matcher) ; gut-check chrome vs panel Cinnamon ambré.
