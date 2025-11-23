# agent.py
import logging
import json
import os
from datetime import datetime
from typing import Annotated, Literal
from dataclasses import dataclass, field

# Optional debug: set DEBUG=1 in .env.local to get extra prints
DEBUG = os.getenv("DEBUG", "0") == "1"

# configure logger
logger = logging.getLogger("agent")
logger.setLevel(logging.DEBUG if DEBUG else logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("[%(levelname)s] %(asctime)s - %(message)s"))
logger.addHandler(handler)

logger.info("🚀 COFFEE SHOP AGENT - LOADING")

from dotenv import load_dotenv
from pydantic import Field
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    RoomInputOptions,
    WorkerOptions,
    cli,
    metrics,
    MetricsCollectedEvent,
    RunContext,
    function_tool,
)
from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv(".env.local")

# -------------------------
# Order state dataclasses
# -------------------------
@dataclass
class OrderState:
    drinkType: str | None = None
    size: str | None = None
    milk: str | None = None
    extras: list[str] = field(default_factory=list)
    name: str | None = None

    def is_complete(self) -> bool:
        """Required fields: drinkType, size, milk, name"""
        return all([
            self.drinkType is not None,
            self.size is not None,
            self.milk is not None,
            self.name is not None
        ])

    def to_dict(self) -> dict:
        return {
            "drinkType": self.drinkType,
            "size": self.size,
            "milk": self.milk,
            "extras": self.extras,
            "name": self.name
        }

    def get_summary(self) -> str:
        if not any([self.drinkType, self.size, self.milk, self.name, self.extras]):
            return "🔄 No items collected yet."
        extras_text = f" with {', '.join(self.extras)}" if self.extras else ""
        dt = (self.drinkType.title() if self.drinkType else "—")
        sz = (self.size.title() if self.size else "—")
        milk = (self.milk.title() if self.milk else "—")
        name = (self.name if self.name else "—")
        return f"☕ {sz} {dt} with {milk} milk{extras_text} for {name}"

@dataclass
class Userdata:
    order: OrderState
    session_start: datetime = field(default_factory=datetime.now)

# -------------------------
# Helpers
# -------------------------
def normalize_str(s: str | None) -> str | None:
    if s is None:
        return None
    return s.strip().lower()

def normalize_list_of_str(lst: list[str] | None) -> list[str]:
    if not lst:
        return []
    return [str(x).strip().lower() for x in lst if str(x).strip()]

# -------------------------
# function tools (normalized & robust)
# -------------------------
@function_tool
async def set_drink_type(ctx: RunContext[Userdata], drink: Annotated[
        Literal["latte", "cappuccino", "americano", "espresso", "mocha", "coffee", "cold brew", "matcha"],
        Field(description="The type of coffee")]) -> str:
    normalized = normalize_str(drink)
    ctx.userdata.order.drinkType = normalized
    logger.info("DRINK SET: %s", normalized)
    return f"☕ Got it — {normalized.title()}. {ctx.userdata.order.get_summary()}"

@function_tool
async def set_size(ctx: RunContext[Userdata], size: Annotated[
        Literal["small", "medium", "large", "extra large"],
        Field(description="Drink size")]) -> str:
    normalized = normalize_str(size)
    ctx.userdata.order.size = normalized
    logger.info("SIZE SET: %s", normalized)
    return f"📏 {normalized.title()} chosen. {ctx.userdata.order.get_summary()}"

@function_tool
async def set_milk(ctx: RunContext[Userdata], milk: Annotated[
        Literal["whole", "skim", "almond", "oat", "soy", "coconut", "none"],
        Field(description="Type of milk")]) -> str:
    normalized = normalize_str(milk)
    ctx.userdata.order.milk = normalized
    logger.info("MILK SET: %s", normalized)
    if normalized == "none":
        return "🥛 Black coffee — bold and simple!"
    return f"🥛 {normalized.title()} milk. {ctx.userdata.order.get_summary()}"

@function_tool
async def set_extras(ctx: RunContext[Userdata], extras: Annotated[
        list[str] | None,
        Field(description="List of extras or None")]=None) -> str:
    items = normalize_list_of_str(extras)
    ctx.userdata.order.extras = items
    logger.info("EXTRAS SET: %s", items)
    if items:
        return f"🎯 Added: {', '.join(items)}."
    return "🎯 No extras added."

@function_tool
async def set_name(ctx: RunContext[Userdata], name: Annotated[str, Field(description="Customer name")]) -> str:
    cleaned = name.strip().title()
    ctx.userdata.order.name = cleaned
    logger.info("NAME SET: %s", cleaned)
    return f"👤 Thanks, {ctx.userdata.order.name}! {ctx.userdata.order.get_summary()}"

