# Voice E-Commerce Agent - Day 9: Agentic Commerce Protocol (ACP) Implementation

## Overview

This project implements a voice-driven shopping assistant using LiveKit Agents, inspired by the **Agentic Commerce Protocol (ACP)**. The agent simulates a lite version of ACP by separating conversation logic (LLM + voice) from commerce logic (product catalog management and order creation). Users can browse a small product catalog via voice commands, search/filter products, place orders, and view order history—all persisted in JSON files.

Key features:
- **Voice Interaction**: Powered by Deepgram (STT), Google Gemini (LLM), and Murf TTS (voice: Ken for natural conversation).
- **ACP-Inspired Flow**: User intent → Tool calls for catalog browse/order creation → Structured JSON responses.
- **Backend Persistence**: Products in `ecommerce_products/products.json`; Orders in `ecommerce_data/orders.json`.
- **No Real Payments**: Orders are simulated and confirmed via voice/UI logs.

This meets the **Primary Goal** of Day 9 in the Murf AI Voice Agent Challenge: voice browsing, ordering, and persistence. Advanced elements include user preferences tracking, product suggestions, and basic filtering.

Built with:
- **LiveKit Agents**: For real-time voice pipeline.
- **Murf Falcon TTS**: Fastest TTS for engaging responses (mentioned in challenge).
- **Python 3.x**: Backend logic.

## Quick Start

### Prerequisites
- Python 3.10+.
- API Keys: Set in `.env.local`:
  ```
  LIVEKIT_URL=your_livekit_url
  LIVEKIT_API_KEY=your_api_key
  LIVEKIT_API_SECRET=your_secret
  DEEPGRAM_API_KEY=your_deepgram_key
  GOOGLE_API_KEY=your_google_key  # For Gemini LLM
  MURF_API_KEY=your_murf_key
  ```
- Install dependencies:
  ```
  pip install livekit-agents livekit-plugins-deepgram livekit-plugins-google livekit-plugins-murf livekit-plugins-silero livekit-plugins-noise-cancellation python-dotenv
  ```

### Setup
1. Clone or create the project structure:
   ```
   backend/
   ├── agent.py          # Main agent code (provided)
   ├── .env.local        # API keys
   ├── ecommerce_data/   # Orders JSON (auto-created)
   └── ecommerce_products/
       └── products.json # Catalog (auto-created with defaults)
   ```

2. Run the agent:
   ```
   python agent.py
   ```
   - This starts the LiveKit worker. Logs will show prewarming (VAD model, catalog load).

3. Connect via Browser:
   - Open `http://localhost:8080` (or your LiveKit room URL).
   - Join the voice room, grant mic access.
   - Speak to interact (e.g., "Show me mugs").

### Testing the Agent
1. **Browse Products**:
   - Say: "Show me all coffee mugs."
   - Agent: Lists matching products (e.g., "Stoneware Coffee Mug - ₹800 | Rating: ⭐⭐⭐⭐☆").

2. **Search & Filter**:
   - Say: "Find black hoodies under 2500."
   - Agent: Filters and summarizes 2-4 items with IDs.

3. **Place Order**:
   - Say: "Buy the Classic Black Hoodie, ID hoodie-001, quantity 1."
   - Agent: Confirms details, creates order, updates stock, saves to JSON.

4. **View Order**:
   - Say: "What did I just buy?"
   - Agent: Reads back order ID, items, total.

5. **Suggestions**:
   - Say: "Recommend something."
   - Agent: Suggests based on preferences (tracks recent searches/categories).

### Data Files
- **products.json**: Auto-generated with 8 sample products (mugs, t-shirts, hoodies, notebooks, laptop bags). Schema:
  ```json
  {
    "id": "mug-001",
    "name": "Stoneware Coffee Mug",
    "description": "...",
    "price": 800,
    "currency": "INR",
    "category": "mugs",
    "tags": ["coffee", "ceramic"],
    "in_stock": true,
    "stock_quantity": 45,
    "rating": 4.5,
    "images": ["mug-001-1.jpg"]
  }
  ```
