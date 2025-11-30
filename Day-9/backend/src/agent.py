import logging
import os
import json
import random
from datetime import datetime
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    WorkerOptions,
    cli,
    metrics,
    tokenize,
    function_tool,
    RunContext
)
from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel

logger = logging.getLogger("ecommerce-agent")
load_dotenv(".env.local")

# Create necessary directories
os.makedirs("ecommerce_data", exist_ok=True)
os.makedirs("ecommerce_products", exist_ok=True)

class ProductManager:
    """Manages product catalog with file-based storage"""
    
    def __init__(self):
        self.products_file = "ecommerce_products/products.json"
        self.products = self._load_products()
    
    def _load_products(self) -> List[Dict[str, Any]]:
        """Load products from JSON file or create default catalog"""
        if os.path.exists(self.products_file):
            try:
                with open(self.products_file, 'r') as f:
                    products = json.load(f)
                logger.info(f"Loaded {len(products)} products from {self.products_file}")
                return products
            except Exception as e:
                logger.error(f"Error loading products: {e}")
        
        # Create default product catalog
        default_products = [
            {
                "id": "mug-001",
                "name": "Stoneware Coffee Mug",
                "description": "Handcrafted ceramic mug perfect for your morning chai or coffee. Microwave and dishwasher safe.",
                "price": 800,
                "currency": "INR",
                "category": "mugs",
                "subcategory": "drinkware",
                "color": "white",
                "material": "ceramic",
                "size": "standard",
                "brand": "Artisan Pottery",
                "tags": ["coffee", "tea", "ceramic", "handmade", "microwave-safe"],
                "in_stock": True,
                "stock_quantity": 45,
                "rating": 4.5,
                "review_count": 23,
                "images": ["mug-001-1.jpg", "mug-001-2.jpg"]
            },
            {
                "id": "mug-002",
                "name": "Blue Ceramic Tea Mug with Handle",
                "description": "Beautiful blue ceramic mug with traditional Indian patterns. Perfect for tea lovers.",
                "price": 950,
                "currency": "INR",
                "category": "mugs",
                "subcategory": "drinkware",
                "color": "blue",
                "material": "ceramic",
                "size": "standard",
                "brand": "Desi Designs",
                "tags": ["tea", "ceramic", "traditional", "blue", "hand-painted"],
                "in_stock": True,
                "stock_quantity": 32,
                "rating": 4.7,
                "review_count": 18,
                "images": ["mug-002-1.jpg", "mug-002-2.jpg"]
            },
            {
                "id": "tshirt-001",
                "name": "Classic Cotton T-Shirt",
                "description": "100% premium cotton comfortable t-shirt for everyday wear. Pre-shrunk fabric.",
                "price": 899,
                "currency": "INR",
                "category": "clothing",
                "subcategory": "tops",
                "color": "black",
                "material": "cotton",
                "size": "M",
                "brand": "Comfort Wear",
                "tags": ["cotton", "basic", "casual", "everyday", "comfort"],
                "in_stock": True,
                "stock_quantity": 67,
                "rating": 4.3,
                "review_count": 45,
                "images": ["tshirt-001-1.jpg"]
            },
            {
                "id": "tshirt-002",
                "name": "Premium Cotton Polo T-Shirt",
                "description": "Premium quality cotton polo t-shirt with better fit and durable fabric.",
                "price": 1299,
                "currency": "INR",
                "category": "clothing",
                "subcategory": "tops",
                "color": "white",
                "material": "cotton",
                "size": "L",
                "brand": "Urban Classic",
                "tags": ["polo", "premium", "cotton", "formal-casual", "durable"],
                "in_stock": True,
                "stock_quantity": 28,
                "rating": 4.6,
                "review_count": 32,
                "images": ["tshirt-002-1.jpg", "tshirt-002-2.jpg"]
            },
            {
                "id": "hoodie-001",
                "name": "Classic Black Hoodie",
                "description": "Warm and comfortable black hoodie for casual wear. Perfect for winter seasons.",
                "price": 2499,
                "currency": "INR",
                "category": "clothing",
                "subcategory": "outerwear",
                "color": "black",
                "material": "cotton-polyester",
                "size": "M",
                "brand": "Street Style",
                "tags": ["hoodie", "winter", "casual", "warm", "comfortable"],
                "in_stock": True,
                "stock_quantity": 15,
                "rating": 4.4,
                "review_count": 56,
                "images": ["hoodie-001-1.jpg"]
            },
            {
                "id": "hoodie-002",
                "name": "Soft Grey Hoodie with Front Pocket",
                "description": "Soft grey hoodie with spacious front pocket. Made from premium fabric.",
                "price": 2299,
                "currency": "INR",
                "category": "clothing",
                "subcategory": "outerwear",
                "color": "grey",
                "material": "cotton-polyester",
                "size": "L",
                "brand": "Comfort Zone",
                "tags": ["hoodie", "grey", "pocket", "soft", "premium"],
                "in_stock": True,
                "stock_quantity": 22,
                "rating": 4.8,
                "review_count": 41,
                "images": ["hoodie-002-1.jpg", "hoodie-002-2.jpg"]
            },
            {
                "id": "notebook-001",
                "name": "Handmade Leather Journal",
                "description": "Handmade leather-bound journal with premium paper for writing and sketching.",
                "price": 650,
                "currency": "INR",
                "category": "stationery",
                "subcategory": "journals",
                "color": "brown",
                "material": "leather-paper",
                "size": "A5",
                "brand": "Artisan Crafts",
                "tags": ["journal", "leather", "writing", "sketching", "premium"],
                "in_stock": True,
                "stock_quantity": 38,
                "rating": 4.9,
                "review_count": 29,
                "images": ["notebook-001-1.jpg"]
            },
            {
                "id": "laptop-bag-001",
                "name": "Professional Laptop Bag",
                "description": "Water-resistant laptop bag with multiple compartments for professionals.",
                "price": 1899,
                "currency": "INR",
                "category": "bags",
                "subcategory": "laptop-bags",
                "color": "black",
                "material": "nylon",
                "size": "15-inch",
                "brand": "Urban Professional",
                "tags": ["laptop", "bag", "professional", "water-resistant", "compartments"],
                "in_stock": True,
                "stock_quantity": 12,
                "rating": 4.5,
                "review_count": 38,
                "images": ["laptop-bag-001-1.jpg"]
            }
        ]
        
        self._save_products(default_products)
        return default_products
    
    def _save_products(self, products: List[Dict[str, Any]]) -> bool:
        """Save products to JSON file"""
        try:
            with open(self.products_file, 'w') as f:
                json.dump(products, f, indent=2, ensure_ascii=False)
            logger.info(f"Saved {len(products)} products to {self.products_file}")
            return True
        except Exception as e:
            logger.error(f"Error saving products: {e}")
            return False
    
    def search_products(self, query: str, category: str = "", max_price: float = 0, 
                       color: str = "", brand: str = "") -> List[Dict[str, Any]]:
        """Advanced product search with multiple filters and relevance scoring"""
        query = query.lower().strip()
        results = []
        
        for product in self.products:
            if not product.get("in_stock", True):
                continue
            
            # Apply filters
            if category and category.strip() and product.get("category", "") != category.lower():
                continue
                
            if max_price and max_price > 0 and product.get("price", 0) > max_price:
                continue
                
            if color and color.strip() and product.get("color", "").lower() != color.lower():
                continue
                
            if brand and brand.strip() and product.get("brand", "").lower() != brand.lower():
                continue
            
            # Calculate relevance score
            score = 0
            product_lower = {k: str(v).lower() if isinstance(v, str) else v for k, v in product.items()}
            
            # Exact matches in key fields (higher weight)
            if query in product_lower.get("name", ""):
                score += 10
            if query in product_lower.get("brand", ""):
                score += 8
            if query in product_lower.get("category", ""):
                score += 6
            if query in product_lower.get("subcategory", ""):
                score += 5
            
            # Partial matches and tag matches
            if any(query in tag for tag in product_lower.get("tags", [])):
                score += 4
            if query in product_lower.get("description", ""):
                score += 3
            if query in product_lower.get("color", ""):
                score += 2
            if query in product_lower.get("material", ""):
                score += 1
            
            # If we have a query but no matches, skip this product
            if query and score == 0:
                continue
                
            # Add rating bonus
            score += product.get("rating", 0) * 0.5
            
            if score > 0 or not query:  # Include all if no query but filters applied
                results.append((product, score))
        
        # Sort by relevance score (descending) and then by rating
        results.sort(key=lambda x: (-x[1], -x[0].get("rating", 0)))
        return [product for product, score in results]
    
    def get_categories(self) -> List[str]:
        """Get all available product categories"""
        categories = set()
        for product in self.products:
            if product.get("in_stock", True):
                categories.add(product.get("category", ""))
        return sorted(list(categories))
    
    def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get product by ID"""
        return next((p for p in self.products if p["id"] == product_id), None)
    
    def update_stock(self, product_id: str, quantity: int) -> bool:
        """Update product stock quantity"""
        product = self.get_product_by_id(product_id)
        if product:
            product["stock_quantity"] = max(0, product.get("stock_quantity", 0) - quantity)
            if product["stock_quantity"] == 0:
                product["in_stock"] = False
            self._save_products(self.products)
            return True
        return False

# Load existing orders or create empty list
def load_orders():
    orders_file = "ecommerce_data/orders.json"
    if os.path.exists(orders_file):
        try:
            with open(orders_file, 'r') as f:
                orders = json.load(f)
            logger.info(f"Loaded {len(orders)} existing orders")
            return orders
        except Exception as e:
            logger.error(f"Error loading orders: {e}")
    return []

def save_orders(orders):
    """Save orders to JSON file"""
    try:
        orders_file = "ecommerce_data/orders.json"
        with open(orders_file, 'w') as f:
            json.dump(orders, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved {len(orders)} orders to {orders_file}")
        return True
    except Exception as e:
        logger.error(f"Error saving orders: {e}")
        return False

class EcommerceAgent(Agent):
    def __init__(self):
        # Initialize product manager
        self.product_manager = ProductManager()
        
        # Load existing orders
        self.orders = load_orders()
        
        # Shopping session state
        self.session_state = {
            "current_products": [],
            "cart": [],
            "last_order": None,
            "conversation_context": "greeting",
            "user_preferences": {
                "preferred_categories": [],
                "price_range": {"min": 0, "max": 10000},
                "recent_searches": []
            }
        }
        
        # Agent instructions for e-commerce
        instructions = """You are a friendly and helpful voice shopping assistant. Your role is to help users browse products and place orders.

