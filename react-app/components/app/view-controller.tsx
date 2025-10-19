'use client';

import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useRoomContext } from '@livekit/components-react';
import { useSession } from '@/components/app/session-provider';
import { SessionView } from '@/components/app/session-view';
import { WelcomeView } from '@/components/app/welcome-view';
import { OnboardingView } from '@/components/app/onboarding-view';
import { getOnboardingData, saveOnboardingData } from '@/lib/onboarding';

const MotionWelcomeView = motion.create(WelcomeView);
const MotionSessionView = motion.create(SessionView);

const VIEW_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.5,
    ease: 'linear',
  },
};

export function ViewController() {
  const room = useRoomContext();
  const isSessionActiveRef = useRef(false);
  const { appConfig, isSessionActive, startSession } = useSession();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  // Check if onboarding has been completed on mount
  useEffect(() => {
    const onboardingData = getOnboardingData();
    if (onboardingData) {
      setUserName(onboardingData.name);
      setIsOnboardingComplete(true);
    }
    setIsLoading(false);
  }, []);

  // animation handler holds a reference to stale isSessionActive value
  isSessionActiveRef.current = isSessionActive;

  // disconnect room after animation completes
  const handleAnimationComplete = () => {
    if (!isSessionActiveRef.current && room.state !== 'disconnected') {
      room.disconnect();
    }
  };

  const handleOnboardingComplete = (userData: { name: string; age: string }) => {
    saveOnboardingData(userData);
    setUserName(userData.name);
    setIsOnboardingComplete(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {/* Onboarding screen */}
      {!isOnboardingComplete && !isSessionActive && (
        <motion.div
          key="onboarding"
          {...VIEW_MOTION_PROPS}
        >
          <OnboardingView onComplete={handleOnboardingComplete} />
        </motion.div>
      )}
      {/* Welcome screen */}
      {isOnboardingComplete && !isSessionActive && (
        <MotionWelcomeView
          key="welcome"
          {...VIEW_MOTION_PROPS}
          startButtonText={appConfig.startButtonText}
          onStartCallHotline={() => startSession('hotline')}
          onStartCallBudgeting={() => startSession('budgeting')}
          userName={userName}
        />
      )}
      {/* Session view */}
      {isSessionActive && (
        <MotionSessionView
          key="session-view"
          {...VIEW_MOTION_PROPS}
          appConfig={appConfig}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
    </AnimatePresence>
  );
}
