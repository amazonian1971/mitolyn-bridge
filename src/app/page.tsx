'use client';

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

// Simple SVG icons (no external deps)
const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TruckIcon = () => (
  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const BadgeIcon = () => (
  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [showRedirecting, setShowRedirecting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      localStorage.setItem("utm_source", urlParams.get("utm_source") || "");
      localStorage.setItem("utm_medium", urlParams.get("utm_medium") || "");
      localStorage.setItem("utm_campaign", urlParams.get("utm_campaign") || "");
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      handleLogLeadAndRedirect();
    }
  }, [status, session]);

  const handleLogLeadAndRedirect = async () => {
    setLoading(true);
    setShowRedirecting(true);

    try {
      const utm_source = localStorage.getItem("utm_source");
      const utm_medium = localStorage.getItem("utm_medium");
      const utm_campaign = localStorage.getItem("utm_campaign");

      await fetch("/api/log-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          name: session?.user?.name || null,
          utm_source,
          utm_medium,
          utm_campaign,
        }),
      });

      setTimeout(() => {
        window.location.href = process.env.NEXT_PUBLIC_AFFILIATE_LINK!;
      }, 1500);
    } catch (error) {
      console.error("Redirect failed:", error);
      window.location.href = process.env.NEXT_PUBLIC_AFFILIATE_LINK!;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
        <div className="max-w-md w-full space-y-8 text-center">
          
          {/* Story Hook */}
          <div className="mb-6 text-left max-w-prose mx-auto bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-gray-800 italic text-base leading-relaxed">
              “After 40, my energy vanished — no matter how ‘healthy’ I ate. 
              My wellness coach said my metabolism needed gentle support. 
              That small shift changed everything.”
            </p>
            <p className="text-right text-sm text-blue-700 font-medium mt-2">— Sarah, Verified User</p>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Feel Like <span className="text-blue-600">Yourself Again</span> — Naturally
          </h1>

          {/* ✅ LIFESTYLE IMAGE — Compliant & Magnetic */}
          <div className="my-6">
            <img 
              src="https://images.unsplash.com/photo-1506795660198-e95c77602129?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Woman smiling while enjoying a peaceful morning with natural wellness support" 
              className="rounded-2xl shadow-sm w-full"
              loading="lazy"
            />
          </div>

          {/* Subheadline */}
          <p className="text-gray-600 text-lg">
            Join thousands who’ve added daily metabolic support to their wellness routine.
          </p>

          {/* Benefit Stack */}
          <ul className="grid grid-cols-1 gap-3 mt-6 text-left">
            <li className="flex items-start gap-2">
              <CheckIcon /> <span className="text-gray-700">Support healthy metabolic function</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon /> <span className="text-gray-700">Promote steady, natural energy levels</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon /> <span className="text-gray-700">Complement your balanced lifestyle</span>
            </li>
          </ul>

          {/* Guarantee Badge */}
          <div className="flex justify-center mt-6">
            <div className="bg-green-50 border border-green-200 rounded-full px-4 py-2 flex items-center gap-2">
              <BadgeIcon />
              <span className="text-green-800 font-medium text-sm">
                60-Day Satisfaction Guarantee*
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8">
            <button
              onClick={() => signIn("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-white font-bold text-lg disabled:opacity-70 hover:from-blue-700 hover:to-indigo-800"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#FFFFFF" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#FFFFFF" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FFFFFF" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#FFFFFF" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Start My Wellness Journey →
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <ShieldIcon /> SSL Secured
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <TruckIcon /> Free Shipping
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <BadgeIcon /> Made in USA
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-xs text-gray-500 space-y-2">
            <p>🔒 Secure sign-in with Google</p>
            <p>✉️ By continuing, you agree to receive wellness updates. Unsubscribe anytime.</p>
            <p className="flex justify-center gap-4">
              <a href="/privacy" className="underline hover:text-blue-600">Privacy Policy</a>
              <a href="/disclaimer" className="underline hover:text-blue-600">Affiliate Disclaimer</a>
            </p>
          </div>
        </div>
      </div>

      {/* Redirect Modal */}
      {showRedirecting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900">Loading Product Details...</h3>
            <p className="mt-2 text-gray-600">Redirecting to official site.</p>
          </div>
        </div>
      )}

      {/* Footer Disclaimer */}
      <footer className="py-4 text-center text-xs text-gray-500 border-t border-gray-100">
        *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. 
        Results may vary. The guarantee is provided by the manufacturer. Consult your physician before use.
      </footer>
    </div>
  );
}