'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { AppConfig } from '@/app-config';
import { ChatTranscript } from '@/components/app/chat-transcript';
import { PreConnectMessage } from '@/components/app/preconnect-message';
import { TileLayout } from '@/components/app/tile-layout';
import {
  AgentControlBar,
  type ControlBarControls,
} from '@/components/livekit/agent-control-bar/agent-control-bar';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useConnectionTimeout } from '@/hooks/useConnectionTimout';
import { useDebugMode } from '@/hooks/useDebug';
import { cn } from '@/lib/utils';

const MotionBottom = motion.create('div');

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const BOTTOM_VIEW_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
      translateY: '0%',
    },
    hidden: {
      opacity: 0,
      translateY: '100%',
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.3,
    delay: 0.5,
    ease: 'easeOut',
  },
};

interface FadeProps {
  top?: boolean;
  bottom?: boolean;
  className?: string;
}

export function Fade({ top = false, bottom = false, className }: FadeProps) {
  return (
    <div
      className={cn(
        'from-background pointer-events-none h-4 bg-linear-to-b to-transparent',
        top && 'bg-linear-to-b',
        bottom && 'bg-linear-to-t',
        className
      )}
    />
  );
}

interface SessionViewProps {
  appConfig: AppConfig;
}

// Improv Battle state interface
interface ImprovState {
  playerName: string;
  currentRound: number;
  totalRounds: number;
  scenariosCompleted: number;
  hostMood: string;
  performanceNotes: string[];
  currentPhase: string;
}

