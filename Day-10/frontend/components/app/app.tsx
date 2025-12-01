'use client';

import { RoomAudioRenderer, StartAudio } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { SessionProvider } from '@/components/app/session-provider';
import { ViewController } from '@/components/app/view-controller';

interface AppProps {
  appConfig: AppConfig;
}

export function App({ appConfig }: AppProps) {
  return (
    <SessionProvider appConfig={appConfig}>
      <div className="min-h-screen bg-background">
        {/* Simple audio starter */}
        <div className="fixed bottom-6 right-6 z-50">
          <StartAudio 
            label="🎤 Start Voice" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full shadow-lg font-medium transition-colors"
          />
        </div>
        
        {/* Main content area */}
        <main className="flex items-center justify-center min-h-screen p-4">
          <ViewController />
        </main>

        {/* Audio renderer */}
        <RoomAudioRenderer />
      </div>
    </SessionProvider>
  );
}