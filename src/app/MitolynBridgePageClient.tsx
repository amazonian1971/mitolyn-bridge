'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

type UTM = Record<string, string>;
type GateStep = 1 | 2;

// Magnetic Button (built-in)
function MagneticButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${dx * 0.08}px, ${dy * 0.08}px)`;
  };
  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0,0)';
  };
  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`btn-luxe px-6 py-4 text-lg shadow-luxe glow ${className}`}
    >
      {children}
    </button>
  );
}

// Aurora Background (built-in)
function AuroraBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="aurora">
        <span className="a1" />
        <span className="a2" />
        <span className="a3" />
      </div>
      <div className="grid-overlay" />
      <div className="noise" />
    </div>
  );
}

export default function MitolynBridgePageClient() {
  // Core states
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(872); // 14:32
  const [spotsLeft, setSpotsLeft] = useState(7);
  const [utmParams, setUtmParams] = useState<UTM>({});

  // Gate + CRO
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [attemptedWatch, setAttemptedWatch] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [gateStep, setGateStep] = useState<GateStep>(1);
  const [userGoal, setUserGoal] = useState('');
  const [userAgeRange, setUserAgeRange] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Floating testimonials
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showTestimonial, setShowTestimonial] = useState(false);
  const [testimonialPosition, setTestimonialPosition] = useState<React.CSSProperties>({ bottom: 16, left: 16 });

  // Variant A/B
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  const AFFILIATE_URL = process.env.NEXT_PUBLIC_AFFILIATE_URL || 