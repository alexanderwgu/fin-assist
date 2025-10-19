'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { RoomContext } from '@livekit/components-react';
import { APP_CONFIG_DEFAULTS, type AppConfig } from '@/app-config';
import { useRoom } from '@/hooks/useRoom';

type SessionMode = 'budgeting' | 'hotline' | undefined;

const SessionContext = createContext<{
  appConfig: AppConfig;
  isSessionActive: boolean;
  sessionMode?: SessionMode;
  startSession: (mode?: SessionMode) => void;
  endSession: () => void;
}>({
  appConfig: APP_CONFIG_DEFAULTS,
  isSessionActive: false,
  sessionMode: undefined,
  startSession: () => {},
  endSession: () => {},
});

interface SessionProviderProps {
  appConfig: AppConfig;
  children: React.ReactNode;
}

export const SessionProvider = ({ appConfig, children }: SessionProviderProps) => {
  const { room, isSessionActive, startSession, endSession } = useRoom(appConfig);
  const [sessionMode, setSessionMode] = useState<SessionMode>(undefined);

  const startSessionWithMode = useCallback(
    (mode?: SessionMode) => {
      setSessionMode(mode);
      startSession(mode);
    },
    [startSession]
  );

  const contextValue = useMemo(
    () => ({
      appConfig,
      isSessionActive,
      sessionMode,
      startSession: startSessionWithMode,
      endSession,
    }),
    [appConfig, isSessionActive, sessionMode, startSessionWithMode, endSession]
  );

  return (
    <RoomContext.Provider value={room}>
      <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>
    </RoomContext.Provider>
  );
};

export function useSession() {
  return useContext(SessionContext);
}
