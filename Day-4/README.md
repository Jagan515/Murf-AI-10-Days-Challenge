# Active Recall Coach - Voice Learning Agent

[![Murf AI Voice Agent Challenge](https://img.shields.io/badge/Murf%20AI-Voice%20Agent%20Challenge-blueviolet)](https://www.murf.ai/)  
**Day 4 of the 10 Days of AI Voice Agents Challenge** – Built with [LiveKit Agents](https://docs.livekit.io/agents/) and the fastest TTS API, [Murf Falcon](https://www.murf.ai/).

## Overview

This is an **intelligent voice learning companion** that implements active recall and teaching techniques to help master programming concepts. Based on the principle that "the best way to learn is to teach," this agent guides users through three distinct learning modes with specialized Murf AI voices.

- **Core Flow**: Course selection → Learning mode choice → Concept explanation/quizzing/teaching → Progress tracking
- **Multi-Voice Design**: Different Murf Falcon voices for each learning mode (Matthew, Alicia, Ken)
- **Course System**: Extensible JSON-based content with Go programming and Data Structures & Algorithms courses
- **Active Learning**: Implements evidence-based Feynman technique and active recall methodology

Built for the **Murf AI Voice Agent Challenge** – check out my [LinkedIn post](https://www.linkedin.com/posts/YOUR_POST_HERE) with a demo video!

## Features

### Three Learning Modes
- **Learn Mode** 🎓 (Matthew voice): Clear, conversational explanations of programming concepts
- **Quiz Mode** ❓ (Alicia voice): Interactive questioning to test understanding and provide feedback
- **Teach Back Mode** 🗣️ (Ken voice): Users explain concepts back to reinforce learning with qualitative feedback

### Multi-Course System
- **Go Language Course**: Complete Go programming curriculum from basics to advanced concurrency (21 concepts)
- **DSA Course**: Comprehensive Data Structures & Algorithms covering arrays to dynamic programming (20 concepts)
- **Extensible Design**: Easy to add new courses via JSON files in `shared-data/` folder

### Voice-Optimized Experience
- **Real-time Voice Processing**: LiveKit-powered audio pipeline with Deepgram STT and Murf TTS
- **Natural Conversations**: Google Gemini LLM for contextual, flowing dialogues
- **Mode-Specific Voices**: Distinct vocal personalities for each learning approach

## Quick Start

### Prerequisites
- Python 3.10+
- [LiveKit CLI](https://docs.livekit.io/getting-started/create-room/#install-the-cli) installed
- API Keys: Set in `.env.local`:
  ```
  LIVEKIT_URL=your_livekit_url
  LIVEKIT_API_KEY=your_api_key
  LIVEKIT_API_SECRET=your_api_secret
  DEEPGRAM_API_KEY=your_deepgram_key
  GOOGLE_API_KEY=your_google_key  # For Gemini
  MURF_API_KEY=your_murf_key
  ```

### Setup
1. Clone/Fork this repo
2. Create `.env.local` with keys above
3. Run the agent: `python agent.py`
4. In another terminal, start a room: `lk room create --num-participants 2`
5. Connect via [LiveKit Browser Demo](https://meet.livekit.io/) (paste room URL/token)

### Usage
- **Start**: Agent greets and lists available courses
- **Course Selection**: *"I want to study DSA"* or *"Select the Go course"*
- **Mode Switching**: *"Switch to quiz mode"*, *"Let's try teach back"*
- **Concept Navigation**: *"I want to learn about goroutines"*, *"Quiz me on binary search trees"*

**Example Session:**
- Agent: "Welcome! I have two courses: go_course and dsa_course. Which would you like?"
- You: "Let's do DSA"
- Agent: "Great! Selected dsa_course with 20 concepts. Choose learn, quiz, or teach_back mode."
- You: "Switch to learn mode"
- Agent: "Switched to learn mode. Which concept would you like to learn about?"
- You: "Hash tables"
- Agent: (Matthew voice) "Hash tables store key-value pairs using hash functions to compute indexes..."

## Course Content Schema

### Course File Format (`shared-data/*.json`)
```json
[
  {
    "id": "concept-name",
    "title": "Concept Title",
    "summary": "Clear explanation for learn mode...",
    "sample_question": "Question for quiz and teach_back modes"
  }
]
```

### Available Courses
- **go_course.json**: Variables, Functions, Goroutines, Channels, Error Handling, etc. (21 concepts)
- **dsa_course.json**: Arrays, Trees, Graphs, Sorting, Dynamic Programming, etc. (20 concepts)

## Voice Configuration

| Mode | Murf Voice | Style | Role |
|------|------------|-------|------|
| Learn | Matthew | Conversation | Explanatory Tutor |
| Quiz | Alicia | Conversation | Engaging Quiz Master |
| Teach Back | Ken | Conversation | Constructive Coach |

## Testing
- **Multi-Course Testing**: Switch between Go and DSA courses in same session
- **Mode Transitions**: Test seamless switching between learn/quiz/teach_back
- **Concept Coverage**: Ensure all course concepts are accessible
- **Voice Consistency**: Verify correct Murf voices for each mode

## Advanced Goals (Optional Enhancements)
- **Concept Mastery Tracking**: Implement scoring system and progress analytics
- **Teach-Back Evaluator**: AI-powered feedback on user explanations
- **Learning Paths**: Structured progression from beginner to advanced concepts
- **Performance Analytics**: Track weakest concepts and suggest practice plans

To extend: Edit `TutorAgent` class in `agent.py` for new tools and enhanced learning features.

## Architecture
- **Backend**: `agent.py` – LiveKit JobContext → AgentSession → Multi-voice TTS pipeline
- **Content Management**: JSON-based course system in `shared-data/` directory
- **Voice Pipeline**: STT (Deepgram) → LLM (Google Gemini) → TTS (Murf AI) with mode-specific voices
- **Tool System**: Course selection, mode switching, and concept navigation functions

## Contributing / Challenge Notes
Part of the **Murf AI Voice Agent Challenge** – using Murf Falcon for ultra-fast, natural TTS with specialized voices for different learning contexts. Days 1-3: Basic agents and wellness companion; Day 4: Active Recall Coach with multi-voice learning. Follow for Days 5-10!

Tag [@MurfAI](https://www.linkedin.com/company/murf-ai/) on LinkedIn. Hashtags: #MurfAIVoiceAgentsChallenge #10DaysofAIVoiceAgents

## License
MIT – Free to use/modify. Questions? Open an issue.

---

*Built with ❤️ for effective learning. Last updated: Nov 23, 2025.*