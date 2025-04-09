export async function handler(event, context) {
  try {
    // 🔁 Hent data fra CentovaCast
    const response = await fetch("https://kepler.shoutca.st/rpc/lial/streaminfo.get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mountpoint: "/stream" })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ CentovaCast API-feil:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "CentovaCast-feil", detail: err })
      };
    }

    const result = await response.json();
    console.log("🎧 API-respons:", JSON.stringify(result, null, 2));

    // ✅ Hent total lyttertall
    const listeners = result?.data?.[0]?.listenertotal ?? 0;
    const timestamp = new Date().toISOString();

    // 🔁 Send til Supabase
    const supabaseRes = await fetch("https://celickborwdktwuoekfn.supabase.co/rest/v1/stream_stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbGlja2Jvcndka3R3dW9la2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjA1NTIsImV4cCI6MjA1OTY5NjU1Mn0.h06C_Q6jpvNNXMeqvTBaVrQ7vpvzrCe8Ks47mSrHDI4",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlbGlja2Jvcndka3R3dW9la2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjA1NTIsImV4cCI6MjA1OTY5NjU1Mn0.h06C_Q6jpvNNXMeqvTBaVrQ7vpvzrCe8Ks47mSrHDI4"
      },
      body: JSON.stringify({
        listeners,
        timestamp
      })
    });

    if (!supabaseRes.ok) {
      const err = await supabaseRes.text();
      console.error("❌ Supabase-feil:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Supabase-feil", detail: err })
      };
    }

    console.log(`✅ Logget ${listeners} lyttere @ ${timestamp}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, listeners })
    };

  } catch (err) {
    console.error("💥 Kritisk feil:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Exception", detail: err.message })
    };
  }
}
