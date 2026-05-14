# Design Context: Stitch Identity V2 (Synthetic Indigo)

## Aesthetic Scene
"A developer in a quiet room at 3am, illuminated only by a warm desk lamp and the deep violet glow of a monitor, where focus is absolute and the world outside is a blur of indigo shadows."

## Color Strategy: Drenched (Synthetic Indigo)
We use a high-chroma, immersive indigo base with vibrant magenta highlights to create a sense of depth and focus.

### Dark Mode (Late Night Study)
- **Background**: `oklch(12% 0.02 285)` (Midnight Deep Indigo)
- **Surface**: `oklch(16% 0.03 285)` (Shadowed Violet)
- **Primary**: `oklch(65% 0.22 330)` (Neon Magenta Glow)
- **Accent**: `oklch(75% 0.15 45)` (Lamp Warmth / Gold)
- **Text Primary**: `oklch(95% 0.01 285)`
- **Border**: `oklch(25% 0.04 285 / 0.4)` (Ghost Border)

### Light Mode (Morning Fog)
- **Background**: `oklch(98% 0.01 285)` (Foggy White)
- **Surface**: `oklch(96% 0.01 285)` (Soft Pearl)
- **Primary**: `oklch(60% 0.18 330)` (Vibrant Orchid)
- **Accent**: `oklch(65% 0.12 45)` (Burnished Amber)
- **Border**: `oklch(85% 0.02 285)` (Mist Border)

## Typography
- **Primary Font**: 'Inter Variable', sans-serif
- **Scale**: 1.25 ratio (Major Third)
- **Max Line Length**: 70ch

## Components
- **Buttons**: Pill-shaped, high-chroma magenta. Large touch targets.
- **Inputs**: Rounded (1rem), semi-transparent background (`bg-input/50`), long transitions (500ms).
- **Cards**: "Thin Glass" strategy. Deep backdrop blur (32px), subtle primary/accent gradients in the background (`::before`).
- **Glow**: Subtle pulsing glow animation on primary focus states.
