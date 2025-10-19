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
  setCanvasRef: (ref: HTMLCanvasElement | null) => void;
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastAnalysisRef = useRef<number>(0);
  const detectionLoopRef = useRef<number | null>(null);

  // Acquire/Release local camera stream without publishing
  useEffect(() => {
    let active = true;
    const start = async () => {
      if (!isTrackingEnabled || localStream) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
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

  const computeSentiment = useCallback(
    (landmarks: Array<{ x: number; y: number }>): { label: SentimentLabel; confidence: number } => {
      if (!landmarks || landmarks.length < 200) return { label: 'neutral', confidence: 0.5 };
      const upperLipIdx = 13;
      const lowerLipIdx = 14;
      const leftEyeIdx = 159;
      const rightEyeIdx = 386;
      const mouthOpen = Math.abs(landmarks[upperLipIdx].y - landmarks[lowerLipIdx].y);
      const eyeSpan = Math.abs(landmarks[leftEyeIdx].x - landmarks[rightEyeIdx].x);
      const ratio = mouthOpen / Math.max(eyeSpan, 0.0001);

      if (ratio > 0.08) return { label: 'stressed', confidence: Math.min(1, ratio * 6) };
      if (ratio > 0.05) return { label: 'uncertain', confidence: Math.min(1, ratio * 8) };
      return { label: 'attentive', confidence: 0.6 };
    },
    []
  );

  // Continuous detection loop that reads from canvas
  useEffect(() => {
    if (!isTrackingEnabled || !isOverlayVisible || !canvasRef.current || !localStream) {
      if (detectionLoopRef.current) {
        cancelAnimationFrame(detectionLoopRef.current);
        detectionLoopRef.current = null;
      }
      return;
    }

    let active = true;
    let lastPublishTime = 0;

    const runDetectionLoop = async () => {
      if (!active) return;

      try {
        const landmarker = await loadLandmarker();
        const canvas = canvasRef.current;
        if (!canvas || !canvas.width || !canvas.height) {
          detectionLoopRef.current = requestAnimationFrame(runDetectionLoop);
          return;
        }

        const now = performance.now();
        // Run detection every ~100ms for responsive overlay (was 500ms)
        if (now - lastAnalysisRef.current < 100) {
          detectionLoopRef.current = requestAnimationFrame(runDetectionLoop);
          return;
        }
        lastAnalysisRef.current = now;

        try {
          const res = await landmarker.detectForVideo(canvas, now);
          const face0 = res.faceLandmarks?.[0];
          if (face0 && face0.length > 0) {
            const flat = face0.map((p) => ({ x: p.x, y: p.y }));
            setLatestLandmarks(flat);
            const s = computeSentiment(flat);
            setLastSentiment({ label: s.label, confidence: s.confidence, at: Date.now() });

            // Publish to room data channel periodically (every 10-15s, separate from overlay updates)
            if (room && room.localParticipant && now - lastPublishTime > 12000) {
              const payload = JSON.stringify({
                type: 'emotion_update',
                sentiment: s,
                at: Date.now(),
              });
              const data = new TextEncoder().encode(payload);
              try {
                const opts: DataPublishOptions = { reliable: true, topic: 'emotion_update' };
                room.localParticipant.publishData(data, opts);
                lastPublishTime = now;
              } catch {}
            }
          }
        } catch {
          // Silently skip on transient detection failures
        }
      } catch {
        // Silently skip on landmarker load failures
      }

      if (active) {
        detectionLoopRef.current = requestAnimationFrame(runDetectionLoop);
      }
    };

    detectionLoopRef.current = requestAnimationFrame(runDetectionLoop);

    return () => {
      active = false;
      if (detectionLoopRef.current) {
        cancelAnimationFrame(detectionLoopRef.current);
        detectionLoopRef.current = null;
      }
    };
  }, [isTrackingEnabled, isOverlayVisible, canvasRef, localStream, loadLandmarker, room, computeSentiment]);

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

  const setCanvasRef = useCallback((ref: HTMLCanvasElement | null) => {
    canvasRef.current = ref;
    if (ref && localStream && !videoRef.current) {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.srcObject = localStream;
      videoRef.current = video;
      video.play().catch(() => {});
    }
  }, [localStream]);

  const value: EmotionTrackingContextValue = useMemo(
    () => ({
      isTrackingEnabled,
      isOverlayVisible,
      lastSentiment,
      latestLandmarks,
      localStream,
      enableTracking,
      setOverlayVisible: setIsOverlayVisible,
      setCanvasRef,
    }),
    [isTrackingEnabled, isOverlayVisible, lastSentiment, latestLandmarks, localStream, enableTracking, setCanvasRef]
  );

  return <EmotionTrackingContext.Provider value={value}>{children}</EmotionTrackingContext.Provider>;
}

export function useEmotionTracking() {
  const ctx = useContext(EmotionTrackingContext);
  if (!ctx) throw new Error('useEmotionTracking must be used within EmotionTrackingProvider');
  return ctx;
}

export function EmotionOverlayCanvas({ className }: { className?: string }) {
  const { isTrackingEnabled, isOverlayVisible, latestLandmarks, localStream, setCanvasRef } = useEmotionTracking();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw video frame and landmarks in real-time
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isTrackingEnabled || !isOverlayVisible || !localStream) return;

    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.crossOrigin = 'anonymous';
    video.srcObject = localStream;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationId: number;
    const drawFrame = () => {
      if (video.readyState >= 2 && canvas.width && canvas.height) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Draw landmarks overlay with simple circles
        if (latestLandmarks && latestLandmarks.length > 0) {
          ctx.fillStyle = '#22c55e';
          ctx.strokeStyle = '#16a34a';
          ctx.lineWidth = 1;
          latestLandmarks.forEach((p) => {
            const x = p.x * canvas.width;
            const y = p.y * canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
          });
        }
      }
      animationId = requestAnimationFrame(drawFrame);
    };

    video.play().catch(() => {});
    animationId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(animationId);
      video.pause();
      video.srcObject = null;
    };
  }, [isTrackingEnabled, isOverlayVisible, latestLandmarks, localStream]);

  // Keep canvas sized to its parent
  const resizeRef = useCallback((node: HTMLCanvasElement | null) => {
    if (!node) return;
    canvasRef.current = node;
    setCanvasRef(node);
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
  }, [setCanvasRef]);

  if (!isTrackingEnabled || !isOverlayVisible) return null;
  return <canvas ref={resizeRef} className={className} />;
}


