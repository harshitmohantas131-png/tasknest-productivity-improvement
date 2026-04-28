# Changes.md — TaskNest Productivity Score Improvement

## 1. How the Productivity Score Currently Works (Before Changes)

The original implementation used a **hybrid approach** that mixed two separate scoring strategies:

### A) Database-persisted cumulative score (Score table)
- Every time a task was **created**, `+5` was added to a `Score` row in the database.
- Every time a task was **completed**, `+10` more was added to the same row.
- Deleting a task did **not** subtract anything from the score.

### B) Dynamic "momentum bonus" (scoreHelper.js)
- On every GET `/score` request, a bonus was recalculated from all completed tasks.
- If fewer than 2 tasks: `completedCount × 1.5`
- If 2 or more tasks: `completedCount × 3.75`
- This bonus was **added on top** of the stored score value each time.

### Final value returned
```
response = Math.floor(storedDbScore + momentumBonus)
```

---

## 2. Issues Discovered

### Issue 1 — Double-counting
The stored score already accumulated points from task completions. Then `momentumBonus` (recalculated from the same completed tasks) was added again on every request, causing the score to inflate beyond any meaningful boundary.

### Issue 2 — Score grows on task creation
Adding `+5` to the score simply for *creating* a task has no productivity meaning. A user could inflate their score indefinitely by creating and deleting tasks.

### Issue 3 — Score never decreases on deletion
Deleting a completed task did not reduce the stored score. A user could create, complete, delete, recreate, and complete the same task over and over to farm score points with no real work done.

### Issue 4 — Inconsistent multiplier in momentum bonus
The helper used different multipliers depending on whether fewer or more than 2 tasks existed (`× 1.5` vs `× 3.75`), creating a discontinuous jump that made the score unpredictable and opaque.

### Issue 5 — No support for "important tasks"
The client requirement explicitly stated: *"It should consider important tasks."* No field, UI control, or logic for marking tasks as important existed anywhere in the system. There was only a `TODO` comment acknowledging the gap.

### Issue 6 — Static status badge
The `ScoreWidget` always displayed **"High Energy Today"** regardless of the user's actual score, making the widget meaningless as feedback.

---

## 3. Improvements Implemented

### Improvement 1 — Pure computed score (no DB state)
The `Score` database model is no longer used. The productivity score is now computed **on demand** directly from the `Task` table:
```
score = (completedRegularTasks × 10) + (completedImportantTasks × 25)
```
This is always accurate, never double-counts, and automatically reflects the current state of tasks.

### Improvement 2 — Added `isImportant` field to Task
A new boolean field `isImportant` (default `false`) was added to the `Task` Prisma model. Important tasks are worth **25 points** on completion vs **10 points** for regular tasks.

### Improvement 3 — Mark tasks as Important from UI
Users can now:
- Toggle importance **when creating** a task via a star button in `TaskForm`.
- Toggle importance **on any existing task** via a star icon button in `TaskCard`.
- Visually distinguish important tasks by an amber left-border highlight and an **"Important"** badge.

### Improvement 4 — Score breakdown in ScoreWidget
The `ScoreWidget` now displays a breakdown showing:
- Number of regular tasks completed × 10 pts
- Number of important tasks completed × 25 pts

### Improvement 5 — Dynamic status badge
The status label now changes based on the user's actual score:
| Score | Label |
|-------|-------|
| 0 | Getting Started |
| 1–49 | Building Momentum |
| 50–149 | On a Roll! |
| 150+ | High Achiever 🔥 |

### Improvement 6 — Removed all broken score mutations from task CRUD
Creating, updating, and deleting tasks no longer directly mutate any score table. The score always reflects real completion data.

---

## 4. Implementation Details

### Files Modified

| File | Change |
|------|--------|
| `server/prisma/schema.prisma` | Added `isImportant Boolean @default(false)` to `Task` model; removed `Score` model |
| `server/controllers/scoreController.js` | Rewrote to compute score from task data, returns `value` + `breakdown` |
| `server/controllers/taskController.js` | Supports `isImportant` on create/update; removed all Score table mutations |
| `server/utils/scoreHelper.js` | Deprecated (kept as reference comment only) |
| `client/src/services/api.js` | Added `isImportant` to `createTask`; added `updateTaskImportance`; added `VITE_API_URL` env support |
| `client/src/components/TaskCard.jsx` | Added star toggle for importance, `important-badge`, amber highlight for important tasks |
| `client/src/components/TaskForm.jsx` | Added importance toggle with scoring hint |
| `client/src/components/ScoreWidget.jsx` | Added breakdown display, dynamic status badge |
| `client/src/index.css` | Added styles for important tasks, importance toggle, score breakdown |

### Migration
After pulling these changes, run a Prisma migration to apply the schema update:
```bash
cd server
npx prisma migrate dev --name add-important-field
```

---

## 5. How the Changes Improve the System

| Before | After |
|--------|-------|
| Score grows on task creation | Score only grows on task *completion* |
| Score never decreases on deletion | Score always reflects actual completed tasks |
| Double-counting from DB + dynamic bonus | Single, transparent formula |
| No way to mark tasks as important | Star button on every task card + form |
| Important tasks had zero effect on score | Important tasks worth 2.5× more (25 pts) |
| Always shows "High Energy Today" | Badge dynamically reflects actual score tier |
| Score unclear and hard to explain | Formula shown directly in the UI |

---

## 6. Deployment

| | Link |
|-|------|
| **Frontend** | https://your-app.vercel.app |
| **Backend**  | https://tasknest-xyz.onrender.com |

