import { Button } from '@/components/livekit/button';

function JarIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-fg0 mb-4 size-16"
    >
      {/* Jar/Savings themed icon */}
      <path
        d="M32 12C24.82 12 19 17.82 19 25V27C19 34.18 24.82 40 32 40C39.18 40 45 34.18 45 27V25C45 17.82 39.18 12 32 12Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M28 18H36C37.1 18 38 18.9 38 20V22C38 23.1 37.1 24 36 24H28C26.9 24 26 23.1 26 22V20C26 18.9 26.9 18 28 18Z"
        fill="#FFD700"
        stroke="#FFD700"
        strokeWidth="1"
      />
      <path
        d="M25 44C25 42.34 26.34 41 28 41H36C37.66 41 39 42.34 39 44V48C39 49.66 37.66 51 36 51H28C26.34 51 25 49.66 25 48V44Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M22 48H42V52C42 53.1 41.1 54 40 54H24C22.9 54 22 53.1 22 52V48Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Coin/digital gold elements */}
      <circle cx="32" cy="30" r="3" fill="#FFD700" stroke="#FFD700" strokeWidth="1" />
      <circle cx="27" cy="33" r="2" fill="#FFD700" stroke="#FFD700" strokeWidth="1" />
      <circle cx="37" cy="33" r="2" fill="#FFD700" stroke="#FFD700" strokeWidth="1" />
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
        <JarIcon />

        <h1 className="text-foreground text-2xl font-bold mb-2">
          Welcome to Jar Micro-Savings
        </h1>
        
        <p className="text-foreground max-w-prose pt-1 leading-6 font-medium">
          Chat with our AI savings consultant to learn how you can start saving 
          with as little as ₹1 and invest in digital gold
        </p>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>✓ Start saving from just ₹1 daily</p>
          <p>✓ Invest in 24K digital gold</p>
          <p>✓ Zero commission on gold purchases</p>
          <p>✓ Completely free account opening</p>
        </div>

        <Button 
          variant="primary" 
          size="lg" 
          onClick={onStartCall} 
          className="mt-6 w-64 font-mono bg-yellow-600 hover:bg-yellow-700"
        >
          {startButtonText}
        </Button>
        
        <p className="text-muted-foreground text-xs mt-3">
          Speak with our friendly savings consultant (Female AI Assistant)
        </p>
      </section>

      <div className="fixed bottom-5 left-0 flex w-full items-center justify-center">
        <p className="text-muted-foreground max-w-prose pt-1 text-xs leading-5 font-normal text-pretty md:text-sm">
          India's fastest growing micro-savings app • {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://jarapp.in"
            className="underline text-yellow-600"
          >
            Learn more about Jar
          </a>
        </p>
      </div>
    </div>
  );
};