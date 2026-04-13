# Project Memory

## Core
VOPatrně! — Czech consumer protection tool analyzing e-shop terms.
Dark/light mode, Space Grotesk headings, Inter body. Primary teal (168 60% 40%).
Custom VopIcon SVG system — no emoji in UI. All icons in VopIcon.tsx.
9 shop categories with dynamic card rendering via CATEGORY_SECTIONS map.
Smart display: hide default/standard values, show only surprising facts.
Edge function analyze-vop uses direct Anthropic API (claude-sonnet-4-20250514) with ANTHROPIC_API_KEY.
No mock fallback — errors shown to user with Czech messages.

## Memories
- [Category mapping](mem://features/categories) — 9 categories, domain detection, section mapping
- [Smart display](mem://features/smart-display) — displayDefaults.ts hides standard values, expandable
- [VopIcon](mem://design/vopicon) — Custom SVG icon set replacing all emoji
- [Edge function](mem://features/edge-function) — analyze-vop with crawler, legal-fetcher, direct Anthropic Claude API
