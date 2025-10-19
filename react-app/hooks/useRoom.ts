import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Room, RoomEvent, TokenSource } from 'livekit-client';
import { AppConfig } from '@/app-config';
import { toastAlert } from '@/components/livekit/alert-toast';

export function useRoom(appConfig: AppConfig) {
  const aborted = useRef(false);
  const room = useMemo(() => new Room(), []);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const selectedModeRef = useRef<'budgeting' | 'hotline' | undefined>(undefined);

  useEffect(() => {
    function onDisconnected() {
      setIsSessionActive(false);
    }

    function onMediaDevicesError(error: Error) {
      toastAlert({
        title: 'Encountered an error with your media devices',
        description: `${error.name}: ${error.message}`,
      });
    }

    room.on(RoomEvent.Disconnected, onDisconnected);
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);

    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
    };
  }, [room]);

  useEffect(() => {
    return () => {
      aborted.current = true;
      room.disconnect();
    };
  }, [room]);

  const tokenSource = useMemo(
    () =>
      TokenSource.custom(async () => {
        const url = new URL(
          process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? '/api/connection-details',
          window.location.origin
        );

        try {
          const res = await fetch(url.toString(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Sandbox-Id': appConfig.sandboxId ?? '',
            },
            body: JSON.stringify({
              room_config: appConfig.agentName
                ? {
                    agents: [{ agent_name: appConfig.agentName }],
                  }
                : undefined,
              session_mode: selectedModeRef.current,
            }),
          });
          return await res.json();
        } catch (error) {
          console.error('Error fetching connection details:', error);
          throw new Error('Error fetching connection details!');
        }
      }),
    [appConfig]
  );

  const startSession = useCallback(
    (mode?: 'budgeting' | 'hotline') => {
      setIsSessionActive(true);
      selectedModeRef.current = mode;

      if (room.state === 'disconnected') {
        const { isPreConnectBufferEnabled } = appConfig;

        // Check if LiveKit credentials are available
        const hasLiveKitConfig = process.env.NEXT_PUBLIC_LIVEKIT_URL ||
                                process.env.LIVEKIT_URL ||
                                process.env.LIVEKIT_API_KEY;

        if (!hasLiveKitConfig) {
          // Show demo mode when LiveKit is not configured
          toastAlert({
            title: 'Demo Mode',
            description: 'LiveKit is not configured. Running in demo mode.',
          });
          return;
        }

        Promise.all([
          room.localParticipant.setMicrophoneEnabled(true, undefined, {
            preConnectBuffer: isPreConnectBufferEnabled,
          }),
          tokenSource
            .fetch({ agentName: appConfig.agentName })
            .then((connectionDetails) =>
              room.connect(connectionDetails.serverUrl, connectionDetails.participantToken)
            ),
        ]).catch((error) => {
          if (aborted.current) {
            // Once the effect has cleaned up after itself, drop any errors
            //
            // These errors are likely caused by this effect rerunning rapidly,
            // resulting in a previous run `disconnect` running in parallel with
            // a current run `connect`
            return;
          }

          toastAlert({
            title: 'Connection Error',
            description: 'Unable to connect to the voice agent. Please check your configuration.',
          });
          setIsSessionActive(false); // Reset session state on error
        });
      }
    },
    [room, appConfig, tokenSource]
  );

  const endSession = useCallback(() => {
    setIsSessionActive(false);
  }, []);

  return { room, isSessionActive, startSession, endSession };
}
