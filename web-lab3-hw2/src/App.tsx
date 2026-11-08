import { useMemo, useRef, useState } from 'react';
import { generate88Keys } from './utils/pianoUtils';
import { PolyphonicSynth } from './audio/PolyphonicSynth';
import { PianoKey } from './components/PianoKey';

function App() {
  // Khởi tạo Synth 1 lần duy nhất bằng useRef để không bị reset khi render
  const synthRef = useRef(new PolyphonicSynth(8));
  
  // Sinh 88 phím 1 lần duy nhất
  const keys = useMemo(() => generate88Keys(), []);

  // Lưu trạng thái các phím đang được nhấn để đổi màu
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());

  const handleNoteOn = (midi: number, freq: number) => {
    synthRef.current.noteOn(midi, freq);
    setPressedKeys((prev) => new Set(prev).add(midi));
  };

  const handleNoteOff = (midi: number) => {
    synthRef.current.noteOff(midi);
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });
  };

  return (
    <main style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>88-Key Piano</h1>
      
      {/* Khung chứa phím đàn */}
      <section style={{ display: 'flex', position: 'relative', height: '200px' }}>
        {keys.map((key) => (
          <PianoKey
            key={key.midi}
            midi={key.midi}
            noteName={key.noteName}
            freq={key.freq}
            isBlack={key.isBlack}
            isPressed={pressedKeys.has(key.midi)}
            onNoteOn={handleNoteOn}
            onNoteOff={handleNoteOff}
          />
        ))}
      </section>
    </main>
  );
}

export default App;