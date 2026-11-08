import { useEffect } from 'react';

// Map các phím chữ với nốt MIDI (từ C4 đến C5)
const KEY_MAP: Record<string, number> = {
  KeyA: 60, // C4
  KeyW: 61, // C#4
  KeyS: 62, // D4
  KeyE: 63, // D#4
  KeyD: 64, // E4
  KeyF: 65, // F4
  KeyT: 66, // F#4
  KeyG: 67, // G4
  KeyY: 68, // G#4
  KeyH: 69, // A4
  KeyU: 70, // A#4
  KeyJ: 71, // B4
  KeyK: 72, // C5
};

interface UsePianoKeyboardProps {
  onNoteOn: (midi: number, freq: number) => void;
  onNoteOff: (midi: number) => void;
  keysData: { midi: number; freq: number }[]; // Truyền mảng 88 phím vào để lấy tần số
}

export function usePianoKeyboard({ onNoteOn, onNoteOff, keysData }: UsePianoKeyboardProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Chặn spam khi giữ phím
      if (e.repeat) return;

      // Bỏ qua nếu đang gõ trong ô input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const midi = KEY_MAP[e.code];
      if (midi) {
        e.preventDefault(); // Ngăn trình duyệt cuộn trang
        // Tìm tần số tương ứng với nốt MIDI này
        const keyData = keysData.find((k) => k.midi === midi);
        if (keyData) {
          onNoteOn(midi, keyData.freq);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const midi = KEY_MAP[e.code];
      if (midi) {
        onNoteOff(midi);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onNoteOn, onNoteOff, keysData]);
}