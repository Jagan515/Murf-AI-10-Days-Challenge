'use client';

import { AnimatePresence, type HTMLMotionProps, motion } from 'motion/react';
import { type ReceivedChatMessage } from '@livekit/components-react';
import { ChatEntry } from '@/components/livekit/chat-entry';
import { useRef, useEffect } from 'react';

const MotionContainer = motion.create('div');
const MotionChatEntry = motion.create(ChatEntry);

const CONTAINER_MOTION_PROPS: HTMLMotionProps<'div'> = {
  variants: {
    hidden: {
      opacity: 0,
      transition: {
        ease: 'easeOut',
        duration: 0.3,
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        ease: 'easeOut',
        duration: 0.3,
        staggerChildren: 0.1,
        staggerDirection: 1,
      },
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
};

const MESSAGE_MOTION_PROPS: HTMLMotionProps<'div'> = {
  variants: {
    hidden: {
      opacity: 0,
      translateY: 10,
    },
    visible: {
      opacity: 1,
      translateY: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
  },
};

interface ChatTranscriptProps {
  hidden?: boolean;
  messages?: ReceivedChatMessage[];
  autoScroll?: boolean;
  maxHeight?: string;
}

export function ChatTranscript({
  hidden = false,
  messages = [],
  autoScroll = true,
  maxHeight = "400px",
  ...props
}: ChatTranscriptProps & Omit<HTMLMotionProps<'div'>, 'ref'>) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [messages, autoScroll]);

  return (
    <AnimatePresence>
      {!hidden && (
        <div className="w-full max-w-4xl mx-auto">
          {/* Simple scrollable container without ScrollArea */}
          <div 
            className="w-full rounded-lg border border-border bg-background/50 backdrop-blur-sm overflow-y-auto"
            style={{ maxHeight }}
          >
            <MotionContainer 
              {...CONTAINER_MOTION_PROPS} 
              {...props}
              className="px-4 py-4 space-y-3 min-h-[200px]"
            >
              {messages.length === 0 ? (
                <motion.div 
                  className="text-center text-muted-foreground py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="text-xs mt-1 text-muted-foreground/70">
                    Start speaking to see the conversation transcript
                  </p>
                </motion.div>
              ) : (
                <>
                  {messages.map(({ id, timestamp, from, message, editTimestamp }: ReceivedChatMessage) => {
                    const locale = navigator?.language ?? 'en-US';
                    const messageOrigin = from?.isLocal ? 'local' : 'remote';
                    const hasBeenEdited = !!editTimestamp;
                    const isAgent = !from?.isLocal;

                    return (
                      <MotionChatEntry
                        key={id}
                        locale={locale}
                        timestamp={timestamp}
                        message={message}
                        messageOrigin={messageOrigin}
                        hasBeenEdited={hasBeenEdited}
                        {...MESSAGE_MOTION_PROPS}
                        className={`
                          px-4 py-3 rounded-lg border transition-colors
                          ${isAgent 
                            ? 'bg-blue-50 border-blue-200 text-blue-900' 
                            : 'bg-green-50 border-green-200 text-green-900'
                          }
                          ${messageOrigin === 'remote' ? 'text-left' : 'text-right'}
                        `}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </MotionContainer>
          </div>
          
          {/* Transcript status bar */}
          {messages.length > 0 && (
            <motion.div 
              className="flex items-center justify-between px-2 py-1 text-xs text-muted-foreground mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span>
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Live transcription active
              </span>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}