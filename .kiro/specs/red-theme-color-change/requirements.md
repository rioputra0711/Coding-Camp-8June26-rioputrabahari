# Requirements Document

## Introduction

The nyinyo Expense & Budget Visualizer currently uses a blue (#2563EB) primary color with a blue-to-purple gradient for its hero section. This feature replaces the entire color scheme with a bold red/rose/crimson palette to give the application a more energetic and striking visual identity. The change must cover all CSS tokens, accent colors, gradients, and interactive states in both light and dark modes.

## Glossary

- **Theme_System**: The set of CSS custom properties (variables) defined in `:root` and `body.dark` that control all colors across the application.
- **Accent_Color**: The primary brand color applied to interactive elements such as buttons, focused inputs, links, and highlights.
- **Hero_Section**: The full-width gradient banner at the top of the application displaying the total spent amount.
- **Light_Mode**: The default visual mode with a light background and dark text.
- **Dark_Mode**: The alternative visual mode activated via the theme toggle, with a dark background and light text.
- **Category_Palette**: The set of eight `--cat-N` CSS variables used to color the donut chart segments and transaction icons.
- **Focus_Ring**: The `box-shadow` applied to form inputs when focused, providing an accessible visual indicator.
- **Accent_Dim**: The low-opacity tinted background used for hover states on ghost buttons and accent-dim areas.

---

## Requirements

### Requirement 1: Replace Accent Color Tokens in Light Mode

**User Story:** As a developer, I want the CSS accent color tokens in light mode to use a red/rose palette, so that all interactive elements display the new brand color.

#### Acceptance Criteria

1. THE Theme_System SHALL define `--accent` as `#DC2626` (crimson red) in the `:root` block.
2. THE Theme_System SHALL define `--accent-hover` as `#B91C1C` (darker crimson) in the `:root` block.
3. THE Theme_System SHALL define `--accent-dim` as `#FEF2F2` (light rose tint) in the `:root` block.
4. WHEN the page renders in Light_Mode, THE Theme_System SHALL replace all instances of the previous blue accent (`#2563EB`) with `--accent` (`#DC2626`).
5. WHEN the page renders in Light_Mode, THE Theme_System SHALL replace all instances of the previous blue hover (`#1D4ED8`) with `--accent-hover` (`#B91C1C`).
6. IF any CSS token fails to apply, THE Theme_System SHALL allow the page to render with the previously defined color rather than blocking page rendering.

### Requirement 2: Replace Accent Color Tokens in Dark Mode

**User Story:** As a developer, I want the CSS accent color tokens in dark mode to use a red/rose palette, so that the dark theme is consistent with the new brand identity.

#### Acceptance Criteria

1. THE Theme_System SHALL define `--accent-dim` as `#450A0A` (deep dark-red tint) in the `body.dark` block.
2. WHILE Dark_Mode is active, THE Theme_System SHALL apply `--accent` as `#DC2626` and `--accent-hover` as `#B91C1C` (inherited from `:root`, no override required).
3. WHEN the page renders in Dark_Mode, THE Theme_System SHALL automatically convert all focus rings, button backgrounds, and active states to use the red accent color, replacing any remaining blue accent usage.

### Requirement 3: Update Hero Section Gradient

**User Story:** As a user, I want the hero stat banner to display a bold red/rose gradient, so that the application immediately communicates its energetic new identity.

#### Acceptance Criteria

1. THE Hero_Section SHALL use `linear-gradient(135deg, #DC2626 0%, #9F1239 100%)` as its background.
2. WHEN the page loads in either Light_Mode or Dark_Mode, THE Hero_Section SHALL display the crimson-to-rose gradient instead of the previous blue-to-purple gradient.
3. THE Hero_Section SHALL maintain all existing padding and text color (white `#fff`) properties unchanged. Layout changes are permitted provided padding and text color are preserved.

### Requirement 4: Update Focus Ring Color

**User Story:** As a user, I want focused form inputs to show a red focus ring, so that interactive focus states match the new accent color.

#### Acceptance Criteria

1. WHEN a form input or select element receives focus in Light_Mode, THE Theme_System SHALL render a `box-shadow` of `0 0 0 3px rgba(220,38,38,.15)` (red tint) instead of the previous blue tint.
2. WHEN a form input or select element receives focus in Dark_Mode, THE Theme_System SHALL render a `box-shadow` consistent with the red accent at appropriate opacity.

### Requirement 5: Update Category Palette — First Slot

**User Story:** As a developer, I want the first category color slot to use red instead of blue, so that the donut chart and transaction icons align with the new primary brand color.

#### Acceptance Criteria

1. THE Theme_System SHALL define `--cat-0` as `#DC2626` in the `:root` block.
2. WHEN the chart renders, THE Theme_System SHALL use `--cat-0` (`#DC2626`) for the first category segment instead of the previous `#2563EB`.
3. THE Theme_System SHALL leave `--cat-1` through `--cat-7` values unchanged to preserve visual variety in multi-category charts.

### Requirement 6: Backward Compatibility and Scope

**User Story:** As a developer, I want all other design tokens (background, surface, border, text, danger, success, typography) to remain unchanged, so that the theme update does not unintentionally break unrelated UI areas.

#### Acceptance Criteria

1. THE Theme_System SHALL NOT change `--bg`, `--surface`, `--surface2`, `--border`, `--text`, `--muted`, `--danger`, `--danger-dim`, `--success`, `--radius`, `--radius-sm`, `--shadow`, or `--font` values.
2. THE Theme_System SHALL NOT modify any HTML structure, JavaScript logic, CSS class additions, or JavaScript state variables in `index.html` or `js/app.js`.
3. THE Theme_System SHALL apply all color changes exclusively within `css/style.css`.
4. WHEN both Light_Mode and Dark_Mode are toggled, THE Theme_System SHALL correctly display red/rose accent colors in each mode with no blue remnants visible.
