# LCR Labs Web — Design System

The website is the fourth surface of the LCR Labs design language, after
Background Doctor, Threadmark and Edgehold. It is not a separate brand exercise:
the palette, the accent and the spacing rhythm are taken from the apps so the
site and the software read as one product family.

## Principles

- **Native-macOS restraint.** The site should look like it was made by the same
  people who made the apps — precise spacing, real hierarchy, quiet surfaces.
- **Products are the page.** Everything else is support.
- **Nothing decorative that costs something.** No webfonts, no libraries, no
  continuously running work outside one hero-scoped animation.
- **Say only what is true.** No invented features, no dead CTAs, no fake price.

Explicitly avoided: neon, heavy glow, glassmorphism beyond a single toolbar
treatment, oversized gradients, decorative blobs, card-in-card stacking, pill
overuse, giant marketing headlines, scroll-triggered choreography, and the
generic AI-SaaS dashboard look.

## Colour

Every colour is a semantic token in [`src/styles/tokens.css`](../src/styles/tokens.css).
A raw hex value anywhere else is a bug.

The accent is Background Doctor's `AccentColor` asset, unchanged:

| | Light | Dark |
|---|---|---|
| `--accent` | `#7C3AED` | `#A78BFA` |

Purple identifies the brand. It marks primary actions, links, highlight bullets
and focus rings — never a page background, never a status. Status colours
(`--success`, `--warning`, `--danger`, `--info`) are the Apple system colours the
apps' `StatusColor` maps onto, and they carry meaning only.

Dark mode is a graphite suite, not OLED black: the page sits at `#0E0F12` with
surfaces at `#16181D`. Light mode is tuned separately (`#FBFBFC` page, white
surfaces, softer borders) rather than being an inversion.

### How theming works

Each colour is declared **once**:

```css
--surface: light-dark(#ffffff, #16181d);
```

`color-scheme: light dark` on `:root` makes the document follow the system.
The header toggle sets `data-theme="light"` or `"dark"` on `<html>`, which
narrows `color-scheme` and re-resolves every `light-dark()` at once.

Consequences to respect:

- Never define a colour only inside a media query.
- Never add a second theming mechanism.
- The stored choice is re-applied before first paint by an inline script in
  `BaseLayout`; with JavaScript unavailable the system appearance still works,
  and the toggle simply never appears.

## Typography

The system stack — San Francisco on Apple platforms. No font is downloaded, so
no font service ever sees a visitor's IP address.

Sizes run `--text-xs` (12px) to `--text-4xl` (48px). Headings are 600 weight with
negative tracking; `h1` and `h2` use `clamp()` so they scale with the viewport
instead of stepping at breakpoints. Body copy is `--text-base` (15px) at
`--leading-normal`, and measure is capped (`46–56ch`, `--content-narrow` for
prose) — long lines are the most common way a clean layout stops being readable.

## Space, shape, layout

A 4px scale (`--space-1` … `--space-24`). Radii are `6 / 10 / 14px`, where 10px
matches the apps' card corner radius.

Content is capped at `--content-width: 1200px` with a gutter that widens at
768px. Sections share one vertical rhythm through `.section`, rather than each
band inventing its own padding.

Breakpoints, used sparingly: `48rem` (768px) for the header, principles and
feature grids; `60rem` (960px) for the two-column product rows and product hero.

## Motion

`--duration-fast: 120ms` for hover feedback, `--duration: 200ms` for state
changes. Interaction motion is limited to colour and border transitions.

The only ambient motion is `OrbitalField` in the homepage hero: three rings
echoing the ringed planet in the LCR Labs mark, animating `transform` only so
the work stays on the compositor, at 210–470 seconds per revolution. No canvas,
no WebGL, no library, no pointer tracking, no scroll listener, and nothing
animating below the hero.

Under `prefers-reduced-motion: reduce` the rings hold a fixed tilt and the
composition still reads as finished — which is also exactly what a visitor sees
if CSS animation never runs. `global.css` carries a blanket reduced-motion
override on top of that.

## Components

| Component | Responsibility |
|---|---|
| `Button` | The only button. `<a>` when given `href`, `<button>` otherwise. |
| `Logo` | Mark + wordmark. The mark is a CSS mask over `currentColor`. |
| `Header` | Navigation, appearance toggle, compact-width `<details>` menu. |
| `Footer` | Links and copyright. |
| `OrbitalField` | The hero background. |
| `ProductRow` | A homepage product, told at full width. |
| `ProductCard` | A `/products` listing entry. |
| `ProductSlot` | A reserved, unannounced product. |
| `ProductVisual` | Screenshot frame, or an honest empty frame. |
| `SetappAction` | The only component that may render an outbound Setapp link. |
| `StatusBadge` | Availability, in status colour. |
| `DraftNotice` | Marks unreviewed legal/support content. Visible in production. |

Rules for a new component:

1. Tokens only — no literal colours, spacings or durations.
2. Scoped styles do not reach into a child component. Wrap the child in an
   element this component owns instead of passing it a class to be styled.
3. Interactive elements keep a visible focus ring. `:focus-visible` is styled
   once globally and must not be removed.
4. No hover-only affordance, and no control that does nothing without
   JavaScript — hide it instead, as `ThemeToggle` does.

## The brand mark

`public/brand/lcr-mark.png` is the ringed planet, cropped from the same asset the
macOS apps ship. It is drawn as a `mask-image` over `currentColor`, mirroring
`.renderingMode(.template)` in the apps, so one file serves both appearances and
inherits its context's colour. `lcr-lockup.png` is the full stacked lockup;
`lcr-icon-512.png`, `favicon-32.png` and `apple-touch-icon.png` are the white
mark on the accent; `og-default.jpg` is the social card.

## Accessibility

Target is WCAG 2.2 AA. Non-negotiable:

- Semantic landmarks, one `h1` per page, headings in order.
- A skip link, and a visible focus ring on everything focusable.
- Alt text on every meaningful image; decoration is `aria-hidden`.
- `aria-current="page"` on the active navigation item.
- Reduced motion respected.
- Nothing conveyed by colour alone — status badges pair a colour with a word.
