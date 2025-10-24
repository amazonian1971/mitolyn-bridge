'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

type UTM = Record<string, string>;
type GateStep = 1 | 2;

// Magnetic Button (built-in)
function MagneticButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${dx * 0.08}px, ${dy * 0.08}px)`;
  };
  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0,0)';
  };
  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`btn-luxe px-6 py-4 text-lg shadow-luxe glow ${className}`}
    >
      {children}
    </button>
  );
}

// Aurora Background (built-in)
function AuroraBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="aurora">
        <span className="a1" />
        <span className="a2" />
        <span className="a3" />
      </div>
      <div className="grid-overlay" />
      <div className="noise" />
    </div>
  );
}

export default function MitolynBridgePage() {
  // Core states
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(872); // 14:32
  const [spotsLeft, setSpotsLeft] = useState(7);
  const [utmParams, setUtmParams] = useState<UTM>({});

  // Gate + CRO
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [attemptedWatch, setAttemptedWatch] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [gateStep, setGateStep] = useState<GateStep>(1);
  const [userGoal, setUserGoal] = useState('');
  const [userAgeRange, setUserAgeRange] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Floating testimonials
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showTestimonial, setShowTestimonial] = useState(false);
  const [testimonialPosition, setTestimonialPosition] = useState<React.CSSProperties>({ bottom: 16, left: 16 });

  // Variant A/B
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  const AFFILIATE_URL = process.env.NEXT_PUBLIC_AFFILIATE_URL || 'https://hop.clickbank.net/?affiliate=syed222&vendor=mitolyn';

  // Testimonials data
  const floatingTestimonials = useMemo(
    () => [
      { name: 'Jennifer', location: 'Austin, TX', action: 'lost 43 lbs in 12 weeks', timeAgo: 'verified today' },
      { name: 'Sarah', location: 'Phoenix, AZ', action: 'increased energy by 73%', timeAgo: '2 hours ago' },
      { name: 'Linda', location: 'Denver, CO', action: 'blood pressure normalized after 10 weeks', timeAgo: 'verified yesterday' },
      { name: 'Patricia', location: 'Seattle, WA', action: 'lost 52 lbs at age 61', timeAgo: '1 hour ago' },
      { name: 'Maria', location: 'Miami, FL', action: 'no more 2pm crashes', timeAgo: '3 hours ago' },
      { name: 'Karen', location: 'Chicago, IL', action: 'started seeing results in week 3', timeAgo: 'just now' },
      { name: 'Rebecca', location: 'Boston, MA', action: 'mitochondria test improved 47%', timeAgo: '4 hours ago' },
      { name: 'Donna', location: 'Portland, OR', action: 'lost inches without dieting', timeAgo: 'verified today' },
      { name: 'Michelle', location: 'Atlanta, GA', action: 'energy boost without stimulants', timeAgo: '5 hours ago' },
      { name: 'Barbara', location: 'San Diego, CA', action: 'metabolism reactivated at 56', timeAgo: '2 hours ago' },
    ],
    []
  );

  // Tracking helper (fbq/gtag/ttq if present)
  const trackEvent = (name: string, data?: Record<string, any>) => {
    try {
      const w = window as any;
      if (w.fbq) w.fbq('trackCustom', name, data || {});
      if (w.gtag) w.gtag('event', name, { ...(data || {}) });
      if (w.ttq && w.ttq.track) w.ttq.track(name, data || {});
    } catch {
      // no-op
    }
  };

  // Reveal on scroll
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && e.target.classList.add('in'));
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Pick up email from localStorage
  useEffect(() => {
    const capturedEmail = localStorage.getItem('lead_email_captured');
    if (capturedEmail) {
      setEmail(capturedEmail);
      setEmailCaptured(true);
    }
  }, []);

  // UTM + Variant handling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const params: UTM = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'v'].forEach((param) => {
        const value = urlParams.get(param);
        if (value) params[param] = value;
      });
      setUtmParams(params);

      if (params.v === 'A' || params.v === 'B') {
        setVariant(params.v);
        localStorage.setItem('ab_variant_mitolyn', params.v);
      } else {
        const existing = localStorage.getItem('ab_variant_mitolyn') as 'A' | 'B' | null;
        if (existing) {
          setVariant(existing);
        } else {
          const randomVariant: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
          setVariant(randomVariant);
          localStorage.setItem('ab_variant_mitolyn', randomVariant);
        }
      }
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  // Random spots reduction (min 3)
  useEffect(() => {
    const interval = setInterval(() => setSpotsLeft((prev) => (prev > 3 ? prev - 1 : prev)), 45000);
    return () => clearInterval(interval);
  }, []);

  // Floating testimonials logic
  useEffect(() => {
    const showRandomTestimonial = () => {
      const randomIndex = Math.floor(Math.random() * floatingTestimonials.length);
      setCurrentTestimonial(randomIndex);
      const positions: React.CSSProperties[] = [
        { bottom: 16, left: 16 },
        { bottom: 16, right: 16 },
        { top: 80, left: 16 },
        { top: 80, right: 16 },
        { bottom: 120, left: 16 },
        { bottom: 120, right: 16 },
      ];
      const randomPosition = positions[Math.floor(Math.random() * positions.length)];
      setTestimonialPosition(randomPosition);
      setShowTestimonial(true);
      setTimeout(() => setShowTestimonial(false), 5000);
    };

    const initialTimer = setTimeout(showRandomTestimonial, 5000);
    const testimonialTimer = setInterval(() => showRandomTestimonial(), Math.floor(Math.random() * 15000) + 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(testimonialTimer);
    };
  }, [floatingTestimonials]);

  // Exit intent (desktop)
  useEffect(() => {
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !emailCaptured && !showEmailModal) {
        setGateStep(1);
        setShowEmailModal(true);
        trackEvent('ExitIntent');
      }
    };
    document.addEventListener('mouseout', onMouseOut);
    return () => document.removeEventListener('mouseout', onMouseOut);
  }, [emailCaptured, showEmailModal]);

  // Sticky CTA on scroll depth
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - window.innerHeight);
      if (scrolled > 0.2 && !emailCaptured) setShowStickyCTA(true);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [emailCaptured]);

  // Helpers
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateEmail = (val: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  // Email submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypotRef.current?.value) {
      setEmailError('Something went wrong. Please try again.');
      return;
    }

    if (!email) {
      setEmailError('Please enter your email address');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setEmailError('');

    try {
      const { error } = await supabase.from('leads').insert([
        {
          email: email.toLowerCase(),
          source: 'bridge_page_gated',
          campaign: 'mitolyn',
          utm_source: utmParams.utm_source || 'direct',
          utm_medium: utmParams.utm_medium || 'none',
          utm_campaign: utmParams.utm_campaign || 'none',
          page_url: typeof window !== 'undefined' ? window.location.href : '',
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        },
      ]);

      if (error && error.code !== '23505') {
        console.error('Supabase error:', error);
      }

      localStorage.setItem('lead_email_captured', email);
      setEmailCaptured(true);
      setShowEmailModal(false);

      try {
        const w = window as any;
        if (w.fbq) w.fbq('track', 'Lead', { value: email });
      } catch {}
      trackEvent('Lead', { email_masked: email.replace(/(.{2}).+(@.+)/, '$1***$2') });

      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        setTimeout(() => {
          window.location.href = AFFILIATE_URL;
        }, 500);
      }, 4000);
    } catch (error) {
      console.error('Error:', error);
      setEmailError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCTAClick = () => {
    setAttemptedWatch(true);
    setGateStep(1);
    setShowEmailModal(true);
    trackEvent('CTA_Click', { placement: 'primary' });
  };

  const handleContinueStep1 = () => {
    setGateStep(2);
    trackEvent('MicroCommitment_Completed', { goal: userGoal, age: userAgeRange });
  };

  const headline =
    variant === 'A'
      ? 'Scientists Found a "Cellular Energy Switch" that Reboots Fat‑Burning After 40'
      : 'Harvard‑Backed "Cellular Energy Switch" Helping Women 40+ Reboot Metabolism Fast';

  const ctaText = variant === 'A' ? '🔓 Watch Free Scientific Presentation →' : '👉 Unlock the Free Video Now';

  // Global Luxe Styles (inline)
  const GLOBAL_CSS = `
  :root {
    --brand-1: 99 102 241;
    --brand-2: 139 92 246;
    --brand-3: 16 185 129;
    --accent-1: 56 189 248;
  }
  * { -webkit-tap-highlight-color: transparent; }
  .aurora { position:absolute; inset:-20% -10% auto -10%; pointer-events:none; filter:blur(60px); opacity:.6; mix-blend-mode:screen; }
  .aurora > span { position:absolute; border-radius:9999px; will-change:transform,opacity,filter; animation:aurora 18s ease-in-out infinite alternate; }
  .aurora .a1 { width:40vw; height:40vw; background:radial-gradient(60% 60% at 50% 50%, rgba(99,102,241,.9), transparent 60%); top:0; left:10%; }
  .aurora .a2 { width:50vw; height:50vw; background:radial-gradient(60% 60% at 50% 50%, rgba(139,92,246,.9), transparent 60%); top:10%; right:5%; animation-delay:.6s; }
  .aurora .a3 { width:45vw; height:45vw; background:radial-gradient(60% 60% at 50% 50%, rgba(16,185,129,.9), transparent 60%); top:40%; left:20%; animation-delay:1.2s; }
  @keyframes aurora {
    0% { transform: translate3d(-2%, -1%, 0) scale(1); }
    50% { transform: translate3d(2%, 1%, 0) scale(1.05); }
    100% { transform: translate3d(-1%, 2%, 0) scale(1.02); }
  }
  .grid-overlay::before {
    content:""; position:absolute; inset:0; pointer-events:none;
    background:
      linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px) 0 0 / 40px 40px,
      linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px) 0 0 / 40px 40px;
    mask-image:radial-gradient(ellipse at 50% 30%, black, transparent 70%);
  }
  .noise::after {
    content:""; position:absolute; inset:0; opacity:.08; pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
    background-size:cover;
  }
  .glass { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.15); backdrop-filter:blur(16px); }
  .gradient-border { position:relative; border-radius:1rem; }
  .gradient-border::before {
    content:""; position:absolute; inset:-1px; z-index:-1; border-radius:inherit;
    background:linear-gradient(120deg, rgb(var(--brand-1)), rgb(var(--brand-2)), rgb(var(--brand-3)));
    -webkit-mask:linear-gradient(#000,#000) content-box, linear-gradient(#000,#000);
    -webkit-mask-composite:xor; mask-composite:exclude; padding:1px;
  }
  .shadow-luxe { box-shadow:0 10px 40px rgba(16,185,129,.15), 0 2px 10px rgba(0,0,0,.3); }
  .glow { box-shadow:0 0 0 6px rgba(16,185,129,.15), 0 0 0 14px rgba(56,189,248,.08); }
  .reveal { opacity:0; transform:translateY(16px); transition:all .6s cubic-bezier(.2,.7,.2,1); }
  .reveal.in { opacity:1; transform:translateY(0); }
  .btn-luxe { position:relative; border-radius:.875rem; overflow:hidden; background:linear-gradient(90deg, rgb(var(--brand-3)), rgb(var(--brand-2))); color:white; font-weight:800; transition:transform .25s ease, box-shadow .25s ease; }
  .btn-luxe:hover { transform:translateY(-1px) scale(1.02); box-shadow:0 12px 30px rgba(139,92,246,.25); }
  .btn-luxe::after { content:""; position:absolute; inset:0; pointer-events:none; background:radial-gradient(120% 120% at 10% 0%, rgba(255,255,255,.25), transparent 60%); mix-blend-mode:screen; }

  @keyframes slideIn { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); opacity: 1; } }
  .animate-slideIn { animation: slideIn 0.5s ease-out; }
  .animate-slideUp { animation: slideUp 0.3s ease-out; }
  .animate-bounceIn { animation: bounceIn 0.6s ease-out; }
  `;

  return (
    <>
      {/* Inline global luxe styles */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="gradient-border glass rounded-2xl max-w-sm w-full p-6 relative animate-bounceIn text-white">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-3">Thank You, {email.split('@')[0]}! 🎉</h2>
            <p className="text-center text-white/80 mb-4 text-sm">Your mitochondrial health guide is being sent to:</p>
            <div className="glass rounded-lg p-3 mb-4">
              <p className="text-center font-semibold text-emerald-300 text-sm">📧 {email}</p>
            </div>
            <div className="space-y-2 mb-4">
              <h3 className="font-bold text-center mb-2 text-sm">Your FREE Scientific Resources:</h3>
              <div className="flex items-center gap-2 p-2 glass rounded-lg">
                <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2h4a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm">Mitochondrial Activation Guide</p>
                  <p className="text-xs text-white/70">Scientific PDF (Value: $47)</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 glass rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm">30-Day Results Timeline</p>
                  <p className="text-xs text-white/70">What to expect week-by-week</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 glass rounded-lg">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm">90-Day Guarantee Info</p>
                  <p className="text-xs text-white/70">Risk-free trial details</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-lg p-3 mb-4">
              <p className="text-center text-xs text-white/80">Total Value:</p>
              <p className="text-center text-xl font-bold text-emerald-300">$171 FREE!</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/80 mb-2">📬 Check your inbox in the next 2-5 minutes</p>
              <p className="text-xs text-white/60">(Don't forget to check your spam folder!)</p>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-sky-300 animate-pulse">Redirecting to your video presentation...</p>
            </div>
          </div>
        </div>
      )}

      {/* Email Capture Modal (Two-step) */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="gradient-border glass rounded-2xl max-w-md w-full p-6 relative animate-slideUp text-white">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-1 rounded bg-white/20 overflow-hidden">
                <div className={`h-1 bg-emerald-400 transition-all ${gateStep === 1 ? 'w-1/2' : 'w-full'}`} />
              </div>
              <span className="text-xs text-white/70">Step {gateStep}/2</span>
            </div>

            {gateStep === 1 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">Quick question before the video:</h2>
                <p className="text-white/70 mb-6 text-sm">This helps personalize your results timeline.</p>

                <div className="text-left space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-white mb-2 block">Your #1 goal</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Lose weight', 'Boost energy', 'Hormone balance', 'Overall health'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setUserGoal(g)}
                          className={`text-xs md:text-sm px-3 py-2 rounded-lg border ${
                            userGoal === g
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'glass text-white border-white/20'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-white mb-2 block">Your age range</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['35-44', '45-54', '55-64', '65+'].map((age) => (
                        <button
                          key={age}
                          type="button"
                          onClick={() => setUserAgeRange(age)}
                          className={`text-xs md:text-sm px-3 py-2 rounded-lg border ${
                            userAgeRange === age
                              ? 'bg-sky-600 text-white border-sky-600'
                              : 'glass text-white border-white/20'
                          }`}
                        >
                          {age}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <MagneticButton
                  onClick={handleContinueStep1}
                  className={`w-full mt-6 ${!userGoal || !userAgeRange ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  Continue →
                </MagneticButton>

                <p className="text-xs text-white/60 mt-4">Takes 10 seconds. No credit card required.</p>
              </div>
            )}

            {gateStep === 2 && (
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-bold mb-3">Unlock The Mitochondrial Breakthrough Video</h2>
                <p className="text-white/70 mb-6 text-sm">
                  Join <span className="font-semibold">47,392 women</span> who discovered the real cause of metabolism slowdown after 40
                </p>

                <div className="glass rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-emerald-300 mb-2">🎁 You'll Also Get FREE:</p>
                  <ul className="text-sm text-left text-white/80 space-y-1">
                    <li>✓ Harvard-Backed Mitochondrial Science Report</li>
                    <li>✓ 30-Day Results Timeline (Week-by-Week)</li>
                    <li>✓ 90-Day Money-Back Guarantee Details</li>
                  </ul>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  {/* Honeypot */}
                  <input type="text" ref={honeypotRef} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    placeholder="Enter your best email address..."
                    className={`w-full px-4 py-3 rounded-lg text-lg bg-black/30 text-white/90 border-2 focus:outline-none ${
                      emailError ? 'border-red-500' : 'border-white/20 focus:border-emerald-400'
                    }`}
                    autoFocus
                    required
                  />

                  {emailError && <p className="text-red-400 text-sm text-left">{emailError}</p>}

                  <MagneticButton className="w-full" onClick={() => {}}>
                    {isSubmitting ? 'Unlocking Video...' : ctaText}
                  </MagneticButton>

                  {/* Hidden submit to support Enter key */}
                  <button type="submit" className="hidden" aria-hidden />
                </form>

                <p className="text-xs text-white/60 mt-4">🔒 Your email is 100% secure. No spam, ever.</p>

                <div className="mt-6 p-3 glass rounded-lg">
                  <p className="text-sm text-rose-300">
                    ⏰ Only <span className="font-bold">{spotsLeft} spots</span> remaining • Video expires in{' '}
                    <span className="font-bold">{formatTime(timeLeft)}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Testimonials */}
      {showTestimonial && (
        <div className="fixed z-40 max-w-xs animate-slideIn gradient-border glass rounded-lg p-3" style={testimonialPosition}>
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-emerald-400/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold">
                {floatingTestimonials[currentTestimonial].name} from {floatingTestimonials[currentTestimonial].location}
              </p>
              <p className="text-xs text-white/80">{floatingTestimonials[currentTestimonial].action}</p>
              <p className="text-xs text-white/60">{floatingTestimonials[currentTestimonial].timeAgo}</p>
            </div>
          </div>
        </div>
      )}

      {/* Page wrapper */}
      <div className="relative min-h-screen bg-[#0b0e14] text-white">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <AuroraBackground />
          <div className="relative max-w-6xl mx-auto px-4">
            <div className="reveal in flex justify-center mb-5">
              <span className="glass gradient-border text-xs md:text-sm px-3 py-1 rounded-full text-white/90">
                ⚡ Harvard study validates mitochondrial breakthrough
              </span>
            </div>

            <h1
              className="reveal in text-center text-3xl md:text-6xl font-extrabold leading-tight mb-4 bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #8b5cf6 40%, #10b981)' }}
            >
              {headline}
            </h1>

            <p className="reveal in text-center text-white/80 text-lg md:text-2xl max-w-3xl mx-auto mb-10">
              97% of women over 45 experience mitochondrial slowdown. The good news? It's reversible — learn how in this free presentation.
            </p>

            <div className="reveal in max-w-4xl mx-auto">
              <div className="relative rounded-2xl gradient-border glass shadow-luxe overflow-hidden">
                <div className="aspect-video relative">
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-white/15 backdrop-blur flex items-center justify-center mb-3 ring-2 ring-white/30">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                      <p className="text-white font-semibold">Video Locked</p>
                      <p className="text-white/70 text-sm">Enter your email to unlock instant access</p>
                    </div>
                  </div>

                  {/* Click catcher */}
                  <button onClick={handleCTAClick} className="absolute inset-0 z-20" aria-label="Unlock video" />

                  {/* Decorative halo */}
                  <div className="absolute -inset-[2px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(34,211,238,.35),rgba(139,92,246,.35),rgba(16,185,129,.35),rgba(34,211,238,.35))] blur-xl"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.08),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,.06),transparent_45%),linear-gradient(180deg,rgba(0,0,0,.4),rgba(0,0,0,.65))]"></div>
                </div>

                <div className="flex items-center justify-between px-4 py-3 text-xs text-white/80">
                  <span className="glass px-2 py-1 rounded-md">LOCKED</span>
                  <span className="opacity-80">👁 47,392 have watched</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center gap-3">
                <MagneticButton onClick={handleCTAClick} className="w-full md:w-auto">
                  {ctaText}
                </MagneticButton>
                <p className="text-white/60 text-xs">
                  No credit card required • Expires in <span className="font-mono">{formatTime(timeLeft)}</span>
                </p>
              </div>
            </div>

            {/* Trust row */}
            <div className="reveal in mt-10 flex flex-wrap justify-center items-center gap-4 text-sm text-white/70">
              <span className="glass px-3 py-1 rounded-md">✓ No stimulants</span>
              <span className="glass px-3 py-1 rounded-md">✓ Harvard-backed science</span>
              <span className="glass px-3 py-1 rounded-md">✓ 90-day guarantee</span>
              <span className="glass px-3 py-1 rounded-md">✓ Results in 2–4 weeks</span>
            </div>
          </div>
        </section>

        {/* Sticky Header Bar (glass) */}
        <div className="sticky top-0 z-40">
          <div className="glass gradient-border mx-auto max-w-6xl mt-2 rounded-xl px-4 py-2 text-white/90 shadow-luxe">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="animate-pulse">🔴</span>
                <span className="font-semibold hidden sm:inline">{spotsLeft} Spots Remaining</span>
                <span className="font-semibold sm:hidden">{spotsLeft} Left</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⏰</span>
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pain Points */}
        <section className="py-10">
          <div className="max-w-5xl mx-auto px-4">
            <h2
              className="text-2xl md:text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #8b5cf6)' }}
            >
              Is Your Mitochondria Causing These Problems?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "You've tried every diet but your metabolism keeps getting slower",
                'You experience afternoon energy crashes no matter how much coffee you drink',
                'Your body stores fat easier than ever, especially around your midsection',
                "You feel exhausted even after a full night's sleep",
                'Exercise barely makes a dent in weight loss anymore',
                'You've noticed increased brain fog and difficulty concentrating',
                "Your doctor says 'everything is normal' but you know something's wrong",
              ].map((pain, idx) => (
                <div key={idx} className="reveal glass gradient-border rounded-xl p-4 border-l-4 border-rose-400">
                  <div className="flex items-start gap-3">
                    <span className="text-rose-300 text-xl">⚠️</span>
                    <p className="text-white/90">{pain}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 glass gradient-border rounded-xl">
              <p className="text-center text-white/90">
                <span className="font-bold text-emerald-300">GOOD NEWS:</span> Harvard research shows these symptoms stem from
                <span className="font-semibold"> declining mitochondrial function</span> — and it's reversible...
              </p>
            </div>
          </div>
        </section>

        {/* 30-Day Timeline */}
        <section className="py-10">
          <div className="max-w-5xl mx-auto px-4">
            <h2
              className="text-2xl md:text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #8b5cf6, #10b981)' }}
            >
              Your 30-Day Mitochondrial Transformation Timeline
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="reveal glass gradient-border rounded-xl shadow-luxe p-6">
                <h3 className="font-bold text-lg text-sky-300 mb-2">Week 1-2: Subtle Shifts Begin</h3>
                <ul className="space-y-2 text-white/80">
                  <li>• Stable energy (no more 2pm crashes)</li>
                  <li>• Cravings fade as ATP efficiency improves</li>
                  <li>• Better mental clarity and focus</li>
                </ul>
              </div>
              <div className="reveal glass gradient-border rounded-xl shadow-luxe p-6">
                <h3 className="font-bold text-lg text-emerald-300 mb-2">Week 3-4: The Metabolic Reboot</h3>
                <ul className="space-y-2 text-white/80">
                  <li>• Noticeable fat loss around midsection</li>
                  <li>• Morning energy dramatically improved</li>
                  <li>• Body leans out without strict dieting</li>
                  <li>• Up to 70% increase in fat-burning efficiency</li>
                </ul>
              </div>
              <div className="reveal glass gradient-border rounded-xl shadow-luxe p-6">
                <h3 className="font-bold text-lg text-purple-300 mb-2">Beyond 30 Days: Long-Term Benefits</h3>
                <ul className="space-y-2 text-white/80">
                  <li>• Sustained weight loss without yo-yo</li>
                  <li>• All-day energy without stimulants</li>
                  <li>• Improved metabolic markers</li>
                  <li>• Better performance and recovery</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Mid CTA */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4">Ready to Reactivate Your Mitochondria?</h3>
            <MagneticButton onClick={handleCTAClick} className="px-8 py-4">
              {ctaText}
            </MagneticButton>
            <p className="text-xs md:text-sm text-white/70 mt-3">Free video • No credit card required</p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-10">
          <div className="max-w-6xl mx-auto px-4">
            <h2
              className="text-2xl md:text-4xl font-extrabold text-center mb-4 bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #8b5cf6)' }}
            >
              47,392 Women Have Already Transformed Their Metabolism
            </h2>
            <p className="text-center text-white/70 mb-8 md:mb-12 text-base md:text-lg">
              Real results from verified users — all without stimulants or extreme dieting
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  initials: 'JM',
                  name: 'Jennifer Mitchell',
                  location: 'Austin, TX • Age 52',
                  result: 'Lost 43 lbs in 12 weeks',
                  quote:
                    "The 2pm crashes are GONE! I haven't felt this energetic since my 30s. My doctor was shocked when she saw my metabolic markers improve by 47%. This is real science, not another fad.",
                },
                {
                  initials: 'SK',
                  name: 'Sarah Kingston',
                  location: 'Phoenix, AZ • Age 48',
                  result: 'Energy increased by 73%',
                  quote:
                    'I was skeptical about the mitochondria claims, but the Harvard research convinced me. Week 3 was when everything changed — the fat just started melting off. No jitters, no crashes, just steady energy all day.',
                },
                {
                  initials: 'LR',
                  name: 'Linda Rodriguez',
                  location: 'Denver, CO • Age 56',
                  result: 'Blood pressure normalized',
                  quote:
                    "My blood pressure is normal for the first time in 10 years! Lost 37 pounds without changing my diet drastically. The mitochondrial approach is completely different from anything I've tried.",
                },
                {
                  initials: 'PT',
                  name: 'Patricia Thompson',
                  location: 'Seattle, WA • Age 61',
                  result: 'Lost 52 lbs at age 61',
                  quote:
                    "I thought weight loss after 60 was impossible. The 90-day guarantee gave me confidence to try. Best decision ever! My grandkids can't keep up with me now. This isn't just weight loss, it's cellular rejuvenation.",
                },
              ].map((t, i) => (
                <div key={i} className="reveal glass gradient-border rounded-2xl p-6 shadow-luxe">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-sky-400 text-white flex items-center justify-center font-bold">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-white/60">{t.location}</p>
                      <div className="flex text-yellow-300 text-sm">★★★★★</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-xs px-3 py-1 rounded-full glass">{t.result}</span>
                  </div>
                  <p className="text-white/80 italic">"{t.quote}"</p>
                  <p className="text-xs text-white/60 mt-3">Verified Purchase ✓</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Warning */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="reveal glass gradient-border rounded-xl p-5 flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-bold text-rose-300 text-lg mb-1">WARNING: Beware of Counterfeit Products</h3>
                <p className="text-white/80 text-sm">
                  Due to high demand, fake versions are being sold on Amazon and other sites. These may contain harmful ingredients. Only purchase
                  from the official source to ensure safety and results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-10">
          <div className="max-w-5xl mx-auto px-4">
            <h2
              className="text-2xl md:text-3xl font-extrabold text-center mb-8 bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #8b5cf6)' }}
            >
              Special Pricing Available Today Only
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="glass gradient-border rounded-lg p-4 text-center">
                <h3 className="font-bold text-white/90 mb-2">1 Bottle</h3>
                <p className="text-3xl font-bold text-white">$79</p>
                <p className="text-sm text-white/70">per bottle</p>
                <p className="text-sm text-white/60 mt-2">30-day supply</p>
              </div>

              <div className="glass gradient-border rounded-lg p-4 text-center relative shadow-luxe">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </span>
                <h3 className="font-bold text-white/90 mb-2">6 Bottles</h3>
                <p className="text-3xl font-bold text-emerald-300">$294</p>
                <p className="text-sm text-white/70">per bottle</p>
                <p className="text-sm text-white/60 mt-2">90-day supply</p>
                <p className="text-xs text-emerald-300 font-semibold mt-1">Save $215!</p>
              </div>

              <div className="glass gradient-border rounded-lg p-4 text-center">
                <h3 className="font-bold text-white/90 mb-2">3 Bottles</h3>
                <p className="text-3xl font-bold text-sky-300">$177</p>
                <p className="text-sm text-white/70">per bottle</p>
                <p className="text-sm text-white/60 mt-2">180-day supply</p>
                <p className="text-xs text-sky-300 font-semibold mt-1">Save $98!</p>
              </div>
            </div>

            <div className="text-center glass gradient-border rounded-lg p-4">
              <p className="text-sm text-white/80">
                <span className="font-bold">🛡️ 90-Day Money-Back Guarantee:</span> Try Mitolyn risk-free. If you don't see results, get a full
                refund — no questions asked.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="gradient-border glass rounded-2xl shadow-luxe p-6 md:p-10">
              <h2
                className="text-2xl md:text-4xl font-extrabold text-center mb-4 bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #8b5cf6, #10b981)' }}
              >
                Your Mitochondrial Transformation Starts Now
              </h2>

              <p className="text-center text-base md:text-lg text-white/80 mb-6 md:mb-8">
                Watch the free scientific presentation that explains the Harvard-backed discovery helping thousands of women finally lose weight
                and regain energy after 40
              </p>

              <div className="glass rounded-lg p-4 md:p-6 mb-6 md:mb-8">
                <p className="text-center font-semibold text-rose-300 mb-2 text-sm md:text-base">
                  ⚠️ Due to demand, we can only guarantee access for:
                </p>
                <p className="text-center text-3xl md:text-4xl font-bold text-rose-300 font-mono">{formatTime(timeLeft)}</p>
                <p className="text-center text-sm md:text-base text-white/70 mt-2">Only {spotsLeft} spots remaining today</p>
              </div>

              <MagneticButton onClick={handleCTAClick} className="w-full py-5 text-lg md:text-2xl">
                {ctaText}
              </MagneticButton>

              <div className="mt-4 p-3 glass rounded-lg">
                <p className="text-center text-white/80 text-sm">🔒 Enter your email above to unlock instant access</p>
              </div>

              <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-white/70">
                <span className="flex items-center gap-1">
                  <span className="text-emerald-300">✓</span> No Credit Card Required
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-emerald-300">✓</span> Harvard-Backed Science
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-emerald-300">✓</span> 90-Day Guarantee
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Bottom CTA */}
        {!emailCaptured && showStickyCTA && (
          <div className="fixed bottom-3 inset-x-0 z-40">
            <div className="max-w-5xl mx-auto px-4">
              <div className="glass gradient-border rounded-2xl shadow-luxe px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 text-white/80">
                  <span className="text-rose-300">⏰</span>
                  <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                  <span className="hidden sm:inline">• {spotsLeft} spots left</span>
                </div>
                <MagneticButton
                  onClick={() => {
                    setShowEmailModal(true);
                    setGateStep(1);
                    trackEvent('CTA_Click', { placement: 'sticky' });
                  }}
                  className="px-5 py-3"
                >
                  {ctaText}
                </MagneticButton>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="py-8">
          <div className="max-w-4xl mx-auto px-4 text-center text-xs text-white/60 space-y-2">
            <p>* Results vary by individual. These statements have not been evaluated by the FDA.</p>
            <p>This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
            <p>© 2024 MITOLYN. All Rights Reserved.</p>

            <div className="text-center text-xs text-white/60 space-y-3 pt-4 md:pt-6">
              <p>🔒 Secure checkout • SSL encrypted</p>
              <p>✉️ By continuing, you agree to receive important health updates. Unsubscribe anytime.</p>
              <p className="flex justify-center gap-4 md:gap-6">
                <a href="/privacy" className="underline hover:text-emerald-300">
                  Privacy Policy
                </a>
                <a href="/disclaimer" className="underline hover:text-emerald-300">
                  Affiliate Disclaimer
                </a>
                <a href="/scientific-references" className="underline hover:text-emerald-300">
                  Scientific References
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}