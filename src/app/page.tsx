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
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Unlock Your <span className="text-red-600">Weight Loss Breakthrough</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Join 8,427+ women who melted stubborn fat using this doctor-approved method.
            </p>
          </div>

          {/* Rotating Social Proof */}
<div className="my-6">
  {(() => {
    const testimonials = [
      "🔥 “Lost 28lbs in 4 weeks — no dieting!” — Sarah T., Texas",
      "💯 “Finally found what works — down 2 dress sizes!” — Mia R., Florida",
      "⚡ “Energy through the roof + dropped 34lbs!” — Jessica L., California",
      "🌟 “My husband didn’t recognize me — 41lbs gone!” — Amanda K., NY",
      "💖 “No gym, no starving — just Mitolyn & consistency!” — Rachel M., Illinois",
    ];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
      }, 4000); // Rotate every 4 seconds
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="bg-gradient-to-r from-yellow-50 to-red-50 border border-yellow-200 rounded-xl p-4 text-center animate-fade-in-out">
        <p className="text-yellow-800 font-semibold text-sm md:text-base">
          {testimonials[current]}
        </p>
      </div>
    );
  })()}
</div>
            
              
            
          

          <div className="mt-8">
            <button
              onClick={() => signIn("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 font-semibold text-lg disabled:opacity-50"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-500 space-y-1">
            <p>🔒 Secure with Google — no password needed</p>
            <p>✉️ By continuing, you agree to receive health tips. Unsubscribe anytime.</p>
            <p>
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {showRedirecting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900">Generating Your Custom Plan...</h3>
            <p className="mt-2 text-gray-600">Please wait — this only takes a moment.</p>
          </div>
        </div>
      )}

      <footer className="py-4 text-center text-xs text-gray-400 border-t">
        *Results not typical. Individual results may vary.
      </footer>
    </div>
  );
}