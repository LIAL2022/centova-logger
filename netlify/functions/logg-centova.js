export async function handler(event, context) {
  try {
    // Hent data fra CentovaCast
    const response = await fetch("https://kepler.shoutca.st/rpc/lial/streaminfo.get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mountpoint: "/stream" })
    });

    const result = await response.json();
    const listeners = result?.listeners ?? 0;

    // Send til Supabase
    const supabaseRes = await fetch("https://celickborwdktwuoekfn.supabase.co/rest/v1/stream_stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // Sett inn hele API-nøkkelen din
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Sett inn hele Bearer-tokenet
      },
      body: JSON.stringify({
        listeners,
        timestamp: new Date().toISOString()
      })
    });

    if (!supabaseRes.ok) {
      const err = await supabaseRes.text();
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Supabase error", detail: err })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, listeners })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Exception", detail: err.message })
    };
  }
}
