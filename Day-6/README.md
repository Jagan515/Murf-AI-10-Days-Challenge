# Fraud Alert Voice Agent for State Bank of India

[![Murf AI Voice Agent Challenge](https://img.shields.io/badge/Murf%20AI-Voice%20Agent%20Challenge-blueviolet)](https://www.murf.ai/)  
**Day 6 of the 10 Days of AI Voice Agents Challenge** – Built with [LiveKit Agents](https://docs.livekit.io/agents/) and the fastest TTS API, [Murf Falcon](https://www.murf.ai/).

## Overview

This is a **professional fraud alert voice agent** for **State Bank of India (SBI)**, designed to handle suspicious transaction verifications securely and reassuringly. It loads pending fraud cases from a JSON "database", verifies the customer via a pre-stored security question, describes the transaction, confirms legitimacy, and updates the case status (safe/fraudulent/failed). All with calm, Indian-English delivery (e.g., "Namaste!" greetings). Sessions are short (1-2 mins) and use fake data only – no real sensitive info requested.

- **Persona**: Empathetic SBI fraud rep – professional, patient, multilingual touches (Hindi words like "Dhanyavaad").
- **Bank Focus**: Fictional SBI setup; verifies masked cards, explains actions (e.g., "Card blocked, new one in 3-5 days").
- **Ethical Guardrails**: Fake data; no PINs/cards asked; ends calls politely; logs outcomes for demo.

Built for the **Murf AI Voice Agent Challenge** – check out my [LinkedIn post](https://www.linkedin.com/posts/YOUR_POST_HERE) with a demo video! (See safe/fraud/failed flows + DB updates.)

## Features

- **Auto-Load Fraud Case**: On session start, asks for name → Loads matching case from JSON DB.
- **Secure Verification**: Poses pre-stored security Q (e.g., "Mother's maiden name?") – only proceeds if correct.
- **Transaction Narration**: Reads details calmly: "₹18,245 at International Electronics (aliexpress.com) on 2024-01-15 14:30 from Shenzhen."
- **Binary Confirmation**: "Did you authorize?" → Branches: Yes (safe, reassure) / No (fraud, mock block/dispute).
- **Status Update**: Writes back to DB: `confirmed_safe`/`confirmed_fraud`/`verification_failed` + outcome note/timestamp.
- **Voice Polish**: Murf Falcon TTS (en-US-alicia for warm tone) + Deepgram STT + Gemini LLM. Multilingual turn detection.
- **Persistence**: Overwrites JSON entry; console logs for debugging (e.g., "Updated: confirmed_safe").

### Sample Fraud Database (`fraud_database/fraud_cases.json`)
Pre-created with 5 fake Indian customer cases (sourced from mock data; inspired by common fraud patterns):

```json
{
  "fraud_cases": [
    {
      "userName": "Rahul Sharma",
      "securityIdentifier": "12345",
      "cardEnding": "4242",
      "case": "pending_review",
      "transactionName": "International Electronics",
      "transactionTime": "2024-01-15 14:30:00",
      "transactionCategory": "e-commerce",
      "transactionSource": "aliexpress.com",
      "amount": "₹18,245",
      "location": "Shenzhen, China",
      "securityQuestion": "What is your mother's maiden name?",
      "securityAnswer": "patel",
      "outcome": "",
      "callTimestamp": ""
    },
    {
      "userName": "Priya Singh",
      "securityIdentifier": "67890",
      "cardEnding": "5678",
      "case": "pending_review",
      "transactionName": "Dubai Luxury Mall",
      "transactionTime": "2024-01-15 16:45:00",
      "transactionCategory": "retail",
      "transactionSource": "dubailuxury.ae",
      "amount": "₹92,500",
      "location": "Dubai, UAE",
      "securityQuestion": "What was the name of your first school?",
      "securityAnswer": "kendriya",
      "outcome": "",
      "callTimestamp": ""
    },
    {
      "userName": "Arjun Kumar",
      "securityIdentifier": "54321",
      "cardEnding": "9876",
      "case": "pending_review",
      "transactionName": "Premium Tech Store",
      "transactionTime": "2024-01-15 18:20:00",
      "transactionCategory": "electronics",
      "transactionSource": "premiumtech.com",
      "amount": "₹67,999",
      "location": "Singapore",
      "securityQuestion": "What is your birth city?",
      "securityAnswer": "delhi",
      "outcome": "",
      "callTimestamp": ""
    },
    {
      "userName": "Ananya Reddy",
      "securityIdentifier": "11223",
      "cardEnding": "3344",
      "case": "pending_review",
      "transactionName": "Online Gaming Purchase",
      "transactionTime": "2024-01-15 20:15:00",
      "transactionCategory": "entertainment",
      "transactionSource": "gameworld.com",
      "amount": "₹12,750",
      "location": "United States",
      "securityQuestion": "What is your favorite food?",
      "securityAnswer": "biryani",
      "outcome": "",
      "callTimestamp": ""
    },
    {
      "userName": "Vikram Mehta",
      "securityIdentifier": "44556",
      "cardEnding": "7788",
      "case": "pending_review",
      "transactionName": "Flight Booking",
      "transactionTime": "2024-01-15 22:30:00",
      "transactionCategory": "travel",
      "transactionSource": "quickflights.com",
      "amount": "₹45,320",
      "location": "London, UK",
      "securityQuestion": "What is your father's middle name?",
      "securityAnswer": "kumar",
      "outcome": "",
      "callTimestamp": ""
    }
  ]
}
```

### Data Schema (Updated Entries)
Post-call example (overwritten in place):
```json
{
  "userName": "Rahul Sharma",
  "securityIdentifier": "12345",
  "cardEnding": "4242",
  "case": "confirmed_safe",
  "transactionName": "International Electronics",
  "transactionTime": "2024-01-15 14:30:00",
  "transactionCategory": "e-commerce",
  "transactionSource": "aliexpress.com",
  "amount": "₹18,245",
  "location": "Shenzhen, China",
  "securityQuestion": "What is your mother's maiden name?",
  "securityAnswer": "patel",
  "outcome": "Customer confirmed transaction as legitimate",
  "callTimestamp": "2025-11-27T10:15:00Z"
}
```

## Quick Start

### Prerequisites
- Python 3.10+.
- [LiveKit CLI](https://docs.livekit.io/getting-started/create-room/#install-the-cli).
- API Keys in `.env.local`:
  ```
  LIVEKIT_URL=your_livekit_url
  LIVEKIT_API_KEY=your_api_key
  LIVEKIT_API_SECRET=your_api_secret
  DEEPGRAM_API_KEY=your_deepgram_key
  GOOGLE_API_KEY=your_google_key  # For Gemini
  MURF_API_KEY=your_murf_key
  ```
- Install: `pip install -r requirements.txt` (or `livekit-agents[murf,deepgram,google,silero]`).

### Setup
1. Clone/Fork this repo.
2. Create `.env.local` with keys.
3. Run agent: `python src/agent.py`.
4. Start room: `lk room create --num-participants 2`.
5. Connect via [LiveKit Browser Demo](https://meet.livekit.io/) (SBI-themed UI at http://localhost:3000).

### Usage
- **Session Start**: Agent greets: "Namaste! SBI Fraud Dept... Your full name?"
- **Verification**: Say name (e.g., "Rahul Sharma") → Q: "Mother's maiden name?" → "Patel".
- **Review**: Agent reads tx: "₹18,245 at International Electronics... Authorize?"
- **Confirm**: "Yes" → Safe, ends. "No" → Fraud, mock actions.
- **Check DB**: Post-session, view `fraud_database/fraud_cases.json` for updates.

## Testing
- **Voice Commands** (Test all flows):
  - **Safe**: Name: "Rahul Sharma"; Answer: "patel"; Tx: "Yes/Haan" → Logs: "confirmed_safe".
  - **Fraud**: Name: "Priya Singh"; Answer: "kendriya"; Tx: "No/Nahi" → Logs: "confirmed_fraud".
  - **Failed**: Wrong answer (e.g., "wrong") → "verification_failed"; Ends politely.
- **Multi-Turn**: Test drifts (e.g., "What's my balance?") – Steers back: "Focusing on this tx...".
- **Verify DB**: Open JSON – Status/outcome/timestamp updated? Console: "Updated fraud case...".
- **Edge Cases**: Unknown name → "No cases; call 1800-1234". Empty DB → Creates sample on first run.

## Advanced Goals (Optional)
- **Telephony Integration**: Route via LiveKit Telephony for real calls (Plivo/SIP trunk) – Same flow over phone.
- **Multi-Case**: Handle 2+ tx per call; DTMF for yes/no.
- **Ops Log**: Separate JSON for fraud ops (e.g., "dispute_raised").

## Architecture
- **Backend**: `src/agent.py` – FraudAgent class with tools (`find_fraud_case`, `verify_security_answer`, etc.). Pre-warms DB; JSON load/update funcs. SBI prompt with cases embedded.
- **Frontend**: SBI-themed (blue gradients, shield icons) – Updated welcome/transcript for trust (e.g., "Secure Fraud Check").
- **Flow**: Greeting → Name tool → Verify tool → Describe tool → Response tool → Update DB → End.

## Contributing / Challenge Notes
Part of the **Murf AI Voice Agent Challenge** – using Murf Falcon for reassuring, low-latency TTS in sensitive fraud flows. Days 1-5: Starter to SDR; Day 6: This SBI fraud bot (fake data for safety). Follow for Days 7-10!

Tag [@MurfAI](https://www.linkedin.com/company/murf-ai/) on LinkedIn. Hashtags: #MurfAIVoiceAgentsChallenge #10DaysofAIVoiceAgents

## License
MIT – Free to use/modify. Questions? Open an issue.

---

*Built with ❤️ for secure banking. Last updated: Nov 27, 2025.*