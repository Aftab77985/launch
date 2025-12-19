# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application built with React 19, TypeScript, and Tailwind CSS 4. The project implements an interactive "hold-to-launch" page with progress tracking, confetti effects, and animations. It serves as a launch portal for the Bureau of Statistics Planning & Development Department, Government of Balochistan.

## Key Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build production bundle
npm start            # Start production server
npm run lint         # Run ESLint
```

### Development Notes
- The dev server uses hot reload - changes to files auto-update in the browser
- Main entry point is `app/page.tsx` which delegates to `app/launch/page.tsx`

## Architecture

### Project Structure
- **Next.js App Router**: Uses the modern App Router (`app/` directory) instead of Pages Router
- **Single-page Application**: The entire UI is contained in `app/launch/page.tsx` as a client component
- **Root Layout**: `app/layout.tsx` configures Geist font family and basic HTML structure
- **Routing**: `app/page.tsx` serves as the index route and directly renders `LaunchPage`

### Key Technologies

**Styling:**
- Tailwind CSS 4 with PostCSS plugin (`@tailwindcss/postcss`)
- Uses inline `@theme` directive in `app/globals.css` for CSS custom properties
- Dark mode support via `prefers-color-scheme`

**Animations & Effects:**
- `framer-motion` for component animations, progress rings, and button interactions
- `canvas-confetti` for celebration effects (burst patterns, balloon effects, side cannons)
- Custom SVG progress ring with animated stroke

**Icons:**
- `lucide-react` for icons (Rocket, CheckCircle2, Sparkles)

### Launch Page Component (`app/launch/page.tsx`)

This is the core interactive component with the following architecture:

**State Management:**
- `isHolding`: Tracks if user is pressing/holding the button
- `progress`: Tracks hold progress (0-100%)
- `isLaunched`: Tracks if launch sequence has completed
- `controls`: Framer Motion animation controls for button scaling

**Configuration Constants:**
- `HOLD_DURATION`: 5000ms - Total time required to complete launch
- `UPDATE_INTERVAL`: 20ms - Progress update frequency
- `INCREMENT`: Calculated progress increment per interval

**User Interaction:**
- Mouse events: `onMouseDown`, `onMouseUp`, `onMouseLeave` on button
- Touch events: `onTouchStart`, `onTouchEnd` for mobile support
- Keyboard: Spacebar hold support via `keydown`/`keyup` listeners

**Launch Sequence:**
Three-phase confetti animation triggered at 100% progress:
1. Initial center burst (150 particles)
2. Continuous balloon effect from sides (1 second duration)
3. Side cannon bursts after 500ms delay

After animations, redirects to `https://bospnd.balochistan.gov.pk/` after 4 second delay.

**Visual Effects:**
- Radial gradient glow from top
- Grain texture overlay
- Animated grid pattern background
- SVG progress ring with animated stroke and glow
- Button with backdrop blur and conditional styling based on state

## TypeScript Configuration

- **Module Resolution**: Uses `bundler` mode (Next.js optimized)
- **Path Aliases**: `@/*` maps to project root
- **Target**: ES2017
- **Strict Mode**: Enabled
- **JSX**: `react-jsx` (React 19 automatic JSX runtime)

## ESLint Configuration

- Uses Next.js recommended configs (`eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`)
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Important Implementation Details

### Client Component Requirement
The `LaunchPage` must remain a client component (`"use client"`) due to:
- Browser-only APIs (window, document)
- Event listeners (mouse, touch, keyboard)
- React hooks (useState, useEffect, useRef, useCallback)
- Canvas confetti library (requires DOM)

### Timer Implementation
Uses `setInterval` with cleanup in `useEffect` to prevent memory leaks. Progress resets to 0 if user releases before completion.

### Animation Performance
- Progress ring uses SVG with `pathLength` animation for smooth 60fps updates
- Framer Motion handles all component transitions and button feedback
- Confetti uses `requestAnimationFrame` for balloon effect loop

### Font Loading
Uses Next.js `next/font/google` API for optimized Geist font loading with CSS variable injection.

## External Resources

- **Logo**: `https://cdn.bospnd.balochistan.gov.pk/assets/gob-logo.png`
- **Grain Texture**: `https://grainy-gradients.vercel.app/noise.svg`
- **Redirect Target**: `https://bospnd.balochistan.gov.pk/`

## Potential Extension Points

If adding new features, consider:
- The main layout structure uses flexbox with `flex-grow` for vertical centering
- All timing constants are configurable at the top of the component
- Confetti configurations are inline and can be extracted for reusability
- The component follows a hook-based architecture - new interactions should use `useCallback` for event handlers
