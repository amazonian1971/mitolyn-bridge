'use client';

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { Inter, Lora } from 'next/font/google';

// --- Icon Components (Unaltered) ---
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

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-lora' });


export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    setLoading(true);

    try {
      await fetch("/api/log-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });
      router.push('/thank-you');
    } catch (error) {
      console.error("Failed to submit lead:", error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

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
    const handleScroll = () => setShowStickyBar(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const faqs = [
    { question: "Is this safe for women over 40?", answer: "Yes. Mitolyn is formulated with gentle, natural ingredients specifically chosen for their safety and efficacy. As with any new supplement, we recommend consulting your physician before use." },
    { question: "How long until I see results?", answer: "Many users report feeling a noticeable difference in their energy levels within the first two weeks of consistent daily use. However, for best results, we recommend a 3-month course to allow the ingredients to work synergistically with your body." },
    { question: "What if it doesn't work for me?", answer: "Every bottle of Mitolyn is backed by our iron-clad 180-day, no-questions-asked, money-back guarantee. Your journey to feeling great is completely risk-free." },
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
      <div className="bg-emerald-600 text-white text-center p-2 text-sm font-semibold">
        Limited Time: Free Shipping On All U.S. Orders!
      </div>
      
      {/* --- HERO SECTION - "ULTRA-DIRECT" PIVOT --- */}
      <header className="relative text-center py-20 md:py-28 px-4 bg-gradient-to-b from-white to-emerald-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto">
          
          <h1 className={`font-serif text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-in fade-in slide-in-from-top duration-700 ${lora.className}`}>
            The #1 Metabolism Booster for Women Over 40
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 animate-in fade-in slide-in-from-top duration-900">
            This gentle, non-stimulant formula helps fire up your metabolism and support all-day energy. Get your free guide to the 5 key foods that support this process.
          </p>
          
          <div className="animate-in fade-in slide-in-from-bottom duration-1000">
            <form onSubmit={handleEmailSubmit} className="max-w-lg mx-auto space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for the FREE guide"
                required
                className="w-full px-6 py-4 text-lg text-gray-800 bg-white border-2 border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg shadow-lg hover:shadow-xl text-white font-bold text-lg transition-all transform hover:-translate-y-1 disabled:opacity-70 flex items-center justify-center space-x-3"
              >
                <span>{loading ? 'Sending...' : 'Get My Free Guide!'}</span>
                <span>→</span>
              </button>
            </form>
            
            <div className="flex justify-center gap-4 mt-4 flex-wrap text-xs text-gray-600">
              <span>🔒 100% Secure</span>
              <span>✔️ Instant Access</span>
              <span>🚫 We hate spam</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* --- How It Works Section --- */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className={`font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${lora.className}`}>How This Formula Supports Your Metabolism</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">It works with your body's natural processes in three simple steps.</p>
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

      {/* --- Testimonials Section --- */}
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
              src="https://messages-prod.27c852f3500f38c1e7786e2c9ff9e48f.r2.cloudflarestorage.com/6e68d108-d89d-4b1d-92e4-5c3d64c88edc/1760177437375-0199d2c0-1837-78b2-bf57-b14ce055d711.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=c86e09ae0bc1d897b03dfaa30a8b51f3%2F20251011%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20251011T101037Z&X-Amz-Expires=3600&X-Amz-Signature=cab7f2c7b3320c254517e38cb10b945e841c0a1bbb902b9a053e74fc76b0fb73&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
              alt="Radiant woman in her 40s enjoying a healthy smoothie and feeling vibrant"
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
  
      <footer className="py-8 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-4">
            <a href="https://mitolyn.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="https://mitolyn.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="https://mitolyn.com/shipping-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Shipping Policy</a>
            <a href="https://mitolyn.com/return-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Return Policy</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <p className="max-w-3xl mx-auto">
            *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Results may vary from person to person.
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} MetabolismSupport.com. All Rights Reserved.</p>
        </div>
      </footer>

      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 hidden sm:block">Get Your Free Quick-Start Guide!</p>
              <p className="text-sm text-gray-600">Discover the 5 key foods that support your metabolism.</p>
            </div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center space-x-2 shadow-md"
            >
              <span>Get The Guide</span>
              <span>→</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}