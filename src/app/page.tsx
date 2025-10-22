'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function MitolynLandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(872); // 14:32
  const [spotsLeft, setSpotsLeft] = useState(7);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showTestimonial, setShowTestimonial] = useState(false);
  const [testimonialPosition, setTestimonialPosition] = useState<React.CSSProperties>({ bottom: 16, left: 16 });
  const [selectedPackage, setSelectedPackage] = useState('3'); // Default to 3-bottle package
  const [showFAQ, setShowFAQ] = useState(false);

  const AFFILIATE_URL = process.env.NEXT_PUBLIC_AFFILIATE_URL || 'https://hop.clickbank.net/?affiliate=syed222&vendor=mitolyn';

  // Testimonials data
  const testimonials = [
    {
      name: "Jennifer M.",
      age: 52,
      location: "Austin, TX",
      result: "Lost 43 lbs in 12 weeks",
      quote: "I cried when I stepped on the scale this morning. 43 pounds GONE! I haven't weighed this since my 30s. The crazy part? I'm eating MORE than before. My energy is through the roof!",
      rating: 5,
      image: "https://scontent.fbho5-1.fna.fbcdn.net/o1/v/t0/f2/m340/AQOR2JvVizUhZlCuNO-Vzv5urWRq7e3PpDJn_OgQRDYKP-WPrHCqWvbFMVs9Qyd-e7VmsTEG_N4NVI_tLEfwLzoEkSRmj0SQFQRUUmw6pLD5S1_azPxFK1XMH-5_P_4-Xc5ix2IsWjumozoIj1FTTSzDYMW4lw.png?_nc_ht=scontent.fbho5-1.fna.fbcdn.net&_nc_gid=KQ9Q_MHoEzh3m4EhpQWgAw&_nc_cat=100&_nc_oc=AdlczNk4JaW12G8RDwU_beQu78Eo-13aJRivge8V5-EXRMY3slYQPu8W0iMYmQATR8vo5ALEYNGlrSfN1afP7B_J&ccb=9-4&oh=00_Afd_cwcc2OWaC08ga34Zi1v2hXVOGsVx2e0xyUIeN80Oxg&oe=68FA3AC7&_nc_sid=5b3566"
    },
    {
      name: "Sarah K.",
      age: 48,
      location: "Phoenix, AZ",
      result: "Lost 31 lbs in 8 weeks",
      quote: "The 2pm crashes are GONE. Completely gone! I used to need 3 cups of coffee just to survive the afternoon. Now I have energy all day. My doctor was shocked!",
      rating: 5,
      image: "https://scontent.fbho5-1.fna.fbcdn.net/v/t39.30808-6/567590724_805671922637373_8743488634365345067_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=e1afaa&_nc_ohc=sHHxH1_sd4EQ7kNvwGiyUJd&_nc_oc=AdkahVtGPJ8HRY4oDVQ5ppZws2Ii0587f1XqxJQbGVZ_7tmNl9pyamRv5ZPBeZQcZjMlUGAT6myvqzHoYWej5lP5&_nc_zt=23&_nc_ht=scontent.fbho5-1.fna&_nc_gid=6cw7l1DjClAdQdWILmdU8A&oh=00_AfcaSWwGgFRqOLDYpNEaoihsHfaDxh1vridTPP4XITrqsw&oe=68FE5B98"
    },
    {
      name: "Linda R.",
      age: 56,
      location: "Denver, CO",
      result: "Lost 37 lbs in 10 weeks",
      quote: "My blood pressure is normal for the first time in 10 years! My doctor reduced my medications. I've lost 37 pounds and 5 dress sizes. This saved my health!",
      rating: 5,
      image: "https://scontent.fbho5-1.fna.fbcdn.net/v/t39.30808-6/566248172_805673882637177_7826166945754350851_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=e1afaa&_nc_ohc=X8UDnt1G5gIQ7kNvwHZQ2kn&_nc_oc=AdmEWwQGOIEDqmjF19ICio6n5ePvvtvBgQqn-4Sa195Xls_fIiYydQ2NP9MT1bRqSOTmU9oYDQfkP6wr_xCN1HVm&_nc_zt=23&_nc_ht=scontent.fbho5-1.fna&_nc_gid=1c8OTl4z_EZvJ0gzuBA3-A&oh=00_AfdXhKRv0nUB8LsIsAfly_lWsbGHszM89jvF2SXue8x3Fw&oe=68FE378B"
    },
    {
      name: "Patricia T.",
      age: 61,
      location: "Seattle, WA",
      result: "Lost 52 lbs in 14 weeks",
      quote: "I thought weight loss after 60 was impossible. I was WRONG! 52 pounds gone and I feel 30 years younger. My grandkids can't keep up with me now!",
      rating: 5,
      image: "https://scontent.fbho5-1.fna.fbcdn.net/v/t39.30808-6/565679893_805673889303843_1636475946485239826_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=e1afaa&_nc_ohc=WzwfBrW19GoQ7kNvwGbG4QT&_nc_oc=AdnoYfEBdOr9Gmk1OvSx03j_OzfzGQ2wHh0fy07u41Zq_xPdUecyut9bvDrj8hofcoq1_dXoP9YPrEAD8jhcz9Mh&_nc_zt=23&_nc_ht=scontent.fbho5-1.fna&_nc_gid=9Tb7NLcu0-jAS-M2388IlA&oh=00_Afe-eYrMPkySpm2uGkoGfJZtrVjs3VRQQpTWTsPB6TTf6Q&oe=68FE2FF7"
    }
  ];

  // Pricing packages
  const packages = [
    {
      id: '1',
      name: '30-Day Supply',
      bottles: 1,
      price: 59,
      originalPrice: 89,
      savings: 30,
      popular: false,
      bonus: false,
      shipping: '+ $9.95 shipping'
    },
    {
      id: '3',
      name: '90-Day Supply',
      bottles: 3,
      price: 147,
      originalPrice: 267,
      savings: 120,
      popular: true,
      bonus: true,
      shipping: 'FREE U.S. shipping'
    },
    {
      id: '6',
      name: '180-Day Supply',
      bottles: 6,
      price: 234,
      originalPrice: 534,
      savings: 300,
      popular: false,
      bonus: true,
      shipping: 'FREE U.S. shipping'
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "How does Mitolyn work?",
      answer: "Mitolyn works by optimizing mitochondrial function at the cellular level. It enhances ATP production (your body's true energy currency) and improves mitochondrial efficiency, helping your body naturally burn fat more efficiently and sustain higher energy levels."
    },
    {
      question: "Are there any side effects?",
      answer: "Most users do not experience significant negative side effects. Some first-time users report temporary digestive discomfort, such as bloating or mild gas, particularly in the first few days of use. This is typically a sign of the body adjusting to increased fat metabolism and cellular energy production."
    },
    {
      question: "How long until I see results?",
      answer: "Results vary by individual, but many users report more stable energy within the first week. By weeks 3-4, most notice significant fatigue reduction and their metabolism begins burning more fuel. For best results, consistent use for at least 90 days is recommended."
    },
    {
      question: "Is Mitolyn safe?",
      answer: "Yes, Mitolyn is formulated with natural plant-based compounds and is free from stimulants, synthetic additives, or artificial appetite suppressants. It's manufactured in an FDA-registered, GMP-certified facility. However, if you have pre-existing medical conditions or are taking medications, consult your doctor before use."
    },
    {
      question: "What if it doesn't work for me?",
      answer: "Mitolyn comes with a 90-day money-back guarantee. If you're not completely satisfied with your results, simply return the product (even empty bottles) for a full refund, no questions asked."
    }
  ];

  // Handle package selection
  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const { error } = await supabase.from('leads').insert([{
        email: email.toLowerCase(),
        source: 'landing_page',
        campaign: 'mitolyn',
        package: selectedPackage,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
      }]);

      if (error && error.code !== '23505') {
        console.error('Supabase error:', error);
      }
      
      // Track with pixels
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', { value: email });
      }
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Redirect after showing success modal
      setTimeout(() => {
        setShowSuccessModal(false);
        window.location.href = AFFILIATE_URL;
      }, 3000);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle direct CTA click
  const handleDirectCTA = () => {
    window.location.href = AFFILIATE_URL;
  };

  // Inject custom styles only on client side
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes bounceIn {
        0% {
          transform: scale(0.3);
          opacity: 0;
        }
        50% {
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
        }
      }
      .animate-slideIn {
        animation: slideIn 0.5s ease-out;
      }
      .animate-slideUp {
        animation: slideUp 0.3s ease-out;
      }
      .animate-bounceIn {
        animation: bounceIn 0.6s ease-out;
      }
      .animate-pulse {
        animation: pulse 2s infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Random spots reduction
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft(prev => prev > 3 ? prev - 1 : prev);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Random floating testimonials
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      showRandomTestimonial();
    }, 5000);
    
    const testimonialTimer = setInterval(() => {
      showRandomTestimonial();
    }, Math.floor(Math.random() * 15000) + 15000);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(testimonialTimer);
    };
  }, []);

  // Function to show a random testimonial
  const showRandomTestimonial = () => {
    const randomIndex = Math.floor(Math.random() * testimonials.length);
    setCurrentTestimonial(randomIndex);
    
    const positions = [
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
    
    setTimeout(() => {
      setShowTestimonial(false);
    }, 5000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-bounceIn">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-3">
              Thank You! 🎉
            </h2>
            
            <p className="text-center text-gray-700 mb-4 text-sm">
              Your order is being processed. Redirecting to secure checkout...
            </p>
            
            <div className="text-center">
              <p className="text-xs text-blue-600 animate-pulse">
                Redirecting to secure checkout...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Testimonials */}
      {showTestimonial && (
        <div 
          className="fixed bg-white shadow-2xl rounded-lg p-3 max-w-xs animate-slideIn z-40 border-l-4 border-green-500"
          style={testimonialPosition}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">
                {testimonials[currentTestimonial].name} from {testimonials[currentTestimonial].location}
              </p>
              <p className="text-xs text-gray-600">
                Just ordered Mitolyn
              </p>
              <p className="text-xs text-gray-500">
                2 minutes ago
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Header Bar */}
      <div className="sticky top-0 bg-red-600 text-white py-2 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-xs">
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

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 md:py-12">
          <div className="max-w-5xl mx-auto px-4">
            {/* Pre-headline */}
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                <span>⚡</span>
                BREAKING: Harvard Study Validates Ancient Discovery
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-center text-gray-900 mb-4 md:mb-6 leading-tight">
              Doctor Discovers 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600"> "Dormant" Metabolism Switch </span>
              That Forces Your Body To Burn 
              <span className="underline decoration-2 md:decoration-4 decoration-green-500"> 1-2 Lbs Every 48 Hours</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl lg:text-2xl text-center text-gray-700 mb-6 md:mb-8 max-w-3xl mx-auto">
              97% of women over 45 have this ONE metabolism-blocking enzyme that makes weight loss nearly impossible... 
              <span className="font-semibold text-gray-900"> until now</span>
            </p>

            {/* Product Image */}
            <div className="relative max-w-md mx-auto mb-6 md:mb-8">
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl p-4">
                <img 
                  src="https://picsum.photos/seed/mitolyn-bottle/400/400.jpg" 
                  alt="Mitolyn Bottle" 
                  className="w-full h-auto"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Scientifically Proven
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>No Stimulants</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>All-Natural Ingredients</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>90-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Made in USA</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM/SOLUTION SECTION */}
        <section className="py-8 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900">
              Does This Sound Like You?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                {[
                  "You've tried every diet but your body refuses to lose weight like it used to",
                  "You wake up exhausted no matter how much sleep you get",
                  "Your metabolism feels 'broken' - you gain weight just looking at food",
                  "That 2pm energy crash hits you like a truck every single day"
                ].map((pain, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <span className="text-red-500 text-xl flex-shrink-0">😔</span>
                    <p className="text-gray-800 text-sm md:text-base">{pain}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  The REAL Reason This Happens
                </h3>
                <p className="text-gray-700 mb-4">
                  As we age, our mitochondria (the powerhouses of our cells) become less efficient. This leads to:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Slower metabolism and weight gain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Chronic fatigue and energy crashes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Difficulty losing stubborn fat</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-xl"
              >
                See How Mitolyn Can Help →
              </button>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-8 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900">
              How Mitolyn Works at the Cellular Level
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838L12.75 7.95a.999.999 0 01-.356.257l-4 1.714a1 1 0 01-.788-1.838L12.333 7.912l-1.94-.831a1 1 0 00-.787 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Step 1</h3>
                <p className="text-gray-700">
                  Mitolyn delivers powerful antioxidants and nutrients directly to your mitochondria
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v8h8a1 1 0 01.707 1.707l-8.586 8.586A1 1 0 013 18.586V11H2a1 1 0 01-1-1V3a1 1 0 011.046-.954l9.254-9.254z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Step 2</h3>
                <p className="text-gray-700">
                  It enhances ATP production, your body's true energy currency
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2h4a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Step 3</h3>
                <p className="text-gray-700">
                  Your metabolism naturally accelerates, burning fat more efficiently
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">The Science Behind It</h3>
              <p className="text-gray-700 mb-4">
                Unlike traditional fat burners that rely on stimulants, Mitolyn works at the cellular level to optimize mitochondrial function. This approach provides:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Sustained energy without crashes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Enhanced fat metabolism</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Improved mental clarity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Long-term metabolic health</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* INGREDIENTS SECTION */}
        <section className="py-8 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900">
              Clinically-Backed Ingredients
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Maqui Berry</h3>
                <p className="text-gray-700 mb-4">
                  A potent antioxidant-rich superfruit that reduces oxidative stress and improves insulin sensitivity. Studies show it enhances mitochondrial function.
                </p>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Key Benefit:</span> Supports fat metabolism
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 102 0V6h1a1 1 0 110-2H6V3a1 1 0 00-1-1zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Rhodiola</h3>
                <p className="text-gray-700 mb-4">
                  A powerful adaptogen that reduces fatigue, improves endurance, and regulates cortisol levels. Helps stabilize metabolic health.
                </p>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Key Benefit:</span> Reduces stress-related weight gain
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2h4a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Haematococcus</h3>
                <p className="text-gray-700 mb-4">
                  A natural source of astaxanthin, one of the most powerful antioxidants known to science. Protects mitochondria from oxidative damage.
                </p>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Key Benefit:</span> Preserves mitochondrial efficiency
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-8 md:py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 text-gray-900">
              Real Results From Real People
            </h2>
            <p className="text-center text-gray-600 mb-8 md:mb-12 text-base md:text-lg">
              Over 47,392 women are already transforming their lives with Mitolyn
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-t-4 border-green-500">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm md:text-base">{testimonial.name}</p>
                      <p className="text-xs md:text-sm text-gray-600">{testimonial.location} • Age {testimonial.age}</p>
                      <div className="flex text-yellow-400 text-sm md:text-base">★★★★★</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs md:text-sm font-bold">
                      {testimonial.result}
                    </span>
                  </div>
                  <p className="text-gray-700 italic mb-4 text-sm md:text-base">"{testimonial.quote}"</p>
                  <p className="text-xs text-gray-500">Verified Purchase ✓</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-8 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 text-gray-900">
              Choose Your Package
            </h2>
            <p className="text-center text-gray-600 mb-8 md:mb-12 text-base md:text-lg">
              Select the package that best fits your weight loss journey
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className={`relative bg-white rounded-xl shadow-lg p-6 border-2 ${
                    selectedPackage === pkg.id ? 'border-green-500' : 'border-gray-200'
                  } ${pkg.popular ? 'md:scale-105' : ''}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="flex justify-center items-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                      <span className="text-lg text-gray-500 line-through">${pkg.originalPrice}</span>
                    </div>
                    <p className="text-green-600 font-semibold">Save ${pkg.savings}</p>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm text-gray-700">{pkg.bottles} bottle{pkg.bottles > 1 ? 's' : ''} of Mitolyn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm text-gray-700">{pkg.shipping}</span>
                    </li>
                    {pkg.bonus && (
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-sm text-gray-700">2 FREE bonus eBooks</span>
                      </li>
                    )}
                  </ul>
                  
                  <button
                    onClick={() => handlePackageSelect(pkg.id)}
                    className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${
                      selectedPackage === pkg.id 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    {selectedPackage === pkg.id ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
                <span>⚠️</span>
                <span>Limited Time Offer: {spotsLeft} spots remaining</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-8 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <button
                    onClick={() => setShowFAQ(showFAQ === index ? -1 : index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transition-transform ${showFAQ === index ? 'rotate-180' : ''}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {showFAQ === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-8 md:py-16 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 lg:p-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 md:mb-6 text-gray-900">
                Your Transformation Starts Today
              </h2>
              
              <p className="text-center text-base md:text-lg text-gray-700 mb-6 md:mb-8">
                Join thousands of women who have already transformed their bodies with Mitolyn
              </p>

              {/* Urgency Box */}
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
                <p className="text-center font-semibold text-red-800 mb-2 text-sm md:text-base">
                  ⚠️ Warning: Due to high demand, we can only guarantee access for the next:
                </p>
                <p className="text-center text-3xl md:text-4xl font-bold text-red-600 font-mono">
                  {formatTime(timeLeft)}
                </p>
                <p className="text-center text-sm md:text-base text-red-700 mt-2">
                  Only {spotsLeft} spots remaining for today
                </p>
              </div>

              {/* Main CTA Button */}
              <button
                onClick={handleDirectCTA}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg md:text-2xl py-4 md:py-6 rounded-lg transition-all transform hover:scale-105 shadow-2xl animate-pulse"
              >
                Get Mitolyn Now →
              </button>

              {/* Trust Badges */}
              <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> 90-Day Money Back Guarantee
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> FDA Registered Facility
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> Made in USA
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 md:py-8 bg-white border-t">
          <div className="max-w-4xl mx-auto px-4 text-center text-xs text-gray-500 space-y-2">
            <p>
              * Results vary by individual. These statements have not been evaluated by the FDA.
            </p>
            <p>© 2024 MITOLYN. All Rights Reserved.</p>
            
            <div className="text-center text-xs text-gray-500 space-y-3 pt-4 md:pt-6">
              <p>🔒 Secure checkout</p>
              <p>✉️ By continuing, you agree to receive wellness updates. Unsubscribe anytime.</p>
              <p className="flex justify-center gap-4 md:gap-6">
                <a href="/privacy" className="underline hover:text-teal-600">Privacy Policy</a>
                <a href="/disclaimer" className="underline hover:text-teal-600">Disclaimer</a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}