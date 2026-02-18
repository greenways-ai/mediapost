"use client";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { 
  Calendar, 
  BarChart3, 
  Share2, 
  Zap, 
  Clock, 
  Layers,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  ArrowRight
} from "lucide-react";

const platforms = [
  { name: "Instagram", icon: Instagram, color: "#E4405F" },
  { name: "Twitter/X", icon: Twitter, color: "#1DA1F2" },
  { name: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  { name: "Facebook", icon: Facebook, color: "#1877F2" },
  { name: "YouTube", icon: Youtube, color: "#FF0000" },
  { name: "TikTok", icon: Share2, color: "#00f2ea" },
];

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Schedule posts for optimal times. Our AI suggests the best moments to maximize engagement."
  },
  {
    icon: Layers,
    title: "Content Calendar",
    description: "Visualize your content strategy with an intuitive drag-and-drop calendar interface."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track performance across all platforms. Understand what content resonates with your audience."
  },
  {
    icon: Zap,
    title: "Auto-Publishing",
    description: "Set it and forget it. Posts go live automatically across all your connected accounts."
  },
  {
    icon: MessageSquare,
    title: "Unified Inbox",
    description: "Respond to comments and messages from all platforms in one centralized inbox."
  },
  {
    icon: Clock,
    title: "Best Time to Post",
    description: "AI-powered recommendations based on your audience's activity patterns."
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Features
            </Link>
            <Link href="#platforms" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Platforms
            </Link>
            <Link href="#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="btn-primary hidden sm:flex text-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative px-6 py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          
          {/* Gradient Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-[1400px] mx-auto relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Column */}
              <div className="space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 badge-accent">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Now with AI-powered scheduling</span>
                </div>

                <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
                  <span className="text-text-primary">Manage all your </span>
                  <span className="text-accent">social media</span>
                  <span className="text-text-primary"> in one place</span>
                </h1>

                <p className="text-text-secondary text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Schedule posts, track analytics, and engage with your audience across Instagram, Twitter, LinkedIn, and more — all from a single dashboard.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link href="/login" className="btn-primary">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button className="btn-secondary">
                    Watch Demo
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start pt-4">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Dashboard Preview */}
              <div className="relative">
                <div className="card-elevated p-2 lg:p-4 relative z-10">
                  {/* Mock Dashboard */}
                  <div className="bg-surface-sunken rounded-lg p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-info" />
                        <div>
                          <div className="text-sm font-medium text-text-primary">Content Calendar</div>
                          <div className="text-xs text-text-tertiary">October 2026</div>
                        </div>
                      </div>
                      <button className="btn-primary text-xs py-2">
                        <PlusIcon className="w-4 h-4" />
                        New Post
                      </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 text-center text-xs">
                      {['S','M','T','W','T','F','S'].map((day, i) => (
                        <div key={i} className="text-text-tertiary py-1">{day}</div>
                      ))}
                      {Array.from({ length: 31 }, (_, i) => (
                        <div 
                          key={i} 
                          className={`aspect-square rounded-lg flex items-center justify-center text-text-secondary
                            ${[5, 12, 15, 19, 23, 28].includes(i + 1) 
                              ? 'bg-accent/20 text-accent font-medium' 
                              : 'hover:bg-surface-hover'
                            }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-divider">
                      <div className="text-center">
                        <div className="text-lg font-bold text-accent">12.5K</div>
                        <div className="text-xs text-text-tertiary">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-info">8.2%</div>
                        <div className="text-xs text-text-tertiary">Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-warning">2.4K</div>
                        <div className="text-xs text-text-tertiary">Reach</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 card p-3 shadow-lg animate-in">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-text-tertiary">Engagement up</div>
                      <div className="text-sm font-bold text-accent">+24.5%</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 card p-3 shadow-lg animate-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span className="text-sm text-text-secondary">3 posts scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section id="platforms" className="px-6 py-16 border-t border-divider">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-text-primary mb-4">
                Connect all your favorite platforms
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Manage Instagram, Twitter, LinkedIn, Facebook, and more from one central hub. 
                No more switching between apps.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {platforms.map((platform) => (
                <div 
                  key={platform.name}
                  className="card p-4 flex items-center gap-3 hover:border-accent/50 transition-colors cursor-pointer group"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${platform.color}20` }}
                  >
                    <platform.icon className="w-5 h-5" style={{ color: platform.color }} />
                  </div>
                  <span className="font-medium text-text-primary">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
              <span className="badge-accent mb-4 inline-block">Features</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                Everything you need to grow your audience
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Powerful tools designed to save you time and maximize your social media impact.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="card p-6 hover:border-accent/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Analytics Preview Section */}
        <section className="px-6 py-20 border-t border-divider">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="badge-accent mb-4 inline-block">Analytics</span>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                  Understand what works
                </h2>
                <p className="text-text-secondary mb-8 leading-relaxed">
                  Get detailed insights into your content performance. Track engagement rates, 
                  follower growth, and optimal posting times across all platforms.
                </p>

                <div className="space-y-4">
                  {[
                    { label: "Engagement Rate", value: "8.2%", change: "+1.4%" },
                    { label: "Total Reach", value: "48.2K", change: "+12%" },
                    { label: "Profile Visits", value: "3.1K", change: "+8%" },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between card p-4">
                      <div>
                        <div className="text-sm text-text-secondary">{stat.label}</div>
                        <div className="text-xl font-bold text-text-primary">{stat.value}</div>
                      </div>
                      <span className="badge-accent">{stat.change}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart Preview */}
              <div className="card-elevated p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Engagement Growth</div>
                    <div className="stat-value text-accent">+128%</div>
                  </div>
                  <select className="bg-surface-sunken border border-border rounded-lg px-3 py-1.5 text-sm text-text-secondary">
                    <option>Last 30 days</option>
                    <option>Last 7 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                
                {/* Bar Chart */}
                <div className="h-48 flex items-end gap-2">
                  {[35, 55, 40, 70, 50, 85, 65, 75, 60, 90, 80, 95].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm transition-all duration-500 hover:opacity-80"
                      style={{
                        height: `${height}%`,
                        background: i >= 8 
                          ? 'linear-gradient(180deg, var(--accent) 0%, var(--accent-dark) 100%)'
                          : 'var(--surface-hover)',
                      }}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between mt-4 text-text-tertiary text-xs">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="card-elevated p-8 lg:p-12 text-center relative overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-info/5 pointer-events-none" />
              
              <div className="relative z-10">
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                  Ready to streamline your social media?
                </h2>
                <p className="text-text-secondary max-w-2xl mx-auto mb-8">
                  Join thousands of creators and businesses who save hours every week with MyPost.
                  Start your free trial today.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/login" className="btn-primary text-lg px-8">
                    Get Started Free
                  </Link>
                  <button className="btn-secondary text-lg px-8">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-divider">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-2 md:col-span-1">
                <Logo size="sm" className="mb-4" />
                <p className="text-text-secondary text-sm">
                  The all-in-one social media management platform for creators and businesses.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-text-primary mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li><Link href="#" className="hover:text-accent transition-colors">Features</Link></li>
                  <li><Link href="#" className="hover:text-accent transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-accent transition-colors">Integrations</Link></li>
                  <li><Link href="#" className="hover:text-accent transition-colors">Changelog</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-text-primary mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li><Link href="#" className="hover:text-accent transition-colors">About</Link></li>
                  <li><Link href="#" className="hover:text-accent transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-accent transition-colors">Careers</Link></li>
                  <li><Link href="#" className="hover:text-accent transition-colors">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-text-primary mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li><Link href="#" className="hover:text-accent transition-colors">Privacy</Link></li>
                  <li><Link href="#" className="hover:text-accent transition-colors">Terms</Link></li>
                  <li><Link href="#" className="hover:text-accent transition-colors">Security</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-divider">
              <p className="text-text-tertiary text-sm">
                © 2026 MyPost. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link href="#" className="text-text-tertiary hover:text-accent transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-text-tertiary hover:text-accent transition-colors">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-text-tertiary hover:text-accent transition-colors">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Plus icon component
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
