"use client";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 badge-alert pulse-live pl-6">
              <span>Live Terminal v4.2</span>
            </div>
            <ThemeToggle />
            <Link href="/login" className="btn-primary hidden sm:flex">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative px-6 py-20 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-50" />
          <div className="max-w-[1600px] mx-auto relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 text-accent font-mono text-sm">
                  <span className="text-accent">/</span>
                  <span className="uppercase tracking-widest">Module: Multi-Sync</span>
                </div>

                <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-none">
                  <span className="text-text-primary">YOUR </span>
                  <span className="text-accent">CONTENT</span>
                  <br />
                  <span className="italic">IS THE </span>
                  <span className="text-accent italic">MARKET</span>
                </h1>

                <p className="text-text-secondary text-lg max-w-md leading-relaxed">
                  Predict the Unpredictable. Turn every post into a play-to-earn experience for your audience.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link href="/login" className="btn-primary">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Get Started
                  </Link>
                  <button className="btn-secondary">
                    View Documentation
                  </button>
                </div>

                {/* Active Market Card */}
                <div className="card-elevated p-6 mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge-accent">Active Market</span>
                    <span className="text-text-tertiary text-sm font-mono">#8842</span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-4 text-text-primary">
                    Will this video hit 1M views in 24hrs?
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-surface-sunken">
                      <div className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Probability</div>
                      <div className="text-2xl font-bold text-accent">78.4% YES</div>
                    </div>
                    <div className="p-4 rounded-lg bg-surface-sunken">
                      <div className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Odds</div>
                      <div className="text-2xl font-bold text-alert">1.25x RETURN</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="relative">
                <div className="text-center mb-12">
                  <div className="font-mono text-text-tertiary text-sm mb-2">mypost.greenways.ai</div>
                  <div className="font-display text-lg uppercase tracking-wider text-text-primary">Command Center</div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
                    <span className="text-text-primary">ONE MARKET</span>
                    <br />
                    <span className="text-outline text-3xl sm:text-4xl lg:text-5xl">EVERY PLATFORM</span>
                  </h2>
                </div>

                {/* Platform Icons */}
                <div className="flex justify-center items-center gap-6 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-accent transition-colors cursor-pointer">
                    <svg className="w-6 h-6 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-alert flex items-center justify-center shadow-glow-red animate-pulse">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-accent transition-colors cursor-pointer">
                    <svg className="w-6 h-6 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-1.5 5v4.793l-2.646-2.647-.708.708L12 13.207l4.854-4.853-.708-.708L13.5 10.793V7h-3zm0 6v3h3v-3h-3z"/>
                    </svg>
                  </div>
                </div>

                <p className="text-center text-text-secondary">
                  Sync your community across Twitch, YouTube, and X.
                  <br />
                  <span className="text-accent font-semibold">Gamify your influence.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="px-6 py-16 border-t border-divider">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Engagement Chart */}
              <div className="lg:col-span-2 card-elevated p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Engagement Delta</div>
                    <div className="stat-value text-accent">+248%</div>
                  </div>
                  <span className="badge-accent">Past 30 Days</span>
                </div>
                
                {/* Chart */}
                <div className="h-48 flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100, 80, 90].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm transition-all duration-500 hover:opacity-80"
                      style={{
                        height: `${height}%`,
                        background: i >= 10 
                          ? 'linear-gradient(180deg, var(--accent) 0%, var(--accent-dark) 100%)'
                          : 'rgba(0, 200, 83, 0.3)',
                        opacity: i >= 10 ? 1 : 0.6,
                      }}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between mt-4 text-text-tertiary text-xs font-mono">
                  <span>01</span>
                  <span>02</span>
                  <span>03</span>
                  <span>04</span>
                  <span className="text-accent">Surge Detected</span>
                </div>
              </div>

              {/* Stats Column */}
              <div className="space-y-6">
                {/* Uptime Badge */}
                <div className="card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-text-tertiary text-xs uppercase tracking-wider">System Health: Optimal</span>
                  </div>
                  <span className="font-display font-bold text-accent">99.9% UPTIME</span>
                </div>

                {/* Leaderboard Card */}
                <div className="bg-alert rounded-2xl p-6 text-white shadow-glow-red">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span className="text-xs uppercase tracking-wider opacity-80">Leaderboard Status</span>
                  </div>
                  <div className="font-display text-2xl font-bold mb-2">TOP 1% OF CREATORS</div>
                  <p className="text-sm opacity-80 mb-4">
                    Your audience is more active than 99% of users in the media tech category.
                  </p>
                  <button className="w-full py-3 bg-white text-alert font-bold rounded-lg hover:bg-opacity-90 transition-colors">
                    CLAIM YOUR DASHBOARD
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Stats */}
        <section className="px-6 py-12 border-t border-divider">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Retention Rate */}
              <div className="card p-6">
                <div className="text-text-tertiary text-xs uppercase tracking-wider mb-2">Retention Rate</div>
                <div className="flex items-baseline gap-1">
                  <span className="stat-value">84.2</span>
                  <span className="text-2xl font-bold text-accent">%</span>
                </div>
                <div className="mt-4 progress-bar">
                  <div className="progress-bar-fill" style={{ width: '84.2%' }} />
                </div>
              </div>

              {/* Conversion */}
              <div className="card p-6">
                <div className="text-text-tertiary text-xs uppercase tracking-wider mb-2">Conversion</div>
                <div className="flex items-baseline gap-1">
                  <span className="stat-value">12.5</span>
                  <span className="text-2xl font-bold text-accent">x</span>
                </div>
                <div className="mt-4 progress-bar">
                  <div className="progress-bar-fill" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Testimonial */}
              <div className="card p-6 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-text-secondary font-medium">Ready to Play?</span>
                </div>
                <p className="text-text-secondary text-sm italic">
                  &ldquo;Statstrade transformed my passive scrollers into active participants.&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-info" />
                  <span className="text-xs text-text-tertiary">@crypto_trader</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Turn Opinions Section */}
        <section className="px-6 py-20">
          <div className="max-w-[1600px] mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-text-primary">
              TURN OPINIONS
              <br />
              INTO <span className="text-accent">ANALYTICS</span>
            </h2>
            <p className="text-center text-text-secondary max-w-2xl mx-auto">
              Transform audience engagement into actionable insights. Every interaction becomes a data point, every opinion a market signal.
            </p>
            
            <div className="flex justify-center mt-8">
              <Link href="/login" className="btn-primary text-lg px-8 py-4">
                Start Trading Influence
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-divider">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-text-tertiary text-sm">
              © 2026 Statstrade. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
