@AGENTS.md

# Design system

Cotton-candy aesthetic: pastel pink + blue only — **no purple anywhere** (removed 2026-08-17 per explicit direction; it read too "AI-generated portfolio template"). Cute, casual, fun — this is a personal portfolio, not a corporate doc, and should look like it.

**Light mode only — no dark mode.** Removed 2026-08-17: it silently followed OS `prefers-color-scheme` with no in-app toggle, which read as broken ("I set light mode and don't see it") rather than intentional. Don't reintroduce a `@media (prefers-color-scheme: dark)` block without an explicit user-facing toggle to go with it.

**Colors** — tokens in `app/globals.css` (`:root` only):
- `--brand-blue` / `--brand-blue-deep`, `--brand-pink` / `--brand-pink-deep` — the only two hues. Don't add a third accent color without updating this doc.
- Semantic pattern used throughout: **blue = steady/done, pink = active/needs-attention** (see `ProjectCard.tsx` status badges, admin `tickets` page status badges). Keep new status/badge colors consistent with this, don't invent a third meaning.
- `--foreground` is a blue-biased charcoal/navy, not pure grey or black — chosen deliberately per the "neutrals aren't default" principle below.
- Primary CTAs/buttons: `bg-gradient-to-r from-brand-blue-deep to-brand-pink-deep`. Never re-introduce a `via-` purple stop.
- `.card` and `.candy-shadow` utility classes in `globals.css` give the soft color-tinted shadow look — use these instead of plain `shadow-md`/grey shadows.

**Type** — `next/font/google` in `app/layout.tsx`:
- Display/headings: **Fredoka** (`font-display` utility, generated from the `--font-display` theme token) — bubbly, rounded, playful. Used on all `h1`/`h2` via the global `h1,h2,h3,h4` rule in `globals.css`, plus explicit `font-display` class where a heading needs it outside that selector.
- Body: **Nunito** — rounded terminals, friendly, casual, still readable at body sizes.
- Never fall back to Geist/Inter/system-ui for this site — that's the generic look this redesign moved away from.

**Layout/motion**: big border-radius everywhere (`rounded-full` pills, `rounded-[2rem]`/`rounded-3xl` cards), soft candy-colored shadows instead of grey ones, tasteful bouncy hover (`hover:scale-105`, occasional `hover:rotate-6` on the chat bubble) — kept restrained per the note below, not layered on everywhere.

## For future design work on this repo

Before making UI/visual changes, invoke the **`artifact-design`** skill (`Skill({skill: "artifact-design"})`) for its fundamentals even though it's nominally scoped to Artifacts — the principles (pick neutrals deliberately, avoid the AI-generic-design cluster, pair typefaces on purpose, both-themes token discipline, restrained motion) generalize directly to this Next.js site and are what this redesign was built against. This was the closest match found when researching available skills/plugins for web design (searched the org's skill and plugin catalogs, both came back empty — nothing more specific exists in this environment as of 2026-08-17).

Read the "Color/Type/Layout" tokens above first — they're the existing system this skill's fundamentals say to honor over generic defaults.
