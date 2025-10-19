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
  const [selectedVideo, setSelectedVideo] = useState<
    'onboarding_vis_1.mp4' | 'onboarding_vid_2.mp4'
  >('onboarding_vis_1.mp4');

  // Fade in on mount and step changes
  useEffect(() => {
    setFadeState('out');
    const timer = setTimeout(() => setFadeState('in'), 100);
    return () => clearTimeout(timer);
  }, [step]);

  // Randomize video selection when entering video step
  useEffect(() => {
    if (step === 'video') {
      // 1/3 chance to show onboarding_vid_2.mp4, otherwise show onboarding_vis_1.mp4
      const randomValue = Math.random();
      setSelectedVideo(randomValue < 0.15 ? 'onboarding_vid_2.mp4' : 'onboarding_vis_1.mp4');
    }
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
    'Financial literacy education',
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
            <h1 className="text-foreground mb-4 text-3xl font-light tracking-wide">
              Welcome to FinAssist
            </h1>
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
                className={`relative cursor-crosshair rounded-lg p-4 transition-all duration-300 ${
                  hoveredFeature === idx
                    ? 'scale-105 transform border-2 border-gray-300/60 bg-white shadow-lg'
                    : 'bg-muted/50 border-muted-foreground/20 hover:border-muted-foreground/30 border hover:bg-gray-50/80'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`mt-0.5 h-3 w-3 rounded-full transition-all duration-300 ${
                      hoveredFeature === idx ? 'bg-blue-500 shadow-md' : 'bg-gray-400'
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm leading-relaxed font-medium transition-colors duration-300 ${
                        hoveredFeature === idx ? 'text-gray-900' : 'text-gray-300'
                      }`}
                    >
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

          {/* Privacy Notice */}
          <div className="mt-6 max-w-sm">
            <p className="text-muted-foreground/80 text-center text-xs leading-relaxed">
              <span className="text-white-foreground font-medium">Privacy First:</span> No data is
              stored at all. We prioritize your total privacy and confidentiality and do not collect
              any data. Your information stays completely secure and is deleted after you exit the
              app.
            </p>
          </div>
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
    console.log('Rendering video step with selected video:', selectedVideo);
    return (
      <div
        className={`flex h-screen w-full items-center justify-center bg-black transition-opacity duration-500 ${
          fadeState === 'in' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="relative h-full w-full">
          <video
            key={selectedVideo}
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
            className="h-full w-full object-cover"
          >
            <source src={`/${selectedVideo}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Skip/Fast-forward button */}
          <button
            onClick={handleVideoEnd}
            className="absolute right-6 bottom-6 flex animate-pulse items-center gap-2 rounded-full border border-white/20 bg-white/20 px-6 py-3 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:animate-none hover:bg-white/30 active:scale-95"
          >
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
              <path d="M20 6v12l1.5-1V7L20 6z" />
            </svg>
            <span className="font-medium">Skip Intro</span>
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
          <h1 className="text-foreground mb-2 text-3xl font-light tracking-wide">
            You&apos;re all set!
          </h1>
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
