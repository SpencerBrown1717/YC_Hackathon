/**
 * Pitch Garry — Outbound Call Proxy
 * Cloudflare Worker that takes { to: "+1..." } from your landing page
 * and asks AgentPhone to dial that number using your AI Garry agent.
 *
 * Why a Worker:
 *   Your AgentPhone API key must NEVER live in browser JS.
 *   The worker holds the key as a secret and proxies the request.
 *
 * SETUP (2 minutes):
 *   1. Go to dash.cloudflare.com → Workers & Pages → Create → Worker
 *   2. Paste this whole file as the worker code
 *   3. Settings → Variables → add three SECRETS (not env vars):
 *        AGENTPHONE_API_KEY = sk_live_xxx     (from AgentPhone → Settings → API Keys)
 *        AGENTPHONE_AGENT_ID = agt_xxx        (from AgentPhone → Agents → your Garry agent → URL or settings)
 *        AGENTPHONE_FROM_NUMBER = +14177644332
 *   4. Optional but recommended: Settings → Variables → add:
 *        ALLOWED_ORIGIN = https://spencerbrown1717.github.io
 *   5. Deploy. Copy the worker URL (e.g. pitch-garry.YOURNAME.workers.dev)
 *   6. Paste that URL into index.html as `CALLBACK_ENDPOINT`
 *
 * VERIFY THE AGENTPHONE ENDPOINT:
 *   The exact path/payload below is a best guess based on common REST
 *   conventions. Check AgentPhone's docs (sidebar → Documentation) and
 *   adjust the body shape + URL if needed. Most likely variants:
 *     POST /v1/calls          { to, from, agent_id }
 *     POST /v1/agents/{id}/call { to }
 *     POST /v1/voice/calls    { to, from, agent_id }
 *   If you see "404 not found" in the worker logs, that's the line to fix.
 */

const AGENTPHONE_URL = "https://api.agentphone.ai/v1/calls";

export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || "*";

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(allowedOrigin),
      });
    }

    if (request.method !== "POST") {
      return json({ error: "POST only" }, 405, allowedOrigin);
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, allowedOrigin);
    }

    const to = (body.to || "").trim();
    if (!/^\+\d{10,15}$/.test(to)) {
      return json({ error: "Invalid phone number — must be E.164 (+15551234567)" }, 400, allowedOrigin);
    }

    // Basic abuse guard: only US/Canada (+1) by default. Loosen if you want.
    if (!to.startsWith("+1")) {
      return json({ error: "US/Canada numbers only for now" }, 400, allowedOrigin);
    }

    // Required secrets
    if (!env.AGENTPHONE_API_KEY || !env.AGENTPHONE_AGENT_ID || !env.AGENTPHONE_FROM_NUMBER) {
      return json({ error: "Worker missing required secrets" }, 500, allowedOrigin);
    }

    // Call AgentPhone
    try {
      const apResp = await fetch(AGENTPHONE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.AGENTPHONE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: to,
          from: env.AGENTPHONE_FROM_NUMBER,
          agent_id: env.AGENTPHONE_AGENT_ID,
        }),
      });

      const text = await apResp.text();
      if (!apResp.ok) {
        console.error("AgentPhone error", apResp.status, text);
        return json({
          error: "AgentPhone rejected the call",
          status: apResp.status,
          details: text,
        }, 502, allowedOrigin);
      }

      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      return json({ ok: true, call: data }, 200, allowedOrigin);

    } catch (err) {
      console.error("Worker exception", err);
      return json({ error: "Worker exception", message: String(err) }, 500, allowedOrigin);
    }
  },
};

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}
