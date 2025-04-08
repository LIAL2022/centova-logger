const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const CENTOVA_URL = "https://kepler.shoutca.st/rpc/lial/streaminfo.get";
  const SUPABASE_URL = "https://celickborwdktwuoekfn.supabase.co/rest/v1/stream_stats";
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbGlja2Jvcndka3R3dW9la2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjA1NTIsImV4cCI6MjA1OTY5NjU1Mn0.h06C_Q6jpvNNXMeqvTBaVrQ7vpvzrCe8Ks47mSrHDI4";

  try {
    const centovaRes = await fetch(CENTOVA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: true })
    });

    const centovaData = await centovaRes.json();
    const listeners = centovaData?.data?.[0]?.listeners ?? null;
    if (listeners === null) throw new Error("Ingen lyttertall funnet.");

    const supabaseRes = await fetch(SUPABASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": API_KEY,
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        listeners: listeners
      })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `🎧 Logget ${listeners} lyttere.` })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
