// src/types/elevenlabs.d.ts
import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "agent-id": string;
        theme?: "light" | "dark";
      };
    }
  }
}