@function_tool
async def complete_order(ctx: RunContext[Userdata]) -> str:
    order = ctx.userdata.order
    if not order.is_complete():
        missing = []
        if not order.drinkType: missing.append("☕ drink type")
        if not order.size: missing.append("📏 size")
        if not order.milk: missing.append("🥛 milk")
        if not order.name: missing.append("👤 name")
        logger.info("COMPLETE_ORDER called but missing: %s", missing)
        return f"🔄 Almost there — please provide: {', '.join(missing)}"
    try:
        path = save_order_to_json(order)
        extras_text = f" with {', '.join(order.extras)}" if order.extras else ""
        logger.info("ORDER COMPLETED and saved to %s", path)
        return (f"🎉 Order confirmed! {order.get_summary()}\n"
                f"📁 Saved to: {path}\n"
                "⏰ Your drink will be ready in 3-5 minutes. Thank you!")
    except Exception as e:
        logger.exception("Failed to save order: %s", e)
        return "⚠️ I saved your order in memory but couldn't write the file. We'll prepare it."

@function_tool
async def get_order_status(ctx: RunContext[Userdata]) -> str:
    order = ctx.userdata.order
    if order.is_complete():
        return f"📊 Your order is complete! {order.get_summary()}"
    return f"📊 In progress: {order.get_summary()}"

# -------------------------
# Barista agent
# -------------------------
class BaristaAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions="""
You are a friendly barista called 'Brew Buddy'. Ask one question at a time.
Collect these fields: drinkType, size, milk, extras, name.
Call the appropriate function_tool as soon as user provides that piece of info.
If a field is missing, ask a clarifying question for that field only.
When all fields are filled, call complete_order.
Speak warmly and concisely, use emojis, avoid long multi-part questions.
""",
            tools=[
                set_drink_type,
                set_size,
                set_milk,
                set_extras,
                set_name,
                complete_order,
                get_order_status,
            ],
        )

def create_empty_order():
    return OrderState()

# -------------------------
# storage helpers
# -------------------------
def get_orders_folder():
    try:
        base_dir = os.path.dirname(__file__)
    except NameError:
        base_dir = os.getcwd()
    backend_dir = os.path.abspath(os.path.join(base_dir, ".."))
    folder = os.path.join(backend_dir, "orders")
    os.makedirs(folder, exist_ok=True)
    return folder

def save_order_to_json(order: OrderState) -> str:
    folder = get_orders_folder()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    filename = f"order_{timestamp}.json"
    path = os.path.join(folder, filename)
    temp_path = path + ".tmp"

    order_data = order.to_dict()
    order_data["timestamp"] = datetime.now().isoformat()
    order_data["session_id"] = f"session_{timestamp}"

    # write to temp file first, then atomically replace
    with open(temp_path, "w", encoding="utf-8") as f:
        json.dump(order_data, f, indent=4, ensure_ascii=False)
    os.replace(temp_path, path)
    logger.info("Saved JSON order to %s", path)
    return path

# -------------------------
# prewarm
# -------------------------
def prewarm(proc: JobProcess):
    logger.info("🔥 Prewarming VAD model...")
    if not hasattr(proc, "userdata") or proc.userdata is None:
        proc.userdata = {}
    # load model and store
    proc.userdata["vad"] = silero.VAD.load()
    logger.info("✅ VAD model loaded successfully!")

# -------------------------
# main entrypoint
# -------------------------
async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {"room": getattr(ctx.room, "name", "unknown")}
    logger.info("🚀 BREW & BEAN CAFE - AI BARISTA")
    logger.info("Orders folder: %s", get_orders_folder())

    test_order_saving()

    userdata = Userdata(order=create_empty_order())

    # safe vad retrieval with fallback
    vad_model = None
    if hasattr(ctx, "proc"):
        proc_userdata = getattr(ctx.proc, "userdata", None)
        if isinstance(proc_userdata, dict):
            vad_model = proc_userdata.get("vad")
    if vad_model is None:
        logger.info("No prewarmed VAD found; loading inline (fallback).")
        vad_model = silero.VAD.load()

    session = AgentSession(
        stt=deepgram.STT(model="nova-3"),
        llm=google.LLM(model="gemini-2.5-flash"),
        tts=murf.TTS(voice="en-US-matthew", style="Conversation", text_pacing=True),
        turn_detection=MultilingualModel(),
        vad=vad_model,
        userdata=userdata,
    )

    # collect metrics
    usage_collector = metrics.UsageCollector()
    @session.on("metrics_collected")
    def _on_metrics(ev: MetricsCollectedEvent):
        usage_collector.collect(ev.metrics)

    try:
        await session.start(
            agent=BaristaAgent(),
            room=ctx.room,
            room_input_options=RoomInputOptions(noise_cancellation=noise_cancellation.BVC()),
        )
        await ctx.connect()
    except Exception as e:
        logger.exception("Failed to start session or connect: %s", e)
        raise

def test_order_saving():
    # quick sanity test to ensure JSON saving works in runtime
    test_order = OrderState(drinkType="latte", size="medium", milk="oat", extras=["vanilla"], name="Tester")
    try:
        p = save_order_to_json(test_order)
        logger.info("🧪 test save succeeded: %s", p)
    except Exception as e:
        logger.exception("🧪 test save failed: %s", e)

if __name__ == "__main__":
    logger.info("⚡ STARTING COFFEE SHOP AGENT...")
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
