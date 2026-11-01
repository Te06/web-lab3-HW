import { useMemo } from 'react';
import { useDrumKeyboard } from './hooks/useDrumKeyboard';
import { playDrumSound } from './hooks/useAudioEngine';

function App() {
  // Định nghĩa các phím (Dùng Map theo đúng slide)
  const padMap = useMemo(() => {
    return new Map([
      ['KeyW', { id: 'kick' }],
      ['KeyA', { id: 'snare' }],
      ['KeyS', { id: 'hihat' }],
      ['KeyD', { id: 'tom' }],
    ]);
  }, []);

  // Hàm xử lý khi bấm phím
  const handleTriggerPad = (padId: string) => {
    playDrumSound(padId);
  };

  // Sử dụng hook bắt sự kiện phím
  useDrumKeyboard(padMap, handleTriggerPad);

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>HW1: Drum Kit</h1>
      <p>Bấm các phím W, A, S, D để nghe thử âm thanh (nhớ bật loa).</p>
    </main>
  );
}

export default App;