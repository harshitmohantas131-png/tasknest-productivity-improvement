# Productivity Score — Improvement Summary

## Problem
The original `Productivity Score` feature had several issues:
- Score was double-counted (DB stored score + dynamic momentum bonus added on top)
- Score increased on task *creation* — not just completion
- Deleting tasks never reduced the score
- No support for marking tasks as "important" (client requirement was ignored)
- Status badge was always static ("High Energy Today")

## Solution

### New Scoring Formula
```
score = (completedRegularTasks × 10) + (completedImportantTasks × 25)
```
Score is computed dynamically — no persistent DB state, no double-counting.

### Important Tasks Feature
- Added `isImportant` field to the Task model
- Star (⭐) button on every task card to toggle importance
- Importance toggle in the task creation form
- Important tasks visually highlighted with amber border and badge

### Score Widget
- Shows a live breakdown of regular vs important completions
- Dynamic status badge based on actual score tier

## Files Changed
- `server/prisma/schema.prisma` — added `isImportant` field
- `server/controllers/scoreController.js` — rewritten with clean formula
- `server/controllers/taskController.js` — supports `isImportant`, removed broken score mutations
- `server/utils/scoreHelper.js` — deprecated
- `server/prisma/seed.js` — updated to remove Score model references
- `client/src/services/api.js` — added importance API calls
- `client/src/components/TaskCard.jsx` — star toggle, important badge
- `client/src/components/TaskForm.jsx` — importance toggle at creation
- `client/src/components/ScoreWidget.jsx` — breakdown + dynamic badge
- `client/src/index.css` — new styles for important tasks
