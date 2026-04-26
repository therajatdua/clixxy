import Link from "next/link";
import { BarChart2, Shield, Zap } from "lucide-react";
import HeroText from "@/components/landing/HeroText";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { FaInstagram, FaYoutube, FaTiktok, FaSnapchatGhost, FaWhatsapp, FaFacebookF } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-[#2b2b2b] selection:text-text-primary pb-32">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-20">
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-surface-hover text-text-primary rounded font-medium tracking-wide border border-border shadow-sm text-lg">
              CLIXY™
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide text-gray-400 uppercase">
            <Link href="#features" className="hover:text-text-primary transition-colors">Features</Link>
            <Link href="#stats" className="hover:text-text-primary transition-colors">Analytics</Link>
            <Link href="#pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <ThemeSwitcher />
            <Link
              href="/login"
              className="text-sm font-medium hover:text-text-primary uppercase transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="hidden sm:inline-block px-5 py-2.5 text-sm font-medium bg-transparent border border-border text-text-primary rounded-full hover:bg-surface-hover transition-all tracking-wide shadow-sm"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 flex flex-col items-center text-center overflow-hidden">
        {/* Subtle starry background overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="w-full relative z-10 px-4">
          <HeroText firstLine="LET'S TRACK" secondLine="YOUR AUDIENCE" />
        </div>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mt-6 mb-10 leading-relaxed z-10 font-medium px-4">
          Turn <span className="text-text-primary font-medium">Links into Insights</span> and <span className="text-text-primary font-medium">Visitors into Growth</span> — with powerful tracking analytics.
        </p>

        <div className="z-10 relative group inline-block">
          <div className="absolute inset-0 bg-white blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-full pointer-events-none" />
          <Link
            href="/signup"
            className="relative z-10 flex items-center gap-2 px-8 py-4 bg-white hover:bg-surface dark:bg-surface-hover text-text-primary rounded-full font-medium text-lg transition-transform hover:scale-105 active:scale-95 tracking-wide shadow-lg"
          >
            Start Tracking Now
          </Link>
        </div>
      </section>

      {/* Logos */}
      <section className="mt-32 w-full overflow-hidden border-t border-border pt-12 pb-12">
        <p className="text-center text-sm font-bold tracking-widest uppercase text-text-muted mb-8">Trusted by creators across</p>
        <div className="flex max-w-[1000px] mx-auto px-6 justify-center items-center gap-8 flex-wrap">
          {[
            { name: "Instagram", icon: FaInstagram },
            { name: "YouTube", icon: FaYoutube },
            { name: "TikTok", icon: FaTiktok },
            { name: "Snapchat", icon: FaSnapchatGhost },
            { name: "WhatsApp", icon: FaWhatsapp },
            { name: "Facebook", icon: FaFacebookF }
          ].map(platform => (
            <div key={platform.name} className="flex items-center gap-2 text-xl font-medium tracking-tight text-text-muted hover:text-accent transition-all cursor-pointer">
              <platform.icon className="w-6 h-6" />
              <span className="hidden sm:inline-block">{platform.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 max-w-[1400px] mx-auto px-6 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-text-primary mb-4">Everything you need</h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">Powerful features disguised in an intuitive, beautifully simple interface.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Lightning Fast", desc: "No delays. Redirects happen seamlessly and instantly around the globe.", icon: Zap },
            { title: "Deep Analytics", desc: "Track devices, referrers, locations, and browsers in real-time.", icon: BarChart2 },
            { title: "Secure & Private", desc: "Your data is yours. Enterprise-grade security for peace of mind.", icon: Shield },
          ].map((f, i) => (
            <div key={i} className="card p-8 rounded-2xl border border-border bg-surface hover:border-accent transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-bg border border-border flex items-center justify-center mb-6 shadow-sm text-accent">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-3">{f.title}</h3>
              <p className="text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics */}
      <section id="stats" className="py-24 bg-surface border-y border-border">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-text-primary mb-6">Know your audience</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-12">
            Stop guessing where your audience comes from. Our analytics dashboard gives you
            the full picture of your marketing efforts.
          </p>
          <div className="w-full max-w-4xl mx-auto bg-bg border border-border rounded-xl aspect-video shadow-2xl overflow-hidden flex items-center justify-center p-8">
            <div className="text-text-muted font-medium flex flex-col items-center">
              <BarChart2 className="w-16 h-16 mb-4 opacity-50" />
              <p>Sign in to view your real-time analytics dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 max-w-[1400px] mx-auto px-6 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-text-primary mb-4">Simple, transparent pricing</h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">Start for free, upgrade when you need more power.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card p-8 rounded-2xl border border-border bg-surface">
            <h3 className="text-2xl font-medium text-text-primary mb-2">Starter</h3>
            <p className="text-text-secondary mb-6">Perfect for side projects and individuals.</p>
            <p className="text-4xl font-medium text-text-primary mb-8">₹0<span className="text-lg text-text-muted">/mo</span></p>
            <ul className="space-y-4 mb-8 text-text-primary">
              <li className="flex items-center gap-3"><span className="text-accent">✓</span> Up to 50 links</li>
              <li className="flex items-center gap-3"><span className="text-accent">✓</span> Basic analytics</li>
              <li className="flex items-center gap-3"><span className="text-accent">✓</span> Standard support</li>
            </ul>
            <Link href="/signup" className="block text-center w-full py-3 rounded-lg border border-border font-medium text-text-primary hover:bg-surface-hover transition-colors">Get Started</Link>
          </div>
          <div className="card p-8 rounded-2xl border-2 border-accent bg-surface relative shadow-xl">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
            <h3 className="text-2xl font-medium text-text-primary mb-2">Pro</h3>
            <p className="text-text-secondary mb-6">For power users and growing businesses.</p>
            <p className="text-4xl font-medium text-text-primary mb-8">₹499<span className="text-lg text-text-muted">/mo</span></p>
            <ul className="space-y-4 mb-8 text-text-primary">
              <li className="flex items-center gap-3"><span className="text-accent">✓</span> Unlimited links</li>
              <li className="flex items-center gap-3"><span className="text-accent">✓</span> Advanced real-time analytics</li>
              <li className="flex items-center gap-3"><span className="text-accent">✓</span> Priority support</li>
            </ul>
            <Link href="/signup" className="block text-center w-full py-3 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition-colors shadow-md">Upgrade to Pro</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
