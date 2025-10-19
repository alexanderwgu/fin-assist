'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { DataPublishOptions } from 'livekit-client';
import { RoomContext } from '@livekit/components-react';
import {
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from '@mediapipe/tasks-vision';

type SentimentLabel = 'neutral' | 'attentive' | 'uncertain' | 'stressed';

interface EmotionTrackingContextValue {
  isTrackingEnabled: boolean;
  isOverlayVisible: boolean;
  lastSentiment?: { label: SentimentLabel; confidence: number; at: number };
  latestLandmarks?: Array<{ x: number; y: number }> | null;
  localStream: MediaStream | null;
  enableTracking: (enabled: boolean) => void;
  setOverlayVisible: (visible: boolean) => void;
}

const EmotionTrackingContext = createContext<EmotionTrackingContextValue | undefined>(undefined);

export function EmotionTrackingProvider({ children }: { children: React.ReactNode }) {
  const room = useContext(RoomContext);

  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [lastSentiment, setLastSentiment] = useState<{
    label: SentimentLabel;
    confidence: number;
    at: number;
  }>();
  const [latestLandmarks, setLatestLandmarks] = useState<Array<{ x: number; y: number }> | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const processingVideoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Acquire/Release local camera stream without publishing
  useEffect(() => {
    let active = true;
    const start = async () => {
      if (!isTrackingEnabled || localStream) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        setLocalStream(stream);
      } catch {
        // user denied or no device – disable tracking
        setIsTrackingEnabled(false);
      }
    };
    const stop = () => {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
        setLocalStream(null);
      }
    };
    if (isTrackingEnabled) start();
    else stop();
    return () => {
      active = false;
      // do not stop here; handled by dependency change
    };
  }, [isTrackingEnabled, localStream]);

  const loadLandmarker = useCallback(async () => {
    if (faceLandmarkerRef.current) return faceLandmarkerRef.current;
    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );
    const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
      },
      runningMode: 'VIDEO',
      numFaces: 1,
    });
    faceLandmarkerRef.current = landmarker;
    return landmarker;
  }, []);

  const computeSentiment = useCallback((landmarks: Array<{ x: number; y: number }>): { label: SentimentLabel; confidence: number } => {
    // Simple heuristic placeholder:
    // Use mouth openness as a proxy; larger openness may indicate talking or stress
    // Indices are approximate for FaceMesh; fallback to neutral if not enough points
    if (!landmarks || landmarks.length < 200) return { label: 'neutral', confidence: 0.5 };
    const upperLipIdx = 13; // approximate
    const lowerLipIdx = 14; // approximate
    const leftEyeIdx = 159; // approximate
    const rightEyeIdx = 386; // approximate
    const mouthOpen = Math.abs(landmarks[upperLipIdx].y - landmarks[lowerLipIdx].y);
    const eyeSpan = Math.abs(landmarks[leftEyeIdx].x - landmarks[rightEyeIdx].x);
    const ratio = mouthOpen / Math.max(eyeSpan, 0.0001);

    if (ratio > 0.08) return { label: 'stressed', confidence: Math.min(1, ratio * 6) };
    if (ratio > 0.05) return { label: 'uncertain', confidence: Math.min(1, ratio * 8) };
    return { label: 'attentive', confidence: 0.6 };
  }, []);

  const analyzeOnce = useCallback(async () => {
    if (!isTrackingEnabled) return;
    const track = localStream?.getVideoTracks()?.[0];
    if (!track) return;

    try {
      const landmarker = await loadLandmarker();
      if (!processingVideoRef.current) {
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.srcObject = new MediaStream([track]);
        processingVideoRef.current = video;
        await video.play().catch(() => {});
      }

      const videoEl = processingVideoRef.current!;
      // Ensure the element has current data and dimensions before detection
      if (videoEl.readyState < 2) {
        await new Promise<void>((resolve) => {
          const onLoaded = () => resolve();
          videoEl.addEventListener('loadeddata', onLoaded, { once: true });
        });
      }
      if (!videoEl.videoWidth || !videoEl.videoHeight) {
        // As a fallback, wait a microtask and check again
        await new Promise((r) => setTimeout(r, 50));
        if (!videoEl.videoWidth || !videoEl.videoHeight) return;
      }
      const now = performance.now();
      const res = await landmarker.detectForVideo(videoEl, now);
      const face0 = res.faceLandmarks?.[0];
      if (face0 && face0.length > 0) {
        const flat = face0.map((p) => ({ x: p.x, y: p.y }));
        setLatestLandmarks(flat);
        const s = computeSentiment(flat);
        setLastSentiment({ label: s.label, confidence: s.confidence, at: Date.now() });

        // Publish to room data channel (reliable)
        if (room && room.localParticipant) {
          const payload = JSON.stringify({
            type: 'emotion_update',
            sentiment: s,
            at: Date.now(),
          });
          const data = new TextEncoder().encode(payload);
          try {
            const opts: DataPublishOptions = { reliable: true, topic: 'emotion_update' } as const;
            room.localParticipant.publishData(data, opts);
          } catch {}
        }
      }
    } catch (e) {
      // swallow to avoid spamming UI; keep lastSentiment unchanged
    }
  }, [localStream, isTrackingEnabled, loadLandmarker, room, computeSentiment]);

  // Periodic analysis: once immediately and then every 10-15s (use 12s)
  useEffect(() => {
    if (!isTrackingEnabled) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Run once at start
    analyzeOnce();
    intervalRef.current = window.setInterval(() => {
      analyzeOnce();
    }, 12_000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTrackingEnabled, analyzeOnce]);

  // Auto-disable if local camera stream ends
  useEffect(() => {
    if (!localStream) return;
    const handleEnded = () => setIsTrackingEnabled(false);
    localStream.getTracks().forEach((t) => t.addEventListener('ended', handleEnded));
    return () => localStream.getTracks().forEach((t) => t.removeEventListener('ended', handleEnded));
  }, [localStream]);

  const enableTracking = useCallback((enabled: boolean) => {
    setIsTrackingEnabled(enabled);
    if (!enabled) {
      setLatestLandmarks(null);
    }
  }, []);

  const value: EmotionTrackingContextValue = useMemo(
    () => ({
      isTrackingEnabled,
      isOverlayVisible,
      lastSentiment,
      latestLandmarks,
      localStream,
      enableTracking,
      setOverlayVisible: setIsOverlayVisible,
    }),
    [isTrackingEnabled, isOverlayVisible, lastSentiment, latestLandmarks, localStream, enableTracking]
  );

  return <EmotionTrackingContext.Provider value={value}>{children}</EmotionTrackingContext.Provider>;
}

