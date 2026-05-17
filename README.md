# Pitch Garry

> Call an AI parody of a famously direct YC investor and get your startup idea roasted in 60 seconds.

Built at the **[Call My Agent Hackathon](https://events.ycombinator.com/CallMyAgentHackathon)** (May 17, 2026) at Y Combinator, hosted by **[AgentPhone](https://agentphone.to)**.

## What it is

Dial a number. Pitch your idea. An AI agent on the other end asks probing questions — about your wedge, your users, your unit economics — and gives you a blunt verdict. Good idea, bad idea, or "talk to users first."

No app. No signup. Just a phone call.

## Stack

- **[AgentPhone](https://agentphone.to)** — phone numbers for AI agents (voice + messaging via a single API)
- **LLM** — for the personality and reasoning
- Single-file static landing page (this repo) — deployed on GitHub Pages

## Deploy

1. Push to GitHub
2. Settings → Pages → deploy from `main` / root
3. Replace the placeholder `href="#"` on the Call CTA with your AgentPhone number, e.g. `tel:+15551234567`

## Disclaimer

"Pitch Garry" is a satirical, AI-generated character inspired by general startup-culture tropes. Not affiliated with, endorsed by, or representative of Y Combinator, Garry Tan, or any real investor. For entertainment and hackathon purposes only.

## License

MIT
