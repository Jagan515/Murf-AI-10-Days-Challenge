# Simple FAQ SDR + Lead Capture for Jar

[![Murf AI Voice Agent Challenge](https://img.shields.io/badge/Murf%20AI-Voice%20Agent%20Challenge-blueviolet)](https://www.murf.ai/)  
**Day 5 of the 10 Days of AI Voice Agents Challenge** – Built with [LiveKit Agents](https://docs.livekit.io/agents/) and the fastest TTS API, [Murf Falcon](https://www.murf.ai/).

## Overview

This is a **voice-based Sales Development Representative (SDR) agent** for **Jar**, India's leading micro-savings app that turns spare change into digital gold investments. The agent warmly engages users, answers FAQs on Jar's features/pricing using pre-loaded content, qualifies leads by collecting key details naturally, and wraps up with a verbal summary while persisting data to JSON. It's designed for short, focused calls (2-3 mins) to nurture potential customers without pressure.

- **Persona**: Friendly, knowledgeable SDR – greets, discovers needs, answers queries, captures leads, and closes positively.
- **Company Focus**: Jar enables effortless savings starting at ₹1 in 24K digital gold, with auto-invest from transactions. Backed by vaults from Augmont, MMTC-PAMP, SafeGold.
- **Ethical Note**: No hard sells; focuses on value and consent for lead capture. Avoids unsubstantiated claims.

Built for the **Murf AI Voice Agent Challenge** – check out my [LinkedIn post](https://www.linkedin.com/posts/YOUR_POST_HERE) with a demo video! (Watch the agent handle a FAQ + lead qual in real-time.)

## Features

- **Warm Greeting & Discovery**: Starts with "Hi! I'm Alex from Jar – how can I help with your savings today?" Probes: "What brought you here?" to uncover needs.
- **FAQ Handling**: Answers product/company/pricing questions via simple keyword search on loaded JSON (e.g., "What is digital gold?" → Explains 99.9% pure, start at ₹1).
- **Lead Capture**: Asks progressively: Name? Company/Role? Email? Use case? Team size? Timeline? (e.g., "now/soon/later"). Stores in JSON on response.
- **End-of-Call Summary**: Detects wrap-up phrases ("That's all", "Thanks"), recaps verbally ("Sounds like you're building a team savings program at XYZ – I'll email details!"), and saves full lead JSON.
- **Voice-Optimized**: Murf Falcon TTS (en-US-alicia for warm, conversational tone) + Deepgram STT + Gemini LLM. Pre-warms FAQ for low latency.
- **Persistence**: Leads saved to `leads/lead_{timestamp}.json` for follow-up (e.g., CRM export).

### Loaded FAQ Content (from Jar's Official Sources)
Pre-loaded as JSON in `shared-data/jar_faq.json` (sourced from [Jar Blog](https://www.myjar.app/blog/frequently-asked-questions-about-digital-gold)):

```json
[
  {
    "question": "What is Digital Gold?",
    "answer": "Digital Gold is the modern way of buying Gold through online channels without physically holding Gold. For every gram of Gold you buy, there is actual 24k Gold stored in a locker in your name by one of the three Gold banks in India - Augmont, MMTC - PAMP and SafeGold. There is also no minimum purchase requirement for Digital Gold. You can begin with as little as ₹1 and work your way up."
  },
  {
    "question": "Where to buy Digital Gold?",
    "answer": "One can buy Digital Gold from any registered apps and intermediaries like PayTM, PhonePe, Google Pay, etc. It can also be bought from Jar App for as low as ₹1. Without KYC, Digital Gold can be purchased, but only up to a specific quantity, depending on the platform. Some popular apps allow you to buy Gold worth up to ₹50,000 without having to go through a KYC process, like Jar."
  },
  {
    "question": "What are the advantages and disadvantages of Digital Gold?",
    "answer": "Advantages: Digital Gold is simple to keep track of and is accessible at any time. It has a high level of liquidity and is available for purchase 24 hours a day, 7 days a week, 365 days a year, including holidays. Gold is seen as an inflation hedge and can be used as collateral for loans. For the past 92 years, Gold prices have been rising YoY. Disadvantages: It does not provide any passive income, i.e., you do not earn interest on your investment. Digital Gold is not subject to SBI or SEBI laws. On many partner sites, the maximum amount of Gold that may be invested is Rs. 2 lakh. Holding businesses charge a tiny management fee for holding your Digital Gold while it is being delivered."
  },
  {
    "question": "How to buy Digital Gold?",
    "answer": "Go to any Gold-investment platform, such as Jar, Paytm, Kalyan Jewellers, PhonePe, Google Pay, and so on. Select the ‘Gold locker/vault’ option. Enter the amount you would like to invest in Digital Gold. The price of Digital Gold is dependent on market fluctuations, so one can buy it at a fixed rate provided by the intermediary or buy Digital Gold by weight. Make payment using a debit or credit card, net banking, or simply from your wallet. The amount of Gold credited will be instantaneously updated, and your Digital Gold will be held in a vault that is 100% insured. Instantly sell or purchase Digital Gold. Investors can receive their Digital Gold in the form of bullions or coins, depending on their preference. Many Digital Gold intermediaries have a delivery limit and charge a fee for exceeding it."
  },
  {
    "question": "Why should I invest in Digital Gold?",
    "answer": "Investment Size: Investing in Digital Gold is quite affordable, and you can buy and sell it for as little as ₹1. Storage and Safety: Digital Gold has no storage or security issues. Every gram of Gold in your account is backed by genuine physical Gold held in a safe vault by the seller in your name. High Liquidity: Gold is the most liquid commodity. Digital Gold can be bought and sold anywhere and anytime. Trading: Digital Gold may be bought and sold online in a few simple steps at any time and from anywhere. Money is deposited straight into your bank account or registered wallet. Pure Gold with No Hidden Fees: Digital Gold only allows you to deal in pure Gold, i.e. 24 carat Gold. Only Gold is used to invest the complete amount you spend. When you make a purchase, you simply have to pay 3% GST. Security: For every gram of Gold you purchase, genuine 24k Gold is held in a locker in your name by one of India's three Gold banks: Augmont, MMTC PAMP and SafeGold."
  },
  {
    "question": "What if I lose your smartphone, will my Gold disappear?",
    "answer": "Nope! Digital Gold is also registered in your name, just like stocks on the stock exchange. It's kept safe in vaults that are insured and monitored by a third-party trustee. This ensures that your Gold is safe, even if the app from which you purchased is no longer available or you lose your smartphone."
  },
  {
    "question": "Who should buy Digital Gold?",
    "answer": "Digital Gold is an option for anyone who cannot afford to buy physical gold or invest large quantities of money in the yellow metal at one time. Digital gold has a purity of 99.9% and can be purchased for as little as 1 using the Jar App, which eliminates the need to store it safely. You only need your phone and the Jar App to get started. Jar also allows you to set up auto-investing."
  },
  {
    "question": "How much tax do I have to pay on the sale of Digital Gold?",
    "answer": "Any earnings from the sale of your Gold assets within three years of the date of purchase will be deemed Short-Term Capital Gains (STCG). It will essentially be added to your annual income, and you will be required to pay tax on the highest income tax bracket in which your income falls. The earnings from the sale of your jewellery, gold coins, or digital gold after three years or longer from the date of purchase will be categorised as Long-Term Capital Gains (LTCG). Long-term capital gains on the sale of gold assets are taxed at 20%, plus a surcharge and an education cess, if applicable."
  }
]
```

**Pricing Highlights** (Integrated into FAQ tool):
- Minimum Investment: ₹1.
- Fees: 3% GST on purchase; small management fee for storage/delivery (platform-dependent).
- No hidden fees on core buys; liquidity 24/7.

### Data Schema (`leads/lead_{timestamp}.json`)
Human-readable lead entries:
```json
{
  "timestamp": "2025-11-26T10:00:00Z",
  "name": "Jane Smith",
  "company": "FinTech Inc.",
  "email": "jane@fintech.com",
  "role": "CFO",
  "use_case": "Corporate employee savings via digital gold",
  "team_size": "200+",
  "timeline": "soon",
  "summary": "Mid-sized fintech exploring team micro-savings; interested in auto-invest features. Follow up via email."
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
5. Connect via [LiveKit Browser Demo](https://meet.livekit.io/) (Jar-themed UI at http://localhost:3000).

### Usage
- **Start Chat**: Agent greets and asks needs.
- **Ask FAQ**: "What does Jar do?" → "Jar turns your spare change into 24K digital gold – start with just ₹1!"
- **Lead Qual**: Shares details naturally (e.g., "I'm from ABC Corp, looking for team savings.").
- **Wrap Up**: "Thanks, that's all" → Verbal recap + JSON save.
- Check `leads/` post-call.

## Testing
- **Voice Commands**:
  - Greeting: "Hi!" → Warm intro.
  - FAQ: "Pricing for digital gold?" → ₹1 min, 3% GST.
  - Lead: "My name is Test User, email test@example.com, role Manager, company TestCo, use case personal savings, team 10, timeline now."
  - End: "I'm done" → Summary & save.
- **Multi-Turn**: Test drift (e.g., off-topic) – agent steers back politely.
- **Verify JSON**: Open `leads/lead_*.json` – should capture all fields.
- **Edge Cases**: No email? Agent follows up gently. Invalid query? "Let me check our FAQs..."

## Advanced Goals (Optional)
- **RAG Integration**: Use vector search (e.g., from LiveKit RAG example) for dynamic FAQ matching.
- **CRM Handoff**: MCP to Zapier/Salesforce for real lead export.
- **Analytics**: Track call duration/lead quality in JSON aggregates.

## Architecture
- **Backend**: `src/agent.py` – SDR system prompt, `find_faq` tool (keyword match on JSON), `save_lead` tool (JSON append). Pre-loads FAQ via `prewarm`.
- **Frontend**: Jar-themed (gold gradients, savings icons) – updated welcome/transcript for financial trust (e.g., yellow-gold buttons, "Start Saving with Jar").
- **Flow**: Greeting → Needs probe → FAQ/Qualify loop → Detect end → Summary + persist.

## Contributing / Challenge Notes
Part of the **Murf AI Voice Agent Challenge** – using Murf Falcon for ultra-fast, natural TTS in sales convos. Days 1-4: Basic to wellness/tutor agents; Day 5: This SDR for Jar (inspired by micro-savings trend). Follow for Days 6-10!

Tag [@MurfAI](https://www.linkedin.com/company/murf-ai/) on LinkedIn. Hashtags: #MurfAIVoiceAgentsChallenge #10DaysofAIVoiceAgents

## License
MIT – Free to use/modify. Questions? Open an issue.

---

*Built with ❤️ for smarter sales. Last updated: Nov 26, 2025.*