export const SessionView = ({
  appConfig,
  ...props
}: React.ComponentProps<'section'> & SessionViewProps) => {
  useConnectionTimeout(200_000);
  useDebugMode({ enabled: IN_DEVELOPMENT });

  const messages = useChatMessages();
  const [chatOpen, setChatOpen] = useState(false);
  const [improvState, setImprovState] = useState<ImprovState>({
    playerName: 'Contestant',
    currentRound: 0,
    totalRounds: 3,
    scenariosCompleted: 0,
    hostMood: 'energetic',
    performanceNotes: [],
    currentPhase: 'intro'
  });
  const [isImprovMode, setIsImprovMode] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const controls: ControlBarControls = {
    leave: true,
    microphone: true,
    chat: appConfig.supportsChatInput,
    camera: appConfig.supportsVideoInput,
    screenShare: appConfig.supportsVideoInput,
  };

  // Detect if we're in improv mode based on messages
  useEffect(() => {
    const hasImprovKeywords = messages.some(message => 
      message.message?.toLowerCase().includes('improv') ||
      message.message?.toLowerCase().includes('scene') ||
      message.message?.toLowerCase().includes('character') ||
      message.message?.toLowerCase().includes('host') ||
      message.message?.toLowerCase().includes('alex') ||
      message.message?.toLowerCase().includes('round') ||
      message.message?.toLowerCase().includes('scenario') ||
      message.message?.toLowerCase().includes('performance')
    );
    
    if (hasImprovKeywords && !isImprovMode) {
      setIsImprovMode(true);
    }
  }, [messages, isImprovMode]);

  // Update improv state based on chat messages
  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (lastMessage && !lastMessage.from?.isLocal) {
      const message = lastMessage.message.toLowerCase();
      
      // Extract player name
      if (message.includes('welcome') && message.includes('name')) {
        const nameMatch = message.match(/welcome.*?(\w+)/i);
        if (nameMatch && nameMatch[1]) {
          setImprovState(prev => ({ 
            ...prev, 
            playerName: nameMatch[1] 
          }));
        }
      }
      
      // Detect round progression
      if (message.includes('round') && (message.includes('start') || message.includes('next'))) {
        setImprovState(prev => ({ 
          ...prev, 
          currentRound: Math.min(prev.totalRounds, prev.currentRound + 1),
          currentPhase: 'performing'
        }));
      }
      
      // Detect scenario completion
      if ((message.includes('react') || message.includes('feedback') || message.includes('comment')) && 
          !message.includes('next')) {
        setImprovState(prev => ({ 
          ...prev, 
          scenariosCompleted: Math.min(prev.totalRounds, prev.scenariosCompleted + 1),
          currentPhase: 'feedback'
        }));
      }
      
      // Detect host mood from reactions
      const moods = ['amused', 'critical', 'surprised', 'impressed', 'skeptical', 'enthusiastic'];
      const detectedMood = moods.find(mood => message.includes(mood));
      if (detectedMood) {
        setImprovState(prev => ({ ...prev, hostMood: detectedMood }));
      }
      
      // Detect performance notes
      if (message.includes('strong') || message.includes('good') || message.includes('excellent') || 
          message.includes('creative') || message.includes('funny') || message.includes('character')) {
        const notes = [
          'Strong character work',
          'Creative scenario handling',
          'Good comedic timing',
          'Excellent improvisation',
          'Funny moments',
          'Great energy'
        ];
        const matchingNote = notes.find(note => message.includes(note.toLowerCase()));
        if (matchingNote && !improvState.performanceNotes.includes(matchingNote)) {
          setImprovState(prev => ({
            ...prev,
            performanceNotes: [...prev.performanceNotes, matchingNote].slice(-3)
          }));
        }
      }
      
      // Detect game end
      if (message.includes('summary') || message.includes('final') || message.includes('closing')) {
        setImprovState(prev => ({ ...prev, currentPhase: 'summary' }));
      }
    }
  }, [messages, improvState.performanceNotes]);

  // Check for token expiration
  useEffect(() => {
    const handleTokenError = () => {
      setTokenExpired(true);
    };

    // Listen for connection errors
    window.addEventListener('connection-error', handleTokenError);
    return () => window.removeEventListener('connection-error', handleTokenError);
  }, []);

  useEffect(() => {
    const lastMessage = messages.at(-1);
    const lastMessageIsLocal = lastMessage?.from?.isLocal === true;

    if (scrollAreaRef.current && lastMessageIsLocal) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleRestartSession = () => {
    setImprovState({
      playerName: 'Contestant',
      currentRound: 0,
      totalRounds: 3,
      scenariosCompleted: 0,
      hostMood: 'energetic',
      performanceNotes: [],
      currentPhase: 'intro'
    });
    setTokenExpired(false);
    console.log('Improv session restart requested');
  };

  const handleContinueSession = () => {
    setTokenExpired(false);
    console.log('Continue improv session requested');
  };

  const getMoodColor = (mood: string) => {
    const moodColors: { [key: string]: string } = {
      amused: 'text-yellow-400',
      critical: 'text-orange-400',
      surprised: 'text-pink-400',
      impressed: 'text-green-400',
      skeptical: 'text-blue-400',
      enthusiastic: 'text-red-400',
      energetic: 'text-purple-400'
    };
    return moodColors[mood] || 'text-purple-400';
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      amused: '😄',
      critical: '🤔',
      surprised: '😲',
      impressed: '👏',
      skeptical: '🧐',
      enthusiastic: '🔥',
      energetic: '⚡'
    };
    return moodEmojis[mood] || '🎭';
  };

  return (
    <section className="bg-gradient-to-br from-purple-900 via-violet-900 to-fuchsia-900 relative z-10 h-full w-full overflow-hidden" {...props}>
      {/* Token Expired Modal */}
      {tokenExpired && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-purple-900 border border-purple-500 rounded-2xl p-6 max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="text-purple-100 text-xl font-bold mb-2">Session Expired</h3>
            <p className="text-purple-200 mb-4">
              Your improv battle session has expired. Would you like to continue your performance?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRestartSession}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors font-medium"
              >
                🔄 New Performance
              </button>
              <button
                onClick={handleContinueSession}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors font-medium"
              >
                🚀 Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Improv Battle Overlay */}
      {isImprovMode && (
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/50 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-purple-300 font-bold text-sm">🎭 Improv Battle</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">LIVE</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-purple-400">Player</div>
                <div className="text-purple-100 font-medium truncate">{improvState.playerName}</div>
              </div>
              <div className="space-y-1">
                <div className="text-purple-400">Round</div>
                <div className="text-purple-100 font-medium">{improvState.currentRound}/{improvState.totalRounds}</div>
              </div>
              <div className="space-y-1">
                <div className="text-purple-400">Completed</div>
                <div className="text-purple-100 font-medium">{improvState.scenariosCompleted} scenes</div>
              </div>
              <div className="space-y-1">
                <div className="text-purple-400">Host Mood</div>
                <div className={`font-medium ${getMoodColor(improvState.hostMood)}`}>
                  {getMoodEmoji(improvState.hostMood)} {improvState.hostMood}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-purple-400">Phase</div>
                <div className="text-purple-100 font-medium capitalize">{improvState.currentPhase}</div>
              </div>
              <div className="space-y-1">
                <div className="text-purple-400">Status</div>
                <div className="text-green-100 font-medium">
                  {improvState.currentRound >= improvState.totalRounds ? 'Complete' : 'Active'}
                </div>
              </div>
            </div>

            {/* Performance Notes */}
            {improvState.performanceNotes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-purple-500/20">
                <div className="text-purple-400 text-xs mb-2">Recent Feedback:</div>
                <div className="flex flex-wrap gap-1">
                  {improvState.performanceNotes.map((note, index) => (
                    <span key={index} className="bg-purple-500/30 text-purple-100 text-xs px-2 py-1 rounded">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={handleRestartSession}
              className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 rounded-lg transition-colors font-medium"
            >
              🔄 New Improv Battle
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Chat Transcript with Theater Theme */}
      <div
        className={cn(
          'fixed inset-0 grid grid-cols-1 grid-rows-1',
          !chatOpen && 'pointer-events-none'
        )}
      >
        <Fade top className="absolute inset-x-4 top-0 h-40" />
        <div ref={scrollAreaRef} className="px-4 pt-40 pb-[150px] md:px-6 md:pb-[180px] overflow-y-auto">
          <ChatTranscript
            hidden={!chatOpen}
            messages={messages}
            className="mx-auto max-w-2xl space-y-4 transition-opacity duration-300 ease-out"
          />
        </div>
      </div>

      {/* Tile Layout */}
      <TileLayout chatOpen={chatOpen} />

      {/* Enhanced Bottom Section with Theater Theme */}
      <MotionBottom
        {...BOTTOM_VIEW_MOTION_PROPS}
        className="fixed inset-x-3 bottom-0 z-50 md:inset-x-12"
      >
        {appConfig.isPreConnectBufferEnabled && (
          <PreConnectMessage messages={messages} className="pb-4" />
        )}
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-purple-500/30 relative mx-auto max-w-2xl pb-3 md:pb-4">
          <Fade bottom className="absolute inset-x-0 top-0 h-4 -translate-y-full" />
          
          {/* Improv Battle Quick Actions */}
          {isImprovMode && (
            <div className="px-4 pt-3 pb-2 border-b border-purple-500/20">
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  🎭 Start Round
                </button>
                <button className="flex-shrink-0 bg-pink-600 hover:bg-pink-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  🎤 Perform Scene
                </button>
                <button className="flex-shrink-0 bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  👏 Get Feedback
                </button>
                <button className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  🏆 End Game
                </button>
              </div>
            </div>
          )}
          
          <AgentControlBar 
            controls={controls} 
            onChatOpenChange={setChatOpen}
            className="px-4 pt-2"
          />
        </div>
      </MotionBottom>

      {/* Voice Command Helper */}
      <div className="fixed bottom-36 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-500/50">
          <p className="text-purple-300 text-xs font-medium">
            🎤 Say: "My name is...", "Ready for next round", "Let me try...", "That was fun!"
          </p>
        </div>
      </div>

      {/* Game Show Badge */}
      <div className="fixed top-4 right-4 z-30">
        <div className="bg-yellow-600/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-yellow-400/50">
          <p className="text-yellow-100 text-xs font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></span>
            LIVE SHOW
          </p>
        </div>
      </div>

      {/* Stage Curtains Decoration */}
      <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-red-900 to-transparent opacity-60 z-10"></div>
      <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-red-900 to-transparent opacity-60 z-10"></div>
    </section>
  );
};