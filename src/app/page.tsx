// src/app/page.tsx
'use client';

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const PlusIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg 
    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [showRedirecting, setShowRedirecting] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // ✅ Capture UTM + Click IDs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const gclid = params.get('gclid');
      const gbraid = params.get('gbraid');
      const wbraid = params.get('wbraid');
      if (gclid) localStorage.setItem('gclid', gclid);
      if (gbraid) localStorage.setItem('gbraid', gbraid);
      if (wbraid) localStorage.setItem('wbraid', wbraid);

      const utm_source = params.get('utm_source');
      const utm_medium = params.get('utm_medium');
      const utm_campaign = params.get('utm_campaign');
      if (utm_source) localStorage.setItem('utm_source', utm_source);
      if (utm_medium) localStorage.setItem('utm_medium', utm_medium);
      if (utm_campaign) localStorage.setItem('utm_campaign', utm_campaign);
    }
  }, []);

  // Sticky CTA
  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-redirect on login
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
      const gclid = localStorage.getItem("gclid");
      const gbraid = localStorage.getItem("gbraid");
      const wbraid = localStorage.getItem("wbraid");

      await fetch("/api/log-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          name: session?.user?.name || null,
          utm_source,
          utm_medium,
          utm_campaign,
          gclid,
          gbraid,
          wbraid,
        }),
      });

      if (typeof window !== "undefined" && (window as any).gtag && session?.user?.email) {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-968379698",
          value: 75.0,
          currency: "INR",
          email: session.user.email,
        });
      }

      setTimeout(() => {
        window.location.href = process.env.NEXT_PUBLIC_AFFILIATE_LINK!;
      }, 1500);
    } catch (error) {
      console.error("Redirect failed:", error);
      window.location.href = process.env.NEXT_PUBLIC_AFFILIATE_LINK!;
    }
  };

  const faqs = [
    {
      question: "Is this safe for women over 40?",
      answer: "Yes — it’s formulated with gentle, natural ingredients. Always consult your physician before starting any new supplement."
    },
    {
      question: "Do I need to follow a special diet?",
      answer: "No. It’s designed to complement your balanced lifestyle, not replace healthy habits."
    },
    {
      question: "How long before I notice a difference?",
      answer: "Many users report feeling more energized within a few weeks of consistent use as part of their daily routine."
    },
    {
      question: "Is this a weight loss product?",
      answer: "No. This is a dietary supplement that supports healthy metabolic function and natural energy levels."
    },
    {
      question: "What’s in the formula?",
      answer: "It contains natural ingredients like green tea extract, B vitamins, and other compounds that support metabolic wellness."
    },
    {
      question: "Is it non-stimulant?",
      answer: "Yes — it’s formulated without caffeine or jitters-inducing stimulants."
    },
    {
      question: "Where is it made?",
      answer: "It’s proudly made in an FDA-registered, GMP-certified facility in the USA."
    },
    {
      question: "Is there a guarantee?",
      answer: "Yes — it comes with a 60-day satisfaction guarantee. If you’re not happy, contact the manufacturer for a refund."
    },
    {
      question: "Can I take it with medications?",
      answer: "If you’re taking prescription medications, please consult your healthcare provider before use."
    },
    {
      question: "How do I take it?",
      answer: "Take one capsule daily with water, preferably in the morning as part of your wellness routine."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
        <div className="max-w-md w-full space-y-8 text-center">
          
          <div className="mb-6 text-left max-w-prose mx-auto bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-gray-800 italic text-base leading-relaxed">
              “After 40, my energy vanished — no matter how ‘healthy’ I ate. 
              My wellness coach said my metabolism needed gentle support. 
              That small shift changed everything.”
            </p>
            <p className="text-right text-sm text-blue-700 font-medium mt-2">— Sarah, Verified User</p>
          </div>

          {/* ✅ PERFECTLY CENTERED */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 whitespace-nowrap mx-auto text-center">
            Feel Like Yourself Again — Naturally
          </h1>
          <p className="text-gray-600 text-lg mt-2 mx-auto text-center max-w-prose">
            The trusted choice for <strong>natural metabolism support</strong> after 40.
          </p>

          <div className="my-6">
            <img 
              src="https://images.stockcake.com/public/2/0/3/2036d68e-9c45-4730-921a-b9b8a3791638_large/sipping-red-smoothie-stockcake.jpg" 
              alt="Woman enjoying morning wellness routine with natural metabolic support" 
              className="rounded-2xl shadow-sm w-full"
              loading="lazy"
            />
          </div>

          <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <h3 className="font-bold text-indigo-900 text-lg mb-3">Why Women Over 40 Choose This</h3>
            <ul className="space-y-2 text-left">
              <li className="flex items-start gap-2"><CheckIcon /> Supports healthy metabolic function</li>
              <li className="flex items-start gap-2"><CheckIcon /> Promotes steady, natural energy</li>
              <li className="flex items-start gap-2"><CheckIcon /> Gentle, non-stimulant formula</li>
            </ul>
          </div>

          <div className="mt-8">
            <button
              onClick={() => signIn("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-md text-white font-bold text-lg disabled:opacity-70 hover:from-blue-700 hover:to-indigo-800 transition-all"
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

          <div className="flex justify-center gap-4 mt-4 flex-wrap text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> SSL Secured</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Free Shipping</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Made in USA</span>
          </div>

          {/* ✅ FAQ with + sign effect */}
          <div className="mt-10 pt-6 border-t border-gray-200 space-y-3 max-w-prose mx-auto text-left">
            <h3 className="font-bold text-gray-900 text-lg text-center">Frequently Asked Questions</h3>
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 font-medium"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-sm">{faq.question}</span>
                  <PlusIcon isOpen={openFaq === index} />
                </button>
                {openFaq === index && (
                  <div className="p-4 bg-gray-50 text-xs text-gray-600 border-t border-gray-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

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

      {/* Sticky CTA Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-40">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Ready to start?</span>
            <button
              onClick={() => signIn("google")}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Redirect Modal */}
      {showRedirecting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 text-center shadow-xl max-w-sm mx-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="font-bold text-gray-900">Loading Details...</p>
            <p className="text-gray-600 text-sm mt-1">Redirecting to official site.</p>
          </div>
        </div>
      )}

      <footer className="py-4 text-center text-xs text-gray-500 border-t border-gray-100">
        *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. Results may vary.
      </footer>
    </div>
  );
}