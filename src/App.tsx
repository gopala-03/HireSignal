import React, { useState, FormEvent, ErrorInfo, ReactNode } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Database, 
  Filter, 
  LayoutDashboard, 
  Mail, 
  MessageSquareX, 
  PieChart, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { joinWaitlist } from './firebase';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error) {
            errorMessage = `Database Error: ${parsed.error}`;
          }
        }
      } catch {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
          <div className="max-w-md w-full glass-card rounded-2xl p-8 text-center shadow-xl">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-brand-primary mb-4">Application Error</h2>
            <p className="text-brand-muted mb-8">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-md bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitting(true);
      setError(null);
      try {
        await joinWaitlist(email);
        setIsSubmitted(true);
        setEmail('');
      } catch (err: any) {
        let msg = "Failed to join waitlist. Please try again.";
        try {
          const parsed = JSON.parse(err.message);
          msg = parsed.error || msg;
        } catch {
          msg = err.message || msg;
        }
        setError(msg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-primary text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-brand-primary">HireSignal</span>
          </div>
          <div className="hidden md:flex md:items-center md:gap-8">
            <a href="#problem" className="text-sm font-medium text-brand-muted hover:text-brand-primary transition-colors">The Problem</a>
            <a href="#solution" className="text-sm font-medium text-brand-muted hover:text-brand-primary transition-colors">How it Works</a>
            <a href="#features" className="text-sm font-medium text-brand-muted hover:text-brand-primary transition-colors">Features</a>
            <a href="#analytics" className="text-sm font-medium text-brand-muted hover:text-brand-primary transition-colors">Analytics</a>
          </div>
          <div>
            <a 
              href="#waitlist" 
              className="inline-flex items-center justify-center rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary transition-all"
            >
              Get Early Access
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white py-24 sm:py-32">
          <div className="data-grid absolute inset-0 opacity-20" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand-accent ring-1 ring-inset ring-blue-700/10 mb-6">
                  Now in Private Beta
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight text-brand-primary sm:text-6xl lg:text-7xl">
                  Turn Hiring Rejections into <span className="text-brand-accent">Intelligence.</span>
                </h1>
                <p className="mt-6 text-xl leading-8 text-brand-muted max-w-xl">
                  HireSignal is a hiring analytics platform that captures structured rejection data to improve your recruitment efficiency and pipeline visibility.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Identify specific skill gaps in your talent pipeline",
                    "Automate structured, low-risk candidate communication",
                    "Gain visibility into why top-of-funnel candidates drop off"
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-brand-accent" />
                      <span className="text-brand-primary font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                  <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter your work email"
                      className="block w-full rounded-md border-0 py-3 px-4 text-brand-primary shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-accent sm:text-sm sm:leading-6"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-none rounded-md bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                    </button>
                  </form>
                  <a href="#solution" className="text-sm font-semibold leading-6 text-brand-primary flex items-center gap-1 group">
                    Learn more <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
                {isSubmitted && (
                  <p className="mt-4 text-sm text-green-600 font-medium">
                    Thanks! We'll be in touch soon.
                  </p>
                )}
                {error && (
                  <p className="mt-4 text-sm text-red-600 font-medium">
                    {error}
                  </p>
                )}
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-amber-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div className="text-xs font-mono text-brand-muted">REJECTION_ANALYTICS_v1.0</div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                        <div className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">Total Rejections</div>
                        <div className="text-2xl font-bold text-brand-primary">1,284</div>
                        <div className="text-xs text-green-600 mt-1 font-medium">+12% vs last month</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                        <div className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">Avg. Time to Reject</div>
                        <div className="text-2xl font-bold text-brand-primary">4.2 Days</div>
                        <div className="text-xs text-brand-accent mt-1 font-medium">Target: &lt; 5 Days</div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                      <div className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-4">Primary Rejection Drivers</div>
                      <div className="space-y-3">
                        {[
                          { label: "Skill Mismatch", value: 42, color: "bg-brand-accent" },
                          { label: "Salary Expectations", value: 28, color: "bg-slate-400" },
                          { label: "Cultural Alignment", value: 15, color: "bg-slate-300" },
                          { label: "Role Redefinition", value: 10, color: "bg-slate-200" }
                        ].map((item, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span>{item.label}</span>
                              <span>{item.value}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                className={`h-full ${item.color}`} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-blue-400/10 blur-2xl" />
                <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-brand-primary/5 blur-3xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section id="problem" className="bg-brand-bg py-24 sm:py-32 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-brand-accent uppercase tracking-widest">The Problem</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-brand-primary sm:text-4xl">
                Recruitment is a black box of lost data.
              </p>
              <p className="mt-6 text-lg leading-8 text-brand-muted">
                Most companies track who they hire, but few understand why they reject. This lack of visibility leads to repeated mistakes and massive operational waste.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {[
                  {
                    title: "Invisible Pipeline Leaks",
                    description: "Recruiters reject hundreds of candidates weekly without structured data, making it impossible to identify where the hiring process is failing.",
                    icon: Filter
                  },
                  {
                    title: "Operational Inefficiency",
                    description: "Sourcing teams continue to find candidates with the same misaligned profiles because there is no feedback loop from the interview stage.",
                    icon: Clock
                  },
                  {
                    title: "Communication Bottlenecks",
                    description: "Manual rejection emails are either generic and unhelpful or time-consuming and legally risky, leading to ghosting and poor brand reputation.",
                    icon: MessageSquareX
                  }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-brand-primary">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm">
                        <item.icon className="h-6 w-6 text-brand-accent" aria-hidden="true" />
                      </div>
                      {item.title}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-brand-muted">
                      <p className="flex-auto">{item.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="py-24 sm:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-20">
              <h2 className="text-base font-semibold leading-7 text-brand-accent uppercase tracking-widest">The Solution</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-brand-primary sm:text-4xl">
                One click to capture hiring intelligence.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {[
                {
                  step: "01",
                  title: "Review Candidate",
                  description: "Recruiters review the candidate profile or interview feedback as they normally would within their workflow."
                },
                {
                  step: "02",
                  title: "Tag Rejection Reason",
                  description: "With a single click, select from structured, pre-defined rejection categories that match your specific hiring criteria."
                },
                {
                  step: "03",
                  title: "Generate Insights",
                  description: "HireSignal automatically updates your dashboard with analytics and sends a structured, low-risk notification to the candidate."
                }
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="text-6xl font-black text-slate-100 absolute -top-8 -left-4 group-hover:text-blue-50 transition-colors">{item.step}</div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-brand-primary mb-4">{item.title}</h3>
                    <p className="text-brand-muted leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-brand-primary py-24 sm:py-32 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-base font-semibold leading-7 text-brand-accent uppercase tracking-widest">Features</h2>
                <p className="mt-2 text-4xl font-bold tracking-tight text-white">
                  Built for high-performance hiring teams.
                </p>
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                  {[
                    {
                      name: "One-Click Tagging",
                      desc: "Tag rejections in seconds using standardized reasons.",
                      benefit: "Zero friction for recruiters.",
                      icon: Zap
                    },
                    {
                      name: "Analytics Dashboard",
                      desc: "Real-time visibility into rejection trends across roles.",
                      benefit: "Data-driven process optimization.",
                      icon: LayoutDashboard
                    },
                    {
                      name: "Structured Comms",
                      desc: "Automated, safe rejection emails based on tags.",
                      benefit: "Reduced legal risk and manual work.",
                      icon: Mail
                    },
                    {
                      name: "Hiring Insights",
                      desc: "Identify specific skill gaps in your talent pool.",
                      benefit: "Better sourcing strategies.",
                      icon: BarChart3
                    },
                    {
                      name: "Pipeline Visibility",
                      desc: "See exactly where candidates are dropping off.",
                      benefit: "Fix bottlenecks in the funnel.",
                      icon: Filter
                    },
                    {
                      name: "ATS Integration",
                      desc: "Syncs seamlessly with your existing hiring stack.",
                      benefit: "No duplicate data entry.",
                      icon: Database
                    }
                  ].map((feature, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10 mb-2">
                        <feature.icon size={18} className="text-brand-accent" />
                      </div>
                      <h3 className="font-bold text-lg">{feature.name}</h3>
                      <p className="text-sm text-slate-400">{feature.desc}</p>
                      <p className="text-xs font-mono text-brand-accent mt-1">{feature.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="rounded-xl bg-slate-800 p-8 border border-slate-700 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-full bg-brand-accent/20 flex items-center justify-center">
                      <PieChart className="text-brand-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Pipeline Health Score</div>
                      <div className="text-xs text-slate-400">Updated 2 mins ago</div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-48 w-full bg-slate-900/50 rounded-lg border border-slate-700 flex items-end justify-around p-4">
                      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="w-8 bg-brand-accent rounded-t-sm" 
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded bg-slate-900/50 border border-slate-700">
                        <div className="text-[10px] uppercase text-slate-500 font-bold">Conversion Rate</div>
                        <div className="text-xl font-bold">18.4%</div>
                      </div>
                      <div className="p-3 rounded bg-slate-900/50 border border-slate-700">
                        <div className="text-[10px] uppercase text-slate-500 font-bold">Drop-off Rate</div>
                        <div className="text-xl font-bold">32.1%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics / Value Section */}
        <section id="analytics" className="py-24 sm:py-32 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="glass-card rounded-2xl p-8 shadow-xl border-slate-200">
                  <h3 className="text-lg font-bold text-brand-primary mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-brand-accent" />
                    Q1 Rejection Breakdown
                  </h3>
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span>Skill Mismatch (Technical)</span>
                        <span className="text-brand-accent">42%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full">
                        <div className="h-full w-[42%] bg-brand-accent rounded-full" />
                      </div>
                      <p className="mt-2 text-xs text-brand-muted italic">Insight: Your JD might be over-specifying React experience for junior roles.</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span>Salary Expectations</span>
                        <span className="text-brand-accent">28%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full">
                        <div className="h-full w-[28%] bg-slate-400 rounded-full" />
                      </div>
                      <p className="mt-2 text-xs text-brand-muted italic">Insight: Market rates for DevOps have increased 15% in your region.</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-xs text-brand-muted uppercase font-bold">Efficiency</div>
                          <div className="text-lg font-bold text-green-600">+24%</div>
                        </div>
                        <div>
                          <div className="text-xs text-brand-muted uppercase font-bold">Visibility</div>
                          <div className="text-lg font-bold text-brand-primary">100%</div>
                        </div>
                        <div>
                          <div className="text-xs text-brand-muted uppercase font-bold">Risk</div>
                          <div className="text-lg font-bold text-blue-600">-80%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-base font-semibold leading-7 text-brand-accent uppercase tracking-widest">Analytics</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-brand-primary sm:text-4xl">
                  Stop guessing. Start measuring.
                </p>
                <p className="mt-6 text-lg leading-8 text-brand-muted">
                  HireSignal transforms subjective interview outcomes into objective business data. Understand exactly why your pipeline is leaking and adjust your strategy in real-time.
                </p>
                <div className="mt-10 space-y-4">
                  {[
                    "Identify specific skill mismatches by department",
                    "Track salary alignment against market benchmarks",
                    "Monitor recruiter efficiency and rejection speed",
                    "Quantify the impact of hiring criteria changes"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-brand-accent" />
                      <span className="text-brand-primary font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="bg-brand-bg py-24 sm:py-32 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-brand-accent uppercase tracking-widest">Early Feedback</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-brand-primary">
                Trusted by forward-thinking hiring teams.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  quote: "HireSignal gave us the first clear look at why our engineering pipeline was stalling. We realized our technical screen was misaligned with our actual requirements.",
                  author: "Sarah Chen",
                  role: "Head of People, Fintech Startup"
                },
                {
                  quote: "The one-click tagging is a game changer. Our recruiters actually use it because it adds zero friction to their workflow, and the data we get back is invaluable.",
                  author: "Marcus Thorne",
                  role: "Senior Recruiter, ScaleUp Tech"
                }
              ].map((testimonial, i) => (
                <div key={i} className="glass-card rounded-xl p-8 italic text-brand-primary leading-relaxed relative">
                  <span className="text-6xl text-slate-200 absolute top-4 left-4 font-serif">"</span>
                  <p className="relative z-10 mb-6">{testimonial.quote}</p>
                  <div className="not-italic flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                    <div>
                      <div className="font-bold text-sm">{testimonial.author}</div>
                      <div className="text-xs text-brand-muted">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="max-w-3xl mx-auto rounded-xl bg-white border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-2 text-brand-accent font-bold text-sm uppercase tracking-wider mb-4">
                <ChevronRight size={16} /> Case Study: Series B SaaS
              </div>
              <h4 className="text-xl font-bold text-brand-primary mb-2">Reducing Time-to-Hire by 18%</h4>
              <p className="text-brand-muted text-sm leading-relaxed">
                By identifying that 35% of candidates were rejected at the final stage due to "Salary Mismatch," this team adjusted their sourcing filters and JD disclosures, resulting in a more qualified pipeline and significantly faster closing times.
              </p>
            </div>
          </div>
        </section>

        {/* Objection Handling Section */}
        <section className="py-24 sm:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-brand-accent uppercase tracking-widest">FAQ</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-brand-primary">
                Common Questions
              </p>
            </div>
            <div className="mx-auto max-w-3xl divide-y divide-slate-200">
              {[
                {
                  q: "Does this add extra work for my recruiters?",
                  a: "No. HireSignal is designed for one-click interaction. It integrates directly into your existing workflow, replacing manual email drafting with a single selection."
                },
                {
                  q: "Is it legally safe to share rejection reasons?",
                  a: "We focus on structured, objective categories (e.g., 'Technical Skill Mismatch') rather than subjective feedback. Our automated communication is designed to be professional, concise, and low-risk."
                },
                {
                  q: "We already use an ATS. Why do we need this?",
                  a: "Most ATS platforms are great at tracking candidates but poor at analyzing rejection data. HireSignal sits on top of your ATS to provide the deep analytics and structured communication they lack."
                }
              ].map((faq, i) => (
                <div key={i} className="py-8">
                  <dt className="text-lg font-bold text-brand-primary">{faq.q}</dt>
                  <dd className="mt-4 text-brand-muted leading-relaxed">{faq.a}</dd>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="waitlist" className="relative isolate overflow-hidden bg-brand-primary py-24 sm:py-32">
          <div className="data-grid absolute inset-0 opacity-10" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to optimize your hiring intelligence?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Join our private beta and start turning rejection data into your most valuable hiring asset.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your work email"
                    className="block w-full rounded-md border-0 bg-white/5 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-brand-accent sm:text-sm sm:leading-6"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-none rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand-primary shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Requesting...' : 'Request Access'}
                  </button>
                </form>
              </div>
              {isSubmitted && (
                <p className="mt-4 text-sm text-green-400 font-medium">
                  Thanks! We'll be in touch soon.
                </p>
              )}
              {error && (
                <p className="mt-4 text-sm text-red-400 font-medium">
                  {error}
                </p>
              )}
              <p className="mt-4 text-xs text-slate-400">
                Limited spots available for Q2 2026.
              </p>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
            <div className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-tr from-[#3b82f6] to-[#1e40af] opacity-20" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-primary text-white">
                <Zap size={14} fill="currentColor" />
              </div>
              <span className="text-lg font-bold tracking-tighter text-brand-primary">HireSignal</span>
            </div>
            <div className="flex gap-8 text-sm text-brand-muted">
              <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-brand-primary transition-colors">Contact</a>
            </div>
            <div className="text-sm text-brand-muted">
              © 2026 HireSignal Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
