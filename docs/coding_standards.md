# Coding Standards

## TypeScript

- **Strict mode** is enabled (`"strict": true` in tsconfig.json)
- No use of `any` except in engine internals with explicit ESLint disable comments
- All function parameters and return types must be explicitly typed
- Use `interface` for object shapes, `type` for unions and intersections
- Use `unknown` instead of `any` for external data; validate before use

## React / Next.js

- Add `'use client'` to every component that uses hooks or browser APIs
- Server components must not import `useState`, `useEffect`, or browser-only libraries
- Use `dynamic(..., { ssr: false })` for Monaco Editor and any window-dependent code
- GSAP must only be called inside `useEffect` or via dynamic import
- Keep components under 300 lines; extract sub-components if needed

## File Structure

- Pages: `app/<route>/page.tsx`
- Reusable UI: `components/<ComponentName>.tsx`
- Engine logic: `engine/<module>.ts` (no React, pure TypeScript)
- Tests: `tests/<module>.test.ts` (unit) or `tests/<name>.spec.ts` (E2E)

## Naming

- Components: PascalCase (`ArrayVisualizer.tsx`)
- Functions and variables: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types and interfaces: PascalCase

## CSS / Styling

- Use TailwindCSS utility classes exclusively
- No inline styles except for dynamic values (e.g., bar heights from data)
- Prefer `transition-*` classes for animations; use GSAP for complex sequences

## Testing

- Unit tests must not depend on DOM or React; test pure logic only
- Mock browser APIs in Jest via `jest.setup.js`
- E2E tests live in `tests/*.spec.ts` and run via Playwright
- Aim for >80% coverage on engine modules
