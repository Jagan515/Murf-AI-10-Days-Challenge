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

# Load available courses from shared-data directory
def load_available_courses():
    shared_data_dir = "shared-data"
    os.makedirs(shared_data_dir, exist_ok=True)
    
    # Create default Go course if it doesn't exist
    go_course_file = os.path.join(shared_data_dir, "go_course.json")
    if not os.path.exists(go_course_file):
        default_go_course = [
            {
                "id": "variables",
                "title": "Variables in Go",
                "summary": "Variables in Go store values and must be declared with a specific type. Use 'var' keyword or short declaration ':='. Go is statically typed and supports type inference.",
                "sample_question": "How do you declare a variable in Go and what's the difference between 'var' and short declaration?"
            },
            {
                "id": "constants",
                "title": "Constants",
                "summary": "Constants in Go are immutable values declared with 'const' keyword. They can be typed or untyped and are evaluated at compile time.",
                "sample_question": "What are constants in Go and how do they differ from variables?"
            },
            {
                "id": "loops",
                "title": "Loops in Go",
                "summary": "Go has only 'for' loops that can work as traditional for, while, or infinite loops. No while or do-while keywords - everything uses for.",
                "sample_question": "How does Go implement different types of loops using only the 'for' keyword?"
            },
            {
                "id": "conditionals",
                "title": "Conditional Statements",
                "summary": "Go has if-else statements and switch statements. If can include initialization statements. Switch is more flexible than in other languages.",
                "sample_question": "What are the key features of Go's if and switch statements?"
            },
            {
                "id": "arrays-slices",
                "title": "Arrays and Slices",
                "summary": "Arrays have fixed size, slices are dynamic views into arrays. Slices are more commonly used and have built-in functions like append and copy.",
                "sample_question": "What's the difference between arrays and slices in Go?"
            },
            {
                "id": "maps",
                "title": "Maps",
                "summary": "Maps are key-value collections. They're reference types and need to be initialized with make(). Provide fast lookups by key.",
                "sample_question": "How do you create and use maps in Go?"
            },
            {
                "id": "functions",
                "title": "Functions",
                "summary": "Functions are first-class citizens in Go. They can return multiple values, have named returns, and can be assigned to variables.",
                "sample_question": "What are the special features of functions in Go compared to other languages?"
            },
            {
                "id": "variadic-functions",
                "title": "Variadic Functions",
                "summary": "Variadic functions accept variable number of arguments using '...' syntax. The arguments are treated as a slice inside the function.",
                "sample_question": "How do variadic functions work in Go?"
            },
            {
                "id": "closures",
                "title": "Closures",
                "summary": "Closures are functions that capture variables from their surrounding scope. They maintain state between calls.",
                "sample_question": "What are closures in Go and when would you use them?"
            },
            {
                "id": "pointers",
                "title": "Pointers",
                "summary": "Pointers hold memory addresses. Go has pointers but no pointer arithmetic. Used for passing references and modifying original values.",
                "sample_question": "How do pointers work in Go and what are their limitations?"
            },
            {
                "id": "structs",
                "title": "Structs",
                "summary": "Structs are collections of fields that define a type. They support embedding and can have methods attached to them.",
                "sample_question": "What are structs in Go and how do they support composition?"
            },
            {
                "id": "interfaces",
                "title": "Interfaces",
                "summary": "Interfaces define method sets. Types implicitly implement interfaces by implementing all methods. Empty interface 'interface{}' accepts any type.",
                "sample_question": "How does Go's interface system differ from other languages?"
            },
            {
                "id": "enums",
                "title": "Enums (Iota)",
                "summary": "Go doesn't have enums but uses iota with constants to create enumerated values. Iota auto-increments in const blocks.",
                "sample_question": "How do you implement enums in Go using iota?"
            },
            {
                "id": "generics",
                "title": "Generics",
                "summary": "Generics allow writing type-safe, reusable code. Introduced in Go 1.18 with type parameters and constraints.",
                "sample_question": "How do generics work in Go and what problems do they solve?"
            },
            {
                "id": "goroutines",
                "title": "Goroutines",
                "summary": "Goroutines are lightweight threads managed by the Go runtime. Started with 'go' keyword. They're cheaper than OS threads.",
                "sample_question": "What are goroutines and how do they enable concurrency?"
            },
            {
                "id": "channels",
                "title": "Channels",
                "summary": "Channels are typed conduits for communication between goroutines. They can be buffered or unbuffered and support synchronization.",
                "sample_question": "What are channels and how do they help in goroutine communication?"
            },
            {
                "id": "waitgroups",
                "title": "WaitGroups",
                "summary": "WaitGroups synchronize goroutines by waiting for a collection to finish. Use Add(), Done(), and Wait() methods.",
                "sample_question": "How do WaitGroups help in managing goroutine execution?"
            },
            {
                "id": "mutex",
                "title": "Mutex and Synchronization",
                "summary": "Mutex (mutual exclusion) protects shared resources from concurrent access. Sync package provides Mutex and RWMutex for locking.",
                "sample_question": "When and how would you use mutex in Go programs?"
            },
            {
                "id": "error-handling",
                "title": "Error Handling",
                "summary": "Go uses explicit error return values instead of exceptions. Errors are values that implement the error interface. Multiple return values facilitate this.",
                "sample_question": "How does Go handle errors differently from exception-based languages?"
            },
            {
                "id": "file-operations",
                "title": "File Operations",
                "summary": "Go's os and io packages provide file operations. Includes reading, writing, creating, and deleting files with proper error handling.",
                "sample_question": "What are the main packages and patterns for file operations in Go?"
            },
            {
                "id": "packages",
                "title": "Packages and Modules",
                "summary": "Go code is organized in packages. Modules manage dependencies and versioning. Each file belongs to a package and exports capitalized identifiers.",
                "sample_question": "How does Go's package system work and what are modules?"
            }
        ]
        with open(go_course_file, 'w') as f:
            json.dump(default_go_course, f, indent=2)
    
    # Find all JSON course files
    course_files = []
    for file in os.listdir(shared_data_dir):
        if file.endswith('.json'):
            course_files.append(file)
    
    return course_files

