"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [reply, setReply] = useState<string>("");
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
    setStatus("Requesting mic...");
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
      setStatus("Processing...");
      const res = await fetch("/api/voice/turn", { method: "POST", body: form });
      if (!res.ok) {
        setStatus("Error");
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
      setStatus("Done");
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
    setStatus("Recording...");
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-semibold">Voice Agent</h1>
      <button
        className="px-6 py-3 rounded-md bg-black text-white disabled:opacity-50"
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
        onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
        disabled={recording}
      >
        {recording ? "Recording..." : "Hold to Speak"}
      </button>
      <div className="text-sm text-gray-500">{status}</div>
      <div className="w-full max-w-xl">
        <div className="font-medium">You said</div>
        <div className="p-3 border rounded-md min-h-[48px] whitespace-pre-wrap">{transcript}</div>
      </div>
      <div className="w-full max-w-xl">
        <div className="font-medium">Agent reply</div>
        <div className="p-3 border rounded-md min-h-[48px] whitespace-pre-wrap">{reply}</div>
      </div>
      <audio ref={audioRef} controls className="w-full max-w-xl" />
    </div>
  );
}