- **orders.json**: Appends orders. Schema:
  ```json
  {
    "id": "ORD-20241130-143022-1234",
    "items": [{"product_id": "mug-001", "quantity": 1, "unit_price": 800}],
    "total": 800,
    "currency": "INR",
    "created_at": "2024-11-30T14:30:22",
    "status": "confirmed"
  }
  ```

## Architecture

### Core Components
1. **ProductManager Class** (ACP-Inspired Merchant Layer):
   - Loads/saves catalog from JSON.
   - `search_products(query, filters)`: Relevance-scored search (tags, description, etc.).
   - `get_product_by_id(id)`: Retrieve single product.
   - `update_stock(id, qty)`: Decrements stock, sets out-of-stock if zero.

2. **EcommerceAgent Class** (Voice Conversation Layer):
   - Inherits `livekit.agents.Agent`.
   - Tools (function calls):
     - `list_products(category, max_price, color, brand)`: Filtered browse.
     - `search_products(query)`: Keyword search.
     - `create_order(product_id, quantity)`: Creates/persists order.
     - `get_last_order()`: Summarizes recent order.
     - `get_product_details(id)`: Full product info.
     - `browse_categories()`: Lists categories with counts.
     - `suggest_products()`: Personalized recs (uses session prefs).
   - Session State: Tracks cart (unused in primary), preferences, current products.

3. **Pipeline**:
   - **STT**: Deepgram Nova-2 (real-time transcription).
   - **LLM**: Google Gemini 2.0 Flash (handles intent, tool calls).
   - **TTS**: Murf (Ken voice, conversational style).
   - **Turn Detection**: Multilingual VAD + Silero.
   - **Noise Cancellation**: BVC for clear audio.

### ACP Alignment (Lite)
- **Intent Interpretation**: LLM parses voice (e.g., "buy black hoodie" → `create_order`).
- **Structured Commerce**: Tools return JSON-like responses; orders use line_items, totals.
- **Separation**: No commerce logic in prompts—pure tool calls.
- **Persistence**: File-based (simulates merchant DB).

### Session Flow
1. Greeting: "Namaste! ... What would you like to browse?"
2. Browse/Search → Tool call → Voice summary (2-4 products).
3. Order: Resolve ID/quantity → Confirm → Persist.
4. History: Recall last order.

## Advanced Features Implemented
- **User Preferences**: Tracks categories/searches for suggestions.
- **Relevance Scoring**: Search ranks by matches + ratings.
- **Stock Management**: Orders reduce inventory.
- **Error Handling**: Graceful fallbacks (e.g., out-of-stock).
- **Logging**: User/agent speech, metrics (tokens/latency).

Not implemented (for future):
- Multi-item cart/checkout.
- HTTP endpoints for UI "Buy" buttons.
- Full ACP schemas (e.g., buyer info, statuses).

## Demo Video
[Embed or link to LinkedIn video: 1-min clip showing voice browse → order → JSON confirmation.]

## Challenge Context
Part of the **Murf AI Voice Agent Challenge** (#10DaysofAIVoiceAgents). Built using the fastest TTS API - **Murf Falcon** for natural, low-latency voice. Tagged @MurfAI. #MurfAIVoiceAgentsChallenge

## Troubleshooting
- **No Voice Response**: Check mic access, API keys, logs for STT errors.
- **Tool Failures**: Verify JSON files; restart to reload catalog.
- **High Latency**: Reduce `preemptive_generation` or check quotas.
- **Logs**: Run with `DEBUG=true` in env for verbose output.

## Future Enhancements
- Integrate FastAPI for ACP endpoints (Advanced Goal 1).
- Add cart ops (Advanced Goal 3).
- UI product grid with buy buttons.

## License
MIT. Inspired by LiveKit docs and ACP spec.

---

*Built on November 30, 2025. Questions? Reach out!*