# Voice Bollywood Improv Agent - Day 10: Improv Battle with Desi Masala! 🎭🇮🇳🎙️

## Overview

This project implements **"Bollywood Improv Dhamaka"**, a voice-first improv game show for the **Day 10: Voice Improv Battle** in the Murf AI Voice Agent Challenge. Drawing from the single-player "Improv Battle" concept, it transforms users into Bollywood superstars through 3 rounds of hilarious, culturally infused improv. The AI host, **Raj "Masala King" Kapoor**, delivers high-energy Hinglish banter, sets desi scenarios (e.g., a chaiwala sparking romance or a dabbawala's mix-up), and provides varied, realistic reactions—mixing praise ("Waah! Blockbuster!"), critique ("Thoda aur tadka chahiye!"), and scores for "masala points."

Key features:
- **Improv Flow**: Intro → Name setup → 3 rounds (scenario → user performance → host reaction) → Dramatic finale with rating (Superstar 🌟 to Rising Star ✨).
- **Cultural Twist**: Indian-themed scenarios, Hinglish prompts (60% English, 40% Hindi), Bollywood references (SRK dialogues, filmy tadka).
- **Voice Pipeline**: Murf Falcon TTS with Indian-accented voices (e.g., hi-IN-Shaan for drama), Deepgram STT, Google Gemini LLM (temp=0.8 for creativity).
- **State & Persistence**: Tracks phases, moods, scores; saves full sessions to JSON (e.g., `bollywood_game_20251201_143022.json`).
- **No Multi-Player (Primary Goal Focus)**: Single-player for simplicity; advanced multi-relay ready via LiveKit rooms.

Built with LiveKit Agents for real-time voice, emphasizing fun, unpredictability, and low-latency interactions. Meets the **Primary Goal**: Browser join, host persona, state management, scenario generation, varied reactions, and graceful close.

## Quick Start

### Prerequisites
- Python 3.10+.
- API Keys in `.env.local`:
  ```
  LIVEKIT_URL=your_livekit_url
  LIVEKIT_API_KEY=your_api_key
  LIVEKIT_API_SECRET=your_secret
  DEEPGRAM_API_KEY=your_deepgram_key
  GOOGLE_API_KEY=your_google_key  # For Gemini LLM
  MURF_API_KEY=your_murf_key
  ```
- Install deps:
  ```
  pip install livekit-agents livekit-plugins-deepgram livekit-plugins-google livekit-plugins-murf livekit-plugins-silero livekit-plugins-noise-cancellation python-dotenv
  ```

### Setup & Run
1. Save the code as `agent.py`.
2. Run: `python agent.py`.
   - Prewarms VAD, checks APIs, loads scenarios to `improv_data/bollywood_scenarios.json`.
3. Browser: Open LiveKit room URL (e.g., `http://localhost:8080`), grant mic.
4. Play: Speak to start—Raj greets in Hinglish, ask name, then "Start round" for improv!

### Testing
- **Full Session**: Say "Namaste" → Give name → "Start round" → Improv (e.g., act out scenario) → "End scene" → Hear reaction/score.
- **Edge**: Say "Stop game" for early exit.
- Logs: Colorful Bollywood-themed output (e.g., 🎭 INFO: Host Raj: 'Waah!').
- JSON: Check `improv_data/` for saves (player, rounds, masala score, duration).

## Architecture

### Core Components
1. **BollywoodImprovAgent Class** (Improv Host Layer):
   - **State**: `game_state` dict (player_name, current_round, phase, masala_score, mood, rounds[]).
   - **Tools** (Function Calls):
     - `set_player_name(name)`: Hinglish welcome.
     - `start_round()`: Random desi scenario (10 defaults, e.g., Mumbai chaiwala romance).
     - `react_to_performance(performance)`: Varied feedback (superhit/hit/average), adds masala points (5-10), mood shifts.
     - `end_game()`: Summary rating, strengths (e.g., "Dialogue delivery SRK jaisi!"), saves JSON.
   - **Persona Prompt**: Over-the-top host with Hinglish, Bollywood phrases ("Arey waah!", "Picture abhi baaki hai!"), endearments ("jaaneman").

2. **Voice Pipeline**:
   - **STT**: Deepgram Nova-2 (real-time, multilingual for Hinglish).
   - **LLM**: Gemini 2.0 Flash (temp=0.8 for creative reactions).
   - **TTS**: Murf Falcon (dynamic voices: hi-IN-Shaan for drama, en-US-Naomi for warmth; style="Conversation").
   - **Turns**: MultilingualModel + Silero VAD; preemptive=True for snappy host responses.
   - **Noise**: BVC cancellation.

3. **Data Flow**:
   - Scenarios: Loaded/saved to JSON; random per round, avoids repeats.
   - Reactions: Randomized styles (dramatic/enthusiastic), constructive mix (praise 60%, critique 40%).
   - Exit: Phase="done" triggers finale; early stop via phrases.

### Game Phases
- **Intro**: Greeting, name setup.
- **Awaiting_Improv**: Scenario prompt → User acts.
- **Reacting**: Feedback, score, next round.
- **Done**: Verdict, sign-off ("Yeh raha aapka host... Picture abhi baaki hai!").

## Advanced Features Implemented
- **Varied Realism**: Random moods/tones; feedback draws from performance text.
- **Cultural Depth**: 10+ Indian scenarios; Hinglish phrases; voice mood-switching.
- **Debugging**: Event listeners (user_speech, agent_speech, errors); fallback TTS.
- **Persistence**: Timestamped JSON with duration, notes—easy for replays/analysis.
- **Error Handling**: API checks, tracebacks, rate-limit tips.

Not implemented (future): Multi-player relay (Goal 1), UI scoreboard (Goal 2)—focused on primary single-player polish.

## Demo Video
[Embed or link: 1-min clip of Hinglish intro → improv round → masala score → JSON save.]

## Challenge Context
Finale of the **Murf AI Voice Agent Challenge** (#10DaysofAIVoiceAgents). Powered by **Murf Falcon**—the fastest TTS API—for instant, expressive desi voices. Tagged @MurfAI. #MurfAIVoiceAgentsChallenge

## Troubleshooting
- **No Hinglish Response**: Check Murf key; test with en-US fallback.
- **Voice Lag**: Lower temp=0.7; ensure quiet mic.
- **Scenario Repeats**: Edit `bollywood_scenarios.json`.
- **Logs**: Run with `DEBUG=true` for emojis/tracebacks.

## Future Enhancements
- Multi-player rooms for relay improv.
- React UI with name input/score display.
- More voices/styles via Murf.

## License
MIT. Inspired by LiveKit docs and improv theater.

---

*Built on December 01, 2025. Arre waah—what a dhamaka! Questions? Let's improvise.*