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

// Game state interface for Jungle Raja adventure
interface GameState {
  playerHealth: number;
  playerKarma: number;
  playerInventory: string[];
  currentLocation: string;
  gameProgress: number;
  blessings: number;
}

export const SessionView = ({
  appConfig,
  ...props
}: React.ComponentProps<'section'> & SessionViewProps) => {
  useConnectionTimeout(200_000);
  useDebugMode({ enabled: IN_DEVELOPMENT });

  const messages = useChatMessages();
  const [chatOpen, setChatOpen] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    playerHealth: 100,
    playerKarma: 50,
    playerInventory: ['Lota (Water Vessel)', 'Roti', 'Torch'],
    currentLocation: 'Shanti Gram Village',
    gameProgress: 0,
    blessings: 0
  });
  const [isJungleRaja, setIsJungleRaja] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const controls: ControlBarControls = {
    leave: true,
    microphone: true,
    chat: appConfig.supportsChatInput,
    camera: appConfig.supportsVideoInput,
    screenShare: appConfig.supportsVideoInput,
  };

  // Detect if we're in jungle raja mode based on messages
  useEffect(() => {
    const hasJungleRajaKeywords = messages.some(message => 
      message.message?.toLowerCase().includes('jungle raja') ||
      message.message?.toLowerCase().includes('namaste') ||
      message.message?.toLowerCase().includes('karma') ||
      message.message?.toLowerCase().includes('dharma') ||
      message.message?.toLowerCase().includes('bharatiya')
    );
    
    if (hasJungleRajaKeywords && !isJungleRaja) {
      setIsJungleRaja(true);
    }
  }, [messages, isJungleRaja]);

  // Update game state based on chat messages
  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (lastMessage && !lastMessage.from?.isLocal) {
      const message = lastMessage.message.toLowerCase();
      
      // Extract health changes
      if (message.includes('health') && message.includes('100')) {
        setGameState(prev => ({ ...prev, playerHealth: 100 }));
      } else if (message.includes('lost health') || message.includes('damage')) {
        setGameState(prev => ({ ...prev, playerHealth: Math.max(0, prev.playerHealth - 20) }));
      } else if (message.includes('gained health') || message.includes('heal')) {
        setGameState(prev => ({ ...prev, playerHealth: Math.min(100, prev.playerHealth + 20) }));
      }
      
      // Extract karma changes
      if (message.includes('karma') && message.includes('increased')) {
        setGameState(prev => ({ ...prev, playerKarma: Math.min(100, prev.playerKarma + 10) }));
      } else if (message.includes('karma') && message.includes('decreased')) {
        setGameState(prev => ({ ...prev, playerKarma: Math.max(0, prev.playerKarma - 10) }));
      }
      
      // Detect inventory changes
      if (message.includes('added') && message.includes('inventory')) {
        const newItems = ['Ayurvedic Herbs', 'Ancient Temple Key', 'Blessed Gangajal', 'Golden Amulet'];
        const foundItem = newItems.find(item => message.includes(item.toLowerCase()));
        if (foundItem && !gameState.playerInventory.includes(foundItem)) {
          setGameState(prev => ({
            ...prev,
            playerInventory: [...prev.playerInventory, foundItem]
          }));
        }
      }
      
      // Detect location changes
      const locations = ['village', 'temple', 'jungle', 'bamboo', 'tiger', 'cave', 'river', 'ghat'];
      const newLocation = locations.find(loc => message.includes(loc));
      if (newLocation) {
        const locationMap: { [key: string]: string } = {
          'village': 'Shanti Gram Village',
          'temple': 'Ancient Shiva Temple', 
          'jungle': 'Dense Jungle Border',
          'bamboo': 'Bamboo Grove',
          'tiger': 'Tiger Temple',
          'cave': 'Crystal Sanctuary',
          'river': 'Sacred River Ghat',
          'ghat': 'Sacred River Ghat'
        };
        setGameState(prev => ({ 
          ...prev, 
          currentLocation: locationMap[newLocation] || 'Unknown Location',
          gameProgress: Math.min(100, prev.gameProgress + 10)
        }));
      }
      
      // Detect blessings
      if (message.includes('blessing') && message.includes('received')) {
        setGameState(prev => ({ ...prev, blessings: prev.blessings + 1 }));
      }
      
      // Detect game completion
      if (message.includes('dhanyavaad') || message.includes('journey complete') || message.includes('enlightenment')) {
        setGameState(prev => ({ ...prev, gameProgress: 100 }));
      }
    }
  }, [messages, gameState.playerInventory]);

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

  const handleRestartGame = () => {
    setGameState({
      playerHealth: 100,
      playerKarma: 50,
      playerInventory: ['Lota (Water Vessel)', 'Roti', 'Torch'],
      currentLocation: 'Shanti Gram Village',
      gameProgress: 0,
      blessings: 0
    });
    setTokenExpired(false);
    console.log('Game restart requested');
  };

  const handleContinueSession = () => {
    setTokenExpired(false);
    // This would typically reconnect with a new token
    console.log('Continue session requested');
  };

  return (
    <section className="bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 relative z-10 h-full w-full overflow-hidden" {...props}>
      {/* Token Expired Modal */}
      {tokenExpired && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-amber-900 border border-amber-500 rounded-2xl p-6 max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="text-amber-100 text-xl font-bold mb-2">Session Expired</h3>
            <p className="text-amber-200 mb-4">
              Your jungle adventure session has expired. Would you like to continue your spiritual journey?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRestartGame}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors font-medium"
              >
                🔄 Restart Journey
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

      {/* Jungle Raja Overlay */}
      {isJungleRaja && (
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-4 border border-amber-500/50 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-amber-300 font-bold text-sm">🐯 Jungle Raja Adventure</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">LIVE</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-amber-400">Location</div>
                <div className="text-amber-100 font-medium truncate">{gameState.currentLocation}</div>
              </div>
              <div className="space-y-1">
                <div className="text-amber-400">Progress</div>
                <div className="text-amber-100 font-medium">{gameState.gameProgress}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-amber-400">Health</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-amber-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        gameState.playerHealth > 50 ? 'bg-green-500' : 
                        gameState.playerHealth > 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${gameState.playerHealth}%` }}
                    ></div>
                  </div>
                  <span className="text-amber-100 text-xs w-6">{gameState.playerHealth}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-amber-400">Karma</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-amber-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        gameState.playerKarma > 70 ? 'bg-blue-500' : 
                        gameState.playerKarma > 40 ? 'bg-purple-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${gameState.playerKarma}%` }}
                    ></div>
                  </div>
                  <span className="text-amber-100 text-xs w-6">{gameState.playerKarma}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-amber-400">Inventory</div>
                <div className="text-amber-100 font-medium">{gameState.playerInventory.length} items</div>
              </div>
              <div className="space-y-1">
                <div className="text-amber-400">Blessings</div>
                <div className="text-amber-100 font-medium">🙏 {gameState.blessings}</div>
              </div>
            </div>
            
            <button
              onClick={handleRestartGame}
              className="mt-3 w-full bg-amber-600 hover:bg-amber-700 text-white text-xs py-2 rounded-lg transition-colors font-medium"
            >
              🔄 Restart Spiritual Journey
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Chat Transcript with Indian Theme */}
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

      {/* Enhanced Bottom Section with Indian Theme */}
      <MotionBottom
        {...BOTTOM_VIEW_MOTION_PROPS}
        className="fixed inset-x-3 bottom-0 z-50 md:inset-x-12"
      >
        {appConfig.isPreConnectBufferEnabled && (
          <PreConnectMessage messages={messages} className="pb-4" />
        )}
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-amber-500/30 relative mx-auto max-w-2xl pb-3 md:pb-4">
          <Fade bottom className="absolute inset-x-0 top-0 h-4 -translate-y-full" />
          
          {/* Jungle Raja Quick Actions */}
          {isJungleRaja && (
            <div className="px-4 pt-3 pb-2 border-b border-amber-500/20">
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button className="flex-shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  🕉️ Karma Check
                </button>
                <button className="flex-shrink-0 bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  🏮 Visit Temple
                </button>
                <button className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  🎒 Inventory
                </button>
                <button className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  🐯 Meet Raja
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
        <div className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 border border-amber-500/50">
          <p className="text-amber-300 text-xs font-medium">
            🎤 Say: "Namaste", "Go to temple", "Check karma", "Help villagers"
          </p>
        </div>
      </div>
    </section>
  );
};