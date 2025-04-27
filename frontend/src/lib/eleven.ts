// src/lib/eleven.ts
export async function createSession() {
    const agent = import.meta.env.VITE_ELEVEN_AGENT_ID;
    const key   = import.meta.env.VITE_ELEVEN_API_KEY;
  
    const res = await fetch(
      `https://api.elevenlabs.io/v1/agents/${agent}/sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": key,
        },
        body: "{}",
      }
    );
    if (!res.ok) throw new Error(`Session create failed ${res.status}`);
    return res.json() as Promise<{ token: string; session_id: string }>;
  }
  