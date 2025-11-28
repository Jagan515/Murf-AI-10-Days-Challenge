import logging
import os
import json
import random
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

logger = logging.getLogger("jungle-raja-agent")
load_dotenv(".env.local")

# Create necessary directories
os.makedirs("game_saves", exist_ok=True)

# Load game world information from file
def load_game_world():
    world_file = "game_saves/world_setup.json"
    
    # If file doesn't exist, create it with default data
    if not os.path.exists(world_file):
        world_data = {
            "game": "Jungle Raja Adventure",
            "description": "An immersive Indian jungle adventure where you explore mystical villages, ancient temples, and solve spiritual riddles guided by Rajkumar Veer, the Jungle Raja.",
            "locations": {
                "village_entrance": {
                    "name": "Shanti Gram Village Entrance",
                    "description": "A peaceful Indian village with colorful huts, the scent of spices in the air, and children playing near a banyan tree.",
                    "connections": ["village_square", "temple", "jungle_edge"],
                    "ambience": "You hear temple bells and the distant sound of a sitar"
                },
                "village_square": {
                    "name": "Village Chowk", 
                    "description": "The bustling heart of the village with market stalls selling spices, fabrics, and street food.",
                    "connections": ["village_entrance", "spice_market", "elder_hut"],
                    "ambience": "The air is filled with the aroma of masala chai and sizzling pakoras"
                },
                "temple": {
                    "name": "Ancient Shiva Temple",
                    "description": "A magnificent stone temple with intricate carvings of gods and goddesses.",
                    "connections": ["village_entrance", "sacred_pool"],
                    "ambience": "You hear the chanting of mantras and the gentle ringing of prayer bells"
                },
                "jungle_edge": {
                    "name": "Dense Jungle Border",
                    "description": "Where civilization meets the wild. The jungle ahead is thick with bamboo and teak trees.",
                    "connections": ["village_entrance", "bamboo_forest", "river_ghat"],
                    "ambience": "Monkeys chatter in the distance and peacocks call from the treetops"
                }
            },
            "npcs": {
                "storyteller": {
                    "name": "Baba Gyan",
                    "location": "village_square",
                    "dialogue": "Ah, a seeker! The Jungle Raja awaits those with pure intentions and courage.",
                    "personality": "Wise and mystical storyteller"
                },
                "sadhu": {
                    "name": "Swami Ananda",
                    "location": "river_ghat", 
                    "dialogue": "The jungle tests not your strength, but your heart. Help others, show compassion.",
                    "personality": "Enlightened spiritual guide"
                }
            },
            "quests": {
                "find_jungle_raja": {
                    "name": "Meet the Jungle Raja",
                    "description": "Find the legendary Jungle Raja and receive his blessing",
                    "status": "active"
                }
            }
        }
        
        # Save world info to file
        with open(world_file, 'w') as f:
            json.dump(world_data, f, indent=2)
        logger.info(f"Created world file: {world_file}")
    
    # Load world info from file
    try:
        with open(world_file, 'r') as f:
            world_data = json.load(f)
        logger.info(f"Loaded world info from: {world_file}")
        return world_data
    except Exception as e:
        logger.error(f"Error loading world info: {e}")
        return None

def save_game_progress(game_data):
    """Save game progress to game_saves folder"""
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"game_saves/save_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(game_data, f, indent=2)
        
        logger.info(f"Game saved to: {filename}")
        return filename
    except Exception as e:
        logger.error(f"Error saving game: {e}")
        return None

