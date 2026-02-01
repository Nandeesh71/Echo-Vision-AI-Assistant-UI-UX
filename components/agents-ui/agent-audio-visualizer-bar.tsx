'use client';

import React, {
  type CSSProperties,
  Children,
  type ComponentProps,
  type ReactNode,
  cloneElement,
  isValidElement,
  useMemo,
} from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { type LocalAudioTrack, type RemoteAudioTrack } from 'livekit-client';
import {
  type AgentState,
  type TrackReferenceOrPlaceholder,
  useMultibandTrackVolume,
} from '@livekit/components-react';
import { useAgentAudioVisualizerBarAnimator } from '@/hooks/agents-ui/use-agent-audio-visualizer-bar';
import { cn } from '@/lib/shadcn/utils';

function cloneSingleChild(
  children: ReactNode | ReactNode[],
  props?: Record<string, unknown>,
  key?: unknown
) {
  return Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript error too.
    if (isValidElement(child) && Children.only(children)) {
      const childProps = child.props as Record<string, unknown>;
      if (childProps.className) {
        // make sure we retain classnames of both passed props and child
        props ??= {};
        props.className = cn(childProps.className as string, props.className as string);
        props.style = {
          ...(childProps.style as CSSProperties),
          ...(props.style as CSSProperties),
        };
      }
      return cloneElement(child, { ...props, key: key ? String(key) : undefined });
    }
    return child;
  });
}

export const AgentAudioVisualizerBarVariants = cva(
  [
    'relative flex items-center justify-center',
    '*:rounded-full *:transition-[height,background-color] *:duration-150 *:ease-[cubic-bezier(0.16,1,0.3,1)]',
    '*:bg-white/10 *:data-[lk-highlighted=true]:bg-primary *:data-[lk-speaking=true]:bg-primary',
    '*:will-change-[height,background-color] *:transform-gpu',
  ],
  {
    variants: {
      size: {
        icon: ['h-[28px] gap-[3px]', '*:w-[4px] *:min-h-[4px]'],
        sm: ['h-[64px] gap-[5px]', '*:w-[8px] *:min-h-[8px]'],
        md: ['h-[120px] gap-[10px]', '*:w-[12px] *:min-h-[12px]'],
        lg: ['h-[240px] gap-[18px]', '*:w-[24px] *:min-h-[24px]'],
        xl: ['h-[480px] gap-[36px]', '*:w-[48px] *:min-h-[48px]'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Props for the AgentAudioVisualizerBar component.
 */
export interface AgentAudioVisualizerBarProps {
  /**
   * The size of the visualizer.
   * @defaultValue 'md'
   */
  size?: 'icon' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * The current state of the agent. Determines the animation pattern.
   * @defaultValue 'connecting'
   */
  state?: AgentState;
  /**
   * The number of bars to display in the visualizer.
   * If not provided, defaults based on size: 3 for 'icon'/'sm', 5 for others.
   */
  barCount?: number;
  /**
   * The audio track to visualize. Can be a local/remote audio track or a track reference.
   */
  audioTrack?: LocalAudioTrack | RemoteAudioTrack | TrackReferenceOrPlaceholder;
  /**
   * Additional CSS class names to apply to the container.
   */
  className?: string;
  /**
   * Custom children to render as bars. Each child receives data-lk-index,
   * data-lk-highlighted, and style props for height.
   */
  children?: ReactNode | ReactNode[];
}

/**
 * A bar-style audio visualizer that responds to agent state and audio levels.
 * Displays animated bars that react to the current agent state (connecting, thinking, speaking, etc.)
 * and audio volume when speaking.
 *
 * @extends ComponentProps<'div'>
 *
 * @example
 * ```tsx
 * <AgentAudioVisualizerBar
 *   size="md"
 *   state="speaking"
 *   audioTrack={agentAudioTrack}
 * />
 * ```
 */
export function AgentAudioVisualizerBar({
  size = 'md',
  state = 'connecting',
  barCount,
  audioTrack,
  className,
  children,
  ...props
}: AgentAudioVisualizerBarProps &
  VariantProps<typeof AgentAudioVisualizerBarVariants> &
  ComponentProps<'div'>) {
  const _barCount = useMemo(() => {
    if (barCount) {
      return barCount;
    }
    switch (size) {
      case 'icon':
      case 'sm':
        return 3;
      default:
        return 5;
    }
  }, [barCount, size]);

  const volumeBands = useMultibandTrackVolume(audioTrack, {
    bands: _barCount,
    loPass: 100,
    hiPass: 200,
  });

  const sequencerInterval = useMemo(() => {
    switch (state) {
      case 'connecting':
        return 2000 / _barCount;
      case 'initializing':
        return 2000;
      case 'listening':
        return 500;
      case 'thinking':
        return 150;
      default:
        return 1000;
    }
  }, [state, _barCount]);

  const highlightedIndices = useAgentAudioVisualizerBarAnimator(
    state,
    _barCount,
    sequencerInterval
  );

  const bands = useMemo(
    () => (state === 'speaking' ? volumeBands : new Array(_barCount).fill(0)),
    [state, volumeBands, _barCount]
  );

  return (
    <div className={cn(AgentAudioVisualizerBarVariants({ size }), className)} {...props}>
      {bands.map((band: number, idx: number) =>
        children ? (
          <React.Fragment key={idx}>
            {cloneSingleChild(children, {
              'data-lk-index': idx,
              'data-lk-highlighted': highlightedIndices.includes(idx),
              style: { height: `${band * 100}%` },
            })}
          </React.Fragment>
        ) : (
          <div
            key={idx}
            data-lk-index={idx}
            data-lk-highlighted={highlightedIndices.includes(idx)}
            data-lk-speaking={state === 'speaking'}
            style={{ height: `${band * 100}%` }}
          />
        )
      )}
    </div>
  );
}
