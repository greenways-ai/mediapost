# MyPost Design System

A modern social media management platform with a bold, dark-mode-first aesthetic inspired by high-end SaaS products.

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
| `--alert` | `#ff2d55` | `#ff4757` | Errors, warnings |
| `--alert-light` | `#ff4757` | `#ff6b7a` | Glows |
| `--alert-dark` | `#e6294b` | `#ff2d55` | Hover states |

### Info & Warning
| Token | Value | Usage |
|-------|-------|-------|
| `--info` | `#00d4ff` | Information, secondary accent |
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

### Text Gradients
```tsx
<span className="text-gradient">Gradient Text</span>
<span className="text-gradient-alt">Multi-color Gradient</span>
```

### Live Indicator
```tsx
<span className="badge-accent pulse-live">Live</span>
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

## 🚀 Usage Examples

### Hero Section (Buffer-style)
```tsx
<section className="relative px-6 py-20">
  <div className="absolute inset-0 grid-pattern opacity-30" />
  
  <div className="max-w-[1400px] mx-auto">
    <div className="inline-flex items-center gap-2 badge-accent mb-6">
      <Zap className="w-3.5 h-3.5" />
      <span>Now with AI-powered scheduling</span>
    </div>

    <h1 className="font-display text-5xl font-bold text-text-primary">
      Manage all your <span className="text-accent">social media</span>
    </h1>
    
    <p className="text-text-secondary text-lg max-w-lg mt-6">
      Schedule posts, track analytics, and engage with your audience 
      across Instagram, Twitter, LinkedIn, and more.
    </p>
  </div>
</section>
```

### Dashboard Stat Card
```tsx
<div className="card p-5">
  <div className="flex items-center justify-between mb-3">
    <div className="p-2 rounded-lg bg-accent/10">
      <TrendingUp className="w-5 h-5 text-accent" />
    </div>
    <span className="stat-delta-positive text-sm">+24%</span>
  </div>
  <div className="stat-value text-2xl">8.5%</div>
  <div className="stat-label mt-1">Engagement Rate</div>
</div>
```

### Platform Connection Card
```tsx
<div className="card p-4 flex items-center gap-3 hover:border-accent/50 transition-colors">
  <div className="w-10 h-10 rounded-lg bg-[#E4405F]/10 flex items-center justify-center">
    <Instagram className="w-5 h-5" style={{ color: '#E4405F' }} />
  </div>
  <div className="flex-1">
    <div className="font-medium text-text-primary">Instagram</div>
    <div className="text-xs text-text-tertiary">@yourbrand</div>
  </div>
  <div className="w-2 h-2 rounded-full bg-accent" />
</div>
```

## 📁 File Structure

```
src/
├── app/
│   ├── globals.css       # Theme variables & component classes
│   ├── layout.tsx        # Root layout with ThemeProvider
│   ├── page.tsx          # Landing page (Buffer-style)
│   ├── login/
│   │   └── page.tsx      # Auth page
│   └── dashboard/
│       └── page.tsx      # Dashboard
├── components/
│   ├── ThemeProvider.tsx # Theme context provider
│   ├── ThemeToggle.tsx   # Theme toggle button
│   └── Logo.tsx          # MP Logo component
├── tailwind.config.ts    # Extended Tailwind config
```

## 🎯 Key Design Principles

1. **Buffer-inspired Layout**: Clean, feature-focused sections with clear CTAs
2. **High Contrast**: Strong contrast between background and text
3. **Neon Accents**: Vibrant green for CTAs and positive metrics
4. **Bold Typography**: Space Grotesk for headlines
5. **Card-based UI**: Elevated cards with subtle shadows
6. **Platform Colors**: Use official brand colors for social platform icons
7. **Data Visualization**: Charts and stats prominently displayed

## 🔌 Platform Brand Colors

| Platform | Color |
|----------|-------|
| Instagram | `#E4405F` |
| Twitter/X | `#1DA1F2` |
| LinkedIn | `#0A66C2` |
| Facebook | `#1877F2` |
| YouTube | `#FF0000` |
| TikTok | `#00f2ea` / `#ff0050` |
