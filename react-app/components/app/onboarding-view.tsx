'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/livekit/button';

interface OnboardingViewProps {
  onComplete: (userData: { name: string; age: string }) => void;
}

type OnboardingStep = 'welcome' | 'name' | 'age' | 'video' | 'complete';

export function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [fadeState, setFadeState] = useState<'in' | 'out'>('out');
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  // Fade in on mount and step changes
  useEffect(() => {
    setFadeState('out');
    const timer = setTimeout(() => setFadeState('in'), 100);
    return () => clearTimeout(timer);
  }, [step]);

  const handleStart = () => {
    setFadeState('out');
    setTimeout(() => {
      setStep('name');
    }, 700);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setFadeState('out');
      setTimeout(() => {
        setStep('age');
      }, 800);
    }
  };

  const handleAgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age.trim()) {
      setFadeState('out');
      setTimeout(() => {
        setStep('video');
      }, 700);
    }
  };

  const handleVideoEnd = () => {
    setFadeState('out');
    setTimeout(() => {
      setStep('complete');
      // Show completion screen for 3 seconds before transitioning to main app
      setTimeout(() => {
        onComplete({ name: name.trim(), age: age.trim() });
      }, 3000);
    }, 500);
  };

  const features = [
    '24/7 empathetic financial guidance',
    'Crisis detection and support',
    'Interactive budget visualization',
    'Financial literacy education'
  ];

  if (step === 'welcome') {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/onboarding-bg.png"
            alt="Onboarding background"
            fill
            className="object-cover"
            priority
          />
          <div className="bg-background/70 absolute inset-0 backdrop-blur-sm" />
        </div>

        <div
          className={`relative z-10 mx-auto max-w-md text-center transition-opacity duration-500 ${
            fadeState === 'in' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="mb-8">
            <h1 className="text-foreground mb-4 text-3xl font-light tracking-wide">Welcome to FinAssist</h1>
            <p className="text-muted-foreground text-lg">
              Your compassionate financial wellness companion
            </p>
          </div>

          <div className="mb-8 space-y-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`relative rounded-lg p-4 cursor-crosshair transition-all duration-300 ${
                  hoveredFeature === idx
                    ? 'bg-white border-2 border-gray-300/60 shadow-lg transform scale-105'
                    : 'bg-muted/50 border border-muted-foreground/20 hover:bg-gray-50/80 hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full mt-0.5 transition-all duration-300 ${
                    hoveredFeature === idx
                      ? 'bg-blue-500 shadow-md'
                      : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium transition-colors duration-300 leading-relaxed ${
                      hoveredFeature === idx
                        ? 'text-gray-900'
                        : 'text-gray-300'
                    }`}>
                      {feature}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleStart} size="lg" className="w-full max-w-xs">
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'name') {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/onboarding-bg.png"
            alt="Onboarding background"
            fill
            className="object-cover"
            priority
          />
          <div className="bg-background/70 absolute inset-0 backdrop-blur-sm" />
        </div>

        <div
          className={`relative z-10 mx-auto w-full max-w-md transition-opacity duration-500 ${
            fadeState === 'in' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="mb-8 text-center">
            <h1 className="text-foreground mb-2 text-3xl font-light tracking-wide">
              What&apos;s your name?
            </h1>
            <p className="text-muted-foreground text-sm">
              This helps us personalize your experience
            </p>
          </div>

          <form onSubmit={handleNameSubmit} className="space-y-8">
            <div className="space-y-2">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-5 py-4 text-center text-lg transition-all outline-none focus:ring-2"
                placeholder="Enter your name"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full font-light" disabled={!name.trim()}>
              Continue
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'age') {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/onboarding-bg.png"
            alt="Onboarding background"
            fill
            className="object-cover"
            priority
          />
          <div className="bg-background/70 absolute inset-0 backdrop-blur-sm" />
        </div>

        <div
          className={`relative z-10 mx-auto w-full max-w-md transition-opacity duration-500 ${
            fadeState === 'in' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="mb-8 text-center">
            <h1 className="text-foreground mb-2 text-3xl font-light tracking-wide">
              Nice to meet you, {name}.
            </h1>
            <p className="text-muted-foreground text-lg">What&apos;s your age range?</p>
          </div>

          <form onSubmit={handleAgeSubmit} className="space-y-8">
            <div className="space-y-2">
              <select
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                autoFocus
                className="border-input bg-background text-foreground focus:ring-ring w-full rounded-lg border px-5 py-4 text-center text-lg transition-all outline-none focus:ring-2"
                required
              >
                <option value="">Select age range</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-50">36-50</option>
                <option value="51-65">51-65</option>
                <option value="65+">65+</option>
              </select>
            </div>

            <Button type="submit" size="lg" className="w-full font-light" disabled={!age.trim()}>
              Continue
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'video') {
    return (
      <div
        className={`flex h-screen w-full items-center justify-center bg-black transition-opacity duration-500 ${
          fadeState === 'in' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="relative h-full w-full">
          <video
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
            className="h-full w-full object-cover"
          >
            <source src="/onboarding_vis_1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Skip button */}
          <button
            onClick={handleVideoEnd}
            className="absolute right-8 bottom-8 rounded-lg px-4 py-2 text-sm font-light text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Skip →
          </button>
        </div>
      </div>
    );
  }

  // Complete state - transitioning to welcome view
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/onboarding-bg2.png"
          alt="Onboarding background"
          fill
          className="object-cover"
          priority
        />
        <div className="bg-background/70 absolute inset-0 backdrop-blur-sm" />
      </div>

      <div
        className={`relative z-10 mx-auto max-w-md text-center transition-opacity duration-700 ${
          fadeState === 'in' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <svg
              className="size-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-foreground mb-2 text-3xl font-light tracking-wide">You&apos;re all set!</h1>
          <p className="text-muted-foreground text-lg">
            Welcome, {name}! We&apos;re here to support your financial journey.
          </p>
        </div>

        <div className="animate-pulse">
          <p className="text-muted-foreground text-sm">Loading your personalized experience...</p>
        </div>
      </div>
    </div>
  );
}
