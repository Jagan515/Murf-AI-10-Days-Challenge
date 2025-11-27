import { Button } from '@/components/livekit/button';

function QuickBasketIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-fg0 mb-6"
    >
      {/* Modern shopping basket with gradient */}
      <defs>
        <linearGradient id="basketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="50%" stopColor="#FF8E53" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
        <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A90E2" />
          <stop offset="100%" stopColor="#357ABD" />
        </linearGradient>
      </defs>
      
      {/* Basket Body */}
      <path
        d="M20 25H60L55 50H25L20 25Z"
        fill="url(#basketGradient)"
        stroke="#FF6B35"
        strokeWidth="2"
      />
      
      {/* Basket Pattern */}
      <path
        d="M25 30H55"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeOpacity="0.3"
        strokeDasharray="2,2"
      />
      <path
        d="M25 35H55"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeOpacity="0.3"
        strokeDasharray="2,2"
      />
      <path
        d="M25 40H55"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeOpacity="0.3"
        strokeDasharray="2,2"
      />
      
      {/* Modern Handle */}
      <path
        d="M30 20C30 18.5 32 15 35 15H45C48 15 50 18.5 50 20"
        stroke="url(#handleGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Floating Items */}
      <g className="animate-float">
        <circle cx="35" cy="32" r="4" fill="#FFD700" opacity="0.9">
          <animate attributeName="cy" values="32;30;32" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="45" cy="35" r="3" fill="#87CEEB" opacity="0.9">
          <animate attributeName="cy" values="35;33;35" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="28" r="2.5" fill="#98FB98" opacity="0.9">
          <animate attributeName="cy" values="28;26;28" dur="1.8s" repeatCount="indefinite"/>
        </circle>
      </g>
      
      {/* Sparkle Effects */}
      <g className="animate-pulse">
        <circle cx="28" cy="18" r="1" fill="#FFFFFF" opacity="0.8"/>
        <circle cx="52" cy="22" r="1" fill="#FFFFFF" opacity="0.6"/>
        <circle cx="45" cy="15" r="0.8" fill="#FFFFFF" opacity="0.7"/>
      </g>
    </svg>
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref} className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/4 -right-10 w-16 h-16 bg-amber-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-1/3 left-1/4 w-12 h-12 bg-orange-300 rounded-full opacity-25 animate-ping"></div>
      </div>

      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-4 py-8">
        <div className="mb-2">
          <QuickBasketIcon />
        </div>

        {/* Animated Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 via-red-500 to-amber-600 bg-clip-text text-transparent animate-gradient">
            QuickBasket
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full mb-3"></div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Your AI Shopping Assistant
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Powered by Priya - Your friendly voice shopping companion
          </p>
        </div>
        
        {/* Main Description */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-orange-100 max-w-md">
          <p className="text-gray-700 leading-7 font-medium mb-4">
            🎉 <span className="text-orange-600 font-semibold">Namaste!</span> I'm Priya, your personal shopping assistant. 
            Let's fill your basket with fresh groceries and delicious food using just your voice!
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 text-left mb-4">
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🎯</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Smart Recipes</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">⚡</span>
              </div>
              <span className="text-xs font-medium text-gray-700">30-min Delivery</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🎙️</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Voice Control</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">💰</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Best Prices</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <Button 
          variant="primary" 
          size="lg" 
          onClick={onStartCall} 
          className="relative overflow-hidden group font-sans bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl text-lg font-semibold border-0"
        >
          <span className="relative z-10 flex items-center gap-2">
            🎤 {startButtonText}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </Button>
        
        {/* Voice Command Examples */}
        <div className="mt-8 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-5 border border-orange-200 max-w-md">
          <p className="text-orange-800 text-sm font-semibold mb-3 flex items-center justify-center gap-2">
            <span className="text-orange-600">💡 Try These Voice Commands:</span>
          </p>
          <div className="space-y-2 text-left">
            <div className="flex items-start gap-2">
              <span className="text-orange-500 text-xs mt-1">•</span>
              <span className="text-gray-700 text-xs">"Add bread and eggs to my cart"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-500 text-xs mt-1">•</span>
              <span className="text-gray-700 text-xs">"I need ingredients for a sandwich"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-500 text-xs mt-1">•</span>
              <span className="text-gray-700 text-xs">"Show me what's in my basket"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-500 text-xs mt-1">•</span>
              <span className="text-gray-700 text-xs">"Place my order for delivery"</span>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-6 flex gap-6 text-xs text-gray-500">
          <div className="text-center">
            <div className="font-bold text-orange-600">500+</div>
            <div>Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-amber-600">30min</div>
            <div>Avg. Delivery</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-red-500">4.9★</div>
            <div>Rating</div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <div className="fixed bottom-5 left-0 right-0 flex justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-orange-200">
          <p className="text-gray-600 text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            QuickBasket Demo • Voice AI Shopping • 
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://quickbasket.demo"
              className="text-orange-600 hover:text-orange-700 font-semibold underline"
            >
              Learn More
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
          animation: gradient 3s ease infinite;
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