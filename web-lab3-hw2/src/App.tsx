import { useMemo, useRef, useState } from 'react';
import { generate88Keys } from './utils/pianoUtils';
import { PolyphonicSynth } from './audio/PolyphonicSynth';
import { PianoKey } from './components/PianoKey';
import { usePianoKeyboard } from './hooks/usePianoKeyboard';
import { useSequencer } from './hooks/useSequencer';
import styles from './App.module.css';

function App() {
  const synthRef = useRef(new PolyphonicSynth(8));
  const keys = useMemo(() => generate88Keys(), []);
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());

  // Hàm âm thanh cơ bản
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

  // Tích hợp Sequencer
  const sequencer = useSequencer(handleNoteOn, handleNoteOff);

  // Bọc lại hàm handleNoteOn/Off để vừa phát nhạc vừa ghi âm
  const onNoteOnCombined = (midi: number, freq: number) => {
    handleNoteOn(midi, freq);
    sequencer.handleRecordNoteOn(midi, freq);
  };

  const onNoteOffCombined = (midi: number) => {
    handleNoteOff(midi);
    sequencer.handleRecordNoteOff(midi);
  };

  // Kích hoạt bắt sự kiện bàn phím (dùng hàm combined)
  usePianoKeyboard({
    onNoteOn: onNoteOnCombined,
    onNoteOff: onNoteOffCombined,
    keysData: keys,
  });

  return (
    <main className={styles.container}>
      <h1>88-Key Piano Sequencer</h1>
      
      {/* Bảng điều khiển */}
      <section className={styles.controls}>
        {!sequencer.isRecording ? (
          <button className={`${styles.button} ${styles.btnRecord}`} onClick={sequencer.startRecording}>
            Record
          </button>
        ) : (
          <button className={`${styles.button} ${styles.btnStop}`} onClick={sequencer.stopRecording}>
            Stop Recording ({sequencer.noteCount} notes)
          </button>
        )}

        <button 
          className={`${styles.button} ${styles.btnPlay}`} 
          onClick={sequencer.playSequence}
          disabled={sequencer.noteCount === 0 || sequencer.isPlaying}
        >
          Play Sequence
        </button>

        <button 
          className={`${styles.button} ${styles.btnStop}`} 
          onClick={sequencer.stopSequence}
          disabled={!sequencer.isPlaying}
        >
          Stop
        </button>

        <select 
          className={styles.select}
          value={sequencer.speed} 
          onChange={(e) => sequencer.setSpeed(Number(e.target.value))}
        >
          <option value={0.5}>0.5x Speed</option>
          <option value={1}>1.0x Speed</option>
          <option value={2}>2.0x Speed</option>
        </select>
      </section>
      
      {/* Bàn phím */}
      <section className={styles.pianoWrapper}>
        {keys.map((key) => (
          <PianoKey
            key={key.midi}
            midi={key.midi}
            noteName={key.noteName}
            freq={key.freq}
            isBlack={key.isBlack}
            isPressed={pressedKeys.has(key.midi)}
            onNoteOn={onNoteOnCombined}
            onNoteOff={onNoteOffCombined}
          />
        ))}
      </section>
    </main>
  );
}

export default App;