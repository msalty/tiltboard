# Tiltboard — Plan

A single-page installable PWA for incline-bench / sliding-bench training, built from your ePub's ~95 exercises with form cues and GIFs.

## Name

**Tiltboard.** "Tilt" leans into the inclined bench; "board" pulls in the glideboard term from your manual. Avoids the Total Gym trademark, ownable, easy to say. Domain `tiltboard.app` looks available at time of planning; worth grabbing if you want one.

## One-sentence pitch

Tiltboard turns the ~95 exercises in your sliding-bench manual into a habit-forming, install-on-your-phone training app: browse the library, build routines, schedule them into a weekly program, work out in either a quick-check-off or fully-guided mode, and never break the chain.

## Architecture at a glance

- Pure static site — HTML / CSS / JavaScript, no backend, no build step required.
- Hostable on GitHub Pages, Netlify, your own server, or opened locally; nothing server-side to maintain.
- Service worker caches everything for full offline use after first load.
- Web App Manifest + icons so iOS and Android can install it to the home screen.
- All user data lives in IndexedDB on-device.
- Export / import is a single JSON file the user downloads or picks from the file system. No cloud, no accounts.

## Data model

Four layered concepts:

1. **Exercise** — the atomic unit. Sourced from your ePub.
   - `id`, `name`, `muscleGroup` (Abdominal / Back / Chest / Legs / Shoulders / Biceps / Triceps), `movementPattern` (push / pull / hinge / squat / core / isolation), `attachment` (none / wing / leg-pull cable / squat stand / handles), `formCues` (the prose from your book), `gifFile`, `favorite` (boolean, user-set).
2. **Routine** — an ordered list of exercises with prescriptions.
   - `id`, `name`, `description`, `entries[]` where each entry is `{ exerciseId, sets, reps, restSec, targetIncline, addedLoad?, notes? }`.
3. **Program** — a weekly schedule of routines.
   - `id`, `name`, `weeklyTargetN` (1–7), `schedule` mapping each weekday (Mon–Sun) to a routine id or rest. The schedule is *suggestion*; the streak only counts completions per week (see Streak rules).
4. **WorkoutLog** — what actually happened on a given day.
   - `id`, `date` (YYYY-MM-DD), `routineId`, `mode` ("checkoff" or "guided"), `sets[]` where each set is `{ exerciseId, reps, incline, addedLoad?, notes? }`, `durationSec`, `feltLike` (optional 1–5).

The exercise library, starter routines, and starter programs ship inside the app bundle as JSON. The user's edits, custom routines, and logs live in IndexedDB.

## Screens

1. **Today** — Big "Start Today's Workout" button; shows the day's prescribed routine from the active program (or "Rest day" / "Free pick"); current streak; this week's progress vs target (e.g., "2 of 3 done this week").
2. **Calendar** — toggle between two views:
   - *Heatmap*: GitHub-style 365-square grid, intensity by workout completion; current streak + best streak headline.
   - *Month grid*: tap any day to see what was done; swipe between months.
3. **Library** — browsable, searchable list of exercises. Filters: muscle group, movement pattern, attachment, favorites-only. Tap any exercise → detail page with looping GIF, form cues, related exercises.
4. **Routines** — list of all routines (starters + custom). Create / edit / duplicate / delete. Routine editor lets you pick exercises from the library and set sets / reps / rest / incline.
5. **Programs** — list of programs; one is "active" at a time. Editor shows a Mon–Sun grid where each day gets a routine or rest. Adjust weekly target N.
6. **Settings** — theme picker (Dark / Light / Warm / Auto), export, import, app version, "reset to factory" with confirm.

## Workout flow — two modes

User picks mode each time from the Today screen.

**Check-off mode (default).**
- Tap "Mark Today Done" → quick modal with: which routine (defaults to scheduled), optional 1-tap "felt easy / medium / hard", optional "log details now or later." Done in 3 seconds.
- The calendar gets a green square; the streak bumps if this completed a weekly target.

**Guided mode.**
- Walk through the routine exercise by exercise. Each exercise screen shows the GIF, form cues, current set number, target reps/incline.
- Per-set logging: tap to log reps actually done, incline level used, optional added load and notes. Auto-starts the rest timer for the prescribed seconds.
- "Next Exercise" advances. End-of-workout summary screen.
- Saves a full `WorkoutLog` with all per-set data.

Both modes produce the same shaped log; guided just has more detail in `sets[]`.

## Streak / "don't break the chain" rules

- Each Mon–Sun calendar week is a "bucket."
- The active program defines `weeklyTargetN` (1–7).
- A week is *complete* if the user logged ≥ N workouts in that week.
- **Current streak** = the number of consecutive recently-completed weeks ending at (and including) the current or most recent completed week. The current week counts as long as it's still possible to hit N — the streak only "breaks" if a past week falls short.
- **Best streak** is the all-time max.
- Forgiveness: this rule lets you skip a day mid-week and still save the streak by stacking workouts later. Strict but not punishing.
- Edge cases handled: changing N mid-week, imported data with old weeks, timezone-anchored "today."

