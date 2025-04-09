const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error(`Feil fra ipapi: ${res.status}`);

    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Kunne ikke hente IP-data", detaljer: err.message })
    };
  }
};
