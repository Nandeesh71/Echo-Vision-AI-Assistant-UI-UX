'use client';

import { AnimatePresence, type HTMLMotionProps, motion } from 'motion/react';
import { type ReceivedMessage, useAgent } from '@livekit/components-react';
import { AgentChatTranscript } from '@/components/agents-ui/agent-chat-transcript';
import { cn } from '@/lib/shadcn/utils';

const MotionContainer = motion.create('div');

const CONTAINER_MOTION_PROPS = {
  variants: {
    hidden: {
      opacity: 0,
      transition: {
        ease: 'easeOut',
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        ease: 'easeOut',
        duration: 0.3,
      },
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
};

interface ChatTranscriptProps {
  hidden?: boolean;
  messages?: ReceivedMessage[];
  chatOpen?: boolean;
}

export function ChatTranscript({
  hidden = false,
  messages = [],
  chatOpen = false,
  className,
  ...props
}: ChatTranscriptProps & Omit<HTMLMotionProps<'div'>, 'ref'>) {
  const { state: agentState } = useAgent();

  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex flex-col transition-all duration-700 ease-in-out',
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      )}
    >
      <AnimatePresence>
        {!hidden && (
          <MotionContainer
            {...props}
            {...CONTAINER_MOTION_PROPS}
            className={cn('no-scrollbar flex h-full w-full flex-col overflow-y-auto', className)}
          >
            <AgentChatTranscript
              agentState={agentState}
              messages={messages}
              className="[&_.is-user>div]:bg-primary mx-auto w-full max-w-2xl px-4 md:px-0 [&_.is-agent>div]:rounded-[28px] [&_.is-agent>div]:border [&_.is-agent>div]:border-white/10 [&_.is-agent>div]:bg-white/5 [&_.is-agent>div]:text-white [&_.is-user>div]:rounded-[28px] [&_.is-user>div]:text-black [&>div>div]:px-4 [&>div>div]:pt-48 [&>div>div]:pb-60 md:[&>div>div]:px-6"
            />
          </MotionContainer>
        )}
      </AnimatePresence>
    </div>
  );
}
