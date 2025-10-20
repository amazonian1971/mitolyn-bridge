'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, type Lead } from '@/lib/supabase';
import Image from 'next/image';

export default function MitolynBridgePage() {
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(272); // 4:32 in seconds
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUrgencyBanner, setShowUrgencyBanner] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false);

  // Affiliate URL from environment variable
  const AFFILIATE_URL = process.env.NEXT_PUBLIC_AFFILIATE_URL || 'https://hop.clickbank.net/?affiliate=syed222&vendor=mitolyn';

  // Capture UTM parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const params: Record<string, string> = {};
      
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
        const value = urlParams.get(param);
        if (value) params[param] = value;
      });
      
      setUtmParams(params);

      // Check if user already submitted email
      const submitted = localStorage.getItem('lead_submitted');
      if (submitted) {
        setHasSubmittedEmail(true);
      }
    }
  }, []);

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        if (prev === 120) setShowUrgencyBanner(true);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Jennifer M., 52",
      location: "Austin, TX",
      weight: "43 lbs in 12 weeks",
      quote: "I tried everything for 3 years. This is the ONLY thing that finally worked. My energy is through the roof!",
      rating: 5,
    },
    {
      name: "Sarah K., 48",
      location: "Phoenix, AZ", 
      weight: "31 lbs in 8 weeks",
      quote: "The 2pm crashes are GONE. I feel like I'm in my 30s again. My husband can't believe the transformation!",
      rating: 5,
    },
    {
      name: "Linda R., 56",
      location: "Denver, CO",
      weight: "37 lbs in 10 weeks",
      quote: "My doctor was shocked at my bloodwork. Everything improved! This saved my health and my confidence.",
      rating: 5,
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Get user's IP address (optional - for analytics)
  const getUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP:', error);
      return null;
    }
  };

  // Save lead to Supabase
  const saveLead = async (emailAddress: string) => {
    try {
      const ip = await getUserIP();
      
      const leadData: Lead = {
        email: emailAddress.toLowerCase(),
        source: 'bridge_page',
        campaign: 'mitolyn',
        utm_source: utmParams.utm_source || 'direct',
        utm_medium: utmParams.utm_medium || 'none',
        utm_campaign: utmParams.utm_campaign || 'none',
        utm_content: utmParams.utm_content || 'none',
        utm_term: utmParams.utm_term || 'none',
        ip_address: ip || 'unknown',
        user_agent: navigator.userAgent,
        page_url: window.location.href,
        referrer: document.referrer || 'direct',
      };

      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        
        // Check if email already exists
        if (error.code === '23505') {
          setEmailError('This email is already registered. Redirecting to presentation...');
          setTimeout(() => {
            window.location.href = AFFILIATE_URL;
          }, 2000);
          return false;
        }
        
        throw error;
      }

      // Store lead ID in localStorage for tracking
      if (data) {
        localStorage.setItem('lead_id', data.id);
        localStorage.setItem('lead_submitted', 'true');
        localStorage.setItem('lead_email', emailAddress);
      }

      // Track with Facebook Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          value: emailAddress,
          content_name: 'mitolyn_bridge',
          content_category: 'weight_loss'
        });
      }

      // Track with Taboola Pixel
      if (typeof window !== 'undefined' && (window as any)._tfa) {
        (window as any)._tfa.push({
          notify: 'event',
          name: 'lead',
          id: 'YOUR_TABOOLA_PIXEL_ID'
        });
      }

      return true;
    } catch (error) {
      console.error('Error saving lead:', error);
      setEmailError('Something went wrong. Please try again.');
      return false;
    }
  };

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    
    if (!email) {
      setEmailError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    // Save to Supabase
    const saved = await saveLead(email);
    
    if (saved) {
      setShowSuccessMessage(true);
      setHasSubmittedEmail(true);
      
      // Redirect to VSL after short delay
      setTimeout(() => {
        window.location.href = AFFILIATE_URL;
      }, 1500);
    }
    
    setIsSubmitting(false);
  };

  // Direct CTA click (without email)
  const handleDirectCTA = async () => {
    // If email was already captured, just redirect
    if (hasSubmittedEmail) {
      // Update conversion status in Supabase
      const leadId = localStorage.getItem('lead_id');
      if (leadId) {
        await supabase
          .from('leads')
          .update({ 
            converted: true, 
            conversion_date: new Date().toISOString() 
          })
          .eq('id', leadId);
      }
    }
    
    // Track click event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout');
    }
    
    window.location.href = AFFILIATE_URL;
  };

  // Track page view on mount
  useEffect(() => {
    // Track page view with Facebook
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
    
    // Track page view with Taboola
    if (typeof window !== 'undefined' && (window as any)._tfa) {
      (window as any)._tfa.push({
        notify: 'event',
        name: 'page_view',
        id: 'YOUR_TABOOLA_PIXEL_ID'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Urgency Banner */}
      {showUrgencyBanner && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-2 px-4 text-center z-50 animate-pulse">
          ⚠️ WARNING: This presentation expires in {formatTime(timeLeft)} - Watch Now!
        </div>
      )}

      {/* Main Container */}
      <div className={`max-w-4xl mx-auto px-4 ${showUrgencyBanner ? 'pt-16' : 'pt-8'} pb-12`}>
        
        {/* Header Section */}
        <header className="text-center mb-8">
          {/* Countdown Timer */}
          <div className="inline-block bg-red-100 border-2 border-red-500 rounded-lg px-6 py-3 mb-6">
            <p className="text-sm text-red-700 font-semibold">
              ⏰ Video Presentation Expires In:
            </p>
            <p className="text-3xl font-bold text-red-600 font-mono">
              {formatTime(timeLeft)}
            </p>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Harvard Doctor's{' '}
            <span className="text-green-600">"Mitochondria Method"</span>{' '}
            Melts <span className="underline">1lb Every 48 Hours</span> After 45
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Without changing your diet, counting calories, or exhausting workouts
          </p>

          {/* Authority Proof */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm">As seen in:</span>
              <span className="font-semibold text-blue-600">Journal of Metabolism</span>
            </div>
            <div className="text-gray-400">|</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <span className="font-bold text-green-600">47,000+</span>
              <span className="text-gray-600">success stories</span>
            </div>
          </div>
        </header>

        {/* Video Placeholder / CTA Section */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-10">
          <div className="relative">
            {/* Video Thumbnail */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handleDirectCTA}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
                  <div className="relative bg-red-600 hover:bg-red-700 text-white rounded-full p-8 transition-all transform hover:scale-110">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </button>
              </div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded">
                <span className="text-sm">Free Presentation • 12:47</span>
              </div>
            </div>

            {/* Email Capture Form or Success Message */}
            {!hasSubmittedEmail ? (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  🎁 Get Instant Access + Free Bonus Guide
                </h3>
                
                {showSuccessMessage ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    ✅ Success! Redirecting to your free presentation...
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      placeholder="Enter your best email address..."
                      className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none text-lg ${
                        emailError ? 'border-red-500' : 'border-gray-300 focus:border-green-500'
                      }`}
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg whitespace-nowrap"
                    >
                      {isSubmitting ? 'Saving...' : 'Watch Free Video →'}
                    </button>
                  </form>
                )}
                
                {emailError && (
                  <p className="text-red-500 text-sm mt-2">{emailError}</p>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  🔒 Your information is 100% secure and will never be shared
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
                <p className="text-green-700 font-semibold">
                  ✅ Email saved! Click below to watch the presentation.
                </p>
              </div>
            )}

            {/* Direct CTA Button */}
            <button
              onClick={handleDirectCTA}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xl py-5 rounded-lg transition-all transform hover:scale-105 shadow-lg animate-pulse"
            >
              Watch The Free Presentation →
            </button>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Real Success Stories From Women Over 45
          </h2>
          
          <div className="relative">
            {/* Testimonial Display */}
            <div className="min-h-[200px]">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === currentTestimonial ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      {/* Stars */}
                      <div className="flex justify-center md:justify-start mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">★</span>
                        ))}
                      </div>
                      
                      {/* Quote */}
                      <p className="text-gray-700 italic mb-3 text-lg">
                        "{testimonial.quote}"
                      </p>
                      
                      {/* Details */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                        <span className="font-bold text-gray-800">{testimonial.name}</span>
                        <span className="text-gray-500">{testimonial.location}</span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                          Lost {testimonial.weight}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial 
                      ? 'bg-green-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl mb-2">🔬</div>
              <p className="text-sm font-semibold">Science-Based</p>
            </div>
            <div>
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm font-semibold">FDA Registered</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🇺🇸</div>
              <p className="text-sm font-semibold">Made in USA</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💰</div>
              <p className="text-sm font-semibold">60-Day Guarantee</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <button
            onClick={handleDirectCTA}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-xl px-12 py-5 rounded-lg transition-all transform hover:scale-105 shadow-2xl mb-4"
          >
            YES! Show Me The Mitochondria Method →
          </button>
          <p className="text-gray-500 text-sm">
            No credit card required • Watch instantly • 100% Free
          </p>
        </div>

        {/* Footer Disclaimer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
          <p className="mb-2">
            * Results vary. Not typical. See disclaimer for details.
          </p>
          <p>
            This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is NOT endorsed by Facebook in any way.
          </p>
        </footer>
      </div>
    </div>
  );
}