# Day 2: Coffee Shop Barista Agent

Welcome to **Day 2** of the **Murf AI Voice Agent Challenge**! Building on yesterday's starter agent, today we'll transform it into a **friendly coffee shop barista** that handles voice orders seamlessly. Using Murf Falcon's ultra-fast TTS for natural responses, your agent will guide customers through their order and save a clean JSON summary. ☕

## 🎯 Objective
Create a conversational barista agent that collects full coffee orders via voice, maintains state, and persists the result. Focus on the **primary goal** for completion—the **advanced challenge** is for extra flair!

## 📋 Primary Goal (Required)
Turn your agent into a **persona-driven barista** for your favorite coffee brand (e.g., "Starbrew" or "Cosmic Brews"). The agent must:

- **Maintain Order State**: Use a simple JSON object to track the order:
  ```json
  {
    "drinkType": "string",  // e.g., "cappuccino"
    "size": "string",       // e.g., "large"
    "milk": "string",       // e.g., "whole" or "none"
    "extras": ["string"],   // e.g., ["whipped cream", "extra shot"]
    "name": "string"        // e.g., "Alex Johnson"
  }
  ```

- **Conversational Behavior**:
  - Greet warmly and ask clarifying questions step-by-step (e.g., "What drink can I get for you today?" → "What size?" → "Milk preference?" → "Any extras?" → "Name for the order?").
  - Continue until **all fields** are filled—no rushing!
  - Once complete, confirm the order verbally and save it as a timestamped JSON file (e.g., `order_20251123_100209.json`).

**Implementation Notes** (My Updates):
- I've customized the barista persona in `agent.py` to be a cheerful "Starbrew" employee with engaging prompts and Murf Falcon TTS for lively responses.
- Orders are automatically saved as JSON files in the `backend/orders/` folder for easy review (e.g., sample orders from testing: `order_20251123_100209_317531.json` for a large cappuccino with whole milk, no extras, for Akshat Patapting).

**Implementation Tips**:
- Use LiveKit tools for state management and function calls (e.g., `set_drink_type`, `set_size`).
- Integrate Murf Falcon TTS for engaging, barista-like responses with emojis (e.g., "Got it, a large cappuccino! ☕").

#### Key Resources
- [LiveKit Tools](https://docs.livekit.io/agents/build/tools/) – For defining order functions.
- [Passing State in Agents](https://docs.livekit.io/agents/build/agents-handoffs/#passing-state) – Manage your JSON order object.
- [Agent Tasks](https://docs.livekit.io/agents/build/tasks/) – Handle sequential questioning.
- [Drive-Thru Example](https://github.com/livekit/agents/blob/main/examples/drive-thru/agent.py) – Adapt this for coffee orders.

## 🚀 Advanced Challenge (Optional)
Level up with a visual twist:
- **Dynamic HTML Rendering**: Generate an HTML "drink image" or order receipt that updates in real-time based on the order.
  - Examples:
    - **Size**: Small cup (compact div) vs. large (expanded).
    - **Extras**: Add whipped cream as a CSS-drawn swirl on top.
    - **Receipt**: A styled table summarizing the order with total (e.g., $4.50).
- Stream the HTML via LiveKit to the frontend for display during/after the conversation.

#### Key Resources
- [Text Streams](https://docs.livekit.io/home/client/data/text-streams/) – Push HTML updates to the UI.
- [RPC for Client-Server](https://docs.livekit.io/home/client/data/rpc/) – Trigger visuals from agent events.

## 📝 Steps to Complete

### Step 1: Build the Barista Agent
- Update your backend (`src/agent.py`) with the barista persona, tools for each order field, and JSON saving logic.
- Test locally: Run backend/frontend and simulate a full order.

### Step 2: Test in Browser
- Connect via `http://localhost:3000`.
- Place a complete coffee order (e.g., "Large latte with oat milk and cinnamon, for Sarah").
- Ensure the agent fills all state fields and saves the JSON.

### Step 3: Record Your Session
- Capture a 30-60 second video:
  - Voice interaction placing the order.
  - Screen showing the final JSON file (open it in your editor).
- Tools: Loom, QuickTime, or OBS.

### Step 4: Share on LinkedIn
- **Post Template**:
  > "Day 2 of the Murf AI Voice Agent Challenge: My coffee barista agent is brewing! ☕ Built with LiveKit and Murf Falcon's fastest TTS API, it takes voice orders, manages state, and saves JSON summaries. Placed a latte order – watch!  
  >  
  > Loving this 10-day sprint into voice AI. Join the fun! #MurfAIVoiceAgentsChallenge #10DaysofAIVoiceAgents @Murf AI"
- **Must-Haves**:
  - Describe your implementation (e.g., "Added tools for drink, size, milk, extras, and name").
  - Mention: "Building voice agents using the fastest TTS API - Murf Falcon."
  - Part of: “Murf AI Voice Agent Challenge”.
  - Tag: @Murf AI.
  - Hashtags: #MurfAIVoiceAgentsChallenge #10DaysofAIVoiceAgents.
- Engage: Tag challenge participants and ask for their Day 2 creations!

## ✅ Completion Checklist
- [ ] Barista persona implemented with order state JSON.
- [ ] Agent asks questions until complete; saves JSON file.
- [ ] (Optional) HTML visuals for drink/receipt.
- [ ] Browser test: Full order placed successfully.
- [ ] Video recorded (interaction + JSON proof).
- [ ] LinkedIn post live with video and all elements.

## 🚀 Next Up
Nailed Day 2? Tomorrow (Day 3), we'll add multi-turn memory and personalization. Keep your JSON orders in `backend/orders/` for reference!

**Resources Recap**:
- Full Challenge Repo: [GitHub](https://github.com/murf-ai/ten-days-of-voice-agents-2025).
- Murf Falcon: [Docs](https://docs.murf.ai/) – Optimize TTS voices for your barista.
- LiveKit Community: [Discord](https://livekit.io/discord) – Get stuck? Ask away!

High-five on your barista bot—orders are flowing! Let's keep the momentum. 🎙️☕

---

*This README is part of the Murf AI 10 Days of Voice Agents Challenge. Updated on November 23, 2025, with changes to `agent.py` and sample orders saved in `backend/orders/` as JSON files.*