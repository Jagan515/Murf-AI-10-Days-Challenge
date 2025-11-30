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

// E-commerce state interface
interface EcommerceState {
  cartItems: number;
  totalSpent: number;
  ordersPlaced: number;
  currentCategory: string;
  lastOrderAmount: number;
  browsingHistory: string[];
}

export const SessionView = ({
  appConfig,
  ...props
}: React.ComponentProps<'section'> & SessionViewProps) => {
  useConnectionTimeout(200_000);
  useDebugMode({ enabled: IN_DEVELOPMENT });

  const messages = useChatMessages();
  const [chatOpen, setChatOpen] = useState(false);
  const [ecommerceState, setEcommerceState] = useState<EcommerceState>({
    cartItems: 0,
    totalSpent: 0,
    ordersPlaced: 0,
    currentCategory: 'Browsing',
    lastOrderAmount: 0,
    browsingHistory: []
  });
  const [isShoppingMode, setIsShoppingMode] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const controls: ControlBarControls = {
    leave: true,
    microphone: true,
    chat: appConfig.supportsChatInput,
    camera: appConfig.supportsVideoInput,
    screenShare: appConfig.supportsVideoInput,
  };

  // Detect if we're in shopping mode based on messages
  useEffect(() => {
    const hasShoppingKeywords = messages.some(message => 
      message.message?.toLowerCase().includes('shop') ||
      message.message?.toLowerCase().includes('buy') ||
      message.message?.toLowerCase().includes('order') ||
      message.message?.toLowerCase().includes('product') ||
      message.message?.toLowerCase().includes('cart') ||
      message.message?.toLowerCase().includes('price') ||
      message.message?.toLowerCase().includes('rupee') ||
      message.message?.toLowerCase().includes('acp')
    );
    
    if (hasShoppingKeywords && !isShoppingMode) {
      setIsShoppingMode(true);
    }
  }, [messages, isShoppingMode]);

  // Update e-commerce state based on chat messages
  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (lastMessage && !lastMessage.from?.isLocal) {
      const message = lastMessage.message.toLowerCase();
      
      // Extract cart items
      if (message.includes('added to cart') || message.includes('cart items')) {
        setEcommerceState(prev => ({ 
          ...prev, 
          cartItems: Math.min(10, prev.cartItems + 1) 
        }));
      } else if (message.includes('removed from cart') || message.includes('cart empty')) {
        setEcommerceState(prev => ({ ...prev, cartItems: 0 }));
      }
      
      // Extract order information
      if (message.includes('order confirmed') || message.includes('purchase successful')) {
        const amountMatch = message.match(/₹(\d+)/) || message.match(/rs\.?\s*(\d+)/i);
        if (amountMatch) {
          const amount = parseInt(amountMatch[1]);
          setEcommerceState(prev => ({
            ...prev,
            ordersPlaced: prev.ordersPlaced + 1,
            totalSpent: prev.totalSpent + amount,
            lastOrderAmount: amount,
            cartItems: 0 // Clear cart after order
          }));
        } else {
          setEcommerceState(prev => ({
            ...prev,
            ordersPlaced: prev.ordersPlaced + 1,
            cartItems: 0
          }));
        }
      }
      
      // Detect category browsing
      const categories = ['mug', 'clothing', 'stationery', 'hoodie', 'tshirt', 'coffee'];
      const foundCategory = categories.find(cat => message.includes(cat));
      if (foundCategory) {
        const categoryMap: { [key: string]: string } = {
          'mug': 'Mugs & Drinkware',
          'clothing': 'Clothing',
          'tshirt': 'Clothing',
          'hoodie': 'Clothing',
          'stationery': 'Stationery',
          'coffee': 'Mugs & Drinkware'
        };
        setEcommerceState(prev => {
          const newHistory = [...prev.browsingHistory];
          const categoryName = categoryMap[foundCategory] || foundCategory;
          if (!newHistory.includes(categoryName) && newHistory.length < 5) {
            newHistory.push(categoryName);
          }
          return { 
            ...prev, 
            currentCategory: categoryName,
            browsingHistory: newHistory
          };
        });
      }
      
      // Detect browsing start
      if (message.includes('browse') || message.includes('show me') || message.includes('looking for')) {
        setEcommerceState(prev => ({ ...prev, currentCategory: 'Browsing' }));
      }
    }
  }, [messages]);

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
    setEcommerceState({
      cartItems: 0,
      totalSpent: 0,
      ordersPlaced: 0,
      currentCategory: 'Browsing',
      lastOrderAmount: 0,
      browsingHistory: []
    });
    setTokenExpired(false);
    console.log('Session restart requested');
  };

  const handleContinueSession = () => {
    setTokenExpired(false);
    // This would typically reconnect with a new token
    console.log('Continue session requested');
  };

  return (
    <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative z-10 h-full w-full overflow-hidden" {...props}>
      {/* Token Expired Modal */}
      {tokenExpired && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-blue-900 border border-blue-500 rounded-2xl p-6 max-w-md text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="text-blue-100 text-xl font-bold mb-2">Session Expired</h3>
            <p className="text-blue-200 mb-4">
              Your shopping session has expired. Would you like to continue your shopping experience?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRestartSession}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium"
              >
                🔄 New Session
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

      {/* E-commerce Overlay */}
      {isShoppingMode && (
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/50 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-blue-300 font-bold text-sm">🛒 Voice Shopping Assistant</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">LIVE</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-blue-400">Current View</div>
                <div className="text-blue-100 font-medium truncate">{ecommerceState.currentCategory}</div>
              </div>
              <div className="space-y-1">
                <div className="text-blue-400">Cart Items</div>
                <div className="text-blue-100 font-medium">{ecommerceState.cartItems} items</div>
              </div>
              <div className="space-y-1">
                <div className="text-blue-400">Orders Placed</div>
                <div className="text-blue-100 font-medium">{ecommerceState.ordersPlaced}</div>
              </div>
              <div className="space-y-1">
                <div className="text-blue-400">Total Spent</div>
                <div className="text-blue-100 font-medium">₹{ecommerceState.totalSpent}</div>
              </div>
              <div className="space-y-1">
                <div className="text-blue-400">Last Order</div>
                <div className="text-blue-100 font-medium">
                  {ecommerceState.lastOrderAmount > 0 ? `₹${ecommerceState.lastOrderAmount}` : 'None'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-blue-400">ACP Protocol</div>
                <div className="text-green-100 font-medium">Active</div>
              </div>
            </div>

            {/* Browsing History */}
            {ecommerceState.browsingHistory.length > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-500/20">
                <div className="text-blue-400 text-xs mb-2">Recent Categories:</div>
                <div className="flex flex-wrap gap-1">
                  {ecommerceState.browsingHistory.map((category, index) => (
                    <span key={index} className="bg-blue-500/30 text-blue-100 text-xs px-2 py-1 rounded">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={handleRestartSession}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-lg transition-colors font-medium"
            >
              🔄 New Shopping Session
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Chat Transcript with E-commerce Theme */}
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

      {/* Enhanced Bottom Section with E-commerce Theme */}
      <MotionBottom
        {...BOTTOM_VIEW_MOTION_PROPS}
        className="fixed inset-x-3 bottom-0 z-50 md:inset-x-12"
      >
        {appConfig.isPreConnectBufferEnabled && (
          <PreConnectMessage messages={messages} className="pb-4" />
        )}
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-blue-500/30 relative mx-auto max-w-2xl pb-3 md:pb-4">
          <Fade bottom className="absolute inset-x-0 top-0 h-4 -translate-y-full" />
          
          {/* E-commerce Quick Actions */}
          {isShoppingMode && (
            <div className="px-4 pt-3 pb-2 border-b border-blue-500/20">
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  🔍 Browse All
                </button>
                <button className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  🛒 View Cart ({ecommerceState.cartItems})
                </button>
                <button className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  📦 Orders
                </button>
                <button className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                  💰 Under ₹1000
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
        <div className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-500/50">
          <p className="text-blue-300 text-xs font-medium">
            🎤 Say: "Show me mugs", "Buy hoodie-001", "Orders under 1000", "What's in my cart?"
          </p>
        </div>
      </div>

      {/* ACP Protocol Badge */}
      <div className="fixed top-4 right-4 z-30">
        <div className="bg-green-600/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-green-400/50">
          <p className="text-green-100 text-xs font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
            ACP Protocol
          </p>
        </div>
      </div>
    </section>
  );
};