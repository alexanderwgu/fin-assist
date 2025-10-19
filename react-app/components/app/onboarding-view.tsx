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
    }, 500);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setFadeState('out');
      setTimeout(() => {
        setStep('age');
      }, 500);
    }
  };

  const handleAgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age.trim()) {
      setFadeState('out');
      setTimeout(() => {
        setStep('video');
      }, 500);
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
            <h1 className="text-foreground mb-4 text-3xl font-bold">Welcome to FinAssist</h1>
            <p className="text-muted-foreground text-lg">
              Your compassionate financial wellness companion
            </p>
          </div>

          <div className="mb-8 space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <h2 className="text-foreground mb-2 font-semibold">What we offer:</h2>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>• 24/7 empathetic financial guidance</li>
                <li>• Crisis detection and support</li>
                <li>• Interactive budget visualization</li>
                <li>• Financial literacy education</li>
              </ul>
            </div>
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

          <form onSubmit={handleNameSubmit} className="space-y-6">
            <div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-4 py-3 text-center text-lg transition-all outline-none focus:ring-2"
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
            src="/onboarding-bg2.png"
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

          <form onSubmit={handleAgeSubmit} className="space-y-6">
            <div>
              <select
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                autoFocus
                className="border-input bg-background text-foreground focus:ring-ring w-full rounded-md border px-4 py-3 text-center text-lg transition-all outline-none focus:ring-2"
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
        <Image src="/onboarding-bg2.png" alt="" fill className="object-cover" />
        <div className="bg-background/70 absolute inset-0 backdrop-blur-sm" />
      </div>

      <div
        className={`relative z-10 mx-auto max-w-md text-center transition-opacity duration-500 ${
          fadeState === 'in' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="mb-8">
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
          <h1 className="text-foreground mb-2 text-2xl font-bold">You&apos;re all set!</h1>
          <p className="text-muted-foreground">
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
