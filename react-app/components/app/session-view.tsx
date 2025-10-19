'use client';

import React, { useMemo, useState } from 'react';
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
import { ScrollArea } from '../livekit/scroll-area/scroll-area';
import { useRemoteParticipants } from '@livekit/components-react';
import { useBudgetSankey } from '@/hooks/useBudgetSankey';
import { BudgetSankey } from '@/components/app/BudgetSankey';

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

export const SessionView = ({
  appConfig,
  ...props
}: React.ComponentProps<'section'> & SessionViewProps) => {
  useConnectionTimeout(200_000);
  useDebugMode({ enabled: IN_DEVELOPMENT });

  const messages = useChatMessages();
  const [chatOpen, setChatOpen] = useState(false);
  useRemoteParticipants();
  const { nodes, links } = useBudgetSankey();
  const [devSankeyVisible] = useState(false);

  // Simplified sample dataset for dev preview
  const devNodes = useMemo(
    () => [
      { id: 'Income' },
      { id: 'Salary' },
      { id: 'Side Hustle' },
      { id: 'Taxes' },
      { id: 'Investments' },
      { id: 'Savings' },
      { id: 'Needs' },
      { id: 'Wants' },
      { id: 'Housing' },
      { id: 'Essentials' },
      { id: 'Discretionary' },
    ],
    []
  );
  const devLinks = useMemo(
    () => [
      { source: 'Salary', target: 'Income', value: 5200 },
      { source: 'Side Hustle', target: 'Income', value: 800 },
      { source: 'Income', target: 'Taxes', value: 1400 },
      { source: 'Income', target: 'Investments', value: 600 },
      { source: 'Income', target: 'Savings', value: 800 },
      { source: 'Income', target: 'Needs', value: 2500 },
      { source: 'Income', target: 'Wants', value: 700 },
      { source: 'Needs', target: 'Housing', value: 1500 },
      { source: 'Needs', target: 'Essentials', value: 1000 },
      { source: 'Wants', target: 'Discretionary', value: 700 },
    ],
    []
  );

  const controls: ControlBarControls = {
    leave: true,
    microphone: true,
    chat: appConfig.supportsChatInput,
    camera: appConfig.supportsVideoInput,
    screenShare: appConfig.supportsVideoInput,
  };

  const sankeyVisible = Boolean(nodes && links && links.length > 0);
  const effectiveSankeyVisible = sankeyVisible || devSankeyVisible;

  return (
    <section className="bg-background relative z-10 h-full w-full overflow-hidden" {...props}>
      {/* Chat Transcript */}
      <div
        className={cn(
          'fixed inset-0 grid grid-cols-1 grid-rows-1',
          !chatOpen && 'pointer-events-none'
        )}
      >
        <Fade top className="absolute inset-x-4 top-0 h-40" />
        <ScrollArea className="px-4 pt-40 pb-[150px] md:px-6 md:pb-[180px]">
          <ChatTranscript
            hidden={!chatOpen}
            messages={messages}
            className="mx-auto max-w-2xl space-y-3 transition-opacity duration-300 ease-out"
          />
        </ScrollArea>
      </div>

      {/* Tile Layout */}
      <TileLayout chatOpen={chatOpen} sankeyVisible={effectiveSankeyVisible} />

      {/* Budget Sankey (if provided by agent tool) */}
      {effectiveSankeyVisible && (
        <div className="pointer-events-auto fixed inset-0 z-50 grid place-items-center">
          <div className="w-[min(90vw,900px)] max-h-[80vh] overflow-auto rounded-lg border bg-background/80 p-4 backdrop-blur-md shadow-lg">
            <BudgetSankey nodes={(nodes && links ? nodes : devNodes)!} links={(nodes && links ? links : devLinks)!} />
          </div>
        </div>
      )}

      {/* Bottom */}
      <MotionBottom
        {...BOTTOM_VIEW_MOTION_PROPS}
        className="fixed inset-x-3 bottom-0 z-50 md:inset-x-12"
      >
        {appConfig.isPreConnectBufferEnabled && (
          <PreConnectMessage messages={messages} className="pb-4" />
        )}
        <div className="bg-background relative mx-auto max-w-2xl pb-3 md:pb-12">
          <Fade bottom className="absolute inset-x-0 top-0 h-4 -translate-y-full" />
          <AgentControlBar controls={controls} onChatOpenChange={setChatOpen} />
        </div>
      </MotionBottom>
    </section>
  );
};
