import React, { useMemo } from 'react';
import { Track } from 'livekit-client';
import { AnimatePresence, motion } from 'motion/react';
import {
  type TrackReference,
  VideoTrack,
  useLocalParticipant,
  useTracks,
  useVoiceAssistant,
} from '@livekit/components-react';
import { AgentAudioVisualizerBar } from '@/components/agents-ui/agent-audio-visualizer-bar';
import { cn } from '@/lib/shadcn/utils';

const MotionContainer = motion.create('div');

const ANIMATION_TRANSITION = {
  type: 'spring',
  stiffness: 675,
  damping: 75,
  mass: 1,
};

const classNames = {
  // GRID
  // 2 Columns x 3 Rows
  grid: [
    'h-full w-full',
    'grid gap-x-2 place-content-center',
    'grid-cols-[1fr_1fr] grid-rows-[90px_1fr_90px]',
  ],
  // Agent
  // chatOpen: true,
  // hasSecondTile: true
  // layout: Column 1 / Row 1
  // align: x-end y-center
  agentChatOpenWithSecondTile: ['col-start-1 row-start-1', 'self-center justify-self-end'],
  // Agent
  // chatOpen: true,
  // hasSecondTile: false
  // layout: Column 1 / Row 1 / Column-Span 2
  // align: x-center y-center
  agentChatOpenWithoutSecondTile: ['col-start-1 row-start-1', 'col-span-2', 'place-content-center'],
  // Agent
  // chatOpen: false
  // layout: Column 1 / Row 1 / Column-Span 2 / Row-Span 3
  // align: x-center y-center
  agentChatClosed: ['col-start-1 row-start-1', 'col-span-2 row-span-3', 'place-content-center'],
  // Second tile
  // chatOpen: true,
  // hasSecondTile: true
  // layout: Column 2 / Row 1
  // align: x-start y-center
  secondTileChatOpen: ['col-start-2 row-start-1', 'self-center justify-self-start'],
  // Second tile
  // chatOpen: false,
  // hasSecondTile: false
  // layout: Column 2 / Row 2
  // align: x-end y-end
  secondTileChatClosed: ['col-start-2 row-start-3', 'place-content-end'],
};

export function useLocalTrackRef(source: Track.Source) {
  const { localParticipant } = useLocalParticipant();
  const publication = localParticipant.getTrackPublication(source);
  const trackRef = useMemo<TrackReference | undefined>(
    () => (publication ? { source, participant: localParticipant, publication } : undefined),
    [source, publication, localParticipant]
  );
  return trackRef;
}

interface TileLayoutProps {
  chatOpen: boolean;
}

export function TileLayout({ chatOpen }: TileLayoutProps) {
  const {
    state: agentState,
    audioTrack: agentAudioTrack,
    videoTrack: agentVideoTrack,
  } = useVoiceAssistant();
  const [screenShareTrack] = useTracks([Track.Source.ScreenShare]);
  const cameraTrack: TrackReference | undefined = useLocalTrackRef(Track.Source.Camera);

  const isCameraEnabled = cameraTrack && !cameraTrack.publication.isMuted;
  const isScreenShareEnabled = screenShareTrack && !screenShareTrack.publication.isMuted;

  const isAvatar = agentVideoTrack !== undefined;

  return (
    <div className={cn(
      "pointer-events-none fixed inset-0 z-30 flex justify-center p-6 transition-all duration-700 md:p-12",
      chatOpen ? "items-start pt-8 pb-0 h-48" : "items-center"
    )}>
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Agent Central Visualizer */}
        <div className="relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isAvatar ? (
              <MotionContainer
                key="agent-audio"
                layoutId="agent-visualizer"
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="relative flex items-center justify-center will-change-transform"
              >
                {/* Visualizer Glow */}
                <div className={cn(
                  "bg-primary/5 absolute rounded-full blur-[64px] transition-all duration-700 will-change-[filter,opacity,transform]",
                  chatOpen ? "h-[200px] w-[200px]" : "h-[300px] w-[300px] md:h-[500px] md:w-[500px]"
                )} />

                <AgentAudioVisualizerBar
                  barCount={7}
                  size={chatOpen ? 'sm' : 'lg'}
                  state={agentState}
                  audioTrack={agentAudioTrack}
                  className="relative z-10 flex items-center justify-center gap-2 transition-all duration-500 will-change-transform"
                />
              </MotionContainer>
            ) : (
              <MotionContainer
                key="agent-video"
                layoutId="agent-visualizer"
                initial={{ opacity: 0, filter: 'blur(20px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(20px)' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={cn(
                  "overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition-all duration-700",
                  chatOpen ? "h-[120px] w-[120px]" : "h-[300px] w-full max-w-lg md:h-[450px]"
                )}
              >
                <VideoTrack
                  trackRef={agentVideoTrack}
                  className="h-full w-full object-cover"
                />
              </MotionContainer>
            )}
          </AnimatePresence>
        </div>

        {/* Local Tracks (Floating) */}
        <div className="fixed top-24 right-6 flex flex-col gap-4 md:top-12 md:right-12">
          <AnimatePresence>
            {((cameraTrack && isCameraEnabled) || (screenShareTrack && isScreenShareEnabled)) && (
              <MotionContainer
                key="local-track"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl backdrop-blur-md"
              >
                <VideoTrack
                  trackRef={cameraTrack || screenShareTrack}
                  className="h-32 w-48 object-cover md:h-40 md:w-60"
                />
              </MotionContainer>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
