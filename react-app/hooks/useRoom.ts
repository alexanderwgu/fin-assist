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
          console.debug('[useRoom] Fetching connection details from', url.toString(), {
            sandboxId: appConfig.sandboxId,
            agentName: appConfig.agentName,
          });
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
          const json = await res.json();
          console.debug('[useRoom] Received connection details', json);
          return json;
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

      console.debug('[useRoom] startSession called with mode:', mode);
      if (room.state === 'disconnected') {
        const { isPreConnectBufferEnabled } = appConfig;

        Promise.all([
          room.localParticipant.setMicrophoneEnabled(true, undefined, {
            preConnectBuffer: isPreConnectBufferEnabled,
          }),
          tokenSource.fetch({ agentName: appConfig.agentName }).then((connectionDetails) => {
            console.debug('[useRoom] Connecting to room', {
              serverUrl: connectionDetails.serverUrl,
              hasToken: Boolean(connectionDetails.participantToken),
            });
            // If server returned demo fallback, show demo toast and do not connect
            if (
              typeof connectionDetails.participantToken === 'string' &&
              connectionDetails.participantToken === 'demo-token'
            ) {
              toastAlert({
                title: 'Demo Mode',
                description: 'Server returned demo credentials. Configure LiveKit env vars.',
              });
              console.warn('[useRoom] Demo Mode: server returned demo credentials');
              return;
            }
            return room.connect(connectionDetails.serverUrl, connectionDetails.participantToken);
          }),
        ]).catch((error) => {
          if (aborted.current) {
            // Once the effect has cleaned up after itself, drop any errors
            //
            // These errors are likely caused by this effect rerunning rapidly,
            // resulting in a previous run `disconnect` running in parallel with
            // a current run `connect`
            return;
          }

          console.error('[useRoom] Connection error', error);
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
