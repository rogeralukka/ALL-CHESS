import React, { useCallback, useState } from 'react';
import { CoachExpression } from '@/data/types';
import { CoachAvatar } from './CoachAvatar';
import { CoachBubble, BubbleMessage } from './CoachBubble';

interface CoachSpeechProps {
  expression: CoachExpression;
  messages?: BubbleMessage[];
  text?: string;
  /** Portrait size in px (80 in side panels, 64 in compact cards). */
  size?: number;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
  className?: string;
}

/**
 * The coach "speaking": head-and-shoulders portrait on the left, speech bubble on the right with a
 * tail pointing at the coach's mouth. The bubble overlaps the portrait by 4px so the two read as one
 * unit. Clicking the portrait finishes the current sentence; while text types the portrait nods.
 */
export const CoachSpeech: React.FC<CoachSpeechProps> = ({
  expression,
  messages,
  text,
  size = 80,
  voiceEnabled = false,
  onToggleVoice,
  className = '',
}) => {
  const [skipSignal, setSkipSignal] = useState(0);
  const [typing, setTyping] = useState(false);
  const onTypingChange = useCallback((t: boolean) => setTyping(t), []);

  return (
    <div className={`flex items-start ${className}`} data-testid="coach-speech">
      <CoachAvatar
        expression={expression}
        mode="bust"
        size={size}
        talking={typing}
        onClick={() => setSkipSignal((n) => n + 1)}
      />
      <div className="flex-1 min-w-0 relative" style={{ marginLeft: Math.round(size * 0.12) }}>
        <CoachBubble
          messages={messages}
          text={text}
          voiceEnabled={voiceEnabled}
          onToggleVoice={onToggleVoice}
          tailTop={Math.round(size * 0.38)}
          skipSignal={skipSignal}
          onTypingChange={onTypingChange}
        />
      </div>
    </div>
  );
};

export default CoachSpeech;