## Starter content shipped with the app

- **Library**: all ~95 exercises from your ePub, with GIFs, muscle group, movement pattern, attachment, and form cues. (Tagging the movement-pattern and attachment fields is a one-time content task — I'll do it as part of build.)
- **Routines** (3 to start):
  - *Full Body 8* — one move per major muscle group, beginner-friendly.
  - *Upper Push/Pull* — chest, back, shoulders, arms.
  - *Lower & Core* — legs + abs.
- **Programs** (2 to start):
  - *Beginner 3×/week* — Full Body on Mon / Wed / Fri.
  - *Intermediate 4×/week* — Upper Mon, Lower Tue, rest Wed, Upper Thu, Lower Fri, weekend free.

User can use these as-is, duplicate-and-edit, or ignore and build their own.

## Visual style — all four, in Settings

Implement four themes, switch in Settings → Appearance:

- **Dark / Gym** — near-black, neon-amber accent, bold sans. Easy on eyes mid-workout.
- **Light / Apple-clean** — white/off-white, generous whitespace, subtle accent.
- **Warm / Journal** — cream background, serif headings, hand-drawn accent strokes.
- **Auto** — follows OS dark/light setting; uses the Dark and Light palettes above.

All themes share the same layout and component sizes — only colors and type styles differ.

## Export / import

- **Export**: Settings → "Export All" downloads `tiltboard-backup-YYYY-MM-DD.json` containing all custom routines, programs, logs, favorites, settings, and a schema version. Exercise library is *not* included in exports (it ships with the app and would just bloat the file).
- **Import**: Settings → "Import" reads a JSON file, validates the schema version, shows a confirm screen ("This will replace your current data with X routines, Y programs, Z logs from DATE — continue?"), then writes.
- Schema version is stamped on every export so future versions can migrate older backups.

## PWA specifics

- `manifest.json` with name "Tiltboard", short_name "Tilt", display "standalone", theme color per active palette, start_url "/", and a full icon set generated from a custom icon (I'll design something simple — likely an inclined bar motif).
- Service worker pre-caches the app shell + library JSON + all GIFs on first load. After that, full offline.
- iOS PWA quirks handled: `apple-touch-icon`, status-bar style, viewport-fit, safe-area padding for the notch / home indicator.
- Add-to-home-screen prompt for Android; iOS users get a one-time "tap Share → Add to Home Screen" tip the first visit.

## File / project layout

```
tiltboard/
├── index.html               app shell, mounts the SPA
├── manifest.webmanifest
├── sw.js                    service worker
├── app.js                   SPA logic (routing, state, views)
├── styles.css               all four themes + layout
├── data/
│   ├── exercises.json       ~95 exercises with metadata
│   ├── routines.json        3 starter routines
│   └── programs.json        2 starter programs
├── icons/                   PWA icons at multiple sizes
└── exercises/               the ~95 GIFs, renamed to slug-friendly filenames
```

Single-page-app in the architectural sense: one HTML file, in-app routing between Today / Calendar / Library / Routines / Programs / Settings.

## Build phases

Suggested order so you have something usable as early as possible:

1. **Phase 1 — Shell + Library.** App shell, navigation, theme system, exercise library (data + browse + filter + detail page with GIFs). At end of phase 1, you can browse all 95 exercises offline on your phone.
2. **Phase 2 — Routines.** Routine list, editor, duplicate, delete. Three starter routines loaded.
3. **Phase 3 — Programs + Today screen.** Program editor, active-program selection, Today screen showing scheduled routine.
4. **Phase 4 — Workout logging.** Check-off mode end-to-end. Calendar (both views). Streak math + this-week progress.
5. **Phase 5 — Guided workout.** Per-set logging, rest timer, end-of-workout summary.
6. **Phase 6 — Export / import + polish.** JSON round-trip, settings polish, icon set, install prompt, final iOS-PWA testing.

Each phase is independently shippable to GitHub Pages — you can install and use the app from Phase 2 onward.

## Open questions parked for later

- **Icon design.** I'll propose something at Phase 1; you can swap it any time.
- **Sounds / haptics for rest timer.** Default: silent + brief vibration at 5s and 0s. Easy to revise once you try it.
- **Sharing routines.** Out of scope for v1. Export/import already lets you hand a JSON to a friend.
- **Apple Watch / wearables.** Out of scope. PWA only.
- **Body-metric tracking (weight, measurements).** Out of scope; this is a workout app, not a body app.

## What I need from you to start building

Nothing else right now. The plan above is enough to start Phase 1. When you say go, I'll:
1. Tag the 95 exercises (movement pattern + attachment) from your ePub text.
2. Stand up the app shell with theming.
3. Wire up the library so you can browse on your phone within a session.

If anything above feels wrong, push back now — cheaper to change here than in code.
