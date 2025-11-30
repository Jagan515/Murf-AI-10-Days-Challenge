import { Button } from '@/components/livekit/button';

function ShoppingCartIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-fg0 mb-6"
    >
      {/* E-commerce Theme with Shopping Cart and Voice Waves */}
      <defs>
        <linearGradient id="shoppingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="voiceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <radialGradient id="glowEffect">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      
      {/* Shopping Cart Base */}
      <rect x="20" y="35" width="40" height="30" rx="8" fill="url(#shoppingGradient)" stroke="#2563EB" strokeWidth="2" />
      
      {/* Cart Handle */}
      <path d="M25,35 Q30,25 35,35" stroke="#1D4ED8" strokeWidth="3" strokeLinecap="round" />
      <path d="M45,35 Q50,25 55,35" stroke="#1D4ED8" strokeWidth="3" strokeLinecap="round" />
      
      {/* Shopping Items */}
      <circle cx="35" cy="45" r="6" fill="#EF4444" opacity="0.9">
        <animate attributeName="cy" values="45;43;45" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="45" cy="48" r="5" fill="#10B981" opacity="0.9">
        <animate attributeName="cy" values="48;46;48" dur="2.2s" repeatCount="indefinite"/>
      </circle>
      
      {/* Voice Waves */}
      <g className="animate-pulse">
        <path d="M60,20 Q65,25 60,30" stroke="url(#voiceGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite"/>
        </path>
        <path d="M65,15 Q72,25 65,35" stroke="url(#voiceGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M70,10 Q80,25 70,40" stroke="url(#voiceGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2.5s" repeatCount="indefinite"/>
        </path>
      </g>
      
      {/* Digital Elements */}
      <g className="animate-float">
        <rect x="25" y="25" width="4" height="4" fill="#8B5CF6" rx="1" opacity="0.8">
          <animate attributeName="y" values="25;22;25" dur="2.5s" repeatCount="indefinite"/>
        </rect>
        <rect x="50" y="28" width="3" height="3" fill="#F59E0B" rx="1" opacity="0.7">
          <animate attributeName="y" values="28;25;28" dur="2s" repeatCount="indefinite"/>
        </rect>
        <rect x="40" y="55" width="3.5" height="3.5" fill="#06B6D4" rx="1" opacity="0.9">
          <animate attributeName="y" values="55;52;55" dur="1.8s" repeatCount="indefinite"/>
        </rect>
      </g>
      
      {/* Sparkles */}
      <g className="animate-pulse">
        <circle cx="20" cy="20" r="1" fill="#60A5FA" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="60" cy="15" r="1.2" fill="#10B981" opacity="0.7">
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
    <div ref={ref} className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Animated Digital Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-400 rounded-sm animate-pulse"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
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
          <ShoppingCartIcon />
        </div>

        {/* Animated Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent animate-gradient">
            Voice Shopping
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-4"></div>
          <h2 className="text-xl font-semibold text-blue-100 mb-2">
            AI-Powered E-commerce Assistant
          </h2>
          <p className="text-sm text-blue-200 max-w-md mx-auto">
            Following Agentic Commerce Protocol (ACP)
          </p>
        </div>
        
        {/* App Description */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-2xl border border-blue-500/30 max-w-md">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-400 text-sm font-semibold">LIVE SHOPPING ASSISTANT</p>
          </div>
          
          <p className="text-blue-100 leading-7 font-medium mb-4 text-left">
            🎯 <span className="text-blue-300 font-semibold">"Namaste! Welcome to Voice Shopping!"</span> 
            I'm your AI shopping assistant, here to help you browse products and place orders using just your voice. 
            Experience the future of e-commerce with natural conversations and seamless shopping.
          </p>

          {/* Shopping Features */}
          <div className="grid grid-cols-2 gap-3 text-left mb-4">
            <div className="flex items-center gap-2 p-2 bg-blue-500/20 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🔍</span>
              </div>
              <span className="text-xs font-medium text-blue-100">Browse Catalog</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-indigo-500/20 rounded-lg">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🎤</span>
              </div>
              <span className="text-xs font-medium text-blue-100">Voice Orders</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-purple-500/20 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📦</span>
              </div>
              <span className="text-xs font-medium text-blue-100">Order History</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-500/20 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">💰</span>
              </div>
              <span className="text-xs font-medium text-blue-100">Price Filters</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <Button 
          variant="primary" 
          size="lg" 
          onClick={onStartCall} 
          className="relative overflow-hidden group font-sans bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl text-lg font-bold border-0 mb-4"
        >
          <span className="relative z-10 flex items-center gap-3">
            🛒 {startButtonText}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Button>

        {/* Restart Button */}
        {onRestart && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRestart}
            className="bg-gray-700 hover:bg-gray-600 text-blue-100 border-0"
          >
            🔄 Restart Shopping
          </Button>
        )}
        
        {/* Voice Command Examples */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl p-5 border border-blue-400/30 max-w-md">
          <p className="text-blue-300 text-sm font-semibold mb-3 flex items-center justify-center gap-2">
            <span className="text-blue-400">🗣️ Shopping Commands:</span>
          </p>
          <div className="space-y-2 text-left">
            <div className="flex items-start gap-2">
              <span className="text-blue-400 text-xs mt-1">•</span>
              <span className="text-blue-100 text-xs">"Show me all coffee mugs"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 text-xs mt-1">•</span>
              <span className="text-blue-100 text-xs">"Do you have t-shirts under 1000 rupees?"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 text-xs mt-1">•</span>
              <span className="text-blue-100 text-xs">"I want to buy hoodie-001"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 text-xs mt-1">•</span>
              <span className="text-blue-100 text-xs">"What did I order last?"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 text-xs mt-1">•</span>
              <span className="text-blue-100 text-xs">"Show me black hoodies"</span>
            </div>
          </div>
        </div>
        
        {/* Shopping Stats */}
        <div className="mt-6 flex gap-6 text-xs text-blue-300">
          <div className="text-center">
            <div className="font-bold text-blue-400">7+</div>
            <div>Products</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-indigo-400">3</div>
            <div>Categories</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-400">ACP</div>
            <div>Protocol</div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <div className="fixed bottom-5 left-0 right-0 flex justify-center">
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-blue-500/30">
          <p className="text-blue-300 text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Voice Shopping Assistant • ACP Protocol • 
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.livekit.io"
              className="text-blue-400 hover:text-blue-300 font-semibold underline"
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