class JungleRajaAgent(Agent):
    def __init__(self):
        # Load game world information from file
        self.world_info = load_game_world()
        if not self.world_info:
            raise Exception("Failed to load game world information")
            
        self.game_state = {
            "player": {
                "name": "Brave Explorer",
                "health": 100,
                "karma": 50,
                "inventory": ["Torch", "Lota (Water Vessel)", "Roti"],
                "location": "village_entrance",
                "rupees": 100,
                "blessings": 0
            },
            "events": {
                "met_storyteller": False,
                "received_blessing": False,
                "raja_encounter": False,
                "villagers_helped": 0
            },
            "conversation_summary": "",
            "timestamp": datetime.now().isoformat()
        }
        self.conversation_state = "greeting"
        self.game_started = False
        
        # Game Master instructions - include initial greeting in instructions
        instructions = """You are Rajkumar Veer, the Jungle Raja - mystical guardian of Indian wilderness. 

IMPORTANT: You MUST start the conversation with this exact greeting:
"Namaste, brave explorer! I am Rajkumar Veer, the Jungle Raja. Welcome to the mystical lands of India where ancient spirits whisper in the jungle breeze. Where shall our journey begin - the peaceful village or the mysterious jungle?"

After the greeting, follow this conversation flow:
1. Guide the player through different locations using the world information
2. Describe each location with rich, sensory details
3. Introduce NPCs and their dialogues when player visits their locations
4. Track player's karma based on their choices and actions
5. Progress the main quest to find the Jungle Raja

GAME WORLD INFORMATION:
{world_description}

LOCATIONS:
{locations_data}

NPCS:
{npcs_data}

QUESTS:
{quests_data}

RULES:
- Always be wise, spiritual, and majestic
- Use Indian terms naturally: Namaste, Dhanyavaad, Karma, Dharma
- Speak in short, poetic sentences (2-3 sentences maximum)
- Always end with a guiding question
- Keep responses concise and under 150 characters
- Never break character
- Update player's karma based on their choices (+10 for good deeds, -5 for poor choices)
"""

        # Format instructions
        locations_text = "\n".join([f"- {loc_data['name']}: {loc_data['description']} (Ambience: {loc_data['ambience']})" 
                                  for loc_data in self.world_info['locations'].values()])
        
        npcs_text = "\n".join([f"- {npc_data['name']} ({npc_data['location']}): {npc_data['dialogue']}" 
                             for npc_data in self.world_info['npcs'].values()])
        
        quests_text = "\n".join([f"- {quest_data['name']}: {quest_data['description']}" 
                               for quest_data in self.world_info['quests'].values()])
        
        formatted_instructions = instructions.format(
            world_description=self.world_info['description'],
            locations_data=locations_text,
            npcs_data=npcs_text,
            quests_data=quests_text
        )
        
        super().__init__(instructions=formatted_instructions)

    @function_tool
    async def move_to_location(self, context: RunContext, location_name: str) -> str:
        """Move player to a new location and describe it"""
        location_map = {
            "village": "village_entrance",
            "square": "village_square", 
            "temple": "temple",
            "jungle": "jungle_edge",
            "chowk": "village_square",
            "forest": "jungle_edge"
        }
        
        target_location = location_map.get(location_name.lower(), location_name.lower())
        
        if target_location in self.world_info["locations"]:
            self.game_state["player"]["location"] = target_location
            
            # Get location description
            location_data = self.world_info["locations"][target_location]
            description = f"You arrive at {location_data['name']}. {location_data['description']} {location_data['ambience']}"
            
            # Check for location-specific events
            if target_location == "village_square" and not self.game_state["events"]["met_storyteller"]:
                self.game_state["events"]["met_storyteller"] = True
                self.game_state["player"]["karma"] = min(100, self.game_state["player"]["karma"] + 5)
                npc_data = self.world_info["npcs"]["storyteller"]
                description += f"\n\n{npc_data['name']} approaches you: '{npc_data['dialogue']}' Your karma increases by 5!"
            
            elif target_location == "temple" and not self.game_state["events"]["received_blessing"]:
                self.game_state["events"]["received_blessing"] = True
                self.game_state["player"]["karma"] = min(100, self.game_state["player"]["karma"] + 10)
                self.game_state["player"]["blessings"] += 1
                npc_data = self.world_info["npcs"]["sadhu"]
                description += f"\n\n{npc_data['name']} blesses you: '{npc_data['dialogue']}' You receive a blessing! Karma +10."
            
            description += "\n\nWhat calls to your spirit in this place?"
            return description
        else:
            return "That path is hidden from view. You can go to: village, temple, or jungle. Where shall we explore?"

    @function_tool
    async def check_status(self, context: RunContext) -> str:
        """Check player's current status and inventory"""
        player = self.game_state["player"]
        karma_level = "High" if player["karma"] > 70 else "Medium" if player["karma"] > 40 else "Low"
        
        return f"""🧘 Your Spiritual Journey:

❤️ Health: {player['health']}/100
🕉️ Karma: {player['karma']} ({karma_level})
🙏 Blessings: {player['blessings']}
💰 Rupees: {player['rupees']}
🎒 Inventory: {', '.join(player['inventory'])}

What calls to your heart next, brave explorer?"""

    @function_tool
    async def help_villagers(self, context: RunContext) -> str:
        """Perform good deeds to increase karma"""
        karma_gain = random.randint(5, 15)
        self.game_state["player"]["karma"] = min(100, self.game_state["player"]["karma"] + karma_gain)
        self.game_state["events"]["villagers_helped"] += 1
        
        good_deeds = [
            "You help elders carry water from the well. Their grateful smiles warm your soul like morning sunlight.",
            "You teach village children to write their names in the dust. Their joyful laughter becomes music to your heart.",
            "You share your roti with a hungry traveler. Compassion blooms within you like a lotus flower.",
            "You help rebuild a damaged hut after the storm. The community's strength now flows through your hands."
        ]
        
        deed = random.choice(good_deeds)
        return f"{deed} Your karma increases by {karma_gain}! (Total: {self.game_state['player']['karma']}) How else may you serve the people of this village?"

    @function_tool
    async def solve_riddle(self, context: RunContext, answer: str) -> str:
        """Solve spiritual riddles for blessings"""
        correct_answers = ["contentment", "santosh", "peace", "happiness", "nothing"]
        
        if any(correct in answer.lower() for correct in correct_answers):
            self.game_state["player"]["karma"] = min(100, self.game_state["player"]["karma"] + 20)
            self.game_state["player"]["blessings"] += 1
            self.game_state["events"]["raja_encounter"] = True
            return "Wisdom blooms within you like a thousand lotuses! Yes, contentment is the greatest wealth. The Jungle Raja blesses your enlightenment with divine light. Your spiritual journey reaches new heights!"
        else:
            self.game_state["player"]["karma"] = max(0, self.game_state["player"]["karma"] - 5)
            return "The answer lies deeper within your soul. What treasure cannot be bought with gold but brings eternal joy to the heart? Look beyond material things to the essence of being."

    @function_tool
    async def save_game(self, context: RunContext) -> str:
        """Save current game progress"""
        # Update conversation summary
        current_location = self.world_info["locations"][self.game_state["player"]["location"]]["name"]
        summary = f"Exploring {current_location}. Karma: {self.game_state['player']['karma']}. Blessings: {self.game_state['player']['blessings']}. Villagers helped: {self.game_state['events']['villagers_helped']}."
        self.game_state["conversation_summary"] = summary
        
        # Save game to database
        filename = save_game_progress(self.game_state)
        
        if filename:
            return f"📜 Your spiritual journey is preserved in ancient scrolls! The jungle remembers every step of your path. Your dharma will continue when you return to this sacred land."
        else:
            return "The jungle spirits are restless tonight. Your journey continues unsaved for now. Try again when the cosmic energies align."

    @function_tool
    async def end_adventure(self, context: RunContext) -> str:
        """End the adventure with a summary"""
        # Create final summary
        final_karma = self.game_state["player"]["karma"]
        blessings = self.game_state["player"]["blessings"]
        villagers_helped = self.game_state["events"]["villagers_helped"]
        
        if final_karma >= 80:
            ending = "With karma shining brightly, you have achieved spiritual enlightenment. The Jungle Raja bestows upon you his highest blessings!"
        elif final_karma >= 50:
            ending = "Your journey has been one of growth and learning. The jungle acknowledges your balanced path and pure intentions."
        else:
            ending = "Your journey continues, with lessons learned and wisdom gained. The jungle teaches that every path has its purpose."
        
        summary = f"""🎉 Your Adventure Summary:

🕉️ Final Karma: {final_karma}
🙏 Blessings Earned: {blessings}
🤝 Villagers Helped: {villagers_helped}

{ending}

Thank you for exploring the mystical lands of India with me. May your real-life journey be filled with the same wonder and wisdom!"""

        # Save final game state
        self.game_state["conversation_summary"] = summary
        save_game_progress(self.game_state)
        
        return summary

