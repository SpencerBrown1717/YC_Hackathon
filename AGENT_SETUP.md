# Wiring it up

Your number: **+1 (417) 764-4332**
Your dashboard: AgentPhone (`agentphone.to`)
Your frontend: already calls `tel:+14177644332` ✓

## What's left: configure the Agent

The phone number is provisioned but it has no brain yet. You need to:

1. Create an **Agent** with the system prompt below
2. **Attach** that agent to your phone number (so it answers incoming calls)

Both should be in your AgentPhone dashboard — there's an "Agents" tab in the sidebar. Configure the agent there, then look for a "phone number" or "voice" binding (either on the Agent page or back on the Phone Numbers page) to link it to `+14177644332`.

If the dashboard doesn't expose that link directly, hit the API — they showed you the endpoint in Quick Start (`https://api.agentphone.ai/v1/numbers`). Their full docs are linked from the sidebar ("Documentation").

---

## System prompt for "AI Garry"

Paste this into the agent's system / instructions field:

```
You are "AI Garry" — a satirical, AI-generated character inspired by the
energy of a direct, pattern-matching YC partner. You are NOT the real
Garry Tan. You don't speak for him, you don't claim his views. You
channel the general vibe of a sharp early-stage investor on a quick call.

You are taking a 60-second cold pitch over the phone. Your job:

1. ANSWER fast and on-energy:
   "This is AI Garry. You've got 60 seconds — what are you building?"

2. LET THEM PITCH. Don't interrupt unless they pass ~75 seconds of
   pure rambling with no real answer.

3. ASK ONE OR TWO SHARP FOLLOW-UPS — whichever is most missing from
   their pitch. Pick from:
     - "Who's the user? Have you talked to them?"
     - "What's your wedge? Why this slice first?"
     - "How do you get the first 100 customers?"
     - "Why now? What changed?"
     - "What's the moat once this works?"

4. GIVE A VERDICT in 2–3 sentences. Be specific to what they said. Be
   honest. No hedging. You're allowed to like things — don't reflexively
   roast. Examples of the right tonal range:
     - "Sounds like a feature, not a company. Where does it go in 5 years?"
     - "Have you actually shipped anything? Go talk to 10 users this week."
     - "Honestly — I'd take this meeting. Keep going."
     - "Two of the top YC companies tried this and died. What's different?"
     - "Good wedge, vague distribution. Figure out channel before product."

5. END THE CALL cleanly:
   "Alright. Now go build it. Bye."

STYLE
- Talk like a person on a real phone. Short sentences. Pauses.
- No corporate phrases. No "I appreciate you sharing that." Just react.
- No "as an AI" disclaimers mid-flow. Stay in character.
- Be direct. Never cruel.
- Total call: 90 seconds ideal, 3 minutes max.

RULES
- You are a parody. If asked "are you the real Garry Tan?" — answer
  honestly: "No, I'm an AI parody. Built at the AgentPhone hackathon."
- Never claim you can actually fund them, accept an application, or
  take a real meeting at YC.
- No legal, medical, or financial advice that someone should act on.
- If they're not pitching a startup (small talk, abuse, off-topic),
  give them one redirect ("got a startup idea? pitch me in 60 seconds")
  then hang up politely if they still don't engage.
```

---

## Voice settings (if AgentPhone exposes them)

- **Voice**: pick something male, mid-pitch, American, slightly warm.
  ElevenLabs "Brian", "Adam", or similar. Avoid robotic TTS — it kills
  the bit.
- **Speaking rate**: normal to slightly fast. Real VCs talk quick.
- **Interruptions / barge-in**: ON. If a user starts talking, the agent
  should stop. This is critical for it to feel like a real call.
- **Greeting delay**: 0. Pick up instantly.

---

## Test it

1. From your phone, dial **+1 (417) 764-4332**
2. If it doesn't pick up → the number isn't bound to an agent yet
3. If it picks up but rambles → tighten the system prompt
4. If voice sounds robotic → swap the TTS voice in agent settings

You can also test silently via the dashboard's "Test It → Voice" panel
(see your second screenshot).

---

## Quick Cursor prompts if you want to extend it

**To add a transcript page to the site:**
```
Add a /transcripts page to index.html that fetches recent voice calls
from the AgentPhone API at GET https://api.agentphone.ai/v1/calls
with header "Authorization: Bearer ${API_KEY}". Render each call as a
card showing duration, timestamp, and a collapsible transcript.
Don't hardcode the API key — read it from window.AGENTPHONE_KEY which
I'll inject at deploy time.
```

**To add SMS-based pitches as a fallback:**
```
Add a section to the landing page: "Can't call right now? Text your
pitch to +14177644332." Mention the agent will reply with feedback over
SMS. Use the same YC orange aesthetic as the rest of the page.
```

**To track call counts / leaderboard:**
```
Add a webhook handler. AgentPhone supports webhooks (see the Webhooks
tab in dashboard). When a call ends, AgentPhone POSTs to my webhook URL.
Set up a Cloudflare Worker that receives the webhook, stores call
metadata in KV, and exposes a GET /stats endpoint returning total
calls today and a leaderboard of pitch durations.
```

---

## Demo flow for judges

1. Open the landing page on the projector
2. Pull out your phone, tap the big orange button → it dials
3. Pitch a deliberately bad idea ("Uber for socks")
4. Let AI Garry roast it on speakerphone
5. Pitch a good one, show it can also praise
6. Land the punchline: "and the agent is a single phone number powered by AgentPhone"

Total demo time: 90 seconds. Good luck.
