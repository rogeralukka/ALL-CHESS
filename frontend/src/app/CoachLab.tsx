import React, { useState } from 'react';
import { CoachRig, RigFace, RigGesture } from '@/features/coach/CoachRig';

const FACES: RigFace[] = ['neutral', 'smile', 'happy', 'grin', 'thinking', 'worried', 'surprised', 'sleepy'];
const GESTURES: RigGesture[] = ['none', 'wave', 'thumbsup', 'think', 'celebrate', 'shrug', 'point'];
const PRESETS: [string, RigFace, RigGesture][] = [
  ['neutral', 'neutral', 'none'],
  ['wave', 'happy', 'wave'],
  ['thumbs up', 'smile', 'thumbsup'],
  ['thinking', 'thinking', 'think'],
  ['brilliant', 'happy', 'celebrate'],
  ['embarrassed', 'worried', 'shrug'],
  ['pointing', 'grin', 'point'],
  ['surprised', 'surprised', 'none'],
];

/** Dev page: every coach face and gesture side by side, plus a live playground. */
export const CoachLab: React.FC = () => {
  const [face, setFace] = useState<RigFace>('neutral');
  const [gesture, setGesture] = useState<RigGesture>('wave');
  const [talking, setTalking] = useState(false);
  return (
    <div className="p-6 space-y-6" data-testid="coach-lab">
      <div className="grid grid-cols-4 gap-4">
        {PRESETS.map(([label, f, g]) => (
          <div key={label} className="panel p-3 flex flex-col items-center">
            <CoachRig face={f} gesture={g} size={240} />
            <div className="font-display font-black text-amber-400">{label}</div>
          </div>
        ))}
      </div>
      <div className="panel p-4 flex gap-6 items-center">
        <CoachRig face={face} gesture={gesture} talking={talking} size={300} />
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">{FACES.map((x) => <button key={x} className="btn-secondary px-3 h-9 rounded-[10px]" onClick={() => setFace(x)}>{x}</button>)}</div>
          <div className="flex flex-wrap gap-2">{GESTURES.map((x) => <button key={x} className="btn-secondary px-3 h-9 rounded-[10px]" onClick={() => setGesture(x)}>{x}</button>)}</div>
          <button className="btn-primary px-3 h-9 rounded-[10px]" onClick={() => setTalking((t) => !t)}>{talking ? 'stop talking' : 'talk'}</button>
        </div>
      </div>
      <div className="panel p-4 flex gap-4 items-end">
        {PRESETS.slice(0, 6).map(([label, f, g]) => <CoachRig key={label} face={f} gesture={g} size={110} bust />)}
      </div>
    </div>
  );
};

export default CoachLab;
