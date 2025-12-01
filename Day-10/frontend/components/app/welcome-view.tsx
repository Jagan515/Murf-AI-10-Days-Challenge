import { Button } from '@/components/livekit/button';

function TheaterMaskIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-fg0 mb-6"
    >
      {/* Theater/Improv Theme with Comedy/Tragedy Masks */}
      <defs>
        <linearGradient id="theaterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="spotlightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <radialGradient id="stageGlow">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      
      {/* Stage Platform */}
      <rect x="15" y="45" width="50" height="10" rx="4" fill="#4C1D95" stroke="#7C3AED" strokeWidth="2" />
      
      {/* Comedy Mask (Smiling) */}
      <circle cx="30" cy="35" r="12" fill="url(#theaterGradient)" stroke="#7C3AED" strokeWidth="1.5" />
      <path d="M25,32 Q30,38 35,32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="27" cy="32" r="1.5" fill="#FFFFFF" />
      <circle cx="33" cy="32" r="1.5" fill="#FFFFFF" />
      
      {/* Tragedy Mask (Sad) */}
      <circle cx="50" cy="35" r="12" fill="url(#theaterGradient)" stroke="#7C3AED" strokeWidth="1.5" />
      <path d="M45,38 Q50,32 55,38" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="47" cy="32" r="1.5" fill="#FFFFFF" />
      <circle cx="53" cy="32" r="1.5" fill="#FFFFFF" />
      
      {/* Spotlight Effect */}
      <g className="animate-pulse">
        <ellipse cx="40" cy="15" rx="25" ry="8" fill="url(#spotlightGradient)" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="40" cy="20" rx="20" ry="6" fill="url(#spotlightGradient)" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.2;0.4" dur="2.2s" repeatCount="indefinite"/>
        </ellipse>
      </g>
      
      {/* Floating Curtain Elements */}
      <g className="animate-float">
        <path d="M10,25 Q15,15 20,25" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" opacity="0.8">
          <animate attributeName="d" values="M10,25 Q15,15 20,25; M10,23 Q15,18 20,23; M10,25 Q15,15 20,25" dur="3s" repeatCount="indefinite"/>
        </path>
        <path d="M60,25 Q65,15 70,25" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" opacity="0.8">
          <animate attributeName="d" values="M60,25 Q65,15 70,25; M60,23 Q65,18 70,23; M60,25 Q65,15 70,25" dur="3s" repeatCount="indefinite" begin="0.5s"/>
        </path>
      </g>
      
      {/* Stage Lights */}
      <g className="animate-pulse">
        <circle cx="20" cy="20" r="2" fill="#60A5FA" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="60" cy="20" r="2" fill="#60A5FA" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.8s" repeatCount="indefinite"/>
        </circle>
      </g>
      
      {/* Sparkles */}
      <g className="animate-pulse">
        <circle cx="15" cy="15" r="1" fill="#FBBF24" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="65" cy="15" r="1.2" fill="#10B981" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="60" r="1" fill="#EF4444" opacity="0.9">
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
    <div ref={ref} className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-fuchsia-900">
      {/* Animated Stage Lights Background */}
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
          <TheaterMaskIcon />
        </div>

        {/* Animated Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent animate-gradient">
            Improv Battle
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-4"></div>
          <h2 className="text-xl font-semibold text-purple-100 mb-2">
            Voice-Powered Theater Game
          </h2>
          <p className="text-sm text-purple-200 max-w-md mx-auto">
            Hosted by Alex "Quick-Wit" Johnson
          </p>
        </div>
        
        {/* Game Description */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-2xl border border-purple-500/30 max-w-md">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-400 text-sm font-semibold">LIVE GAME SHOW HOST</p>
          </div>
          
          <p className="text-purple-100 leading-7 font-medium mb-4 text-left">
            🎭 <span className="text-purple-300 font-semibold">"Welcome to IMPROV BATTLE!"</span> 
            I'm your host <span className="text-yellow-300">Alex Quick-Wit Johnson</span>, and we're about to dive into the wild world of spontaneous theater! 
            Get ready for hilarious scenarios, creative challenges, and honest feedback in this voice-powered improv experience.
          </p>

          {/* Game Features */}
          <div className="grid grid-cols-2 gap-3 text-left mb-4">
            <div className="flex items-center gap-2 p-2 bg-purple-500/20 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🎯</span>
              </div>
              <span className="text-xs font-medium text-purple-100">3 Rounds</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-pink-500/20 rounded-lg">
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🎤</span>
              </div>
              <span className="text-xs font-medium text-purple-100">Voice Acting</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-yellow-500/20 rounded-lg">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🏆</span>
              </div>
              <span className="text-xs font-medium text-purple-100">Host Feedback</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-red-500/20 rounded-lg">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✨</span>
              </div>
              <span className="text-xs font-medium text-purple-100">Creative Scenarios</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <Button 
          variant="primary" 
          size="lg" 
          onClick={onStartCall} 
          className="relative overflow-hidden group font-sans bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl text-lg font-bold border-0 mb-4"
        >
          <span className="relative z-10 flex items-center gap-3">
            🎭 {startButtonText}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Button>

        {/* Restart Button */}
        {onRestart && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRestart}
            className="bg-gray-700 hover:bg-gray-600 text-purple-100 border-0"
          >
            🔄 New Performance
          </Button>
        )}
        
        {/* Voice Command Examples */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-5 border border-purple-400/30 max-w-md">
          <p className="text-purple-300 text-sm font-semibold mb-3 flex items-center justify-center gap-2">
            <span className="text-purple-400">🗣️ Game Commands:</span>
          </p>
          <div className="space-y-2 text-left">
            <div className="flex items-start gap-2">
              <span className="text-purple-400 text-xs mt-1">•</span>
              <span className="text-purple-100 text-xs">"My name is [Your Name]"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 text-xs mt-1">•</span>
              <span className="text-purple-100 text-xs">"I'm ready for the next round"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 text-xs mt-1">•</span>
              <span className="text-purple-100 text-xs">Perform improv scenes naturally</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 text-xs mt-1">•</span>
              <span className="text-purple-100 text-xs">"That was fun, thanks!"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 text-xs mt-1">•</span>
              <span className="text-purple-100 text-xs">"Can we stop here?"</span>
            </div>
          </div>
        </div>
        
        {/* Game Stats */}
        <div className="mt-6 flex gap-6 text-xs text-purple-300">
          <div className="text-center">
            <div className="font-bold text-purple-400">8+</div>
            <div>Scenarios</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-pink-400">3</div>
            <div>Rounds</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-yellow-400">Live</div>
            <div>Host</div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <div className="fixed bottom-5 left-0 right-0 flex justify-center">
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-purple-500/30">
          <p className="text-purple-300 text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Improv Battle • Voice Theater Game • 
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.livekit.io"
              className="text-purple-400 hover:text-purple-300 font-semibold underline"
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