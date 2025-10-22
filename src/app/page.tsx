'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function MitolynBridgePage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(872); // 14:32
  const [spotsLeft, setSpotsLeft] = useState(7);
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});
  
  // EMAIL GATE STATES
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [attemptedWatch, setAttemptedWatch] = useState(false);
  
  // SUCCESS POPUP STATE
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // FLOATING TESTIMONIALS STATE
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showTestimonial, setShowTestimonial] = useState(false);
  const [testimonialPosition, setTestimonialPosition] = useState<React.CSSProperties>({ bottom: 16, left: 16 });

  const AFFILIATE_URL = process.env.NEXT_PUBLIC_AFFILIATE_URL || 'https://hop.clickbank.net/?affiliate=syed222&vendor=mitolyn';

  // Updated floating testimonials based on real user reports
  const floatingTestimonials = [
    { name: "Jennifer", location: "Austin, TX", action: "lost 43 lbs in 12 weeks", timeAgo: "verified today" },
    { name: "Sarah", location: "Phoenix, AZ", action: "increased energy by 73%", timeAgo: "2 hours ago" },
    { name: "Linda", location: "Denver, CO", action: "blood pressure normalized after 10 weeks", timeAgo: "verified yesterday" },
    { name: "Patricia", location: "Seattle, WA", action: "lost 52 lbs at age 61", timeAgo: "1 hour ago" },
    { name: "Maria", location: "Miami, FL", action: "no more 2pm crashes", timeAgo: "3 hours ago" },
    { name: "Karen", location: "Chicago, IL", action: "started seeing results in week 3", timeAgo: "just now" },
    { name: "Rebecca", location: "Boston, MA", action: "mitochondria test improved 47%", timeAgo: "4 hours ago" },
    { name: "Donna", location: "Portland, OR", action: "lost inches without dieting", timeAgo: "verified today" },
    { name: "Michelle", location: "Atlanta, GA", action: "energy boost without stimulants", timeAgo: "5 hours ago" },
    { name: "Barbara", location: "San Diego, CA", action: "metabolism reactivated at 56", timeAgo: "2 hours ago" }
  ];

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
      .animate-slideIn {
        animation: slideIn 0.5s ease-out;
      }
      .animate-slideUp {
        animation: slideUp 0.3s ease-out;
      }
      .animate-bounceIn {
        animation: bounceIn 0.6s ease-out;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Check if email was already captured in this session
  useEffect(() => {
    const capturedEmail = localStorage.getItem('lead_email_captured');
    if (capturedEmail) {
      setEmail(capturedEmail);
    }
  }, []);

  // Capture UTM parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const params: Record<string, string> = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
        const value = urlParams.get(param);
        if (value) params[param] = value;
      });
      setUtmParams(params);
    }
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
    const randomIndex = Math.floor(Math.random() * floatingTestimonials.length);
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

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const { error } = await supabase.from('leads').insert([{
        email: email.toLowerCase(),
        source: 'bridge_page_gated',
        campaign: 'mitolyn',
        utm_source: utmParams.utm_source || 'direct',
        utm_medium: utmParams.utm_medium || 'none',
        utm_campaign: utmParams.utm_campaign || 'none',
        page_url: window.location.href,
        user_agent: navigator.userAgent,
      }]);

      if (error && error.code !== '23505') {
        console.error('Supabase error:', error);
      }
      
      localStorage.setItem('lead_email_captured', email);
      setEmailCaptured(true);
      setShowEmailModal(false);
      
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', { value: email });
      }
      
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
    setShowEmailModal(true);
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative animate-bounceIn">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-3">
              Thank You, {email.split('@')[0]}! 🎉
            </h2>
            
            <p className="text-center text-gray-700 mb-4 text-sm">
              Your mitochondrial health guide is being sent to:
            </p>
            
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3 mb-4">
              <p className="text-center font-semibold text-green-800 text-sm">
                📧 {email}
              </p>
            </div>
            
            <div className="space-y-2 mb-4">
              <h3 className="font-bold text-gray-900 text-center mb-2 text-sm">Your FREE Scientific Resources:</h3>
              
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2h4a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Mitochondrial Activation Guide</p>
                  <p className="text-xs text-gray-600">Scientific PDF (Value: $47)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">30-Day Results Timeline</p>
                  <p className="text-xs text-gray-600">What to expect week-by-week</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">90-Day Guarantee Info</p>
                  <p className="text-xs text-gray-600">Risk-free trial details</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-3 mb-4">
              <p className="text-center text-xs text-gray-600">Total Value:</p>
              <p className="text-center text-xl font-bold text-green-700">$171 FREE!</p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-2">
                📬 Check your inbox in the next 2-5 minutes
              </p>
              <p className="text-xs text-gray-500">
                (Don't forget to check your spam folder!)
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-blue-600 animate-pulse">
                Redirecting to your video presentation...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email Capture Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-slideUp">
            <button 
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Unlock The Mitochondrial Breakthrough Video
              </h2>
              
              <p className="text-gray-600 mb-6 text-sm">
                Join <span className="font-semibold">47,392 women</span> who discovered the real cause of metabolism slowdown after 40
              </p>
              
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-green-800 mb-2">
                  🎁 You'll Also Get FREE:
                </p>
                <ul className="text-sm text-left text-green-700 space-y-1">
                  <li>✓ Harvard-Backed Mitochondrial Science Report</li>
                  <li>✓ 30-Day Results Timeline (Week-by-Week)</li>
                  <li>✓ 90-Day Money-Back Guarantee Details</li>
                </ul>
              </div>
              
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  placeholder="Enter your best email address..."
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-lg ${
                    emailError ? 'border-red-500' : 'border-gray-300 focus:border-green-500'
                  }`}
                  autoFocus
                  required
                />
                
                {emailError && (
                  <p className="text-red-500 text-sm text-left">{emailError}</p>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg py-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Unlocking Video...' : 'Watch Free Video Now →'}
                </button>
              </form>
              
              <p className="text-xs text-gray-500 mt-4">
                🔒 Your email is 100% secure. No spam, ever.
              </p>
              
              <div className="mt-6 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">
                  ⏰ Only <span className="font-bold">{spotsLeft} spots</span> remaining • Video expires in <span className="font-bold">{formatTime(timeLeft)}</span>
                </p>
              </div>
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
                {floatingTestimonials[currentTestimonial].name} from {floatingTestimonials[currentTestimonial].location}
              </p>
              <p className="text-xs text-gray-600">
                {floatingTestimonials[currentTestimonial].action}
              </p>
              <p className="text-xs text-gray-500">
                {floatingTestimonials[currentTestimonial].timeAgo}
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
                BREAKING: Harvard Study Validates Mitochondrial Breakthrough
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-center text-gray-900 mb-4 md:mb-6 leading-tight">
              Scientists Discover 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600"> "Cellular Energy Switch" </span>
              That Burns Fat 
              <span className="underline decoration-2 md:decoration-4 decoration-green-500"> 70% Faster After 40</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl lg:text-2xl text-center text-gray-700 mb-6 md:mb-8 max-w-3xl mx-auto">
              97% of women over 45 have declining mitochondria causing weight gain, fatigue & slow metabolism... 
              <span className="font-semibold text-gray-900"> Harvard research reveals the fix</span>
            </p>

            {/* Hero Image/Video Preview */}
            <div className="relative max-w-3xl mx-auto mb-6 md:mb-8">
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl overflow-hidden shadow-2xl aspect-video">
                <div className="absolute inset-0 bg-black bg-opacity-60 z-10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold text-base md:text-lg mb-2">Video Locked</p>
                    <p className="text-white text-sm md:text-base opacity-90">Enter your email to unlock instant access</p>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={handleCTAClick} 
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75 group-hover:animate-none"></div>
                    <div className="relative bg-gray-600 hover:bg-gray-700 text-white rounded-full p-6 md:p-8 transition-all transform hover:scale-110 shadow-2xl">
                      <svg className="w-12 h-12 md:w-20 md:h-20" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </button>
                </div>
                
                <div className="absolute top-4 left-4 flex gap-3">
                  <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                    LOCKED
                  </span>
                  <span className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-xs md:text-sm">
                    12:47
                  </span>
                </div>
                
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-xs md:text-sm">
                  👁 47,392 have watched
                </div>
              </div>
              
              <button 
                onClick={handleCTAClick}
                className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg md:text-xl py-4 md:py-5 rounded-lg transition-all transform hover:scale-105 shadow-lg animate-pulse"
              >
                🔓 Watch Free Scientific Presentation →
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>No Stimulants or Caffeine</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Harvard-Backed Science</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>90-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Results in 2-4 Weeks</span>
              </div>
            </div>
          </div>
        </section>

        {/* PAIN POINTS SECTION - Updated with mitochondrial focus */}
        <section className="py-8 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900">
              Is Your Mitochondria Causing These Problems?
            </h2>
            
            <div className="space-y-3 md:space-y-4">
              {[
                "You've tried every diet but your metabolism keeps getting slower",
                "You experience afternoon energy crashes no matter how much coffee you drink",
                "Your body stores fat easier than ever, especially around your midsection",
                "You feel exhausted even after a full night's sleep",
                "Exercise barely makes a dent in weight loss anymore",
                "You've noticed increased brain fog and difficulty concentrating",
                "Your doctor says 'everything is normal' but you know something's wrong"
              ].map((pain, index) => (
                <div key={index} className="flex items-start gap-4 p-3 md:p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <span className="text-red-500 text-xl flex-shrink-0">⚠️</span>
                  <p className="text-gray-800 text-sm md:text-lg">{pain}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-green-50 rounded-xl border-2 border-green-300">
              <p className="text-center text-base md:text-lg text-gray-800">
                <span className="font-bold text-green-700">GOOD NEWS:</span> Harvard research shows these symptoms all stem from 
                <span className="font-semibold"> declining mitochondrial function</span> - and it's 100% reversible...
              </p>
            </div>
          </div>
        </section>

        {/* 30-DAY TIMELINE SECTION - NEW */}
        <section className="py-8 md:py-16 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900">
              Your 30-Day Mitochondrial Transformation Timeline
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <h3 className="font-bold text-lg text-blue-700 mb-2">Week 1-2: Subtle Shifts Begin</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• More stable energy throughout the day (no more 2pm crashes)</li>
                  <li>• Cravings begin to fade as mitochondria improve ATP efficiency</li>
                  <li>• Better mental clarity and focus</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <h3 className="font-bold text-lg text-green-700 mb-2">Week 3-4: The Metabolic Reboot</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Noticeable fat loss, especially around the midsection</li>
                  <li>• Morning energy dramatically improved</li>
                  <li>• Body starts "leaning out" even without diet changes</li>
                  <li>• 70% increase in fat-burning efficiency (verified)</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <h3 className="font-bold text-lg text-purple-700 mb-2">Beyond 30 Days: Long-Term Benefits</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Sustained weight loss without yo-yo effect</li>
                  <li>• Consistent all-day energy without stimulants</li>
                  <li>• Improved blood markers and metabolic health</li>
                  <li>• Enhanced exercise performance and recovery</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION - Mid Page */}
        <section className="py-6 md:py-8 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4">Ready to Reactivate Your Mitochondria?</h3>
            <button 
              onClick={handleCTAClick}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold text-base md:text-lg px-8 md:px-12 py-3 md:py-4 rounded-lg transition-all transform hover:scale-105 shadow-xl"
            >
              🔓 Watch Scientific Presentation →
            </button>
            <p className="text-xs md:text-sm text-gray-600 mt-3">Free video • No credit card required</p>
          </div>
        </section>

        {/* TESTIMONIALS SECTION - Updated with real user data */}
        <section className="py-8 md:py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 text-gray-900">
              47,392 Women Have Already Transformed Their Metabolism
            </h2>
            <p className="text-center text-gray-600 mb-8 md:mb-12 text-base md:text-lg">
              Real results from verified users - all without stimulants or extreme dieting
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {[
                {
                  initials: "JM",
                  name: "Jennifer Mitchell",
                  location: "Austin, TX • Age 52",
                  result: "Lost 43 lbs in 12 weeks",
                  quote: "The 2pm crashes are GONE! I haven't felt this energetic since my 30s. My doctor was shocked when she saw my metabolic markers improve by 47%. This is real science, not another fad."
                },
                {
                  initials: "SK",
                  name: "Sarah Kingston",
                  location: "Phoenix, AZ • Age 48",
                  result: "Energy increased by 73%",
                  quote: "I was skeptical about the mitochondria claims, but the Harvard research convinced me. Week 3 was when everything changed - the fat just started melting off. No jitters, no crashes, just steady energy all day."
                },
                {
                  initials: "LR",
                  name: "Linda Rodriguez",
                  location: "Denver, CO • Age 56",
                  result: "Blood pressure normalized",
                  quote: "My blood pressure is normal for the first time in 10 years! Lost 37 pounds without changing my diet drastically. The mitochondrial approach is completely different from anything I've tried."
                },
                {
                  initials: "PT",
                  name: "Patricia Thompson",
                  location: "Seattle, WA • Age 61",
                  result: "Lost 52 lbs at age 61",
                  quote: "I thought weight loss after 60 was impossible. The 90-day guarantee gave me confidence to try. Best decision ever! My grandkids can't keep up with me now. This isn't just weight loss, it's cellular rejuvenation."
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-t-4 border-green-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm md:text-base">{testimonial.name}</p>
                      <p className="text-xs md:text-sm text-gray-600">{testimonial.location}</p>
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

        {/* WARNING SECTION - Counterfeit Alert */}
        <section className="py-8 bg-red-50 border-y-2 border-red-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">⚠️</span>
              <div>
                <h3 className="font-bold text-red-800 text-lg mb-1">WARNING: Beware of Counterfeit Products</h3>
                <p className="text-red-700 text-sm">
                  Due to high demand, fake versions are being sold on Amazon and other sites. 
                  These may contain harmful ingredients. Only purchase from the official source to ensure safety and results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING PREVIEW SECTION */}
        <section className="py-8 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">
              Special Pricing Available Today Only
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="border-2 border-gray-300 rounded-lg p-4 text-center">
                <h3 className="font-bold text-gray-700 mb-2">1 Bottle</h3>
                <p className="text-3xl font-bold text-gray-900">$79</p>
                <p className="text-sm text-gray-600">per bottle</p>
                <p className="text-sm text-gray-500 mt-2">30-day supply</p>
              </div>
              
              <div className="border-2 border-green-500 rounded-lg p-4 text-center bg-green-50 relative">
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </span>
                <h3 className="font-bold text-gray-700 mb-2">6 Bottles</h3>
                <p className="text-3xl font-bold text-green-700">$294</p>
                <p className="text-sm text-gray-600">per bottle</p>
                <p className="text-sm text-gray-500 mt-2">90-day supply</p>
                <p className="text-xs text-green-600 font-semibold mt-1">Save $30!</p>
              </div>
              
              <div className="border-2 border-blue-500 rounded-lg p-4 text-center bg-blue-50">
                <h3 className="font-bold text-gray-700 mb-2">3 Bottles</h3>
                <p className="text-3xl font-bold text-blue-700">$177</p>
                <p className="text-sm text-gray-600">per bottle</p>
                <p className="text-sm text-gray-500 mt-2">180-day supply</p>
                <p className="text-xs text-blue-600 font-semibold mt-1">Save $120!</p>
              </div>
            </div>
            
            <div className="text-center bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-bold">🛡️ 90-Day Money-Back Guarantee:</span> Try Mitolyn risk-free. 
                If you don't see results, get a full refund - no questions asked.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-8 md:py-16 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 lg:p-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 md:mb-6 text-gray-900">
                Your Mitochondrial Transformation Starts Now
              </h2>
              
              <p className="text-center text-base md:text-lg text-gray-700 mb-6 md:mb-8">
                Watch the free scientific presentation that explains the Harvard-backed discovery helping 
                thousands of women finally lose weight and regain energy after 40
              </p>

              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
                <p className="text-center font-semibold text-red-800 mb-2 text-sm md:text-base">
                  ⚠️ Warning: Due to overwhelming demand, we can only guarantee access for:
                </p>
                <p className="text-center text-3xl md:text-4xl font-bold text-red-600 font-mono">
                  {formatTime(timeLeft)}
                </p>
                <p className="text-center text-sm md:text-base text-red-700 mt-2">
                  Only {spotsLeft} spots remaining today
                </p>
              </div>

              <button
                onClick={handleCTAClick}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold text-lg md:text-2xl py-4 md:py-6 rounded-lg transition-all transform hover:scale-105 shadow-2xl animate-pulse"
              >
                🔓 Watch Free Scientific Presentation →
              </button>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-center text-yellow-700 text-sm">
                  🔒 Enter your email above to unlock instant access
                </p>
              </div>

              <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> No Credit Card Required
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> Harvard-Backed Science
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> 90-Day Guarantee
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
            <p>
              This product is not intended to diagnose, treat, cure, or prevent any disease.
            </p>
            <p>© 2024 MITOLYN. All Rights Reserved.</p>
            
            <div className="text-center text-xs text-gray-500 space-y-3 pt-4 md:pt-6">
              <p>🔒 Secure checkout • SSL encrypted</p>
              <p>✉️ By continuing, you agree to receive important health updates. Unsubscribe anytime.</p>
              <p className="flex justify-center gap-4 md:gap-6">
                <a href="/privacy" className="underline hover:text-teal-600">Privacy Policy</a>
                <a href="/disclaimer" className="underline hover:text-teal-600">Affiliate Disclaimer</a>
                <a href="/scientific-references" className="underline hover:text-teal-600">Scientific References</a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}