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

logger = logging.getLogger("bollywood-improv-agent")
load_dotenv(".env.local")

# Create necessary directories
os.makedirs("improv_data", exist_ok=True)

class BollywoodImprovAgent(Agent):
    def __init__(self):
        # Game state
        self.game_state = {
            "player_name": None,
            "current_round": 0,
            "max_rounds": 3,
            "rounds": [],
            "phase": "intro",  # "intro", "awaiting_improv", "reacting", "done"
            "scenarios": self._load_scenarios(),
            "start_time": datetime.now().isoformat(),
            "performance_notes": [],
            "masala_score": 0,  # Bollywood style points
            "mood": "enthusiastic"  # Current host mood
        }
        
        # Indian voice options with different personalities
        self.indian_voices = {
            "mature_male": "en-US-charles",  # Charles - supports hi-IN
            "energetic_male": "en-US-carter",  # Carter - supports en-IN
            "warm_female": "en-US-naomi",  # Naomi - supports hi-IN
            "dramatic_female": "en-US-alicia",  # Alicia - supports hi-IN
            "friendly_female": "en-US-samantha",  # Samantha - supports en-IN
            "versatile_female": "en-US-michelle",  # Michelle - supports hi-IN
            "young_male": "hi-IN-kabir",  # Hindi male voice
            "young_female": "hi-IN-ayushi",  # Hindi female voice
            "deep_male": "hi-IN-shaan",  # Hindi male with style options
            "calm_male": "hi-IN-rahul",  # Hindi conversational
            "expressive_female": "hi-IN-shweta",  # Hindi female with style options
            "professional_male": "hi-IN-amit",  # Hindi conversational
        }
        
        # Agent instructions for Bollywood host with enhanced Indian flavor
        instructions = """You are Raj "Masala King" Kapoor, the flamboyant host of the hit Indian TV show "Bollywood Improv Dhamaka". 

IMPORTANT: You MUST start with this exact Bollywood-style introduction in Hinglish (Hindi+English):
"Namaste doston! Swagat hai aapka Bollywood Improv Dhamaka mein! Main hoon aapka host Raj Masala King Kapoor, aur aaj hum live karenge ek shandaar improv表演! Kya aap taiyar hai apne andar chhupe Bollywood superstar ko jagaane ke liye? Toh bataiye, aapka shandaar naam kya hai, jaaneman?"

PERSONALITY TRAITS:
- Over-the-top Bollywood drama and emotion with Indian expressions
- Mix Hindi and English naturally (Hinglish) - 60% English, 40% Hindi phrases
- Use Bollywood movie references and iconic dialogues (SRK, Salman, Amitabh style)
- Extremely expressive with Indian terms of endearment: jaaneman, beta, darling, boss, bhai, behna
- Add musical references, dance, and filmy masala
- Use Indian metaphors: "masala", "tadka", "chatpata", "dil se", "jaan laga ke"
- Gesture with hands while speaking (describe in speech)

RESPONSE STRUCTURE:
1. Start with Bollywood-style greeting or reaction
2. Use Hinglish mix: "Waah! Kya performance tha yaar!"
3. Include Indian cultural references: food, festivals, movies
4. End with encouraging next action or dramatic pause
5. Keep 2-3 sentences maximum

BOLLYWOOD PHRASES TO USE:
- "Arey waah!" "Kya baat hai!" "Shabaash beta!"
- "Yeh toh blockbuster hai!" "Picture abhi baaki hai!"
- "Aapne toh dil jeet liya!" "Jadoo kar diya aapne!"
- "Maza aa gaya!" "Bohot hard!"
- "Ek dum mast!" "Bole toh..." 

NEVER: Break character, be too formal, use only English, be boring!"""

        super().__init__(instructions=instructions)

    def _load_scenarios(self) -> List[str]:
        """Load Indian-themed improv scenarios"""
        scenarios_file = "improv_data/bollywood_scenarios.json"
        default_scenarios = [
            "You're a Mumbai chaiwala whose special masala chai can make people fall in love. A customer just drank it and is staring at you romantically.",
            "You're a Bollywood director explaining to a new actor why they must dance in the rain while singing a love song to a tree.",
            "You're a Punjabi wedding planner convincing a budget-conscious client why they NEED a horse, 500 guests, and fireworks for a simple ceremony.",
            "You're an auto-rickshaw driver in Delhi who just realized your passenger is your school crush from 20 years ago.",
            "You're a Kolkata street food vendor whose special puchka recipe was just stolen by a rival. Confront them dramatically.",
            "You're a Bollywood backup dancer trying to teach a clumsy American tourist how to do the 'lungi dance' for a movie shoot.",
            "You're at a family wedding and just ate the last gulab jamun that was meant for the bride. The aunties are coming!",
            "You're a yoga guru in Rishikesh who discovers your new foreign student is actually a Hollywood spy learning your secrets.",
            "You're a Mumbai dabbawala who accidentally delivered a marriage proposal tiffin to a grumpy office worker instead of their intended recipient.",
            "You're a Kashmiri shikara driver showing Dal Lake to a tourist who's never seen snow. A sudden snowstorm begins!"
        ]
        
        if os.path.exists(scenarios_file):
            try:
                with open(scenarios_file, 'r') as f:
                    scenarios = json.load(f)
                logger.info(f"Loaded {len(scenarios)} Bollywood scenarios from file")
                return scenarios
            except Exception as e:
                logger.error(f"Error loading Bollywood scenarios: {e}")
        
        # Save default scenarios
        try:
            with open(scenarios_file, 'w') as f:
                json.dump(default_scenarios, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving Bollywood scenarios: {e}")
        
        return default_scenarios

    def _get_voice_for_mood(self) -> str:
        """Select appropriate Indian voice based on current mood"""
        mood_to_voice = {
            "enthusiastic": "en-US-carter",  # Energetic Indian-accented English
            "dramatic": "hi-IN-shaan",  # Hindi with style options for drama
            "romantic": "en-US-naomi",  # Warm female voice
            "comic": "en-US-alicia",  # Expressive female
            "action": "hi-IN-kabir",  # Strong male Hindi
            "emotional": "hi-IN-shweta",  # Emotional Hindi female
            "friendly": "en-US-samantha",  # Friendly Indian English
            "professional": "hi-IN-amit",  # Clear Hindi male
        }
        return mood_to_voice.get(self.game_state["mood"], "en-US-charles")

    @function_tool
    async def start_round(self, context: RunContext) -> str:
        """Start a new improv round with a Bollywood scenario"""
        try:
            if self.game_state["phase"] != "awaiting_improv":
                self.game_state["phase"] = "awaiting_improv"
                
            # Get a random scenario
            available_scenarios = [s for s in self.game_state["scenarios"] 
                                 if s not in [r.get("scenario") for r in self.game_state["rounds"]]]
            
            if not available_scenarios:
                scenario = random.choice(self.game_state["scenarios"])
            else:
                scenario = random.choice(available_scenarios)
            
            self.game_state["current_round"] += 1
            
            # Bollywood-style introductions with Indian flair
            round_intros = [
                f"Dhishoom! Dhishoom! Round {self.game_state['current_round']} aa gaya! Ready hai?",
                f"Arey waah! Ab shuru hota hai asli drama! Round {self.game_state['current_round']} ka scene!",
                f"Chalo bhaiyon aur behno! Taiyar ho jaiye Round {self.game_state['current_round']} ke liye!",
                f"Kya baat hai! Round {self.game_state['current_round']} ka tadka lagne wala hai!"
            ]
            
            response = f"{random.choice(round_intros)}\n\n"
            response += f"🎬 **YOUR BOLLYWOOD SCENE:** {scenario}\n\n"
            response += "Ab aapki baari! Jee bhar ke perform kariye! Remember: zyada drama, zyada emotion, zyada masala! \n(Now it's your turn! Perform with full energy! Remember: more drama, more emotion, more masala!)"
            
            # Store the round info
            round_data = {
                "round_number": self.game_state["current_round"],
                "scenario": scenario,
                "start_time": datetime.now().isoformat()
            }
            self.game_state["rounds"].append(round_data)
            
            # Set mood for this round
            moods = ["dramatic", "enthusiastic", "comic", "emotional", "action"]
            self.game_state["mood"] = random.choice(moods)
            
            return response
            
        except Exception as e:
            logger.error(f"Error in start_round: {e}")
            return "Arre yaar! Kuch technical dikkat hai. Phir se try karte hain, jaaneman!"

    @function_tool
    async def react_to_performance(self, context: RunContext, performance: str = "") -> str:
        """React to the player's improv with Bollywood flair"""
        try:
            if self.game_state["phase"] != "reacting":
                self.game_state["phase"] = "reacting"
            
            current_round = self.game_state["current_round"] - 1
            if current_round < 0 or current_round >= len(self.game_state["rounds"]):
                return "Kuch toh gadbad hai, Daya! Scene samajh mein nahi aaya!"
            
            # Choose a Bollywood reaction style
            reaction_styles = {
                "superhit": {
                    "reactions": [
                        "Kyaaaa baat hai! Yeh toh blockbuster scene tha, yaar!",
                        "Waah! Aapke andar toh Shah Rukh Khan chhupta hai!",
                        "Arey wah! Itna emotion... itna drama... dil jeet liya aapne!"
                    ],
                    "masala_range": (9, 10),
                    "mood": "dramatic"
                },
                "hit": {
                    "reactions": [
                        "Shabaash! Aapka performance dekh kar maza aa gaya!",
                        "Bohot hard! Aamir Khan bhi proud hote!",
                        "Kamaal kar diya aapne! Bollywood ko aap jaise talent ki zaroorat hai!"
                    ],
                    "masala_range": (7, 9),
                    "mood": "enthusiastic"
                },
                "average": {
                    "reactions": [
                        "Achha try kiya! Thoda aur practice karo, star ban jaoge!",
                        "Shuruat acchi hai! Aap mein potential hai, beta!",
                        "Not bad! Lekin remember, Bollywood mein zyada masala chahiye!"
                    ],
                    "masala_range": (5, 7),
                    "mood": "friendly"
                }
            }
            
            style = random.choice(["superhit", "hit", "average"])
            style_data = reaction_styles[style]
            
            reaction = random.choice(style_data["reactions"])
            masala_points = random.randint(*style_data["masala_range"])
            self.game_state["mood"] = style_data["mood"]
            
            # Add specific Bollywood feedback
            feedback_options = [
                f"Aapki dialogue delivery SRK jaisi thi!",
                f"Aapne scene mein ek dum desi tadka daal diya!",
                f"Yeh performance toh 100 crore ki movie ke layak hai!",
                f"Aapne Indian emotions ko perfect dikhaya!",
                f"Aapka comic timing Rohit Shetty movie jaisa tha!",
                f"Aapne toh typical Bollywood masala perfect diya!"
            ]
            
            # Mix Hindi and English naturally
            hinglish_phrases = [
                "Bohot badhiya tha!", 
                "Ek dum mast!", 
                "Maza aa gaya!", 
                "Jadoo kar diya aapne!"
            ]
            
            if random.random() > 0.5:
                reaction += " " + random.choice(feedback_options)
            reaction += " " + random.choice(hinglish_phrases)
            
            # Update masala score
            self.game_state["masala_score"] += masala_points
            
            # Store performance notes
            performance_note = {
                "round": self.game_state["current_round"],
                "reaction": reaction,
                "style": style,
                "masala_points": masala_points,
                "timestamp": datetime.now().isoformat(),
                "mood": self.game_state["mood"]
            }
            self.game_state["performance_notes"].append(performance_note)
            
            # Add masala points announcement with Indian flair
            reaction += f"\n\n🎭 **Masala Points:** {masala_points} \n🏆 **Total:** {self.game_state['masala_score']} / {self.game_state['max_rounds'] * 10}"
            
            # Check if game should continue or end
            if self.game_state["current_round"] >= self.game_state["max_rounds"]:
                self.game_state["phase"] = "done"
                reaction += "\n\n🎉 **AUR KHATAM!** Kya shandaar performance thi! Chalo, final score batate hain..."
            else:
                next_round_phrases = [
                    "Chalo, agla round shuru karte hain!",
                    "Ab ready ho jaiye next scene ke liye!",
                    "Aage badhte hain! Next round ka intezaar hai!"
                ]
                reaction += f"\n\n{random.choice(next_round_phrases)}"
            
            return reaction
            
        except Exception as e:
            logger.error(f"Error in react_to_performance: {e}")
            return "Arre bhai! Kuch toh gadbad hai! Aapka performance dekh kar main emotional ho gaya, yaar!"

    @function_tool
    async def end_game(self, context: RunContext) -> str:
        """End the improv battle with Bollywood-style summary"""
        try:
            if self.game_state["phase"] != "done":
                self.game_state["phase"] = "done"
            
            # Set mood for ending
            self.game_state["mood"] = "emotional"
            
            # Analyze performance for summary
            total_masala = self.game_state["masala_score"]
            max_possible = self.game_state["max_rounds"] * 10
            
            if total_masala >= max_possible * 0.8:
                star_rating = "⭐⭐⭐⭐⭐"
                summary_type = "**SUPERSTAR** 🌟"
                summaries = [
                    "Aap toh ekdum seeti-maar performance de gaye! Bollywood waiting hai aapke liye!",
                    "Kya baat hai! Aap mein toh next big Bollywood star dikh raha hai!",
                    "Waah! Aapki acting ne toh humara dil jeet liya! Blockbuster performance!"
                ]
            elif total_masala >= max_possible * 0.6:
                star_rating = "⭐⭐⭐⭐"
                summary_type = "**HIT HERO** 🎬"
                summaries = [
                    "Shabaash! Aapki performance ne toh housefull show kar diya!",
                    "Bohot khoob! Aap mein real talent hai, beta!",
                    "Kamaal kar diya aapne! Aapka future bright hai!"
                ]
            else:
                star_rating = "⭐⭐⭐"
                summary_type = "**RISING STAR** ✨"
                summaries = [
                    "Aapne toh shuruat kar di! Ab practice karo aur star ban jaoge!",
                    "Achha try kiya! Aap mein potential hai, bas thoda aur masala chahiye!",
                    "Shuruat acchi hai! Aap seekh rahe ho, yeh important hai!"
                ]
            
            summary = random.choice(summaries)
            player_name = self.game_state.get("player_name", "jaaneman")
            
            # Final Bollywood sign-off with dramatic flair
            sign_offs = [
                f"Dhanyavaad {player_name}! Aapne humara dil jeet liya aaj!",
                f"Shukriya {player_name}! Aapki performance yaad rahegi humein!",
                f"{player_name} beta, aap star banoge! Hum guarantee ke sath kehte hain!",
                f"Khatam nahi hoti film, bas interval hota hai! Phir milenge {player_name}!"
            ]
            
            response = f"🎭 **BOLLYWOOD IMPROV DHAMAKA - FINAL REPORT** 🎭\n\n"
            response += f"{star_rating}\n"
            response += f"**Rating:** {summary_type}\n"
            response += f"**Total Masala Score:** {total_masala} / {max_possible}\n"
            response += f"**Rounds Completed:** {self.game_state['current_round']}\n\n"
            response += f"🎤 **HOST'S VERDICT:** {summary}\n\n"
            
            # Add specific strength
            strengths = [
                "Aapki dialogue delivery filmy style ki thi!",
                "Aapne Indian emotions ko perfect dikhaya!",
                "Aapki comic timing toh Rohit Shetty movie jaisi thi!",
                "Aapne drama ko perfect handle kiya!",
                "Aapki energy dekh ke lagta hai aap dance bhi accha karte honge!",
                "Aapne typical Bollywood masala perfect diya!"
            ]
            
            response += f"💪 **Your Strength:** {random.choice(strengths)}\n\n"
            response += f"👋 {random.choice(sign_offs)}\n\n"
            response += "🎬 _Yeh raha aapka host Raj Masala King Kapoor, kehta hai - **Picture abhi baaki hai mere dost!**_ 🎬"
            
            # Save game results
            self._save_game_results()
            
            return response
            
        except Exception as e:
            logger.error(f"Error in end_game: {e}")
            return "Kya performance thi, yaar! Aapne toh humein emotional kar diya! Bollywood ko aap jaise talent ki zaroorat hai!"

    @function_tool
    async def set_player_name(self, context: RunContext, name: str) -> str:
        """Set the player's name with Bollywood style"""
        try:
            self.game_state["player_name"] = name.strip()
            
            responses = [
                f"Waah! Kya naam hai {name}! Aapka naam hi superstar jaisa hai!",
                f"Arey wah {name}! Aapka naam sun kar hi lagta hai aap star banoge!",
                f"{name} beta! Aapka naam toh hit movie jaisa hai!",
                f"Kya baat hai {name}! Aapka naam Bollywood ready lag raha hai!"
            ]
            
            response = random.choice(responses)
            response += "\n\nChalo, pehla scene shuru karte hain! Ready ho jaiye apna best performance dene ke liye!"
            return response
            
        except Exception as e:
            logger.error(f"Error in set_player_name: {e}")
            return "Achha! Chalo shuru karte hain! Aapka performance dekh kar hum excited hain!"

    def _save_game_results(self):
        """Save the game results to a JSON file"""
        try:
            results_file = f"improv_data/bollywood_game_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            results = {
                "player_name": self.game_state.get("player_name"),
                "total_rounds": self.game_state["current_round"],
                "rounds_completed": len(self.game_state["rounds"]),
                "masala_score": self.game_state["masala_score"],
                "max_possible": self.game_state["max_rounds"] * 10,
                "performance_notes": self.game_state["performance_notes"],
                "start_time": self.game_state["start_time"],
                "end_time": datetime.now().isoformat(),
                "duration_minutes": round((datetime.now() - datetime.fromisoformat(self.game_state["start_time"])).total_seconds() / 60, 2)
            }
            
            with open(results_file, 'w') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Saved Bollywood game results to {results_file}")
            
        except Exception as e:
            logger.error(f"Error saving Bollywood game results: {e}")

