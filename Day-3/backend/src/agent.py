import logging
import os
import json
from datetime import datetime
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
logger = logging.getLogger("agent")
load_dotenv(".env.local")

class Assistant(Agent):
    def __init__(self, past_ref: str = "") -> None:
        base_instructions = """You are a supportive, realistic, and grounded health & wellness voice companion. You conduct short daily check-ins to help users reflect on their mood, set simple intentions, and end with encouragement. Keep conversations natural, empathetic, and concise—aim for 1-2 minutes total. Speak as if in a friendly chat.

Start with a warm greeting and, if available, gently reference the past check-in: {past_ref}

Structure the check-in like this:
1. Ask about mood and energy (1 question): e.g., "How are you feeling today—on a scale of 1-10, or just describe it?" or "What's your energy like this morning?" Listen and acknowledge briefly. Capture mood as a short text summary (e.g., "7/10, feeling motivated" or "low energy, stressed").
   
2. Ask about intentions/objectives (1 question): e.g., "What are 1-3 small things you'd like to focus on today? Could be work, rest, or something for you." Listen and note 1-3 practical goals (e.g., "walk for 10 mins, finish email").

3. Offer 1 simple, actionable reflection or idea: Based on what they shared, suggest something small and grounded like "If energy's low, try a 5-min deep breath break" or "Break that goal into one step: just start with the outline." No medical advice, diagnoses, or promises—just supportive nudges.

4. Recap briefly: "So, mood: [summary]. Goals: [list 1-3]. Does that sound right?" Wait for confirmation (yes/no/adjust).

After confirmation, call the save_checkin tool with: mood=[your mood summary], objectives=[comma-separated list like "goal1, goal2"], summary=[1 short sentence recap].

End positively: "Great chat—looking forward to tomorrow!"

Be curious and non-judgmental. Responses: concise, voice-friendly, no emojis/lists/tables/symbols. If conversation drifts long, gently steer back and remind to wrap up to save tokens."""
        instructions = base_instructions.format(past_ref=past_ref)
        super().__init__(
            instructions=instructions,
        )

    @function_tool
    async def save_checkin(self, context: RunContext, mood: str, objectives: str, summary: str) -> str:
        """Call this ONLY at the end, after recap confirmation, to save today's check-in data.
        
        Args:
            mood: Short text summary of user's mood/energy (e.g., "6/10, a bit tired").
            objectives: Comma-separated list of 1-3 goals (e.g., "10-min walk, reply to emails, read a chapter").
            summary: One short, neutral sentence summarizing the check-in (e.g., "User felt moderately energetic and set self-care goals.").
        """
        log_file = "records/wellness_log.json"
        now = datetime.now()
        entry = {
            "date": now.strftime("%Y-%m-%d"),
            "time": now.strftime("%H:%M:%S"),
            "mood": mood,
            "objectives": [obj.strip() for obj in objectives.split(",") if obj.strip()],
            "summary": summary
        }
        try:
            with open(log_file, 'r') as f:
                log = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            log = []
        
        log.append(entry)
        with open(log_file, 'w') as f:
            json.dump(log, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved check-in: {entry}")
        return "Check-in saved. Thanks for sharing—have a great day!"

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()

async def entrypoint(ctx: JobContext):
    # Logging setup
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }
    
    # Create records directory and load past data
    os.makedirs("records", exist_ok=True)
    log_file = "records/wellness_log.json"
    past_ref = ""
    try:
        with open(log_file, 'r') as f:
            log = json.load(f)
        if log:
            last = log[-1]
            objectives_str = ", ".join(last.get("objectives", []))
            past_ref = f"Last time on {last['date']}, you felt {last['mood']}. You aimed for: {objectives_str}. How's that going, or how does today feel?"
    except (FileNotFoundError, json.JSONDecodeError, IndexError):
        past_ref = "This is our first check-in—excited to start!"
    
    logger.info(f"Past reference: {past_ref}")

    # Set up a voice AI pipeline using OpenAI, Cartesia, AssemblyAI, and the LiveKit turn detector
    session = AgentSession(
        # Speech-to-text (STT) is your agent's ears, turning the user's speech into text that the LLM can understand
        # See all available models at https://docs.livekit.io/agents/models/stt/
        stt=deepgram.STT(model="nova-3"),
        # A Large Language Model (LLM) is your agent's brain, processing user input and generating a response
        # See all available models at https://docs.livekit.io/agents/models/llm/
        llm=google.LLM(
                model="gemini-2.5-flash",
            ),
        # Text-to-speech (TTS) is your agent's voice, turning the LLM's text into speech that the user can hear
        # See all available models as well as voice selections at https://docs.livekit.io/agents/models/tts/
        tts=murf.TTS(
                voice="en-US-matthew",
                style="Conversation",
                tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
                text_pacing=True
            ),
        # VAD and turn detection are used to determine when the user is speaking and when the agent should respond
        # See more at https://docs.livekit.io/agents/build/turns
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        # allow the LLM to generate a response while waiting for the end of turn
        # See more at https://docs.livekit.io/agents/build/audio/#preemptive-generation
        preemptive_generation=True,
    )
    # Metrics collection, to measure pipeline performance
    # For more information, see https://docs.livekit.io/agents/build/metrics/
    usage_collector = metrics.UsageCollector()
    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)
    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")
    ctx.add_shutdown_callback(log_usage)
    # Start the session, which initializes the voice pipeline and warms up the models
    await session.start(
        agent=Assistant(past_ref=past_ref),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            # For telephony applications, use `BVCTelephony` for best results
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )
    # Join the room and connect to the user
    await ctx.connect()

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))