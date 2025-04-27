// src/components/widgets/CameraGeminiOverlay.tsx
import React, { useEffect, useRef, useState } from "react";
import { CameraIcon } from "lucide-react";

interface Props {
  apiKey: string;
  /** ms between frames */
  intervalMs?: number;
  /** how many previous summaries to include in the next prompt */
  historyLen?: number;
}

const CameraGeminiOverlay: React.FC<Props> = ({
  apiKey,
  intervalMs = 3000,
  historyLen = 4,
}) => {
  /* ───────── state ───────── */
  const [open, setOpen] = useState(false);
  const [latest, setLatest] = useState("Waiting for first frame …");
  const [loading, setLoading] = useState(false);

  /* ───────── refs ───────── */
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const historyRef = useRef<string[]>([]); // sliding window of past summaries

  /* ───────── helpers ───────── */

  const startCamera = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        await videoRef.current.play();
      }
      timerRef.current = window.setInterval(captureAndAnalyze, intervalMs);
    } catch (e) {
      console.error("getUserMedia error:", e);
      setLatest("❌ Camera error. Check browser permissions.");
    }
  };

  const stopCamera = () => {
    timerRef.current && clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current) return;

    /* ----- JPEG base64 from frame ----- */
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(videoRef.current, 0, 0);
    const b64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];

    /* ----- build prompt ----- */
    const system = `You are monitoring a post-surgery patient via webcam.
Your job: decide if the PATIENT IS SWALLOWING A PILL **in the CURRENT frame**
and guess their current emotion (Happy, Neutral, Pain, Sad, Anxious, etc.).
Respond in **exactly** this format (no line breaks, no extra words):

Medicine Status: <Taken|Not taken|Unknown> | Emotion: <Emotion>`;
    const previous = historyRef.current.length
      ? `Previous observations:\n${historyRef.current.join("\n")}`
      : "";
    const promptText = [system, previous].filter(Boolean).join("\n\n");

    /* ----- call Gemini ----- */
    try {
      setLoading(true);
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: promptText },
                  {
                    inline_data: {
                      mime_type: "image/jpeg",
                      data: b64,
                    },
                  },
                ],
              },
            ],
            generationConfig: { temperature: 0.2, maxOutputTokens: 64 },
          }),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      const json = await res.json();
      const reply: string =
        json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "Medicine Status: Unknown | Emotion: Unknown";

      /* keep sliding history */
      historyRef.current.push(reply);
      if (historyRef.current.length > historyLen)
        historyRef.current.shift();

      setLatest(reply);
    } catch (e) {
      console.error(e);
      setLatest("❌ Gemini error – see console");
    } finally {
      setLoading(false);
    }
  };

  /* ───────── lifecycle ───────── */
  useEffect(() => {
    if (open) startCamera();
    else stopCamera();
    return stopCamera;
  }, [open]);

  /* ───────── UI ───────── */
  return (
    <>
      {/* floating trigger */}
      + <button
   onClick={() => setOpen(true)}
   className="
     fixed bottom-6 right-6 z-40            /* align with ElevenLabs bubble */
     flex h-14 w-14 items-center justify-center
     rounded-full bg-white
     shadow-[0_0_20px_rgba(0,0,0,0.15)]
     ring-1 ring-black/10 hover:ring-black/20
     transition
   "
 >
   <CameraIcon className="h-7 w-7 text-black/80" strokeWidth={2} />
 </button>

      {/* overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          {/* outer rounded container */}
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            {/* close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-2xl leading-none text-gray-500 hover:text-gray-700"
            >
              ×
            </button>

            {/* video */}
            <div className="aspect-video w-full overflow-hidden rounded-2xl border">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                muted
              />
            </div>

            {/* summary bar */}
            <div className="mt-4 rounded-xl border bg-gray-50 px-4 py-3 text-center font-semibold">
              {loading ? "Analyzing …" : latest}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CameraGeminiOverlay;