def prewarm(proc: JobProcess):
    """Preload models and Bollywood improv data"""
    logger.info("Prewarming Bollywood Improv agent...")
    proc.userdata["vad"] = silero.VAD.load()
    
    # Check Murf API key
    murf_api_key = os.getenv("MURF_API_KEY")
    google_api_key = os.getenv("GOOGLE_API_KEY")
    
    if murf_api_key:
        logger.info(f"✅ Murf API Key is present (length: {len(murf_api_key)})")
    else:
        logger.warning("❌ Murf API Key is not set in environment variables")
    
    if google_api_key:
        logger.info(f"✅ Google API Key is present (length: {len(google_api_key)})")
    else:
        logger.warning("❌ Google API Key is not set in environment variables")
    
    # Test Murf voices
    try:
        from livekit.plugins import murf
        # Test that we can initialize TTS
        test_tts = murf.TTS(voice="en-US-charles")
        logger.info("✅ Murf TTS initialized successfully with Indian voice")
    except Exception as e:
        logger.error(f"❌ Failed to initialize Murf TTS: {e}")
    
    logger.info("✅ Bollywood Improv agent prewarmed successfully")

async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {
        "room": ctx.room.name,
        "agent": "bollywood-improv-indian"
    }
    
    logger.info("🎭 Starting Bollywood Improv agent with Indian accent...")
    
    # Check environment variables
    logger.info(f"🔑 Environment check - Murf API Key: {'✅' if 'MURF_API_KEY' in os.environ else '❌'}")
    logger.info(f"🔑 Environment check - Google API Key: {'✅' if 'GOOGLE_API_KEY' in os.environ else '❌'}")
    
    try:
        # Initialize Bollywood Improv agent
        bollywood_agent = BollywoodImprovAgent()
        logger.info("✅ Bollywood Improv agent initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize agent: {e}")
        return

    # Set up voice AI pipeline with Indian accent
    logger.info("🎙️ Setting up Indian accent voice pipeline...")
    
    try:
        # Get initial voice based on agent mood
        initial_voice = bollywood_agent._get_voice_for_mood()
        logger.info(f"🎤 Selected Indian voice: {initial_voice}")
        
        session = AgentSession(
            stt=deepgram.STT(model="nova-2"),
            llm=google.LLM(
                model="gemini-2.0-flash",
                temperature=0.8,  # More creative responses
            ),
            tts=murf.TTS(
                voice=initial_voice,
                style="Conversation",
                tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
                text_pacing=True
            ),
            turn_detection=MultilingualModel(),
            vad=ctx.proc.userdata["vad"],
            preemptive_generation=True,
        )
        
        logger.info(f"✅ Voice pipeline configured with:")
        logger.info(f"   - STT: Deepgram Nova-2")
        logger.info(f"   - LLM: Google Gemini 2.0 Flash")
        logger.info(f"   - TTS: Murf with Indian voice '{initial_voice}'")
        
    except Exception as e:
        logger.error(f"❌ Failed to set up voice pipeline: {e}")
        logger.info("🔄 Trying fallback configuration...")
        
        # Fallback configuration with simpler Indian voice
        try:
            session = AgentSession(
                stt=deepgram.STT(model="nova-2"),
                llm=google.LLM(
                    model="gemini-1.5-flash",
                ),
                tts=murf.TTS(
                    voice="en-US-charles",  # Reliable Indian-accented voice
                ),
                turn_detection=MultilingualModel(),
                vad=ctx.proc.userdata["vad"],
                preemptive_generation=False,
            )
            logger.info("✅ Using fallback configuration")
        except Exception as e2:
            logger.error(f"❌ Fallback also failed: {e2}")
            return

    # Add comprehensive debugging event listeners
    @session.on("user_speech")
    def on_user_speech(transcript: str):
        logger.info(f"🎤 **Contestant:** '{transcript}'")

    @session.on("agent_speech") 
    def on_agent_speech(transcript: str):
        logger.info(f"🎭 **Host Raj:** '{transcript}'")

    @session.on("tts_synthesize")
    def on_tts_synthesize(text: str):
        logger.info(f"🔊 **TTS Text:** {text[:80]}...")

    @session.on("tts_audio")
    def on_tts_audio(audio_frame):
        logger.info(f"🔊 **Audio Generated:** {len(audio_frame.data)} bytes")

    @session.on("metrics_collected")
    def on_metrics_collected(ev: MetricsCollectedEvent):
        if 'tts' in ev.metrics:
            tts_metrics = ev.metrics['tts']
            logger.info(f"📊 TTS Metrics - Voice: {tts_metrics.get('voice')}")

    @session.on("error")
    def on_error(error: Exception):
        logger.error(f"❌ **Session Error:** {error}")

    # Metrics collection
    usage_collector = metrics.UsageCollector()
    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)
    
    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"📈 **Final Usage Summary:** {summary}")
    ctx.add_shutdown_callback(log_usage)

    try:
        # Start the session
        logger.info("🚀 Starting agent session...")
        await session.start(
            agent=bollywood_agent,
            room=ctx.room,
            room_input_options=RoomInputOptions(
                noise_cancellation=noise_cancellation.BVC(),
            ),
        )
        logger.info("✅ Bollywood Improv session started successfully")
        
        # Join the room and connect to the user
        logger.info("🔗 Connecting to room...")
        await ctx.connect()
        logger.info("✅ Connected to room successfully")
        
        logger.info("🎯 **AGENT READY!** Host Raj is waiting for contestants!")
        logger.info("   🔊 Voice: Indian-accented Bollywood host")
        logger.info("   🎬 Style: Over-the-top dramatic with Hinglish mix")
        logger.info("   🎭 Mode: Ready to judge improv performances!")
        
    except Exception as e:
        logger.error(f"❌ Error during Bollywood Improv session: {e}")
        import traceback
        logger.error(f"📝 Traceback: {traceback.format_exc()}")
        
        # Provide specific troubleshooting guidance
        if "MURF_API_KEY" in str(e).upper():
            logger.error("""
            🔑 MURF API KEY ERROR!
            =====================
            Please check your .env.local file and ensure you have:
            
            MURF_API_KEY=your_actual_murf_key_here
            
            Get your key from: https://app.murf.ai/
            """)
        
        if "GOOGLE_API_KEY" in str(e).upper():
            logger.error("""
            🔑 GOOGLE API KEY ERROR!
            ========================
            Please check your .env.local file and ensure you have:
            
            GOOGLE_API_KEY=your_actual_google_key_here
            
            Get your key from: https://makersuite.google.com/app/apikey
            """)
        
        if "429" in str(e):
            logger.error("""
            ⚠️ RATE LIMIT ERROR!
            ===================
            Google Gemini API rate limit exceeded. Try:
            1. Wait 5-10 minutes
            2. Use a different Google account
            3. Try gemini-1.5-flash instead
            """)
        
        raise

