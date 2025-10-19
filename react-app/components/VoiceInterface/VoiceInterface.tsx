"use client";

import React, { useEffect, useRef, useState } from "react";

interface VoiceInterfaceProps {
  className?: string;
}

export default function VoiceInterface({ className = "" }: VoiceInterfaceProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState<string>("Ready to assist");
  const [transcript, setTranscript] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  async function startRecording() {
    setTranscript("");
    setReply("");
    setStatus("Requesting microphone...");
    setIsListening(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const form = new FormData();
        form.append("audio", blob, "audio.webm");
        setStatus("Processing your request...");

        try {
          const res = await fetch("/api/voice/turn", { method: "POST", body: form });
          if (!res.ok) {
            setStatus("Error processing request");
            return;
          }

          const audioBuf = await res.arrayBuffer();
          const transcriptHdr = res.headers.get("x-transcript");
          const replyHdr = res.headers.get("x-text");
          setTranscript(transcriptHdr ? decodeURIComponent(transcriptHdr) : "");
          setReply(replyHdr ? decodeURIComponent(replyHdr) : "");

          const url = URL.createObjectURL(new Blob([audioBuf], { type: res.headers.get("content-type") || "audio/mpeg" }));
          if (audioRef.current) {
            audioRef.current.src = url;
            await audioRef.current.play().catch(() => {});
          }
          setStatus("Response ready");
        } catch (error) {
          console.error("Error:", error);
          setStatus("Error processing request");
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setStatus("Listening...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setStatus("Microphone access denied");
      setIsListening(false);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    setIsListening(false);
    setStatus("Processing audio...");
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#29F280] to-[#5FF9A5] px-8 py-12 text-[#141926] overflow-hidden rounded-t-2xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#592EF2]/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#592EF2] flex items-center justify-center shadow-lg shadow-[#592EF2]/40">
              <i className="fas fa-microphone-alt text-xl text-white"></i>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">Voice Assistant</h2>
              <p className="text-[#141926]/80 text-sm font-medium">Speak about your financial goals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Mic Button Section */}
        <div className="flex flex-col items-center gap-6 mb-10">
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`relative w-40 h-40 rounded-full transition-all duration-300 flex items-center justify-center group ${
              isListening
                ? "bg-[#ef4444] shadow-2xl shadow-red-500/40"
                : "bg-[#29F280] shadow-xl shadow-[#29F280]/40 hover:shadow-2xl hover:shadow-[#29F280]/60"
            }`}
          >
            {/* Pulse Effect */}
            {isListening && (
              <>
                <span className="absolute inset-0 rounded-full bg-[#ef4444] animate-pulse opacity-20"></span>
                <span className="absolute inset-2 rounded-full bg-[#ef4444] animate-pulse opacity-10" style={{ animationDelay: "0.2s" }}></span>
              </>
            )}

            <div className="relative z-10 text-center">
              <i className={`fas fa-microphone text-5xl mb-3 block transition-transform group-hover:scale-110 ${
                isListening ? "text-white animate-bounce" : "text-[#141926]"
              }`}></i>
              <div className="text-sm font-semibold text-[#141926]">
                {isListening ? "Stop" : "Start"}
              </div>
            </div>
          </button>

          {/* Status Indicator */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              isListening
                ? "bg-red-100 text-red-700"
                : "bg-[#29F280]/20 text-[#141926]"
            }`}>
              <div className={`w-2 h-2 rounded-full transition-all ${
                isListening ? "bg-red-600 animate-pulse" : "bg-[#29F280]"
              }`}></div>
              <span className="text-sm font-medium">{status}</span>
            </div>
          </div>
        </div>

        {/* Transcript and Response Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* User Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#29F280]/20 flex items-center justify-center">
                <i className="fas fa-user text-[#29F280]"></i>
              </div>
              <h3 className="font-semibold text-gray-800">You said</h3>
            </div>
            <div className="p-4 rounded-lg bg-[#29F280]/10 border border-[#29F280]/30 min-h-[120px]">
              {transcript ? (
                <p className="text-gray-700 leading-relaxed font-medium">{transcript}</p>
              ) : (
                <p className="text-gray-400 italic">Your words will appear here...</p>
              )}
            </div>
          </div>

          {/* Assistant Response */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#592EF2]/20 flex items-center justify-center">
                <i className="fas fa-robot text-[#592EF2]"></i>
              </div>
              <h3 className="font-semibold text-gray-800">AI response</h3>
            </div>
            <div className="p-4 rounded-lg bg-[#592EF2]/10 border border-[#592EF2]/30 min-h-[120px]">
              {reply ? (
                <p className="text-gray-700 leading-relaxed font-medium">{reply}</p>
              ) : (
                <p className="text-gray-400 italic">Responses will appear here...</p>
              )}
            </div>
          </div>
        </div>

        {/* Audio Player */}
        {reply && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <i className="fas fa-volume-up text-[#29F280]"></i>
              Listen to response
            </h3>
            <div className="p-4 rounded-lg bg-[#29F280]/10 border border-[#29F280]/30">
              <audio
                ref={audioRef}
                controls
                className="w-full h-10 accent-[#29F280]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