export function useEmotionTracking() {
  const ctx = useContext(EmotionTrackingContext);
  if (!ctx) throw new Error('useEmotionTracking must be used within EmotionTrackingProvider');
  return ctx;
}

export function EmotionOverlayCanvas({ className }: { className?: string }) {
  const { isTrackingEnabled, isOverlayVisible, latestLandmarks } = useEmotionTracking();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!(isTrackingEnabled && isOverlayVisible && latestLandmarks && latestLandmarks.length > 0)) {
      return;
    }

    // Draw points only (avoid missing FaceMeshConnections)
    const drawingUtils = new DrawingUtils(canvas.getContext('2d')!);
    const scaledPoints = latestLandmarks.map((p) => ({ x: p.x * canvas.width, y: p.y * canvas.height }));
    drawingUtils.drawLandmarks(scaledPoints as any, { color: '#22c55e', lineWidth: 1, radius: 1 });
  }, [isTrackingEnabled, isOverlayVisible, latestLandmarks]);

  // Keep canvas sized to its parent
  const resizeRef = useCallback((node: HTMLCanvasElement | null) => {
    if (!node) return;
    canvasRef.current = node;
    const resize = () => {
      const parent = node.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      node.width = Math.max(1, Math.floor(rect.width));
      node.height = Math.max(1, Math.floor(rect.height));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(node.parentElement!);
    return () => ro.disconnect();
  }, []);

  if (!isTrackingEnabled || !isOverlayVisible) return null;
  return <canvas ref={resizeRef} className={className} />;
}


