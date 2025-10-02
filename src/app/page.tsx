'use client';

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
        <div className="max-w-md w-full space-y-8 text-center">
          
          {/* A. STORYTELLING HOOK */}
          <div className="mb-6 text-left max-w-prose mx-auto">
            <p className="text-gray-700 italic text-base leading-relaxed">
              “By 3 PM, I was exhausted — even after ‘healthy’ meals. 
              My wellness coach explained how metabolism affects daily energy. 
              That’s when I started looking for natural support… and finally felt like myself again.”
            </p>
            <p className="text-right text-sm text-gray-500 mt-2">— Verified User, California</p>
          </div>

          {/* HEADLINE */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Support Your Natural Metabolism
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600">
              Join thousands adding daily metabolic support to their wellness routine.
            </p>
          </div>

          {/* D. GUARANTEE BADGE */}
          <div className="flex justify-center">
            <div className="bg-green-50 border border-green-200 rounded-full px-4 py-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800 font-medium text-sm">
                60-Day Satisfaction Guarantee*
              </span>
            </div>
          </div>

          {/* B. SOFT URGENCY */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r text-amber-800 text-sm">
            <p>Popular item — check official site for current availability.</p>
          </div>

          {/* E. COMPLIANT TESTIMONIAL */}
          <div className="my-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                  J
                </div>
                <div className="text-left">
                  <p className="font-semibold text-indigo-800 text-sm">Jamie R.</p>
                  <p className="text-xs text-indigo-600">Portland, OR</p>
                </div>
              </div>
              <p className="text-indigo-800 text-sm italic">
                “I take it every morning with my tea. It’s become a calming part of my self-care ritual.”
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => signIn("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 font-semibold text-lg disabled:opacity-50"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              See How It Works
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-500 space-y-1">
            <p>🔒 Secure sign-in with Google</p>
            <p>✉️ By continuing, you agree to receive wellness updates. Unsubscribe anytime.</p>
            <p className="flex justify-center gap-4">
              <a href="/privacy" className="underline hover:text-blue-600">Privacy Policy</a>
              <a href="/disclaimer" className="underline hover:text-blue-600">Affiliate Disclaimer</a>
            </p>
          </div>
        </div>
      </div>

      {showRedirecting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900">Loading Product Details...</h3>
            <p className="mt-2 text-gray-600">Redirecting to official site.</p>
          </div>
        </div>
      )}

      <footer className="py-4 text-center text-xs text-gray-500 border-t">
        *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. 
        Results may vary. The guarantee is provided by the manufacturer. Consult your physician before use.
      </footer>
    </div>
  );
}