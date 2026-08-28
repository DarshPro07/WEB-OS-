# NEXUS // Z++

Phase 1 scaffold for an agentic, cyber-defense-focused WebOS.

## What is implemented

- React + TypeScript + Vite
- Draggable desktop windows
- NEXUS / MATRIX / NITRO visual modes
- Safe agent-objective simulator
- Z++ permission model scaffold
- Sentinel defensive security panel
- Append-only-style in-memory audit ledger
- System telemetry panel

## Z++ concept

For this project:

- Zero Trust
- Zero Exposure
- Zero Silent Actions

This is a project architecture/branding concept, not an established security standard.

## Run

```bash
npm install
npm run dev
```

Then open the local URL Vite prints.

## Phase 2

Build these next:

1. Window open/close/minimize/maximize manager
2. Command palette
3. Persistent audit ledger with IndexedDB
4. Real read-only browser security checks
5. Cyber Lab with harmless simulated incidents
6. Permission approval modal
7. Agent planning graph
8. Keyboard shortcuts
9. Mobile/responsive improvements
10. GitHub Pages deployment

## Safety design

The current agent simulator does not execute arbitrary shell commands or access secrets.
Later integrations should remain permission-gated and defensive.
