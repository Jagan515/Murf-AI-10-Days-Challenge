# Murf AI 10 Days of Voice Agents Challenge - My Progress Repo

Welcome to **my fork** of the **AI Voice Agents Challenge** by [murf.ai](https://murf.ai)! 🚀 I've customized this starter repository to track my 10-day journey building voice agents with **Murf Falcon**—the consistently fastest TTS API. Join me as I tackle daily tasks, share implementations, and post updates on LinkedIn!

## About the Challenge
We just launched **Murf Falcon** – the consistently fastest TTS API, and you're going to be among the first to test it out in ways never thought before!  
**Build 10 AI Voice Agents over the course of 10 Days** along with help from our devs and the community champs, and win rewards!

### How It Works
- One task to be provided everyday along with a GitHub repo for reference.
- Build a voice agent with specific personas and skills.
- Post on GitHub and share with the world on LinkedIn!

## 📅 My Challenge Progress
I've completed the first seven days—check the daily folders for code, READMEs, and sample outputs. Each day builds on the starter, with updates to `agent.py` and more!

| Day | Date Completed | Focus | Key Achievements |
|-----|----------------|-------|------------------|
| **Day 1** | 22 November 2025 | Get Starter Voice Agent Running | Forked repo, set up backend/frontend with LiveKit + Murf Falcon TTS. Tested browser conversation and shared LinkedIn video. [Details → Day-1/README.md](Day-1/README.md) |
| **Day 2** | 23 November 2025 | Coffee Shop Barista Agent | Customized `agent.py` for barista persona; added order state (drink, size, milk, extras, name). Saves JSON orders in `backend/orders/`. Tested full voice orders. [Details → Day-2/README.md](Day-2/README.md) |
| **Day 3** | 23 November 2025 | Health & Wellness Voice Companion | Built supportive voice agent for daily mood/energy check-ins, goal setting, and realistic reflections. Persists data in `records/wellness_log.json` with historical references. Added `save_checkin` tool; tested multi-session continuity and shared LinkedIn video. [Details → Day-3/README.md](Day-3/README.md) |
| **Day 4** | 24 November 2025 | Active Recall Coach | Built multi-voice tutor agent with three learning modes (learn, quiz, teach_back) using Murf Falcon voices (Matthew, Alicia, Ken). Implemented course system with JSON content for Go and DSA courses. Added mode switching and concept selection tools. [Details → Day-4/README.md](Day-4/README.md) |
| **Day 5** | 26 November 2025 | Simple FAQ SDR + Lead Capture | Built voice SDR for Jar micro-savings app; FAQ keyword search tool for digital gold queries, progressive lead qual (name/company/email/role/use case/team/timeline), end-summary & JSON save in `leads/`. Tested full qual flow and shared LinkedIn video. [Details → Day-5/README.md](Day-5/README.md) |
| **Day 6** | 27 November 2025 | Fraud Alert Voice Agent | Built SBI fraud bot; loads JSON DB cases, verifies via security Q, confirms tx (safe/fraud/failed), updates status/outcome. Tools for find/verify/describe/handle; tested all flows + DB persistence; shared LinkedIn video. [Details → Day-6/README.md](Day-6/README.md) |
| **Day 7** | 28 November 2025 | Food & Grocery Ordering Voice Agent | Built QuickBasket assistant; catalog JSON with categories/recipes, cart tools (add/update/remove/view), recipe bundling (e.g., sandwich ingredients), order save to `orders/`. Tested full flows; shared LinkedIn video. [Details → Day-7/README.md](Day-7/README.md) |
| **Day 8** | TBD | Advanced Agent Capabilities | Coming soon... |
| ... | ... | ... | ... (Full 10 days ahead!) |

*Track progress via commits, JSON order logs (e.g., sample orders from Day 2 testing: `order_20251123_100209_317531.json` for a large cappuccino), wellness logs (e.g., `wellness_log.json` entries for Day 3 moods/goals), tutor courses (Day 4), lead captures (e.g., `lead_20251126_100000.json` for Day 5), fraud DB updates (e.g., `fraud_cases.json` with confirmed_safe/fraud entries for Day 6), grocery orders (e.g., `order_20251128_143022.json` for Day 7), and daily videos on LinkedIn. All days build cumulatively—run the full stack for the latest agent!*

## Repository Structure
This is a **monorepo** that contains both the backend and frontend for building voice agent applications. It's designed to be your starting point for each day's challenge task. I've restructured it with daily folders for easy progression, and fixed submodule issues to make Day-1 and Day-2 normal directories (no more gitlinks—contents now fully visible and expandable on GitHub).

```
Murf-AI-10-Days-Challenge/
├── Day-1/                  # Day 1: Starter agent setup
│   ├── backend/            # Python agent with LiveKit (includes src/agent.py, tests, .env.example)
│   ├── frontend/           # Next.js UI for voice room (includes app/, hooks/, public/)
│   ├── LICENSE             # MIT License for Day 1
│   ├── README.md           # Day 1 details and setup
│   └── start_app.sh        # Convenience script for Day 1
├── Day-2/                  # Day 2: Barista with order state
│   ├── backend/            # Updated Python agent (includes src/agent.py with barista tools, orders/ JSON files)
│   │   └── orders/         # Sample JSON orders (e.g., order_20251123_100209.json)
│   ├── challenges/         # Official task MDs (e.g., Day 1 Task.md, Day 2 Task.md)
│   ├── frontend/           # Updated Next.js UI
│   ├── LICENSE             # MIT License for Day 2
│   └── README.md           # Day 2 details and setup
├── Day-3/                  # Day 3: Health & Wellness Companion
│   ├── backend/            # Updated Python agent (includes src/agent.py with wellness tools, records/ JSON logs)
│   │   └── records/        # Sample wellness logs (e.g., wellness_log.json with mood/objectives entries)
│   ├── frontend/           # Updated Next.js UI
│   ├── LICENSE             # MIT License for Day 3
│   ├── README.md           # Day 3 details and setup (includes VOICE_COMMANDS.md)
│   └── start_app.sh        # Convenience script for Day 3
├── Day-4/                  # Day 4: Active Recall Coach
│   ├── backend/            # Updated Python agent (includes src/agent.py with tutor tools, shared-data/ JSON courses)
│   │   └── shared-data/    # Course JSON files (go_course.json, dsa_course.json)
│   ├── frontend/           # Updated Next.js UI
│   ├── LICENSE             # MIT License for Day 4
│   ├── README.md           # Day 4 details and setup
│   └── start_app.sh        # Convenience script for Day 4
├── Day-5/                  # Day 5: Simple FAQ SDR + Lead Capture
│   ├── backend/            # Updated Python agent (includes src/agent.py with SDR tools, shared-data/ FAQ JSON, leads/ output files)
│   │   └── leads/          # Sample lead JSONs (e.g., lead_20251126_100000.json with qual fields)
│   ├── frontend/           # Updated Next.js UI (Jar-themed)
│   ├── LICENSE             # MIT License for Day 5
│   ├── README.md           # Day 5 details and setup
│   └── start_app.sh        # Convenience script for Day 5
├── Day-6/                  # Day 6: Fraud Alert Voice Agent
│   ├── backend/            # Updated Python agent (includes src/agent.py with fraud tools, fraud_database/ JSON cases)
│   │   └── fraud_database/ # Sample fraud JSONs (e.g., fraud_cases.json with pending/reviewed entries)
│   ├── frontend/           # Updated Next.js UI (SBI-themed)
│   ├── LICENSE             # MIT License for Day 6
│   ├── README.md           # Day 6 details and setup
│   └── start_app.sh        # Convenience script for Day 6
├── Day-7/                  # Day 7: Food & Grocery Ordering Voice Agent
│   ├── backend/            # Updated Python agent (includes src/agent.py with ordering tools, catalog.json, orders/ JSON files)
│   │   └── orders/         # Sample order JSONs (e.g., order_20251128_143022.json with cart/items/total)
│   ├── frontend/           # Updated Next.js UI (QuickBasket-themed)
│   ├── LICENSE             # MIT License for Day 7
│   ├── README.md           # Day 7 details and setup
│   └── start_app.sh        # Convenience script for Day 7
├── .gitignore              # Global Git ignores (e.g., .env.local, node_modules)
└── README.md               # This main file!
```

### Backend
The backend is based on [LiveKit's agent-starter-python](https://github.com/livekit-examples/agent-starter-python) with modifications to integrate **Murf Falcon TTS** for ultra-fast, high-quality voice synthesis.  
**Features:**
- Complete voice AI agent framework using LiveKit Agents.
- Murf Falcon TTS integration for fastest text-to-speech.
- LiveKit Turn Detector for contextually-aware speaker detection.
- Background voice cancellation.
- Integrated metrics and logging.
- Complete test suite with evaluation framework.
- Production-ready Dockerfile.  
[→ Backend Documentation](./Day-1/backend/README.md) (Applies to daily backends; Day-2 has barista-specific updates in `src/agent.py`; Day-3 adds wellness persistence in `records/`; Day-4 adds multi-voice tutor system in `shared-data/`; Day-5 adds SDR FAQ/lead tools in `leads/`; Day-6 adds fraud DB load/update in `fraud_database/`; Day-7 adds ordering catalog/cart tools in `orders/`).

### Frontend
The frontend is based on [LiveKit's agent-starter-react](https://github.com/livekit-examples/agent-starter-react), providing a modern, beautiful UI for interacting with your voice agents.  
**Features:**
- Real-time voice interaction with LiveKit Agents.
- Camera video streaming support.
- Screen sharing capabilities.
- Audio visualization and level monitoring.
- Light/dark theme switching.
- Highly customizable branding and UI.  
[→ Frontend Documentation](./Day-1/frontend/README.md) (Applies to daily frontends).

## Quick Start
### Prerequisites
Make sure you have the following installed:
- Python 3.9+ with [uv](https://docs.astral.sh/uv/) package manager.
- Node.js 18+ with pnpm.
- [LiveKit CLI](https://docs.livekit.io/home/cli/cli-setup) (optional but recommended).
- [LiveKit Server](https://docs.livekit.io/home/self-hosting/local/) for local development.

### 1. Clone the Repository
```bash
git clone https://github.com/Jagan515/Murf-AI-10-Days-Challenge.git
cd Murf-AI-10-Days-Challenge
```

### 2. Backend Setup (Per Day)
```bash
cd Day-*/backend  # e.g., Day-7/backend
# Install dependencies
uv sync
# Copy environment file and configure
cp .env.example .env.local
# Edit .env.local with your credentials:
# - LIVEKIT_URL
# - LIVEKIT_API_KEY
# - LIVEKIT_API_SECRET
# - MURF_API_KEY (for Falcon TTS)
# - GOOGLE_API_KEY (for Gemini LLM)
# - DEEPGRAM_API_KEY (for Deepgram STT)
# Download required models
uv run python src/agent.py download-files
```
For LiveKit Cloud users, you can automatically populate credentials:
```bash
lk cloud auth
lk app env -w -d .env.local
```

### 3. Frontend Setup (Per Day)
```bash
cd Day-*/frontend  # e.g., Day-7/frontend
# Install dependencies
pnpm install
# Copy environment file and configure
cp .env.example .env.local
# Edit .env.local with the same LiveKit credentials
```

### 4. Run the Application
#### Install LiveKit Server
```bash
brew install livekit
```

You have two options:
#### Option A: Use the Convenience Script (Runs Everything)
```bash
# From a daily root (e.g., Day-7/)
chmod +x start_app.sh
./start_app.sh
```
This will start:
- LiveKit Server (in dev mode).
- Backend agent (listening for connections).
- Frontend app (at http://localhost:3000).

#### Option B: Run Services Individually
```bash
# Terminal 1 - LiveKit Server
livekit-server --dev
# Terminal 2 - Backend Agent
cd Day-*/backend
uv run python src/agent.py dev
# Terminal 3 - Frontend
cd Day-*/frontend
pnpm dev
```
Then open http://localhost:3000 in your browser!

## Daily Challenge Tasks
Each day, you'll receive a new task that builds upon your voice agent. The tasks will help you:
- Implement different personas and conversation styles.
- Add custom tools and capabilities.
- Integrate with external APIs.
- Build domain-specific agents (customer service, tutoring, etc.).
- Optimize performance and user experience.  
**Stay tuned for daily task announcements!** See `Day-2/challenges/` for official MDs.

## Documentation & Resources
- [Murf Falcon TTS Documentation](https://murf.ai/api/docs/text-to-speech/streaming).
- [LiveKit Agents Documentation](https://docs.livekit.io/agents).
- [Original Backend Template](https://github.com/livekit-examples/agent-starter-python).
- [Original Frontend Template](https://github.com/livekit-examples/agent-starter-react).

## Testing
The backend includes a comprehensive test suite:
```bash
cd Day-*/backend
uv run pytest
```
Learn more about testing voice agents in the [LiveKit testing documentation](https://docs.livekit.io/agents/build/testing/).

## Contributing & Community
This is a challenge repository, but we encourage collaboration and knowledge sharing!
- Share your solutions and learnings on GitHub.
- Post about your progress on LinkedIn (tag @Murf AI with #MurfAIVoiceAgentsChallenge #10DaysofAIVoiceAgents).
- Join the [LiveKit Community Slack](https://livekit.io/join-slack).
- Connect with other challenge participants.

## License
This project is based on MIT-licensed templates from LiveKit and includes integration with Murf Falcon. See individual LICENSE files in daily folders for details.

## Have Fun!
Remember, the goal is to learn, experiment, and build amazing voice AI agents. Don't hesitate to be creative and push the boundaries of what's possible with Murf Falcon and LiveKit!  
Good luck with the challenge—I'm on Day 8 next! ☕🎙️

---

*Built for the AI Voice Agents Challenge by murf.ai. My fork updated on November 28, 2025.*