if __name__ == "__main__":
    # Configure colorful logging for Bollywood vibe
    class BollywoodFormatter(logging.Formatter):
        """Custom formatter with Bollywood style colors"""
        
        COLORS = {
            'DEBUG': '\033[36m',    # Cyan
            'INFO': '\033[32m',     # Green
            'WARNING': '\033[33m',  # Yellow
            'ERROR': '\033[31m',    # Red
            'CRITICAL': '\033[41m', # Red background
            'RESET': '\033[0m'      # Reset
        }
        
        def format(self, record):
            log_color = self.COLORS.get(record.levelname, self.COLORS['INFO'])
            message = super().format(record)
            
            # Add Bollywood emojis based on log level
            emojis = {
                'DEBUG': '🔍',
                'INFO': '🎭',
                'WARNING': '⚠️',
                'ERROR': '❌',
                'CRITICAL': '💥'
            }
            emoji = emojis.get(record.levelname, '🎬')
            
            return f"{emoji} {log_color}{message}{self.COLORS['RESET']}"
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%H:%M:%S'
    )
    
    # Apply custom formatter
    handler = logging.StreamHandler()
    handler.setFormatter(BollywoodFormatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%H:%M:%S'
    ))
    
    # Remove default handlers and add ours
    logger = logging.getLogger()
    for hdlr in logger.handlers[:]:
        logger.removeHandler(hdlr)
    logger.addHandler(handler)
    
    logger.info("""
    🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬
    🎭  BOLLYWOOD IMPROV DHAMAKA AGENT  🎭
    🎤   Hosted by: Raj Masala King Kapoor  🎤
    🔊    Featuring: INDIAN ACCENT VOICE    🔊
    🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬🎬
    """)
    
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))