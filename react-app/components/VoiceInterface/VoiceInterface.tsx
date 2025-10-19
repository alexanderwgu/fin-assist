'use client';

import React, { useEffect, useRef, useState } from 'react';

interface VoiceInterfaceProps {
  className?: string;
}

export default function VoiceInterface({ className = '' }: VoiceInterfaceProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState<string>('Ready to assist');
  const [transcript, setTranscript] = useState<string>('');
  const [reply, setReply] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  async function startRecording() {
    setTranscript('');
    setReply('');
    setStatus('Requesting microphone...');
    setIsListening(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const form = new FormData();
        form.append('audio', blob, 'audio.webm');
        setStatus('Processing your request...');

        try {
          const res = await fetch('/api/voice/turn', { method: 'POST', body: form });
          if (!res.ok) {
            setStatus('Error processing request');
            return;
          }

          const audioBuf = await res.arrayBuffer();
          const transcriptHdr = res.headers.get('x-transcript');
          const replyHdr = res.headers.get('x-text');
          setTranscript(transcriptHdr ? decodeURIComponent(transcriptHdr) : '');
          setReply(replyHdr ? decodeURIComponent(replyHdr) : '');

          const url = URL.createObjectURL(
            new Blob([audioBuf], { type: res.headers.get('content-type') || 'audio/mpeg' })
          );
          if (audioRef.current) {
            audioRef.current.src = url;
            await audioRef.current.play().catch(() => {});
          }
          setStatus('Response ready');
        } catch (error) {
          console.error('Error:', error);
          setStatus('Error processing request');
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setStatus('Listening...');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setStatus('Microphone access denied');
      setIsListening(false);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    setIsListening(false);
    setStatus('Processing audio...');
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl ${className}`}
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-[#29F280] to-[#5FF9A5] px-8 py-12 text-[#141926]">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-40 w-40 rounded-full bg-[#592EF2]/20 blur-3xl"></div>

        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#592EF2] shadow-lg shadow-[#592EF2]/40">
              <i className="fas fa-microphone-alt text-xl text-white"></i>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">Voice Assistant</h2>
              <p className="text-sm font-medium text-[#141926]/80">
                Speak about your financial goals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Mic Button Section */}
        <div className="mb-10 flex flex-col items-center gap-6">
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`group relative flex h-40 w-40 items-center justify-center rounded-full transition-all duration-300 ${
              isListening
                ? 'bg-[#ef4444] shadow-2xl shadow-red-500/40'
                : 'bg-[#29F280] shadow-xl shadow-[#29F280]/40 hover:shadow-2xl hover:shadow-[#29F280]/60'
            }`}
          >
            {/* Pulse Effect */}
            {isListening && (
              <>
                <span className="absolute inset-0 animate-pulse rounded-full bg-[#ef4444] opacity-20"></span>
                <span
                  className="absolute inset-2 animate-pulse rounded-full bg-[#ef4444] opacity-10"
                  style={{ animationDelay: '0.2s' }}
                ></span>
              </>
            )}

            <div className="relative z-10 text-center">
              <i
                className={`fas fa-microphone mb-3 block text-5xl transition-transform group-hover:scale-110 ${
                  isListening ? 'animate-bounce text-white' : 'text-[#141926]'
                }`}
              ></i>
              <div className="text-sm font-semibold text-[#141926]">
                {isListening ? 'Stop' : 'Start'}
              </div>
            </div>
          </button>

          {/* Status Indicator */}
          <div className="text-center">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
                isListening ? 'bg-red-100 text-red-700' : 'bg-[#29F280]/20 text-[#141926]'
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full transition-all ${
                  isListening ? 'animate-pulse bg-red-600' : 'bg-[#29F280]'
                }`}
              ></div>
              <span className="text-sm font-medium">{status}</span>
            </div>
          </div>
        </div>

        {/* Transcript and Response Grid */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* User Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#29F280]/20">
                <i className="fas fa-user text-[#29F280]"></i>
              </div>
              <h3 className="font-semibold text-gray-800">You said</h3>
            </div>
            <div className="min-h-[120px] rounded-lg border border-[#29F280]/30 bg-[#29F280]/10 p-4">
              {transcript ? (
                <p className="leading-relaxed font-medium text-gray-700">{transcript}</p>
              ) : (
                <p className="text-gray-400 italic">Your words will appear here...</p>
              )}
            </div>
          </div>

          {/* Assistant Response */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#592EF2]/20">
                <i className="fas fa-robot text-[#592EF2]"></i>
              </div>
              <h3 className="font-semibold text-gray-800">AI response</h3>
            </div>
            <div className="min-h-[120px] rounded-lg border border-[#592EF2]/30 bg-[#592EF2]/10 p-4">
              {reply ? (
                <p className="leading-relaxed font-medium text-gray-700">{reply}</p>
              ) : (
                <p className="text-gray-400 italic">Responses will appear here...</p>
              )}
            </div>
          </div>
        </div>

        {/* Audio Player */}
        {reply && (
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <i className="fas fa-volume-up text-[#29F280]"></i>
              Listen to response
            </h3>
            <div className="rounded-lg border border-[#29F280]/30 bg-[#29F280]/10 p-4">
              <audio ref={audioRef} controls className="h-10 w-full accent-[#29F280]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
