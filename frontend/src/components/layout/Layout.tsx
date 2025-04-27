// src/layouts/Layout.tsx
import React, { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    // Inject the ElevenLabs widget script only once
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

      {/* Floating voice agent */}
      <elevenlabs-convai
        agent-id="dh2fdxOPPEYFBjluLX5l"
        style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 50 }}
      />
    </div>
  );
};

export default Layout;