IMPORTANT: You MUST start with this greeting:
"Namaste! Welcome to our voice shopping experience. I'm here to help you find the perfect products. What would you like to browse today - mugs, clothing, stationery, or bags?"

KEY RESPONSIBILITIES:
1. Help users browse products by category, price, color, brand, etc.
2. Provide clear product information (name, price, description, rating, brand)
3. Assist with adding items to cart and placing orders
4. Answer questions about previous orders and product details
5. Suggest related products based on user interests

CONVERSATION FLOW:
- Start with greeting and offer help
- When user asks to browse, call appropriate search functions
- Show 2-3 products at a time with clear details including ratings
- Help user specify which product they want to buy (use product IDs)
- Confirm order details before creating
- Always be helpful, patient, and clear

RESPONSE RULES:
- Keep responses conversational but concise
- Always mention product prices in INR and include ratings when available
- Confirm important actions (like placing orders)
- End with a helpful question to move conversation forward
- Use Indian English naturally (Namaste, etc.)
- Never break character as shopping assistant
- Suggest related products when appropriate"""

        super().__init__(instructions=instructions)

    @function_tool
    async def list_products(self, context: RunContext, category: Optional[str] = "", 
                          max_price: Optional[float] = 0, color: Optional[str] = "", 
                          brand: Optional[str] = "") -> str:
        """Browse products with advanced filters"""
        try:
            # Update user preferences
            if category:
                self.session_state["user_preferences"]["preferred_categories"].append(category)
            
            # Search products
            products = self.product_manager.search_products(
                query="", category=category, max_price=max_price, color=color, brand=brand
            )
            
            # Store current products for reference
            self.session_state["current_products"] = products
            
            if not products:
                filter_desc = []
                if category: filter_desc.append(f"category '{category}'")
                if max_price: filter_desc.append(f"under ₹{max_price}")
                if color: filter_desc.append(f"color '{color}'")
                if brand: filter_desc.append(f"brand '{brand}'")
                
                filter_text = " with " + " and ".join(filter_desc) if filter_desc else ""
                return f"I couldn't find any products{filter_text}. Would you like to try different filters?"
            
            # Format response
            if category or max_price or color or brand:
                response = f"Found {len(products)} product(s) matching your criteria:\n\n"
            else:
                response = f"Showing {len(products)} available products:\n\n"
            
            for i, product in enumerate(products[:4], 1):  # Show max 4 products
                rating = product.get("rating", 0)
                rating_stars = "⭐" * int(rating) + "☆" * (5 - int(rating))
                brand_info = f" by {product['brand']}" if product.get('brand') else ""
                
                response += f"{i}. **{product['name']}**{brand_info}\n"
                response += f"   Price: ₹{product['price']} | Rating: {rating_stars} ({rating})\n"
                response += f"   {product['description'][:100]}...\n"
                response += f"   ID: {product['id']} | Color: {product['color'].title()}\n\n"
            
            if len(products) > 4:
                response += f"... and {len(products) - 4} more products.\n\n"
            
            response += "Would you like to see details of any product or apply different filters?"
            return response
            
        except Exception as e:
            logger.error(f"Error in list_products: {e}")
            return "I'm having trouble accessing the product catalog right now. Please try again in a moment."

    @function_tool
    async def search_products(self, context: RunContext, query: str) -> str:
        """Search products by name, description, brand, or tags"""
        try:
            # Update recent searches
            self.session_state["user_preferences"]["recent_searches"].append(query)
            if len(self.session_state["user_preferences"]["recent_searches"]) > 5:
                self.session_state["user_preferences"]["recent_searches"].pop(0)
            
            # Search products
            products = self.product_manager.search_products(query=query)
            
            # Store current products for reference
            self.session_state["current_products"] = products
            
            if not products:
                return f"I couldn't find any products matching '{query}'. Would you like to try a different search term or browse by category?"
            
            response = f"I found {len(products)} product(s) for '{query}':\n\n"
            for i, product in enumerate(products[:3], 1):
                rating = product.get("rating", 0)
                rating_stars = "⭐" * int(rating) + "☆" * (5 - int(rating))
                brand_info = f" by {product['brand']}" if product.get('brand') else ""
                
                response += f"{i}. **{product['name']}**{brand_info}\n"
                response += f"   Price: ₹{product['price']} | Rating: {rating_stars}\n"
                response += f"   Category: {product['category'].title()} | Color: {product['color'].title()}\n"
                response += f"   ID: {product['id']}\n\n"
            
            response += "Would you like to see more details or buy any of these products?"
            return response
            
        except Exception as e:
            logger.error(f"Error in search_products: {e}")
            return "I'm having trouble searching products right now. Please try again."

    @function_tool
    async def create_order(self, context: RunContext, product_id: str, quantity: int = 1) -> str:
        """Create an order for a specific product"""
        try:
            # Find the product
            product = self.product_manager.get_product_by_id(product_id)
            
            if not product:
                return "I couldn't find that product. Please check the product ID and try again."
            
            if not product.get("in_stock", True):
                return f"Sorry, {product['name']} is currently out of stock."
            
            if product.get("stock_quantity", 0) < quantity:
                return f"Sorry, we only have {product.get('stock_quantity', 0)} units of {product['name']} in stock."
            
            # Calculate total
            total = product["price"] * quantity
            
            # Create order object
            order = {
                "id": f"ORD-{datetime.now().strftime('%Y%m%d-%H%M%S')}-{random.randint(1000, 9999)}",
                "items": [
                    {
                        "product_id": product_id,
                        "product_name": product["name"],
                        "quantity": quantity,
                        "unit_price": product["price"],
                        "currency": product["currency"],
                        "brand": product.get("brand", ""),
                        "color": product.get("color", "")
                    }
                ],
                "total": total,
                "currency": product["currency"],
                "created_at": datetime.now().isoformat(),
                "status": "confirmed",
                "shipping_address": "To be provided",
                "payment_method": "Voice Order"
            }
            
            # Update stock and save order
            self.product_manager.update_stock(product_id, quantity)
            self.orders.append(order)
            self.session_state["last_order"] = order
            save_orders(self.orders)
            
            # Format confirmation message
            response = f"✅ Order confirmed!\n\n"
            response += f"**Order ID:** {order['id']}\n"
            response += f"**Product:** {product['name']} ({product['color'].title()})\n"
            response += f"**Brand:** {product.get('brand', 'N/A')}\n"
            response += f"**Quantity:** {quantity}\n"
            response += f"**Total Amount:** ₹{total}\n"
            response += f"**Order Date:** {datetime.now().strftime('%b %d, %Y at %I:%M %p')}\n\n"
            response += "Thank you for your purchase! Your order has been processed successfully."
            
            return response
            
        except Exception as e:
            logger.error(f"Error in create_order: {e}")
            return "I'm having trouble processing your order right now. Please try again."

    @function_tool
    async def get_last_order(self, context: RunContext) -> str:
        """Get the most recent order details"""
        try:
            if not self.orders:
                return "You haven't placed any orders yet. Would you like to browse our products?"
            
            last_order = self.session_state.get("last_order") or self.orders[-1]
            
            response = f"📦 **Your Last Order:**\n\n"
            response += f"**Order ID:** {last_order['id']}\n"
            response += f"**Date:** {datetime.fromisoformat(last_order['created_at']).strftime('%b %d, %Y at %I:%M %p')}\n"
            response += f"**Status:** {last_order['status'].title()}\n"
            response += f"**Payment Method:** {last_order.get('payment_method', 'N/A')}\n\n"
            
            response += "**Items:**\n"
            for item in last_order["items"]:
                response += f"• {item['product_name']} ({item.get('color', '')}) - Qty: {item['quantity']} - ₹{item['unit_price'] * item['quantity']}\n"
            
            response += f"\n**Total:** ₹{last_order['total']}\n\n"
            response += "Would you like to browse similar products?"
            
            return response
            
        except Exception as e:
            logger.error(f"Error in get_last_order: {e}")
            return "I'm having trouble retrieving your order details right now."

    @function_tool
    async def get_product_details(self, context: RunContext, product_id: str) -> str:
        """Get detailed information about a specific product"""
        try:
            product = self.product_manager.get_product_by_id(product_id)
            
            if not product:
                return "I couldn't find that product. Please check the product ID."
            
            rating = product.get("rating", 0)
            rating_stars = "⭐" * int(rating) + "☆" * (5 - int(rating))
            
            response = f"📋 **Product Details:**\n\n"
            response += f"**Name:** {product['name']}\n"
            response += f"**Brand:** {product.get('brand', 'N/A')}\n"
            response += f"**Price:** ₹{product['price']}\n"
            response += f"**Rating:** {rating_stars} ({rating}) from {product.get('review_count', 0)} reviews\n"
            response += f"**Category:** {product['category'].title()} → {product.get('subcategory', '').title()}\n"
            response += f"**Color:** {product['color'].title()}\n"
            response += f"**Material:** {product.get('material', 'N/A')}\n"
            if product.get('size'):
                response += f"**Size:** {product['size']}\n"
            response += f"**Stock:** {product.get('stock_quantity', 0)} units available\n"
            response += f"**Status:** {'✅ In Stock' if product.get('in_stock', True) else '❌ Out of Stock'}\n\n"
            response += f"**Description:** {product['description']}\n\n"
            
            if product.get('tags'):
                response += f"**Tags:** {', '.join(product['tags'])}\n\n"
            
            response += "Would you like to place an order for this product?"
            return response
            
        except Exception as e:
            logger.error(f"Error in get_product_details: {e}")
            return "I'm having trouble getting product details right now."

    @function_tool
    async def browse_categories(self, context: RunContext) -> str:
        """Show all available product categories"""
        try:
            categories = self.product_manager.get_categories()
            
            response = "🛍️ **Available Categories:**\n\n"
            for i, category in enumerate(categories, 1):
                # Count products in this category
                category_products = self.product_manager.search_products(category=category)
                response += f"{i}. **{category.title()}** - {len(category_products)} products available\n"
            
            response += "\nWhich category would you like to explore? You can say 'show me mugs' or 'browse clothing'."
            return response
            
        except Exception as e:
            logger.error(f"Error in browse_categories: {e}")
            return "I'm having trouble loading categories right now."

    @function_tool
    async def suggest_products(self, context: RunContext) -> str:
        """Suggest products based on user preferences and browsing history"""
        try:
            preferences = self.session_state["user_preferences"]
            
            # Get preferred categories or use all
            preferred_cats = preferences.get("preferred_categories", [])
            categories_to_search = preferred_cats if preferred_cats else self.product_manager.get_categories()
            
            suggestions = []
            for category in categories_to_search[:2]:  # Limit to 2 categories
                category_products = self.product_manager.search_products(category=category)
                # Take top rated products from each category
                top_products = sorted(category_products, key=lambda x: x.get("rating", 0), reverse=True)[:2]
                suggestions.extend(top_products)
            
            if not suggestions:
                # Fallback to random popular products
                all_products = [p for p in self.product_manager.products if p.get("in_stock", True)]
                suggestions = random.sample(all_products, min(4, len(all_products)))
            
            response = "🎯 **Recommended For You:**\n\n"
            for i, product in enumerate(suggestions[:4], 1):
                rating = product.get("rating", 0)
                response += f"{i}. **{product['name']}** - ₹{product['price']} | ⭐{rating}\n"
                response += f"   {product['description'][:80]}...\n"
                response += f"   ID: {product['id']}\n\n"
            
            response += "Would you like to see details of any product?"
            return response
            
        except Exception as e:
            logger.error(f"Error in suggest_products: {e}")
            return "Let me show you some popular products instead..."

def prewarm(proc: JobProcess):
    """Preload models and e-commerce data"""
    logger.info("Prewarming E-commerce agent...")
    proc.userdata["vad"] = silero.VAD.load()
    # Preload product manager and orders
    product_manager = ProductManager()
    orders = load_orders()
    logger.info(f"Loaded {len(product_manager.products)} products and {len(orders)} orders during prewarm")

async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {
        "room": ctx.room.name,
        "agent": "ecommerce-shopping"
    }
    
    logger.info("Starting E-commerce agent session...")
    
    try:
        # Initialize E-commerce agent
        ecommerce_agent = EcommerceAgent()
        logger.info("E-commerce agent initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize agent: {e}")
        return

    # Set up voice AI pipeline
    session = AgentSession(
        stt=deepgram.STT(model="nova-2"),
        llm=google.LLM(
            model="gemini-2.0-flash",
        ),
        tts=murf.TTS(
            voice="en-US-ken",
            style="Conversation",
            tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
            text_pacing=True
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,
    )

    # Add event listeners for debugging
    @session.on("user_speech")
    def on_user_speech(transcript: str):
        logger.info(f"Customer said: {transcript}")

    @session.on("agent_speech") 
    def on_agent_speech(transcript: str):
        logger.info(f"Shopping assistant responding: {transcript}")

    # Metrics collection
    usage_collector = metrics.UsageCollector()
    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)
    
    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Final usage summary: {summary}")
    ctx.add_shutdown_callback(log_usage)

    try:
        # Start the session
        await session.start(
            agent=ecommerce_agent,
            room=ctx.room,
            room_input_options=RoomInputOptions(
                noise_cancellation=noise_cancellation.BVC(),
            ),
        )
        logger.info("E-commerce session started successfully")
        
        # Join the room and connect to the user
        await ctx.connect()
        logger.info("Connected to room successfully")
        
    except Exception as e:
        logger.error(f"Error during E-commerce session: {e}")
        raise

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))