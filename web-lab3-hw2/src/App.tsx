import { useMemo, useRef, useState } from 'react';
import { generate88Keys } from './utils/pianoUtils';
import { PolyphonicSynth } from './audio/PolyphonicSynth';
import { PianoKey } from './components/PianoKey';
import { usePianoKeyboard } from './hooks/usePianoKeyboard';

function App() {
  const synthRef = useRef(new PolyphonicSynth(8));
  const keys = useMemo(() => generate88Keys(), []);
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

  // Gọi hook bắt sự kiện bàn phím
  usePianoKeyboard({
    onNoteOn: handleNoteOn,
    onNoteOff: handleNoteOff,
    keysData: keys,
  });

  return (
    <main style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>88-Key Piano</h1>
      
      {/* Thêm overflow-x để cuộn ngang */}
      <section style={{ display: 'flex', position: 'relative', height: '200px', overflowX: 'auto', maxWidth: '100%' }}>
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
      <p style={{ marginTop: '1rem', color: '#666' }}>Sử dụng bàn phím: A, W, S, E, D, F, T, G, Y, H, U, J, K</p>
    </main>
  );
}

export default App;