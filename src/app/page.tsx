// src/app/page.tsx
'use client';

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

const CheckIcon = () => (
  <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  // 🔄 Rotating Testimonials
  const testimonials = [
    {
      text: "Mitolyn gave me steady energy throughout the day without any jitters. After three weeks, my afternoon crashes disappeared, and I felt more like myself again.",
      author: "Sarah, Verified User",
      avatar: "https://via.placeholder.com/50?text=S"
    },
    {
      text: "I was skeptical at first, but after 4 weeks, I noticed I had more stamina for my morning walks — no crash, no guilt, just natural support.",
      author: "Jamie R., Portland, OR",
      avatar: "https://via.placeholder.com/50?text=J"
    },
    {
      text: "As a busy mom over 40, I needed something simple. Mitolyn fits into my routine — no diet, no stress, just consistent energy.",
      author: "Lisa M., Texas",
      avatar: "https://via.placeholder.com/50?text=L"
    },
    {
      text: "My wellness coach recommended this. Now I start my day with focus — not fatigue. Gentle, effective, and non-stimulant.",
      author: "Rachel K., Illinois",
      avatar: "https://via.placeholder.com/50?text=R"
    },
    {
      text: "No more 3 PM slump. Mitolyn helps me power through my workday without coffee or sugar crashes.",
      author: "Tina P., California",
      avatar: "https://via.placeholder.com/50?text=T"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6">
        <div className="max-w-3xl w-full space-y-12">

          {/* Story Hook - Modern Card */}
          <div className="text-left bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-100 shadow-sm">
            <p className="text-gray-800 italic text-lg leading-relaxed">
              “After 40, my energy vanished — no matter how ‘healthy’ I ate. 
              My wellness coach said my metabolism needed gentle support. 
              That small shift changed everything.”
            </p>
            <p className="text-right text-teal-700 font-medium mt-3">— Sarah, Verified User</p>
          </div>

          {/* Headline - Vibrant & Centered */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-700 to-cyan-800 bg-clip-text text-transparent">
              Feel Like Yourself Again — Naturally
            </h1>
            <p className="text-gray-600 text-xl mt-4 max-w-2xl mx-auto">
              The trusted choice for <strong>natural metabolism support</strong> after 40.
            </p>
          </div>

          {/* Rotating Testimonial */}
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <span className="text-teal-700 font-bold">❝</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 italic text-lg">
                  {testimonials[currentTestimonial].text}
                </p>
                <p className="text-right text-teal-700 font-medium mt-2">
                  — {testimonials[currentTestimonial].author}
                </p>
              </div>
            </div>
          </div>

          {/* Lifestyle Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <img 
              src="https://images.stockcake.com/public/2/0/3/2036d68e-9c45-4730-921a-b9b8a3791638_large/sipping-red-smoothie-stockcake.jpg" 
              alt="Woman enjoying morning wellness routine with natural metabolic support" 
              className="w-full h-auto"
              loading="lazy"
            />
          </div>

          {/* ✅ COMPLIANT PRODUCT HIGHLIGHT BLOCK */}
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <span className="text-teal-700 font-bold">❝</span>
              </div>
              <p className="text-gray-800 italic text-lg">
                “Mitolyn gave me steady energy throughout the day without any jitters. After three weeks, my afternoon crashes disappeared, and I felt more like myself again.”
              </p>
            </div>

            <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-teal-600">✨</span> Why Women Are Choosing Mitolyn
            </h3>

            <ul className="space-y-3 text-gray-700 mb-5">
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>Supports mitochondrial health for natural, sustained energy</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>Stimulant-free formula — no crashes, no jitters</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>Complements your wellness lifestyle without harsh side effects</span>
              </li>
            </ul>

            <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
              <p className="text-teal-800 font-medium">
                💡 <strong>Final Thought:</strong> Your metabolism deserves gentle, science-backed support. Mitolyn is designed for those seeking a clean, non-habit-forming way to promote metabolic balance and daily wellness.
              </p>
            </div>
          </div>

          {/* USP Section */}
          <div className="p-5 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100">
            <h3 className="font-bold text-lg text-cyan-900 mb-3 text-center">Why Women Over 40 Choose This</h3>
            <ul className="space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start gap-2"><CheckIcon /> Supports healthy metabolic function</li>
              <li className="flex items-start gap-2"><CheckIcon /> Promotes steady, natural energy</li>
              <li className="flex items-start gap-2"><CheckIcon /> Gentle, non-stimulant formula</li>
            </ul>
          </div>

          {/* CTA Button - Vibrant */}
          <div className="text-center">
            <button
              onClick={() => signIn("google")}
              disabled={loading}
              className="w-full max-w-xs mx-auto px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 rounded-xl shadow-lg hover:shadow-xl text-white font-bold text-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              Start My Wellness Journey →
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center gap-6 mt-4 flex-wrap text-sm text-gray-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-teal-500 rounded-full"></span> SSL Secured</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Free Shipping</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-cyan-500 rounded-full"></span> Made in USA</span>
          </div>

          {/* FAQ */}
          <div className="pt-8 border-t border-gray-200">
            <h3 className="font-bold text-xl text-gray-900 text-center mb-6">Frequently Asked Questions</h3>
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden mb-3">
                <button
                  className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 font-medium"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-gray-800">{faq.question}</span>
                  <PlusIcon isOpen={openFaq === index} />
                </button>
                {openFaq === index && (
                  <div className="p-4 bg-gray-50 text-gray-600 border-t border-gray-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Links */}
          <div className="text-center text-xs text-gray-500 space-y-3 pt-6">
            <p>🔒 Secure sign-in with Google</p>
            <p>✉️ By continuing, you agree to receive wellness updates. Unsubscribe anytime.</p>
            <p className="flex justify-center gap-6">
              <a href="/privacy" className="underline hover:text-teal-600">Privacy Policy</a>
              <a href="/disclaimer" className="underline hover:text-teal-600">Affiliate Disclaimer</a>
            </p>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <span className="text-gray-700 font-medium">Ready to start?</span>
            <button
              onClick={() => signIn("google")}
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-600 transition"
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-3"></div>
            <p className="font-bold text-gray-900">Loading Details...</p>
            <p className="text-gray-600 text-sm mt-1">Redirecting to official site.</p>
          </div>
        </div>
      )}

      <footer className="py-5 text-center text-xs text-gray-500 border-t border-gray-100">
        *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. Results may vary.
      </footer>
    </div>
  );
}