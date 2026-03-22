# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Type-check + production build
npm run preview   # Preview production build
npx tsc --noEmit  # Type-check only, no emit
```

## Architecture

React + TypeScript + Vite app. No routing library — the entire app is a single-page course player with state managed in `App.tsx`.

**Data layer (`src/data/`)** — pure data, no UI:
- `types.ts` — all TypeScript interfaces (`TarotCard`, `CourseModule`, `QuizQuestion`, `SpreadDef`, `ChatMessage`)
- `cards.ts` — the 78 Rider-Waite cards split into `MAJOR` (22), `CU`/`SWD`/`WND`/`PNT` (14 each), re-exported as `ALL`
- `course.ts` — `COURSE` (module/lesson tree), `QZ` (quiz questions keyed by lesson id), `SPS` (spread definitions)

**State (`App.tsx`)** — owns all top-level state: current lesson (`cur`), completed lessons (`done[]`), sidebar open, chat panel open. Progress % is derived from `done.length / total`.

**Navigation model** — lessons are identified by string IDs (e.g. `"intro"`, `"maj1"`, `"q1"`). `Lesson.tsx` is a large switch on `id` that renders the appropriate content. Completing a lesson auto-advances to the next lesson in the flat `COURSE.flatMap(m => m.l)` sequence.

**`Lesson.tsx`** — the largest component; contains all lesson prose inline via shared layout primitives (`P`, `H`, `Li`, `Tip`, `W`, `End`) defined at the top of the file. Card grid lessons (`maj1`–`maj3`, `cuC`, `swC`, `waC`, `peC`) use `CardGrid` + local state to drill into `CardDetail`.

**ChatBot** — calls the Anthropic Messages API directly from the browser (`https://api.anthropic.com/v1/messages`). Requires an API key to be injected at the call site or via a proxy — currently there is no key management in the codebase.

**Fonts** — loaded via Google Fonts `@import` inside a `<style>` tag in `App.tsx`. `hf` (Cormorant Garamond, serif) and `sf` (DM Sans, sans-serif) are exported from `src/constants.ts` and used across components.

**Styling** — all inline styles, no CSS files or CSS-in-JS library. Color palette: background `#0c0c16`, accent gold `#d4a843`, text `#c0b8a8` / `#e0d5c0`.
