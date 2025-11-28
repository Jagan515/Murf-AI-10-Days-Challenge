import { Button } from '@/components/livekit/button';

function JungleRajaIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-fg0 mb-6"
    >
      {/* Indian Jungle Theme with Tiger and Peacock */}
      <defs>
        <linearGradient id="jungleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="peacockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <radialGradient id="glowEffect">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      
      {/* Tiger Head */}
      <circle cx="40" cy="40" r="35" fill="url(#jungleGradient)" stroke="#D97706" strokeWidth="2" />
      
      {/* Tiger Stripes */}
      <path d="M25,30 Q40,25 55,30" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />
      <path d="M22,40 Q40,35 58,40" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />
      <path d="M25,50 Q40,45 55,50" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />
      
      {/* Tiger Eyes */}
      <circle cx="32" cy="35" r="4" fill="#7C2D12">
        <animate attributeName="r" values="4;3;4" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="48" cy="35" r="4" fill="#7C2D12">
        <animate attributeName="r" values="4;3;4" dur="2s" repeatCount="indefinite" begin="0.5s"/>
      </circle>
      
      {/* Peacock Feather Crown */}
      <path d="M40,15 Q45,5 50,15 Q55,25 40,20 Q25,25 30,15 Q35,5 40,15" 
            fill="url(#peacockGradient)" opacity="0.9" />
      
      {/* Magical Glow */}
      <circle cx="40" cy="40" r="25" fill="url(#glowEffect)" opacity="0.6">
        <animate attributeName="r" values="25;28;25" dur="3s" repeatCount="indefinite"/>
      </circle>
      
      {/* Floating Elements */}
      <g className="animate-float">
        <circle cx="25" cy="25" r="3" fill="#EF4444" opacity="0.8">
          <animate attributeName="cy" values="25;22;25" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="55" cy="30" r="2" fill="#8B5CF6" opacity="0.7">
          <animate attributeName="cy" values="30;27;30" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="35" cy="55" r="2.5" fill="#10B981" opacity="0.9">
          <animate attributeName="cy" values="55;52;55" dur="1.8s" repeatCount="indefinite"/>
        </circle>
      </g>
      
      {/* Sparkles */}
      <g className="animate-pulse">
        <circle cx="20" cy="20" r="1" fill="#FBBF24" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="60" cy="25" r="1.2" fill="#10B981" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="45" cy="60" r="1" fill="#EF4444" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.8s" repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
  onRestart?: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  onRestart,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref} className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900">
      {/* Animated Diya/Flame Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-yellow-200 rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-4 py-8">
        <div className="mb-4">
          <JungleRajaIcon />
        </div>

        {/* Animated Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent animate-gradient">
            Jungle Raja
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full mb-4"></div>
          <h2 className="text-xl font-semibold text-amber-100 mb-2">
            Voice-Powered Indian Adventure
          </h2>
          <p className="text-sm text-amber-200 max-w-md mx-auto">
            Guided by Rajkumar Veer, Your AI Jungle King
          </p>
        </div>
        
        {/* Game Description */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-2xl border border-amber-500/30 max-w-md">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-400 text-sm font-semibold">LIVE JUNGLE MASTER</p>
          </div>
          
          <p className="text-amber-100 leading-7 font-medium mb-4 text-left">
            🐯 <span className="text-amber-300 font-semibold">"Namaste, Brave Explorer!"</span> 
            I am <span className="text-orange-300">Rajkumar Veer</span>, the Jungle Raja - guardian of these sacred lands. 
            Together we'll explore mystical villages, ancient temples, and solve spiritual riddles in the heart of India.
          </p>

          {/* Game Features */}
          <div className="grid grid-cols-2 gap-3 text-left mb-4">
            <div className="flex items-center gap-2 p-2 bg-amber-500/20 rounded-lg">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🕉️</span>
              </div>
              <span className="text-xs font-medium text-amber-100">Karma System</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-orange-500/20 rounded-lg">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🏮</span>
              </div>
              <span className="text-xs font-medium text-amber-100">Indian Villages</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-red-500/20 rounded-lg">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🧩</span>
              </div>
              <span className="text-xs font-medium text-amber-100">Spiritual Riddles</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-500/20 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">💾</span>
              </div>
              <span className="text-xs font-medium text-amber-100">Save Journey</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <Button 
          variant="primary" 
          size="lg" 
          onClick={onStartCall} 
          className="relative overflow-hidden group font-sans bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-2xl hover:shadow-amber-500/25 transform hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl text-lg font-bold border-0 mb-4"
        >
          <span className="relative z-10 flex items-center gap-3">
            🐯 {startButtonText}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Button>

        {/* Restart Button */}
        {onRestart && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRestart}
            className="bg-gray-700 hover:bg-gray-600 text-amber-100 border-0"
          >
            🔄 Restart Journey
          </Button>
        )}
        
        {/* Voice Command Examples */}
        <div className="mt-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-5 border border-amber-400/30 max-w-md">
          <p className="text-amber-300 text-sm font-semibold mb-3 flex items-center justify-center gap-2">
            <span className="text-amber-400">🗣️ Adventure Commands:</span>
          </p>
          <div className="space-y-2 text-left">
            <div className="flex items-start gap-2">
              <span className="text-amber-400 text-xs mt-1">•</span>
              <span className="text-amber-100 text-xs">"Go to the village temple"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 text-xs mt-1">•</span>
              <span className="text-amber-100 text-xs">"Check my karma and inventory"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 text-xs mt-1">•</span>
              <span className="text-amber-100 text-xs">"Help the villagers"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 text-xs mt-1">•</span>
              <span className="text-amber-100 text-xs">"Solve the spiritual riddle"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 text-xs mt-1">•</span>
              <span className="text-amber-100 text-xs">"Visit the river ghat"</span>
            </div>
          </div>
        </div>
        
        {/* Game Stats */}
        <div className="mt-6 flex gap-6 text-xs text-amber-300">
          <div className="text-center">
            <div className="font-bold text-amber-400">6+</div>
            <div>Sacred Locations</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-orange-400">3+</div>
            <div>Wise NPCs</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-400">5+</div>
            <div>Spiritual Quests</div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <div className="fixed bottom-5 left-0 right-0 flex justify-center">
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-amber-500/30">
          <p className="text-amber-300 text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Jungle Raja • Indian Voice Adventure • 
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.livekit.io"
              className="text-amber-400 hover:text-amber-300 font-semibold underline"
            >
              LiveKit
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};