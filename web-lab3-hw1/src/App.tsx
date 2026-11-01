import { useState, useMemo, useCallback } from 'react';
import { useDrumKeyboard } from './hooks/useDrumKeyboard';
import { playDrumSound } from './hooks/useAudioEngine';
import styles from './App.module.css';

// Cấu hình thông tin các phím trống
const PAD_DATA = [
  { id: 'kick', keyLabel: 'W', code: 'KeyW', soundName: 'Kick' },
  { id: 'snare', keyLabel: 'A', code: 'KeyA', soundName: 'Snare' },
  { id: 'hihat', keyLabel: 'S', code: 'KeyS', soundName: 'Hi-hat' },
  { id: 'tom', keyLabel: 'D', code: 'KeyD', soundName: 'Tom' },
];

function App() {
  // State lưu lịch sử đánh trống (chỉ lưu 5 nốt gần nhất cho gọn)
  const [hitLog, setHitLog] = useState<string[]>([]);
  // State để làm hiệu ứng nháy sáng khi nút được bấm
  const [activePad, setActivePad] = useState<string | null>(null);

  // Tạo Map để truyền vào Hook (đúng như slide yêu cầu)
  const padMap = useMemo(() => {
    const map = new Map();
    PAD_DATA.forEach((pad) => map.set(pad.code, pad));
    return map;
  }, []);

  // Hàm xử lý khi có âm thanh phát ra (do bấm phím hoặc click chuột)
  const handleTriggerPad = useCallback((padId: string) => {
    playDrumSound(padId);

    // Tìm tên nốt để đưa vào lịch sử
    const pad = PAD_DATA.find((p) => p.id === padId);
    if (pad) {
      setHitLog((prev) => [pad.soundName, ...prev].slice(0, 5));
    }

    // Bật hiệu ứng visual, sau 150ms thì tắt đi
    setActivePad(padId);
    setTimeout(() => setActivePad(null), 150);
  }, []);

  // Kích hoạt Hook bắt sự kiện bàn phím
  useDrumKeyboard(padMap, handleTriggerPad);

  return (
    <main className={styles.container}>
      <h1>Production Drum Kit</h1>
      <p>Bấm phím W, A, S, D hoặc click chuột để chơi.</p>

      {/* Khu vực các phím trống (Không dùng div bao ngoài) */}
      <section className={styles.drumPads} aria-label="Drum Pads">
        {PAD_DATA.map((pad) => (
          <button
            key={pad.id}
            type="button"
            className={`${styles.pad} ${activePad === pad.id ? styles.active : ''}`}
            aria-pressed={activePad === pad.id}
            aria-label={`Play ${pad.soundName} sound`}
            onClick={() => handleTriggerPad(pad.id)}
          >
            <span className={styles.keyLabel}>{pad.keyLabel}</span>
            <span className={styles.soundName}>{pad.soundName}</span>
          </button>
        ))}
      </section>

      {/* Lịch sử đánh trống (Dành cho người khiếm thính) */}
      <section className={styles.hitLogContainer} aria-label="Hit History">
        <h2>Visual Hit Log</h2>
        <output className={styles.hitLog} aria-live="polite">
          {hitLog.length > 0 ? hitLog.join(' | ') : 'Start playing...'}
        </output>
      </section>
    </main>
  );
}

export default App;