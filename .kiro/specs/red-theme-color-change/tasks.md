# Implementation Plan: Red/Rose Theme Color Change

## Overview

All changes are confined to `css/style.css`. Seven targeted line edits replace every blue/purple accent value with the new crimson/rose palette across the `:root` token block, the `body.dark` override block, the `.hero-stat` gradient rule, and the `input:focus` / `select:focus` box-shadow rule. No HTML or JavaScript files are touched.

## Tasks

- [x] 1. Update `:root` accent tokens
  - In `css/style.css`, locate the `:root` block
  - Change `--accent` from `#2563EB` to `#DC2626`
  - Change `--accent-hover` from `#1D4ED8` to `#B91C1C`
  - Change `--accent-dim` from `#EEF3FD` to `#FEF2F2`
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Update `--cat-0` in the `:root` category palette
  - In `css/style.css`, locate the `/* category palette */` comment inside `:root`
  - Change `--cat-0` from `#2563EB` to `#DC2626`
  - Leave `--cat-1` through `--cat-7` untouched
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 3. Update `body.dark` accent-dim override
  - In `css/style.css`, locate the `body.dark` block
  - Change `--accent-dim` from `#1E2D5A` to `#450A0A`
  - _Requirements: 2.1_

- [x] 4. Update `.hero-stat` gradient
  - In `css/style.css`, locate the `.hero-stat` rule
  - Change `background` from `linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)` to `linear-gradient(135deg, #DC2626 0%, #9F1239 100%)`
  - Verify `padding: 36px 32px` and `color: #fff` remain unchanged
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 5. Update `input:focus, select:focus` box-shadow
  - In `css/style.css`, locate the `input:focus, select:focus` rule
  - Change `box-shadow` from `0 0 0 3px rgba(37,99,235,.12)` to `0 0 0 3px rgba(220,38,38,.15)`
  - _Requirements: 4.1, 4.2_

- [ ] 6. Checkpoint — verify no old blue literals remain
  - Search `css/style.css` for any remaining occurrences of: `#2563EB`, `#1D4ED8`, `#7C3AED`, `rgba(37,99,235`
  - Each search MUST return zero matches inside accent, gradient, or focus rules
  - Confirm all unchanged tokens (`--bg`, `--surface`, `--surface2`, `--border`, `--text`, `--muted`, `--danger`, `--danger-dim`, `--success`, `--radius`, `--radius-sm`, `--font`, `--cat-1` … `--cat-7`) still hold their original values
  - Confirm `index.html` and `js/app.js` are unmodified
  - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - [ ]* 6.1 Property test — no old blue literals (Property 1)
    - **Property 1: No old blue accent literals remain**
    - Verify `css/style.css` contains zero occurrences of `#2563EB`, `#1D4ED8`, `#7C3AED`, `rgba(37,99,235`
    - **Validates: Requirements 1.4, 1.5, 2.3, 3.2, 6.4**
  - [ ]* 6.2 Property test — new red values present (Property 2)
    - **Property 2: All new red token values are present and correct**
    - Verify exact string matches: `--accent:      #DC2626`, `--accent-hover:#B91C1C`, `--accent-dim:  #FEF2F2` (in `:root`), `--accent-dim:  #450A0A` (in `body.dark`), `--cat-0: #DC2626`, gradient `#DC2626 0%, #9F1239 100%`, focus shadow `rgba(220,38,38,.15)`
    - **Validates: Requirements 1.1, 1.2, 1.3, 2.1, 5.1**
  - [ ]* 6.3 Property test — unchanged tokens unmodified (Property 3)
    - **Property 3: Unchanged tokens are unmodified**
    - Verify each token in the "Tokens Left Unchanged" table retains its original value
    - **Validates: Requirements 6.1, 5.3**
  - [ ]* 6.4 Property test — scope limited to css/style.css (Property 4)
    - **Property 4: Scope is limited to css/style.css**
    - Verify `index.html` and `js/app.js` byte-contents are identical to pre-change
    - **Validates: Requirements 6.2, 6.3**

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "2", "3", "4", "5"] },
    { "wave": 2, "tasks": ["6"] }
  ]
}
```

Tasks 1–5 are independent CSS edits that can be applied in any order (Wave 1). Task 6 is the verification checkpoint and depends on all prior tasks being complete (Wave 2).

## Notes

- Tasks marked with `*` are optional verification sub-tasks and can be skipped for a fast MVP
- All six main tasks are pure text substitutions in a single file — no build step or toolchain is required
- After completing task 5, open `index.html` in a browser and toggle dark mode to confirm no blue remnants are visible
- The `--danger-dim` token (`#FEF2F2`) coincidentally matches the new `--accent-dim` light value — this is intentional and must not be changed (they are semantically different tokens)
