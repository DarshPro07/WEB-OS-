# Nexus

An OS desktop running in a browser tab. Draggable windows, three themes, and an agent that has to ask for permission before doing anything.

I built it because every demo of every "AI OS" I saw gave the agent the ability to do things first and inform the user about it afterward. I wanted the reverse. The agent has to go through a permission request before it does anything, and any action that gets taken goes into an audit ledger you can scroll through. There is no off-the-record stuff here.

## Components

The desktop: draggable windows, a taskbar, and three visual modes (NEXUS, MATRIX, and NITRO).

The component that took most of my time to build:

- a permission model the agent has to pass before taking an action,
- the security panel to see what actions are currently permitted,
- the audit ledger to keep track of the actions in chronological order,
- the agent simulator which drives everything in the frontend until a real model is wired in.

Z++ is just my name for three rules the OS was built around. Zero trust, zero exposure, zero silent actions. This is not a security standard and I am not trying to invent one.

## Run it

```
npm install
npm run dev
```

Go to the URL printed by Vite.

**Clicking an icon twice opens a window.** Single click is what you would expect, but it is the very first thing I want to change.

Live version: https://web-os-ten-red.vercel.app/

## Working features

Windows, dragging, the three modes, the permission flow, the security panel, the audit ledger.

## Not working

- There is no actual model driving the agent. It is a simulator which creates plausible actions so I could test the permission layer against something.
- Everything is ephemeral. Refresh and get a blank desktop.
- Window manager becomes confused when there is a large number of windows and the order of their stacking and focus become inconsistent. Not fixed.
- Not usable on mobile. I have not checked.

## Technologies used

React, TypeScript, Vite. No backend. Everything is running in the tab.

## Phase 1 vs. phase 2

I wanted to have the shell and the permission layer done before wiring a real model in. Letting a model click things in the frontend was the easier half of the project. Ensuring that it cannot do it silently
