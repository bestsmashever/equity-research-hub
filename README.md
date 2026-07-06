# Equity Research Hub

A small React/Vite frontend for publishing public-equity research reports and tracking follow-up ideas.

The first seeded workspace is based on a July 6, 2026 idea triage covering TSLA, SPCX, AMD, NVDA, AVGO, and RKLB.

The production root redirects to the published report at `/equity_idea_triage_2026-07-06.html`. The interactive research workspace remains available at `/hub`.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Design

The initial interface follows the product concept saved at `docs/design-concept.png`: a compact institutional research workspace with left navigation, a watchlist table, a right-side selected-idea panel, catalyst calendar, and source-quality register.
