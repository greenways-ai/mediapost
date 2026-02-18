# Statstrade Design System

A bold, gaming/analytics-inspired design system featuring neon green accents, deep dark mode, and clean light mode variants.

## 🎨 Color Palette

### Primary Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--background` | `#fafafa` | `#0a0a0a` | Page background |
| `--surface` | `#ffffff` | `#141414` | Card backgrounds |
| `--surface-elevated` | `#ffffff` | `#1a1a1a` | Elevated cards |
| `--surface-sunken` | `#f5f5f5` | `#0d0d0d` | Input backgrounds |
| `--surface-hover` | `#f0f0f0` | `#1f1f1f` | Hover states |

### Accent Colors (Neon Green)
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--accent` | `#00c853` | `#00e676` | Primary actions, success |
| `--accent-light` | `#00e676` | `#00ff88` | Glows, highlights |
| `--accent-dark` | `#00b248` | `#00c853` | Hover states |
| `--accent-muted` | `rgba(0,200,83,0.15)` | `rgba(0,230,118,0.15)` | Subtle backgrounds |

### Alert Colors (Vibrant Red)
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--alert` | `#ff2d55` | `#ff4757` | Errors, warnings, danger |
| `--alert-light` | `#ff4757` | `#ff6b7a` | Glows |
| `--alert-dark` | `#e6294b` | `#ff2d55` | Hover states |

### Info & Warning
| Token | Value | Usage |
|-------|-------|-------|
| `--info` | `#00d4ff` | Information, links |
| `--warning` | `#ff9500` | Warnings, pending states |

### Text Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--text-primary` | `#0a0a0a` | `#ffffff` | Headlines, primary text |
| `--text-secondary` | `#737373` | `#a1a1aa` | Body text |
| `--text-tertiary` | `#a3a3a3` | `#71717a` | Muted text, labels |

## 🔤 Typography

### Font Families
- **Display/Headlines**: `Space Grotesk` - Bold, geometric, modern
- **Body/UI**: `Inter` - Clean, highly readable
- **Mono/Code**: `JetBrains Mono` or `Fira Code`

### Font Sizes (Display)
| Token | Size | Usage |
|-------|------|-------|
| `display-xl` | 6rem (96px) | Hero headlines |
| `display-lg` | 4.5rem (72px) | Large headlines |
| `display-md` | 3.5rem (56px) | Section headlines |
| `display-sm` | 2.5rem (40px) | Subsection headlines |
| `display-xs` | 1.75rem (28px) | Card titles |

## 🧩 Components

### Buttons
```tsx
// Primary (Green with glow)
<button className="btn-primary">Get Started</button>

// Secondary (Outline)
<button className="btn-secondary">Cancel</button>

// Alert (Red)
<button className="btn-alert">Delete</button>

// Ghost (Transparent)
<button className="btn-ghost">More options</button>
```

### Cards
```tsx
// Basic card
<div className="card">Content</div>

// Elevated card (with shadow)
<div className="card-elevated">Content</div>

// Glass card (translucent)
<div className="card-glass">Content</div>
```

### Badges
```tsx
<span className="badge-accent">Active</span>
<span className="badge-alert">Warning</span>
<span className="badge-warning">Pending</span>
```

### Stats
```tsx
<div className="stat-card">
  <div className="stat-value">+248%</div>
  <div className="stat-label">Engagement</div>
</div>
```

## 🌗 Dark/Light Mode

The design system supports both dark and light modes via CSS custom properties. Toggle using the `ThemeProvider`:

```tsx
import { useTheme } from '@/components/ThemeProvider';

function MyComponent() {
  const { setTheme, resolvedTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

Or use the built-in `ThemeToggle` component:
```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

<ThemeToggle />
```

## ✨ Special Effects

### Glow Effects
```tsx
// Green glow
<div className="glow-green">Content</div>

// Red glow
<div className="glow-red">Content</div>

// Text glow
<span className="glow-text">Glowing Text</span>
```

### Text Outline
```tsx
// Creates outline text effect like "EVERY" in the design
<span className="text-outline">OUTLINE</span>
```

### Text Gradients
```tsx
<span className="text-gradient">Gradient Text</span>
<span className="text-gradient-alt">Multi-color Gradient</span>
```

### Live Indicator
```tsx
<span className="badge-alert pulse-live">Live Terminal</span>
```

### Progress Bar
```tsx
<div className="progress-bar">
  <div className="progress-bar-fill" style={{ width: '75%' }} />
</div>
```

## 📐 Spacing & Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Small buttons, tags |
| `radius-md` | 10px | Buttons, inputs |
| `radius-lg` | 16px | Cards |
| `radius-xl` | 24px | Large cards, modals |
| `radius-full` | 9999px | Pills, avatars |

## 🎭 Design Motifs from Image

### 1. "YOUR CONTENT IS THE MARKET"
- Bold, italic display typography
- Green accent on key words
- Dark background with subtle grid pattern

### 2. "ONE MARKET / EVERY PLATFORM"
- Outline text effect for emphasis
- Central hub design with connecting elements
- Platform icons in a circular arrangement

### 3. Stats & Analytics Cards
- Large numeric values with Space Grotesk font
- Small uppercase labels
- Green/red color coding for positive/negative

### 4. Engagement Charts
- Bar charts with gradient fills
- "Surge Detected" badges
- Time-series indicators

### 5. Live Terminal Feel
- Monospace font for technical details
- "Live" pulse indicators
- Version badges

## 🚀 Usage Examples

### Hero Section
```tsx
<section className="relative px-6 py-20">
  <div className="absolute inset-0 grid-pattern opacity-50" />
  <h1 className="font-display text-5xl font-bold">
    YOUR <span className="text-accent">CONTENT</span>
    <br />
    <span className="italic">IS THE </span>
    <span className="text-accent italic">MARKET</span>
  </h1>
</section>
```

### Stat Card with Trend
```tsx
<div className="stat-card">
  <div className="flex items-center justify-between mb-2">
    <span className="stat-label">Engagement Delta</span>
    <span className="badge-accent">+24%</span>
  </div>
  <div className="stat-value text-accent">+248%</div>
  <div className="mt-4 progress-bar">
    <div className="progress-bar-fill" style={{ width: '84%' }} />
  </div>
</div>
```

### Alert Card
```tsx
<div className="bg-alert rounded-2xl p-6 text-white shadow-glow-red">
  <div className="font-display text-2xl font-bold">TOP 1% OF CREATORS</div>
  <p className="text-sm opacity-80 mt-2">
    Your audience is more active than 99% of users.
  </p>
  <button className="w-full mt-4 py-3 bg-white text-alert font-bold rounded-lg">
    CLAIM YOUR DASHBOARD
  </button>
</div>
```

## 📁 File Structure

```
src/
├── app/
│   ├── globals.css       # Theme variables & component classes
│   ├── layout.tsx        # Root layout with ThemeProvider
│   └── page.tsx          # Landing page
├── components/
│   ├── ThemeProvider.tsx # Theme context provider
│   ├── ThemeToggle.tsx   # Theme toggle button
│   └── Logo.tsx          # Logo component
├── tailwind.config.ts    # Extended Tailwind config
```

## 🎯 Key Design Principles

1. **High Contrast**: Strong contrast between background and text
2. **Neon Accents**: Vibrant green (#00e676 in dark) for CTAs and highlights
3. **Bold Typography**: Space Grotesk for headlines, tight letter-spacing
4. **Glassmorphism**: Subtle transparency with backdrop blur
5. **Data-First**: Stats and numbers are prominent
6. **Gaming Aesthetic**: Terminal vibes, live indicators, version badges