def load_course_content(course_file):
    """Load content from a specific course JSON file"""
    course_path = os.path.join("shared-data", course_file)
    try:
        with open(course_path, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        logger.error(f"Error loading course content from {course_file}: {e}")
        return []

class TutorAgent(Agent):
    def __init__(self, mode: str = "learn", current_concept: dict = None, course_file: str = None) -> None:
        self.mode = mode
        self.current_concept = current_concept
        self.course_file = course_file
        self.concepts = []
        
        if course_file:
            self.concepts = load_course_content(course_file)
        
        # Mode-specific instructions and voices
        mode_configs = {
            "learn": {
                "voice": "en-US-matthew",
                "style": "Conversation",
                "instructions": """You are an engaging tutor in 'learn' mode. Your role is to explain programming concepts clearly and conversationally.
                
                When a concept is selected:
                - Explain it using the summary from our content file
                - Use simple, clear examples
                - Keep explanations under 2-3 sentences
                - Encourage the user to ask questions
                
                {concept_list}
                
                Always start by welcoming the user to learn mode and ask which concept they'd like to learn about."""
            },
            "quiz": {
                "voice": "en-US-alicia", 
                "style": "Conversation",
                "instructions": """You are a quiz master in 'quiz' mode. Your role is to test the user's understanding through questions.
                
                When a concept is selected:
                - Ask the sample question from our content file
                - Listen to their answer
                - Provide gentle correction if needed
                - Give positive reinforcement
                
                {concept_list}
                
                Always start by welcoming the user to quiz mode and ask which concept they want to be quizzed on."""
            },
            "teach_back": {
                "voice": "en-US-ken",
                "style": "Conversation", 
                "instructions": """You are a teaching coach in 'teach_back' mode. Your role is to have the user explain concepts back to you.
                
                When a concept is selected:
                - Ask the user to explain the concept in their own words
                - Listen carefully to their explanation
                - Provide qualitative feedback on what they covered well
                - Gently suggest any missing key points
                
                {concept_list}
                
                Always start by welcoming the user to teach-back mode and ask which concept they'd like to teach back."""
            }
        }
        
        config = mode_configs.get(mode, mode_configs["learn"])
        
        if self.concepts:
            concept_list = "Available concepts: " + ", ".join([f"'{concept['title']}'" for concept in self.concepts])
        else:
            concept_list = "No concepts loaded. Please select a course first."
            
        instructions = config["instructions"].format(concept_list=concept_list)
        
        super().__init__(instructions=instructions)

    @function_tool
    async def switch_mode(self, context: RunContext, new_mode: str) -> str:
        """Switch between learning modes: learn, quiz, or teach_back"""
        valid_modes = ["learn", "quiz", "teach_back"]
        if new_mode.lower() not in valid_modes:
            return f"Please choose from: {', '.join(valid_modes)}"
        
        self.mode = new_mode.lower()
        return f"Switched to {self.mode} mode. How would you like to proceed?"

    @function_tool  
    async def select_concept(self, context: RunContext, concept_name: str) -> str:
        """Select a programming concept to focus on"""
        if not self.concepts:
            return "Please select a course first using 'select_course' tool."
            
        concept_name_lower = concept_name.lower()
        for concept in self.concepts:
            if concept_name_lower in concept["title"].lower() or concept_name_lower in concept["id"].lower():
                self.current_concept = concept
                return f"Selected {concept['title']}. Ready for {self.mode} mode!"
        
        available = ", ".join([concept["title"] for concept in self.concepts])
        return f"Concept '{concept_name}' not found. Available concepts: {available}"

    @function_tool
    async def select_course(self, context: RunContext, course_name: str) -> str:
        """Select a course from available JSON files"""
        available_courses = load_available_courses()
        course_name_lower = course_name.lower()
        
        # Try to find matching course file
        matching_courses = []
        for course_file in available_courses:
            if course_name_lower in course_file.lower():
                matching_courses.append(course_file)
        
        if not matching_courses:
            available_list = ", ".join([c.replace('.json', '') for c in available_courses])
            return f"Course '{course_name}' not found. Available courses: {available_list}"
        
        # Use first matching course
        selected_course = matching_courses[0]
        self.course_file = selected_course
        self.concepts = load_course_content(selected_course)
        
        if not self.concepts:
            return f"Failed to load content from {selected_course}"
            
        concept_count = len(self.concepts)
        course_display_name = selected_course.replace('.json', '')
        return f"Selected {course_display_name} course with {concept_count} concepts. Now choose a learning mode and concept!"

    @function_tool
    async def list_courses(self, context: RunContext) -> str:
        """List all available courses"""
        available_courses = load_available_courses()
        if not available_courses:
            return "No courses available. Please add JSON course files to the shared-data folder."
        
        course_list = ", ".join([c.replace('.json', '') for c in available_courses])
        return f"Available courses: {course_list}. Use 'select_course' to choose one."

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()

async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }
    
    # Create shared-data directory and ensure default courses exist
    os.makedirs("shared-data", exist_ok=True)
    available_courses = load_available_courses()
    
    if not available_courses:
        logger.error("No course files available in shared-data")
        return

    # Initialize tutor agent - start without a course selected
    tutor_agent = TutorAgent(mode="learn")

    # Set up voice AI pipeline with default learn mode voice
    session = AgentSession(
        stt=deepgram.STT(model="nova-3"),
        llm=google.LLM(
            model="gemini-2.5-flash",
        ),
        tts=murf.TTS(
            voice="en-US-matthew",  # Default learn mode voice
            style="Conversation",
            tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
            text_pacing=True
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,
    )

    # Metrics collection
    usage_collector = metrics.UsageCollector()
    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)
    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")
    ctx.add_shutdown_callback(log_usage)

    # Start the session
    await session.start(
        agent=tutor_agent,
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Join the room and connect to the user
    await ctx.connect()

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))