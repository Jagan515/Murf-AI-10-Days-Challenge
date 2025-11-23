# Health & Wellness Voice Companion

[![Murf AI Voice Agent Challenge](https://img.shields.io/badge/Murf%20AI-Voice%20Agent%20Challenge-blueviolet)](https://www.murf.ai/)  
**Day 3 of the 10 Days of AI Voice Agents Challenge** – Built with [LiveKit Agents](https://docs.livekit.io/agents/) and the fastest TTS API, [Murf Falcon](https://www.murf.ai/).

## Overview

This is a **supportive voice agent** designed for daily health and wellness check-ins. It acts as a grounded companion: asking about mood/energy, helping set 1-3 simple intentions, offering realistic reflections, and recapping the session. All data is persisted in a JSON log for continuity across sessions (e.g., referencing past moods/goals).

- **Core Flow**: Greeting → Mood check → Goal setting → Quick advice → Recap & save.
- **Voice-First**: Powered by LiveKit for real-time voice (STT: Deepgram, LLM: Google Gemini, TTS: Murf AI).
- **Persistence**: Saves to `records/wellness_log.json` – no external DB needed.
- **Ethical Guardrails**: Non-diagnostic, non-medical; focuses on empathy and small actions.

Built for the **Murf AI Voice Agent Challenge** – check out my [LinkedIn post](https://www.linkedin.com/posts/YOUR_POST_HERE) with a demo video!

## Features

- **Daily Check-Ins**: Short (1-2 min) voice conversations.
- **Mood & Energy Tracking**: User self-reports (text or 1-10 scale).
- **Goal Setting**: 1-3 practical intentions (e.g., "walk, email, rest").
- **Reflections**: Actionable, low-pressure suggestions (e.g., "Try a 5-min break").
- **Recap & Confirmation**: Ensures accuracy before saving.
- **Historical Context**: References last session's mood/goals.
- **Token-Aware**: Prompts steer long chats to wrap up efficiently.
- **Extensible**: Ready for MCP integrations (e.g., Todoist tasks) – see Advanced Goals below.

### Data Schema (`records/wellness_log.json`)
Human-readable array of entries:
```json
[
  {
    "date": "2025-11-23",
    "time": "10:30:00",
    "mood": "7/10, energized",
    "objectives": ["10-min walk", "finish report", "read book"],
    "summary": "User reported positive energy and proactive goals."
  }
]
```

## Quick Start

### Prerequisites
- Python 3.10+
- [LiveKit CLI](https://docs.livekit.io/getting-started/create-room/#install-the-cli) installed.
- API Keys: Set in `.env.local`:
  ```
  LIVEKIT_URL=your_livekit_url
  LIVEKIT_API_KEY=your_api_key
  LIVEKIT_API_SECRET=your_api_secret
  DEEPGRAM_API_KEY=your_deepgram_key
  GOOGLE_API_KEY=your_google_key  # For Gemini
  MURF_API_KEY=your_murf_key
  ```
- Install deps: `pip install -r requirements.txt` (or `livekit-agents[murf,deepgram,google,silero]`).

### Setup
1. Clone/Fork this repo.
2. Create `.env.local` with keys above.
3. Run the agent: `python src/agent.py`.
4. In another terminal, start a room: `lk room create --num-participants 2`.
5. Connect via [LiveKit Browser Demo](https://meet.livekit.io/) (paste room URL/token).

### Usage
- Speak naturally: Agent greets and guides.
- Example Session:
  - Agent: "Hi! How are you feeling today?"
  - You: "Pretty good, 8/10 energy."
  - Agent: "Nice—what's 1-3 things for today?"
  - You: "Gym, call mom, cook dinner."
  - Agent: "Solid plan. For the gym, start with warm-ups. Recap: Mood 8/10, goals gym/call/cook. Right?"
  - You: "Yes."
  - Agent: "Saved—talk soon!"
- Check `records/wellness_log.json` post-session.

## Testing
- **Voice Commands**: See [VOICE_COMMANDS.md](VOICE_COMMANDS.md) for sample scripts.
- **Multi-Session**: Run 2+ times; agent references history.
- **Edge Cases**: Test low mood, no goals, or drifts—agent stays supportive.
- **Metrics**: Logs usage (tokens, latency) via LiveKit.

## Advanced Goals (Implemented Optionally)
- **MCP Integration**: Add Todoist/Notion via [LiveKit MCP](https://docs.livekit.io/agents/build/tools/#external-tools-and-mcp). Say "Turn goals into tasks" to trigger.
- **Weekly Reflections**: Query JSON for trends (e.g., "Mood this week?") – avg score, goal completion.
- **Reminders**: Confirm & schedule via Zapier/Google Calendar MCP.

To extend: Edit `Assistant` class in `src/agent.py` for new tools/prompts.

## Architecture
- **Backend**: `src/agent.py` – LiveKit JobContext → AgentSession → Murf TTS.
- **Persistence**: JSON append in `save_checkin` tool.
- **Frontend**: Browser-based LiveKit room (no custom UI needed).

## Contributing / Challenge Notes
Part of the **Murf AI Voice Agent Challenge** – using Murf Falcon for ultra-fast, natural TTS. Days 1-2: Basic agents; Day 3: This wellness companion. Follow for Days 4-10!

Tag [@MurfAI](https://www.linkedin.com/company/murf-ai/) on LinkedIn. Hashtags: #MurfAIVoiceAgentsChallenge #10DaysofAIVoiceAgents

## License
MIT – Free to use/modify. Questions? Open an issue.

---

*Built with ❤️ for wellness. Last updated: Nov 23, 2025.*