def prewarm(proc: JobProcess):
    """Preload models and game world data"""
    logger.info("Prewarming Jungle Raja agent...")
    proc.userdata["vad"] = silero.VAD.load()
    # Preload game world data
    world_info = load_game_world()
    if world_info:
        logger.info("Game world data loaded successfully during prewarm")
    else:
        logger.error("Failed to load game world data during prewarm")

async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {
        "room": ctx.room.name,
        "agent": "jungle-raja"
    }
    
    logger.info("Starting Jungle Raja agent session...")
    
    try:
        # Initialize Jungle Raja agent
        jungle_agent = JungleRajaAgent()
        logger.info("Jungle Raja agent initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize agent: {e}")
        return

    # Set up voice AI pipeline with MALE voice for Jungle Raja
    session = AgentSession(
        stt=deepgram.STT(model="nova-2"),
        llm=google.LLM(
            model="gemini-2.0-flash",  # Using the same model as working example
        ),
        tts=murf.TTS(
            voice="en-US-ken",  # Male voice for Jungle Raja
            style="Conversation",
            tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
            text_pacing=True
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,  # Same as working example
    )

    # Add event listeners for debugging
    @session.on("user_speech")
    def on_user_speech(transcript: str):
        logger.info(f"Player said: {transcript}")

    @session.on("agent_speech") 
    def on_agent_speech(transcript: str):
        logger.info(f"Jungle Raja responding: {transcript}")

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
            agent=jungle_agent,
            room=ctx.room,
            room_input_options=RoomInputOptions(
                noise_cancellation=noise_cancellation.BVC(),
            ),
        )
        logger.info("Jungle Raja session started successfully")
        
        # Join the room and connect to the user
        await ctx.connect()
        logger.info("Connected to room successfully")
        
    except Exception as e:
        logger.error(f"Error during Jungle Raja session: {e}")
        raise

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))