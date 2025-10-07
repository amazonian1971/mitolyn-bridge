'use client';

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { Inter, Lora } from 'next/font/google';

// --- Fonts for a more elegant and readable design ---
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-lora' });

// --- Icon Components (Enhanced for consistency) ---
const CheckIcon = ({ className = "w-6 h-6 text-emerald-500" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const StarIcon = ({ className = "w-5 h-5 text-amber-400" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
  </svg>
);

const PlusIcon = ({ className = "w-6 h-6 text-gray-500" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const MinusIcon = ({ className = "w-6 h-6 text-emerald-600" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
  </svg>
);

const ShieldCheckIcon = ({ className = "w-8 h-8 text-emerald-600"}: {className?: string}) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a12.02 12.02 0 009 2.056c4.522 0 8.34-1.848 9-2.056a12.02 12.02 0 00-2.382-9.043z" />
    </svg>
);


export default function Home() {
  // --- Core Logic (Unaltered) ---
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [showRedirecting, setShowRedirecting] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const testimonials = [
    { text: "Mitolyn gave me steady energy throughout the day without any jitters. After three weeks, my afternoon crashes disappeared, and I felt more like myself again.", author: "Sarah L, Verified User", avatar: "https://www.uipi.com/wp-content/uploads/2021/06/Testimonial-3.png", rating: 5 },
    { text: "I was skeptical at first, but after 4 weeks, I noticed I had more stamina for my morning walks — no crash, no guilt, just natural support.", author: "Jamie R., Portland, OR", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80", rating: 5 },
    { text: "As a busy mom over 40, I needed something simple. Mitolyn fits into my routine — no diet, no stress, just consistent energy.", author: "Lisa M., Texas", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80", rating: 5 }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const gclid = params.get('gclid');
      if (gclid) localStorage.setItem('gclid', gclid);
      const gbraid = params.get('gbraid');
      const wbraid = params.get('wbraid');
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
    const handleScroll = () => setShowStickyBar(window.scrollY > 600);
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
        body: JSON.stringify({ email: session?.user?.email, name: session?.user?.name || null, utm_source, utm_medium, utm_campaign, gclid, gbraid, wbraid }),
      });
      if (typeof window !== "undefined" && (window as any).gtag && session?.user?.email) {
        (window as any).gtag("event", "conversion", { send_to: "AW-968379698", value: 75.0, currency: "INR", email: session.user.email });
      }
      setTimeout(() => { window.location.href = process.env.NEXT_PUBLIC_AFFILIATE_LINK || '/'; }, 1500);
    } catch (error) {
      console.error("Redirect failed:", error);
      window.location.href = process.env.NEXT_PUBLIC_AFFILIATE_LINK || '/';
    }
  };

  const faqs = [
    { question: "Is Mitolyn safe for women over 40?", answer: "Yes. Mitolyn is formulated with gentle, natural ingredients specifically chosen for their safety and efficacy. As with any new supplement, we recommend consulting your physician before use." },
    { question: "How long until I see results?", answer: "Many users report feeling a noticeable difference in their energy levels within the first two weeks of consistent daily use. However, for best results, we recommend a 3-month course to allow the ingredients to work synergistically with your body." },
    { question: "What if it doesn't work for me?", answer: "We are confident you'll love Mitolyn. That's why every bottle is backed by our iron-clad 180-day, no-questions-asked, money-back guarantee. Your journey to feeling great is completely risk-free." },
    { question: "What are the ingredients?", answer: "Mitolyn contains a proprietary blend of natural, AMPK-activating compounds including Berberine, Ginseng, and Alpha-Lipoic Acid, all chosen to support your body's cellular energy and metabolism." }
  ];

  const features = [
    "Features a Powerful AMPK-Activating Blend",
    "Supports Your Body's 'Metabolic Master Switch'",
    "Promotes All-Day Energy Without Jitters",
    "Helps Reduce Afternoon Slumps & Cravings",
    "Natural, Non-Stimulant Formula",
    "Made in the USA in a GMP-Certified Facility"
  ];

  return (
    <div className={`${inter.variable} ${lora.variable} font-sans bg-stone-50 text-gray-800`}>
      {/* --- Announcement Bar --- */}
      <div className="bg-emerald-600 text-white text-center p-2 text-sm font-semibold">
        Limited Time: Free Shipping On All U.S. Orders!
      </div>
      
      {/* --- Hero Section --- */}
      <header className="relative text-center py-20 md:py-28 px-4 bg-gradient-to-b from-white to-emerald-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto">
      
          <p className="font-semibold text-emerald-700 mb-4 animate-in fade-in slide-in-from-top duration-500 uppercase tracking-wider">The Yale-Celebrated Discovery</p>
          
          <h1 className={`font-serif text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-in fade-in slide-in-from-top duration-700 ${lora.className}`}>
            Activate Your 'Metabolic Master Switch'
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 animate-in fade-in slide-in-from-top duration-900">
            Discover how activating a tiny enzyme called AMPK—the body's "Metabolic Master Switch"—can help fire up your metabolism, support all-day energy, and restore that youthful spark for women over 40.
          </p>
          
          <p className="font-semibold text-gray-700 max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-top duration-900">Watch the free presentation that explains the science:</p>

          <div className="animate-in fade-in slide-in-from-bottom duration-1000">
            <button
              onClick={() => signIn("google")}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg shadow-lg hover:shadow-xl text-white font-bold text-lg transition-all transform hover:-translate-y-1 disabled:opacity-70 flex items-center justify-center space-x-3 w-full max-w-md mx-auto"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              <span>Watch The Free Presentation</span>
            </button>
            
            <div className="flex justify-center gap-4 mt-4 flex-wrap text-xs text-gray-600">
              <span>🔒 SSL Secured</span>
              <span>🚚 Free Shipping</span>
              <span>🇺🇸 Made in USA</span>
              <span>💯 180-Day Guarantee</span>
            </div>

            <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1.5">
                <StarIcon /> <StarIcon /> <StarIcon /> <StarIcon /> <StarIcon /> <span>4.9/5 stars</span>
              </div>
              <span>•</span>
              <span>15,000+ happy customers</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* --- How It Works Section (New Sequence) --- */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className={`font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${lora.className}`}>How Mitolyn Activates Your Master Switch</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">It's not about punishing diets or exhaustive workouts. It's about supporting your body's natural metabolic engine in three simple steps.</p>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl mb-4 font-bold text-emerald-700">1</div>
                    <h3 className="text-xl font-semibold mb-2">Activates AMPK</h3>
                    <p className="text-gray-600">The formula signals your 'Metabolic Master Switch' to start working like it used to.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl mb-4 font-bold text-emerald-700">2</div>
                    <h3 className="text-xl font-semibold mb-2">Recharges "Cellular Batteries"</h3>
                    <p className="text-gray-600">It nourishes your mitochondria, the tiny power plants inside your cells, for clean, natural energy.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl mb-4 font-bold text-emerald-700">3</div>
                    <h3 className="text-xl font-semibold mb-2">Sustains All-Day Vitality</h3>
                    <p className="text-gray-600">The result is steady, reliable energy and metabolic support without the jitters or crash.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- Testimonials Section (MOVED UP) --- */}
      <section className="py-16 md:py-24 bg-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-12 ${lora.className}`}>Real Women, Real Results</h2>
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
                <img src={testimonials[currentTestimonial].avatar} alt={testimonials[currentTestimonial].author} className="w-20 h-20 rounded-full object-cover mx-auto mb-6 ring-4 ring-white/30" />
                <p className="text-xl md:text-2xl italic leading-relaxed mb-6">
                    "{testimonials[currentTestimonial].text}"
                </p>
                <div className="flex justify-center space-x-1 mb-6">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-6 h-6 text-amber-300" />)}
                </div>
                <p className="font-bold text-lg">{testimonials[currentTestimonial].author}</p>
                <div className="flex justify-center space-x-3 mt-8">
                  {testimonials.map((_, index) => (
                    <button key={index} onClick={() => setCurrentTestimonial(index)} className={`w-3 h-3 rounded-full transition-colors ${index === currentTestimonial ? 'bg-white' : 'bg-white/40'}`} />
                  ))}
                </div>
            </div>
        </div>
      </section>

      {/* --- Features & Product Section --- */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="md:order-2">
            <img 
              src="https://shorturl.at/C8lUi" 
              alt="Woman feeling vibrant and energetic"
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
            />
          </div>
          <div className="md:order-1">
            <h2 className={`font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6 ${lora.className}`}>
              The Mitolyn Difference
            </h2>
            <p className="text-lg text-gray-600 mb-8">This isn't just another supplement. It's a targeted formula designed for peace of mind and real results.</p>
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center space-x-3">
                  <CheckIcon />
                  <span className="text-gray-700 font-medium text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Guarantee Section --- */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
            <div className="bg-stone-100 border border-stone-200 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <ShieldCheckIcon className="w-24 h-24 text-emerald-500 flex-shrink-0" />
                <div>
                    <h2 className={`font-serif text-3xl font-bold text-gray-900 mb-3 ${lora.className}`}>Our 180-Day "Feel The Difference" Guarantee</h2>
                    <p className="text-lg text-gray-600">Try Mitolyn for a full 6 months. If you don't feel a remarkable improvement in your energy and vitality, or if you're not satisfied for any reason whatsoever, simply contact us for a full refund. No questions, no hassles. Your journey to feeling great is 100% risk-free.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className={`text-center font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-12 ${lora.className}`}>Your Questions, Answered</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <button
                  className="w-full flex justify-between items-center p-6 text-left font-semibold text-lg"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-gray-900">{faq.question}</span>
                  {openFaq === index ? <MinusIcon /> : <PlusIcon />}
                </button>
                {openFaq === index && (
                  <div className="p-6 pt-0 text-gray-600 animate-in fade-in duration-300">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Final CTA Section --- */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className={`font-serif text-4xl md:text-5xl font-bold mb-6 ${lora.className}`}>Ready to Activate Your Metabolic Master Switch?</h2>
          <p className="text-xl text-emerald-100 mb-10">
            Click below to watch the free presentation and discover how thousands of women are reclaiming their energy.
          </p>
          <button
            onClick={() => signIn("google")}
            disabled={loading}
            className="px-8 py-4 bg-white text-emerald-600 hover:bg-emerald-50 rounded-lg shadow-lg hover:shadow-xl font-bold text-lg transition-all transform hover:-translate-y-1 disabled:opacity-70 flex items-center justify-center space-x-3 w-full max-w-md mx-auto"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            <span>Watch The Free Presentation Now</span>
            <span>→</span>
          </button>
          
          <div className="flex justify-center gap-4 mt-6 flex-wrap text-sm text-emerald-200">
            <span>🔒 SSL Secured</span>
            <span>🚚 Free Shipping</span>
            <span>🇺🇸 Made in USA</span>
            <span>💯 180-Day Guarantee</span>
          </div>

        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="max-w-3xl mx-auto">
            *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Results may vary from person to person.
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} Mitolyn. All Rights Reserved.</p>
        </div>
      </footer>

      {/* --- Sticky Bar (Preserved & Re-styled) --- */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 hidden sm:block">Ready to Activate Your Master Switch?</p>
              <p className="text-sm text-gray-600">Watch the free presentation now.</p>
            </div>
            <button
              onClick={() => signIn("google")}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center space-x-2 shadow-md"
            >
              <span>Watch Now</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* --- Redirect Modal (Preserved & Re-styled) --- */}
      {showRedirecting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl max-w-sm mx-auto animate-in zoom-in duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <h3 className={`font-serif text-xl font-bold text-gray-900 mb-2 ${lora.className}`}>Authentication Successful!</h3>
            <p className="text-gray-600">Get ready to watch the exclusive video presentation. It will start playing automatically...</p>
          </div>
        </div>
      )}
    </div>
  );
}