const CLOVER_TOKEN = "88fc0040-8366-2cf1-7a51-4270de1f16b4";
const CLOVER_MID = "VMKS7WBKX09M1";
const CLOVER_BASE = `https://api.clover.com/v3/merchants/${CLOVER_MID}`;

exports.handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  const p = event.queryStringParameters || {};
  const action = p.action || "items";
  let url;

  if (action === "items") {
    const limit = p.limit || "1000";
    const offset = p.offset || "0";
    url = `${CLOVER_BASE}/items?limit=${limit}&offset=${offset}`;
  } else if (action === "stock") {
    url = `${CLOVER_BASE}/item_stocks`;
  } else {
    url = `${CLOVER_BASE}/${action}`;
  }

  console.log("URL:", url, "Method:", event.httpMethod);

  try {
    const opts = {
      method: event.httpMethod === "POST" ? "POST" : "GET",
      headers: {
        "Authorization": `Bearer ${CLOVER_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    };
    if (event.httpMethod === "POST" && event.body) {
      opts.body = event.body;
    }
    const resp = await fetch(url, opts);
    const text = await resp.text();
    console.log("Status:", resp.status);
    return { statusCode: resp.status, headers: corsHeaders, body: text };
  } catch (err) {
    console.error("Error:", err.message);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
