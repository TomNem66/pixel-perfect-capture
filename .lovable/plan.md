

# VOPatrně! — Multi-Category Refactor

This is a large refactor touching types, mock data, and nearly all UI components. The plan breaks it into manageable phases.

---

## What changes

The app currently shows the same 5 sections (Prodejce, Vrácení, Reklamace, Platby, Doprava) for every URL. After this refactor, it will detect site category (e-shop, marketplace, travel, tickets, etc.) and show only relevant sections with category-specific cards.

---

## Phase 1 — Types & Data Layer

**File: `src/types/analysis.ts`**
- Add `ShopCategory` type (9 categories)
- Add new fields to `AnalysisResult`: `kategorie`, `kategorie_label`, `kategorie_confidence`, `zdroje`, `pravni_odkazy`, `nesoulady`
- Make `vraceni?`, `reklamace?`, `platby?`, `doprava?` optional
- Add 8 new optional section interfaces: `storno`, `predplatne_info`, `ochrana_kupujiciho`, `licence_digital`, `akce_zruseni`, `pojisteni`, `jidlo_kvalita`, `lekarna_info`
- Add `TrustRating` type: `"ok" | "obezretni" | "riziko"`
- Add `LegalComplianceLevel` type for FactRow indicators

**File: `src/lib/categoryMapping.ts`** (new)
- Export `CATEGORY_SECTIONS` map: for each `ShopCategory`, list which section keys to render
- Export `CATEGORY_LABELS` map: Czech labels + emoji for each category
- Export `CATEGORY_DESCRIPTIONS`: short descriptions for the override picker

**File: `src/lib/tooltips.ts`** (new)
- Hardcoded plain-language explanations for complex terms (marketplace, dropshipping, odstoupení od smlouvy, DRM, zprostředkovatel, smluvní pokuta, etc.)

## Phase 2 — Mock Data

**File: `src/lib/mockAnalysis.ts`** — full rewrite
- Domain-to-category mapping for known domains (alza.cz, booking.com, netflix.com, goout.net, wolt.com, cd.cz, store.steampowered.com, drmax.cz, temu.com, etc.)
- Unknown domains → `eshop_zbozi`
- Generate only sections relevant to detected category (using `CATEGORY_SECTIONS`)
- Generate category-appropriate warnings and bonuses
- Include mock `pravni_odkazy` with real e-Sbírka URLs
- Include mock `zdroje` URLs
- Occasionally generate mock `nesoulady`
- Compute `trustRating` from warning severity counts

## Phase 3 — New Card Components

Create 8 new card components in `src/components/cards/` following the existing `CategoryCard`/`FactRow`/`BoolRow` pattern from `ResultsDashboard.tsx`:

- `StornoCard.tsx` — cancellation terms
- `PredplatneCard.tsx` — subscription info, trial, auto-renewal
- `OchranaKupujicihoCard.tsx` — buyer protection programs
- `LicenceCard.tsx` — license vs ownership, DRM, offline access
- `AkceZruseniCard.tsx` — event cancellation/reschedule
- `PojisteniCard.tsx` — cancellation insurance
- `JidloKvalitaCard.tsx` — food quality, allergens, min order
- `LekarnaCard.tsx` — SÚKL license, medicine exceptions

Each card receives its section data as props and renders FactRow/BoolRow items.

## Phase 4 — Refactor ResultsDashboard

**File: `src/components/ResultsDashboard.tsx`** — major refactor

1. **Trust badge** at the very top: 🟢/🟡/🔴 with label, derived from warnings
2. **Category badge** below title: emoji + Czech label (e.g. "🛒 E-shop se zbožím")
3. **Existing warning/bonus banners** — keep as-is
4. **Nesoulady banner** — new, shows contradictions between FAQ and ToS
5. **Dynamic card rendering** — use `CATEGORY_SECTIONS` to conditionally render only relevant cards (existing Prodejce/Vrácení/Reklamace/Platby/Doprava cards + new cards from Phase 3)
6. **Legal compliance indicators** on FactRows — small ✅/➡️/⚠️/❓ icons
7. **Legal references** — small 📖 links next to relevant facts, linking to e-Sbírka
8. **Zdroje section** at bottom — list of analyzed pages with clickable links
9. **Category override** at bottom — subtle "Jedná se o jiný typ obchodu?" expandable with 9 category options
10. **Disclaimer** at very bottom — always visible, with link to ČOI
11. **PDF export button** in header next to Share button

Extract `FactRow`, `BoolRow`, `CategoryCard`, `WarningBanner`, `BonusBanner` into `src/components/shared/` for reuse by all card components.

## Phase 5 — Contextual Help Tooltips

**File: `src/components/InfoTooltip.tsx`** (new)
- Small ℹ️ icon component wrapping Radix Tooltip
- Looks up term in `tooltips.ts` and shows plain-language explanation on hover/click
- Used inline in FactRow values where complex terms appear

## Phase 6 — PDF Export

**File: `src/lib/exportPdf.ts`** (new)
- Use browser `window.print()` with a print-optimized CSS stylesheet, or use `html2canvas` + `jsPDF` for a proper PDF
- Install `jspdf` and `html2canvas` packages
- Capture the results dashboard and generate downloadable PDF
- Button placed in header next to Share button

## Phase 7 — Loading State & Hook Updates

**File: `src/components/LoadingState.tsx`**
- Replace "Vyhodnocování skóre" step label with "Zpracování výsledků"

**File: `src/hooks/useAnalysis.ts`**
- Rename step `"scoring"` → `"processing"`
- Add `reanalyze(url, category)` function for category override re-run

## Phase 8 — Category Override Flow

**In `ResultsDashboard`**: when user selects a different category, call `onReanalyze(url, newCategory)` which propagates up to `Index.tsx` and triggers `useAnalysis` to re-run with forced category.

**File: `src/pages/Index.tsx`** — pass `reanalyze` handler to `ResultsDashboard`

---

## Technical details

- **No new backend/server code** — all changes are client-side
- **Packages to install**: `jspdf`, `html2canvas`
- **Shared components extracted**: `FactRow`, `BoolRow`, `CategoryCard` move to `src/components/shared/` and are imported by all card components
- **Tooltip data is hardcoded** in `tooltips.ts`, not AI-generated
- **Legal URLs to e-Sbírka are hardcoded** in mock data for now (real AI would generate them)
- **Share/history** continue working — `AnalysisResult` is backward-compatible (new fields are optional or have defaults)

---

## Files created (14)
`src/lib/categoryMapping.ts`, `src/lib/tooltips.ts`, `src/lib/exportPdf.ts`, `src/components/InfoTooltip.tsx`, `src/components/shared/FactRow.tsx`, `src/components/shared/BoolRow.tsx`, `src/components/shared/CategoryCard.tsx`, `src/components/cards/StornoCard.tsx`, `src/components/cards/PredplatneCard.tsx`, `src/components/cards/OchranaKupujicihoCard.tsx`, `src/components/cards/LicenceCard.tsx`, `src/components/cards/AkceZruseniCard.tsx`, `src/components/cards/PojisteniCard.tsx`, `src/components/cards/JidloKvalitaCard.tsx`, `src/components/cards/LekarnaCard.tsx`

## Files modified (7)
`src/types/analysis.ts`, `src/lib/mockAnalysis.ts`, `src/components/ResultsDashboard.tsx`, `src/components/LoadingState.tsx`, `src/hooks/useAnalysis.ts`, `src/pages/Index.tsx`, `package.json`

