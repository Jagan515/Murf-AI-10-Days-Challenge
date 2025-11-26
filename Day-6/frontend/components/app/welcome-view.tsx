import { Button } from '@/components/livekit/button';

function SBI_ShieldIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-fg0 mb-4 size-16"
    >
      {/* SBI-themed shield with Indian tricolor elements */}
      <defs>
        <linearGradient id="sbiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1F5C99" />
          <stop offset="100%" stopColor="#0D3D6B" />
        </linearGradient>
      </defs>
      
      {/* Shield base */}
      <path
        d="M32 4L42 9V19C42 29.5 37.5 40.5 32 46C26.5 40.5 22 29.5 22 19V9L32 4Z"
        fill="url(#sbiGradient)"
        stroke="#0D3D6B"
        strokeWidth="2"
      />
      
      {/* Keyhole/security symbol */}
      <circle cx="32" cy="25" r="8" fill="#FFFFFF" opacity="0.9" />
      <rect x="29" y="25" width="6" height="10" rx="3" fill="#1F5C99" />
      <circle cx="32" cy="20" r="2" fill="#1F5C99" />
      
      {/* Check marks for verification */}
      <path
        d="M24 36L28 40L40 28"
        stroke="#FF9933"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 44L28 48L40 36"
        stroke="#138808"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* SBI text */}
      <text x="32" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
        SBI
      </text>
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
    <div ref={ref}>
      <section className="bg-background flex flex-col items-center justify-center text-center">
        <SBI_ShieldIcon />

        <h1 className="text-foreground text-2xl font-bold mb-2 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
          State Bank of India
        </h1>
        <h2 className="text-foreground text-lg font-semibold mb-4">
          Fraud Detection System
        </h2>
        
        <p className="text-foreground max-w-prose pt-1 leading-6 font-medium">
          Namaste! Welcome to State Bank of India's AI-powered fraud detection system. 
          Test our secure transaction verification process.
        </p>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Secure identity verification
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Real-time transaction monitoring
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            Immediate fraud protection
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            24/7 AI customer support
          </p>
        </div>

        <Button 
          variant="primary" 
          size="lg" 
          onClick={onStartCall} 
          className="mt-6 w-64 font-sans bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg"
        >
          {startButtonText}
        </Button>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-md">
          <p className="text-muted-foreground text-xs font-medium">
            Demo Test Users:
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            Rahul Sharma • Priya Singh • Arjun Kumar • Ananya Reddy • Vikram Mehta
          </p>
        </div>
        
        <p className="text-muted-foreground text-xs mt-3">
          🇮🇳 The Nation Banks On Us • Demo purposes only
        </p>
      </section>

      <div className="fixed bottom-5 left-0 flex w-full items-center justify-center">
        <p className="text-muted-foreground max-w-prose pt-1 text-xs leading-5 font-normal text-pretty md:text-sm">
          State Bank of India Demo System • No real financial data • {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.sbi.co.in"
            className="underline text-blue-700 font-medium"
          >
            Visit SBI Official Website
          </a>
        </p>
      </div>
    </div>
  );
};