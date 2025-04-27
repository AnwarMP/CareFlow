// src/layouts/Layout.tsx
import React, { useEffect } from "react";
import CameraGeminiOverlay from "@/components/CameraGeminiOverlay";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  /* —–––– add ElevenLabs script once ––––– */
  useEffect(() => {
    const id = "elevenlabs-widget-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://elevenlabs.io/convai-widget/index.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <main className="pb-20">{children}</main>
      </div>

      {/* 🗣️ ElevenLabs voice agent (leave a little space on the right) */}
      <elevenlabs-convai
        agent-id="dh2fdxOPPEYFBjluLX5l"
        style={{ position: "fixed", bottom: "24px", right: "96px", zIndex: 50 }}
      />

      {/* 📷 Gemini camera overlay button */}
      <CameraGeminiOverlay
        apiKey={import.meta.env.VITE_GEMINI_KEY}   // or process.env.NEXT_PUBLIC_GEMINI_KEY
        intervalMs={3000}                          // every 3 s – change if you like
      />
    </div>
  );
};

export default Layout;