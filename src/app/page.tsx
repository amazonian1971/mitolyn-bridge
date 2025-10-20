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
  // Using CSSProperties type to allow any valid CSS positioning
  const [testimonialPosition, setTestimonialPosition] = useState<React.CSSProperties>({ bottom: 16, left: 16 });

  const AFFILIATE_URL = process.env.NEXT_PUBLIC_AFFILIATE_URL || 'https://hop.clickbank.net/?affiliate=syed222&vendor=mitolyn';

  // Floating testimonials data
  const floatingTestimonials = [
    { name: "Sarah", location: "Phoenix, AZ", action: "started watching this video", timeAgo: "3 minutes ago" },
    { name: "Jennifer", location: "Austin, TX", action: "just unlocked the free guide", timeAgo: "5 minutes ago" },
    { name: "Linda", location: "Denver, CO", action: "is watching the presentation", timeAgo: "2 minutes ago" },
    { name: "Patricia", location: "Seattle, WA", action: "just claimed her free bonuses", timeAgo: "7 minutes ago" },
    { name: "Maria", location: "Miami, FL", action: "started the metabolism activation plan", timeAgo: "4 minutes ago" },
    { name: "Karen", location: "Chicago, IL", action: "just downloaded the meal plan", timeAgo: "1 minute ago" },
    { name: "Rebecca", location: "Boston, MA", action: "is watching this video right now", timeAgo: "6 minutes ago" },
    { name: "Donna", location: "Portland, OR", action: "just joined the priority support", timeAgo: "8 minutes ago" },
    { name: "Michelle", location: "Atlanta, GA", action: "started her transformation journey", timeAgo: "3 minutes ago" },
    { name: "Barbara", location: "San Diego, CA", action: "is watching the presentation", timeAgo: "5 minutes ago" }
  ];

  // Check if email was already captured in this session
  useEffect(() => {
    const capturedEmail = localStorage.getItem('lead_email_captured');
    if (capturedEmail) {
      setEmailCaptured(true);
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
    // Show first testimonial after 5 seconds
    const initialTimer = setTimeout(() => {
      showRandomTestimonial();
    }, 5000);
    
    // Then show random testimonials at random intervals between 15-30 seconds
    const testimonialTimer = setInterval(() => {
      showRandomTestimonial();
    }, Math.floor(Math.random() * 15000) + 15000); // Random between 15-30 seconds
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(testimonialTimer);
    };
  }, []);

  // Function to show a random testimonial
  const showRandomTestimonial = () => {
    // Pick a random testimonial
    const randomIndex = Math.floor(Math.random() * floatingTestimonials.length);
    setCurrentTestimonial(randomIndex);
    
    // Random position (avoiding the middle of the screen)
    const positions = [
      { bottom: 16, left: 16 }, // Bottom left
      { bottom: 16, right: 16 }, // Bottom right
      { top: 80, left: 16 }, // Top left
      { top: 80, right: 16 }, // Top right
      { bottom: 120, left: 16 }, // Bottom left, higher
      { bottom: 120, right: 16 }, // Bottom right, higher
    ];
    
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    setTestimonialPosition(randomPosition);
    setShowTestimonial(true);
    
    // Hide after 5 seconds
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
      // Save to Supabase
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

      if (error && error.code !== '23505') { // Ignore duplicate email errors
        console.error('Supabase error:', error);
      }
      
      // Mark email as captured
      localStorage.setItem('lead_email_captured', email);
      setEmailCaptured(true);
      setShowEmailModal(false);
      
      // Track with pixels
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', { value: email });
      }
      
      // Show success popup
      setShowSuccessPopup(true);
      
      // Auto-redirect after showing success popup
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

  // Handle any CTA click
  const handleCTAClick = () => {
    if (emailCaptured) {
      // Email already captured, redirect immediately
      window.location.href = AFFILIATE_URL;
    } else {
      // Show email capture modal
      setAttemptedWatch(true);
      setShowEmailModal(true);
    }
  };

  // Email validation
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-bounceIn">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Success Message */}
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
              Thank You, {email.split('@')[0]}! 🎉
            </h2>
            
            <p className="text-center text-gray-700 mb-6">
              Your free bonuses are being sent to:
            </p>
            
            {/* Email Display */}
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-6">
              <p className="text-center font-semibold text-green-800">
                📧 {email}
              </p>
            </div>
            
            {/* Bonuses List */}
            <div className="space-y-3 mb-6">
              <h3 className="font-bold text-gray-900 text-center mb-3">Your FREE Gifts Include:</h3>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2h4a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Dr. Mitchell's Metabolism Activation Guide</p>
                  <p className="text-sm text-gray-600">Complete PDF guide (Value: $47)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">7-Day Quick Start Meal Plan</p>
                  <p className="text-sm text-gray-600">Printable meal planning guide (Value: $27)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Priority Customer Support Access</p>
                  <p className="text-sm text-gray-600">Direct line to our health coaches (Value: $97)</p>
                </div>
              </div>
            </div>
            
            {/* Total Value */}
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 mb-6">
              <p className="text-center text-sm text-gray-600">Total Value:</p>
              <p className="text-center text-2xl font-bold text-green-700">$171 FREE!</p>
            </div>
            
            {/* Check Email Message */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                📬 Check your inbox in the next 2-5 minutes
              </p>
              <p className="text-xs text-gray-500">
                (Don't forget to check your spam folder!)
              </p>
            </div>
            
            {/* Redirect Message */}
            <div className="mt-6 text-center">
              <p className="text-sm text-blue-600 animate-pulse">
                Redirecting to your video presentation...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email Capture Modal Overlay */}
      {showEmailModal && !emailCaptured && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative animate-slideUp">
            {/* Close button */}
            <button 
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Modal Content */}
            <div className="text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              
              {/* Headline */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                One Quick Step to Watch Your Free Video
              </h2>
              
              {/* Sub-headline */}
              <p className="text-gray-600 mb-6">
                Enter your email below to unlock instant access to the presentation that's helped 
                <span className="font-semibold"> 47,392 women</span> transform their bodies
              </p>
              
              {/* Benefits */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-green-800 mb-2">
                  🎁 You'll Also Get FREE:
                </p>
                <ul className="text-sm text-left text-green-700 space-y-1">
                  <li>✓ Dr. Mitchell's Metabolism Activation Guide (PDF)</li>
                  <li>✓ 7-Day Quick Start Meal Plan</li>
                  <li>✓ Priority Customer Support Access</li>
                </ul>
              </div>
              
              {/* Email Form */}
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
                  {isSubmitting ? 'Unlocking Video...' : 'Unlock Video & Get Free Bonuses →'}
                </button>
              </form>
              
              {/* Privacy */}
              <p className="text-xs text-gray-500 mt-4">
                🔒 Your email is 100% secure. We hate spam as much as you do.
              </p>
              
              {/* Urgency */}
              <div className="mt-6 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">
                  ⏰ Only <span className="font-bold">{spotsLeft} spots</span> remaining • Video expires in <span className="font-bold">{formatTime(timeLeft)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {emailCaptured && attemptedWatch && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideIn">
          <p className="font-semibold">✓ Access Granted! Redirecting to video...</p>
        </div>
      )}

      {/* Random Floating Testimonials */}
      {showTestimonial && (
        <div 
          className="fixed bg-white shadow-2xl rounded-lg p-4 max-w-sm animate-slideIn z-40 border-l-4 border-green-500"
          style={testimonialPosition}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
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
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">🔴</span>
            <span className="font-semibold">{spotsLeft} Spots Remaining</span>
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
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
          <div className="max-w-5xl mx-auto px-4">
            {/* Pre-headline */}
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
                <span>⚡</span>
                BREAKING: Harvard Study Validates Ancient Discovery
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-900 mb-6 leading-tight">
              Doctor Discovers 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600"> "Dormant" Metabolism Switch </span>
              That Forces Your Body To Burn 
              <span className="underline decoration-4 decoration-green-500"> 1-2 Lbs Every 48 Hours</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xl md:text-2xl text-center text-gray-700 mb-8 max-w-3xl mx-auto">
              97% of women over 45 have this ONE metabolism-blocking enzyme that makes weight loss nearly impossible... 
              <span className="font-semibold text-gray-900"> until now</span>
            </p>

            {/* Hero Image/Video Preview - LOCKED STATE */}
            <div className="relative max-w-3xl mx-auto mb-8">
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl overflow-hidden shadow-2xl aspect-video">
                {/* Lock Overlay if email not captured */}
                {!emailCaptured && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 z-10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white font-semibold text-lg mb-2">Video Locked</p>
                      <p className="text-white text-sm opacity-90">Enter your email to unlock instant access</p>
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={handleCTAClick} 
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75 group-hover:animate-none"></div>
                    <div className={`relative ${emailCaptured ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} text-white rounded-full p-8 transition-all transform hover:scale-110 shadow-2xl`}>
                      <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </button>
                </div>
                
                {/* Video Stats Overlay */}
                <div className="absolute top-4 left-4 flex gap-3">
                  <span className={`${emailCaptured ? 'bg-red-600' : 'bg-gray-600'} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {emailCaptured ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                  <span className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                    12:47
                  </span>
                </div>
                
                {/* Viewer Count */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                  👁 14,328 watching now
                </div>
              </div>
              
              {/* Unlock Button Below Video */}
              {!emailCaptured && (
                <button 
                  onClick={handleCTAClick}
                  className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-xl py-5 rounded-lg transition-all transform hover:scale-105 shadow-lg animate-pulse"
                >
                  🔓 Unlock Free Video Instantly →
                </button>
              )}
              
              {emailCaptured && (
                <button 
                  onClick={handleCTAClick}
                  className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xl py-5 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  ▶️ Watch Free Presentation Now →
                </button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>No Diet Changes Required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Works for Women 45-75</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Science-Based Approach</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>See Results in 48 Hours</span>
              </div>
            </div>
          </div>
        </section>

        {/* PAIN POINTS SECTION */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Does This Sound Like You?
            </h2>
            
            <div className="space-y-4">
              {[
                "You've tried every diet but your body refuses to lose weight like it used to",
                "You wake up exhausted no matter how much sleep you get",
                "Your metabolism feels 'broken' - you gain weight just looking at food",
                "That 2pm energy crash hits you like a truck every single day",
                "You feel bloated and uncomfortable even when eating healthy",
                "Exercise barely makes a dent anymore - if you even have energy for it",
                "You've accepted that 'this is just part of getting older' (it's NOT!)"
              ].map((pain, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <span className="text-red-500 text-xl flex-shrink-0">😔</span>
                  <p className="text-gray-800 text-lg">{pain}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-green-50 rounded-xl border-2 border-green-300">
              <p className="text-center text-lg text-gray-800">
                <span className="font-bold text-green-700">GOOD NEWS:</span> A Harvard medical researcher discovered these symptoms all have the 
                <span className="font-semibold"> SAME hidden cause</span> - and it's NOT your fault...
              </p>
            </div>
          </div>
        </section>

        {/* CTA SECTION - Mid Page */}
        <section className="py-8 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Discover the Truth?</h3>
            <button 
              onClick={handleCTAClick}
              className={`${
                emailCaptured 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
              } text-white font-bold text-lg px-12 py-4 rounded-lg transition-all transform hover:scale-105 shadow-xl`}
            >
              {emailCaptured ? '▶️ Continue to Video →' : '🔓 Unlock Video Access →'}
            </button>
            {!emailCaptured && (
              <p className="text-sm text-gray-600 mt-3">One-time email required • No spam ever</p>
            )}
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              47,392 Women Are Already Transforming Their Lives
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Real results from real women - all verified purchasers
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Testimonials - Same as before */}
              {[
                {
                  initials: "JM",
                  name: "Jennifer Mitchell",
                  location: "Austin, TX • Age 52",
                  result: "Lost 43 lbs in 12 weeks",
                  quote: "I cried when I stepped on the scale this morning. 43 pounds GONE! I haven't weighed this since my 30s. The crazy part? I'm eating MORE than before. My energy is through the roof!"
                },
                {
                  initials: "SK",
                  name: "Sarah Kingston",
                  location: "Phoenix, AZ • Age 48",
                  result: "Lost 31 lbs in 8 weeks",
                  quote: "The 2pm crashes are GONE. Completely gone! I used to need 3 cups of coffee just to survive the afternoon. Now I have energy all day. My doctor was shocked!"
                },
                {
                  initials: "LR",
                  name: "Linda Rodriguez",
                  location: "Denver, CO • Age 56",
                  result: "Lost 37 lbs in 10 weeks",
                  quote: "My blood pressure is normal for the first time in 10 years! My doctor reduced my medications. I've lost 37 pounds and 5 dress sizes. This saved my health!"
                },
                {
                  initials: "PT",
                  name: "Patricia Thompson",
                  location: "Seattle, WA • Age 61",
                  result: "Lost 52 lbs in 14 weeks",
                  quote: "I thought weight loss after 60 was impossible. I was WRONG! 52 pounds gone and I feel 30 years younger. My grandkids can't keep up with me now!"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                      <div className="flex text-yellow-400">★★★★★</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      {testimonial.result}
                    </span>
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                  <p className="text-xs text-gray-500">Verified Purchase ✓</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
                Your Transformation Starts In The Next 2 Minutes
              </h2>
              
              <p className="text-center text-lg text-gray-700 mb-8">
                Watch the short free video that explains everything - including the exact 7-second ritual 
                that's helping thousands of women finally lose weight after 45
              </p>

              {/* Urgency Box */}
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-8">
                <p className="text-center font-semibold text-red-800 mb-2">
                  ⚠️ Warning: Due to high demand, we can only guarantee access for the next:
                </p>
                <p className="text-center text-4xl font-bold text-red-600 font-mono">
                  {formatTime(timeLeft)}
                </p>
                <p className="text-center text-sm text-red-700 mt-2">
                  Only {spotsLeft} spots remaining for today
                </p>
              </div>

              {/* Main CTA Button */}
              <button
                onClick={handleCTAClick}
                className={`w-full ${
                  emailCaptured 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700' 
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                } text-white font-bold text-2xl py-6 rounded-lg transition-all transform hover:scale-105 shadow-2xl ${!emailCaptured && 'animate-pulse'}`}
              >
                {emailCaptured 
                  ? 'YES! Show Me The 7-Second Morning Ritual →' 
                  : '🔓 Unlock Access to Free Video →'}
              </button>

              {/* Status Message */}
              {emailCaptured ? (
                <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-lg">
                  <p className="text-center text-green-700 font-semibold">
                    ✅ Access Unlocked for: {email}
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <p className="text-center text-yellow-700">
                    🔒 Enter your email above to unlock instant access
                  </p>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> No Credit Card Required
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> Watch Instantly
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> 100% Free Video
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-white border-t">
          <div className="max-w-4xl mx-auto px-4 text-center text-xs text-gray-500 space-y-2">
            <p>
              * Results vary by individual. These statements have not been evaluated by the FDA.
            </p>
            <p>© 2024 MITOLYN. All Rights Reserved.</p>
            
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
        </footer>
      </div>
    </>
  );
}

// Custom Styles
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