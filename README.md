# Redoubt Overview

Overview dashboard redesign workspace — React 19 + TypeScript (`.tsx`) consuming the Redoubt Design System via Module Federation.

## Prerequisites

- Node.js 20+
- Design System remote running locally **or** access to the dev CDN manifest

## Quick start

```bash
npm install

# Terminal 1 — Design System (from redoubt-design-system-v2)
npm run watch:federation

# Terminal 2 — Overview app
npm run start:ds-local
```

Open http://localhost:3015/overview

### Use dev CDN instead of local DS

```bash
npm run start:ds-remote
```

## Project structure

```
src/
├── pages/OverviewPage.tsx       # Page shell (header, layout)
├── components/
│   ├── DashboardWidgetGrid.tsx  # Widget grid — replace as redesigns arrive
│   └── PageWidthWrapper.tsx     # DS PageSurface wrapper
├── types/overview.ts            # Shared types
└── mocks/overviewData.ts        # Mock data for local dev
```

## Typography

- **Aeonik** — headlines (`Typography` h3–h6, `PageHeader`)
- **Spline Sans** — body, captions, buttons (via DS components + tokens)

Import `ds/tokens` and wrap with `AppThemeProvider` (already configured in `App.tsx`).

## Next steps

Send redesigns and we'll implement widget components in `src/components/widgets/`.
