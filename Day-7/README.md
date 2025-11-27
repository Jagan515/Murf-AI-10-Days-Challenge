# Food & Grocery Ordering Voice Agent for QuickBasket

[![Murf AI Voice Agent Challenge](https://img.shields.io/badge/Murf%20AI-Voice%20Agent%20Challenge-blueviolet)](https://www.murf.ai/)  
**Day 7 of the 10 Days of AI Voice Agents Challenge** – Built with [LiveKit Agents](https://docs.livekit.io/agents/) and the fastest TTS API, [Murf Falcon](https://www.murf.ai/).

## Overview

This is a **joyful food & grocery ordering voice agent** named **Priya** for **QuickBasket**, a fictional quick-commerce platform delivering groceries and prepared foods. It greets enthusiastically, helps browse/search catalog, adds items/quantities to a cart, handles "ingredients for X" requests by bundling recipes, manages cart ops (view/update/remove), and "places" orders by saving to JSON. Conversations feel like chatting with a helpful store assistant – warm, suggestive, and celebratory. Sessions are fun and efficient (2-4 mins).

- **Persona**: Energetic Priya – Indian-English with Hindi flair ("Achha!", "Shukriya!"), positive, remembers prefs, suggests complements.
- **Platform Focus**: QuickBasket – Fresh groceries/snacks/prepared food; prices in ₹; mock delivery in 30-45 mins.
- **Ethical Note**: No real payments; focuses on delightful UX.

Built for the **Murf AI Voice Agent Challenge** – check out my [LinkedIn post](https://www.linkedin.com/posts/YOUR_POST_HERE) with a demo video! (Watch adding a sandwich recipe, cart tweaks, and order save.)

## Features

- **Energetic Greeting & Discovery**: "Namaste! Welcome to QuickBasket! I'm Priya... What would you like to start with?" Probes needs, suggests categories.
- **Catalog Search/Browse**: Tools for searching items (`search_items`), viewing categories (`show_categories`) – e.g., "Show fruits" → Lists with counts/descriptions.
- **Cart Management**: Add/update/remove/view (`add_item_to_cart`, `update_item_quantity`, `remove_item_from_cart`, `view_cart`) – Confirms enthusiastically: "Wonderful! Added 2 loaves of bread – ₹40. Butter too?"
- **Smart Recipe Bundling**: "Ingredients for sandwich?" → Adds bread/eggs/tomatoes via `add_recipe_to_cart`; explains: "Yay! Added everything for a delicious sandwich!"
- **Order Placement**: Detects "That's all" → Confirms summary/total, saves JSON (`place_order`), celebrates: "🎊 Order placed! ₹250, 30-45 mins delivery." Clears cart.
- **Voice Charm**: Murf Falcon TTS (en-US-alicia for friendly tone) + Deepgram STT + Gemini LLM. Multilingual detection for Hindi mixes.
- **Persistence**: Orders saved to `orders/order_{timestamp}.json`; catalog from `catalog.json`.

### Sample Catalog (`catalog.json`)
Diverse 20+ items across categories (groceries, fruits/veggies, snacks/beverages, prepared food):

```json
{
  "categories": [
    {
      "name": "Groceries",
      "items": [
        {"id": 1, "name": "Bread (Whole Wheat)", "price": 40, "unit": "loaf", "brand": "Harvest Gold", "tags": ["vegan", "wholegrain"]},
        {"id": 2, "name": "Eggs", "price": 60, "unit": "dozen", "brand": "Farm Fresh"},
        {"id": 3, "name": "Milk (Full Cream)", "price": 55, "unit": "liter", "brand": "Amul", "tags": ["dairy"]},
        {"id": 4, "name": "Peanut Butter", "price": 150, "unit": "jar", "brand": "Skippy", "tags": ["vegan"]},
        {"id": 5, "name": "Pasta", "price": 80, "unit": "pack", "brand": "B&B", "tags": ["vegan"]}
      ]
    },
    {
      "name": "Fruits & Vegetables",
      "items": [
        {"id": 6, "name": "Apples", "price": 120, "unit": "kg", "tags": ["vegan", "fresh"]},
        {"id": 7, "name": "Tomatoes", "price": 50, "unit": "kg", "tags": ["vegan"]},
        {"id": 8, "name": "Bananas", "price": 40, "unit": "dozen", "tags": ["vegan"]},
        {"id": 9, "name": "Carrots", "price": 30, "unit": "kg", "tags": ["vegan"]}
      ]
    },
    {
      "name": "Snacks & Beverages",
      "items": [
        {"id": 10, "name": "Chips (Masala)", "price": 20, "unit": "pack", "brand": "Lays"},
        {"id": 11, "name": "Coke", "price": 40, "unit": "bottle", "brand": "Coca-Cola"},
        {"id": 12, "name": "Cookies", "price": 100, "unit": "pack", "brand": "Oreo"},
        {"id": 13, "name": "Juice (Orange)", "price": 60, "unit": "carton", "brand": "Real", "tags": ["vegan"]}
      ]
    },
    {
      "name": "Prepared Food",
      "items": [
        {"id": 14, "name": "Margherita Pizza", "price": 250, "unit": "medium", "tags": ["vegetarian"]},
        {"id": 15, "name": "Chicken Biryani", "price": 300, "unit": "plate", "tags": ["non-veg"]},
        {"id": 16, "name": "Veggie Sandwich", "price": 120, "unit": "pack", "tags": ["vegan"]},
        {"id": 17, "name": "Pasta Alfredo", "price": 200, "unit": "bowl", "tags": ["vegetarian"]}
      ]
    }
  ],
  "recipes": {
    "sandwich": ["Bread (Whole Wheat)", "Peanut Butter", "Apples"],
    "pasta": ["Pasta", "Tomatoes", "Cheese"],
    "salad": ["Apples", "Carrots", "Tomatoes"],
    "breakfast": ["Eggs", "Bread (Whole Wheat)", "Milk (Full Cream)"]
  }
}
```

### Order Schema (`orders/order_{timestamp}.json`)
Example saved order:
```json
{
  "order_id": "QB20251128_143022",
  "customer_name": "Valued Customer",
  "timestamp": "2025-11-28T14:30:22Z",
  "items": [
    {"id": 1, "name": "Bread (Whole Wheat)", "price": 40, "quantity": 2, "unit": "loaf", "brand": "Harvest Gold", "total": 80}
  ],
  "item_count": 2,
  "total_amount": 80,
  "status": "confirmed",
  "delivery_estimate": "30-45 minutes",
  "store": "QuickBasket Express"
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
2. Ensure `catalog.json` exists (code auto-handles if missing, but add for full features).
3. Create `.env.local` with keys.
4. Run agent: `python src/agent.py`.
5. Start room: `lk room create --num-participants 2`.
6. Connect via [LiveKit Browser Demo](https://meet.livekit.io/) (QuickBasket-themed UI at http://localhost:3000).

### Usage
- **Start**: Agent greets: "Namaste! Welcome to QuickBasket! I'm Priya..."
- **Browse/Add**: "Show groceries" or "Add 2 bread" → Lists/confirms.
- **Recipe**: "Ingredients for sandwich" → Bundles & adds.
- **Cart**: "What's in my cart?" → Summary/total.
- **Manage**: "Remove bread" or "Update milk to 2 liters".
- **Order**: "That's all" → Confirms, saves JSON, celebrates.

## Testing
- **Voice Commands** (Full Flows):
  - **Basic Order**: "Add 1 bread, 1 milk" → View cart → "Place order" → Check `orders/*.json`.
  - **Recipe Bundle**: "Ingredients for pasta" → Adds pasta/tomatoes/cheese → "Done".
  - **Updates**: "Add 2 apples" → "Update apples to 3" → "Remove apples" → Cart empty.
  - **Search**: "Search for snacks" → Lists chips/coke → Add one.
- **Multi-Turn**: Test suggestions (e.g., "Bread?" → "Butter too?") – Agent engages.
- **Verify JSON**: Post-order, open `orders/order_*.json` – Items/total/status match?
- **Edge Cases**: Unknown item → "Couldn't find; try alternatives." Empty cart order → "Add something first!"

## Advanced Goals (Optional)
- **Order Tracking**: Mock status progression (received → delivered) in JSON; query "Where's my order?"
- **History**: Multi-order JSON; "Reorder last time" rebuilds cart.
- **Concurrent Orders**: Track multiple (grocery vs. food); "Status of grocery order?"
- **Reorders/Recs**: From history: "Usual groceries?" suggests freq items.
- **Budget Filter**: "Under ₹500" → Filters catalog, warns on exceeds.

## Architecture
- **Backend**: `src/agent.py` – FoodOrderingAgent with tools (`add_item_to_cart`, `add_recipe_to_cart`, etc.). Loads `catalog.json`; saves to `orders/`. Pre-warms catalog.
- **Frontend**: QuickBasket-themed (green gradients, basket icons) – Updated welcome/transcript for fun (e.g., "Happy Shopping!").
- **Flow**: Greeting → Browse/Add/Recipe → Cart ops → Detect end → Save/Confirm.

## Contributing / Challenge Notes
Part of the **Murf AI Voice Agent Challenge** – using Murf Falcon for lively, engaging TTS in shopping chats. Days 1-6: Starter to fraud; Day 7: This QuickBasket assistant (with recipe smarts). Follow for Days 8-10!

Tag [@MurfAI](https://www.linkedin.com/company/murf-ai/) on LinkedIn. Hashtags: #MurfAIVoiceAgentsChallenge #10DaysofAIVoiceAgents

## License
MIT – Free to use/modify. Questions? Open an issue.

---

*Built with ❤️ for tasty orders. Last updated: Nov 28, 2025.*