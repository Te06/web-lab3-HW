import { memo } from 'react';

interface PianoKeyProps {
  midi: number;
  noteName: string;
  isBlack: boolean;
  isPressed: boolean;
  onNoteOn: (midi: number, freq: number) => void;
  onNoteOff: (midi: number) => void;
  freq: number;
}

// Bọc bằng React.memo để nó chỉ render lại khi isPressed thay đổi
export const PianoKey = memo(function PianoKey({
  midi,
  noteName,
  isBlack,
  isPressed,
  onNoteOn,
  onNoteOff,
  freq,
}: PianoKeyProps) {
  return (
    <button
      type="button"
      className={`key ${isBlack ? 'key-black' : 'key-white'} ${isPressed ? 'key-pressed' : ''}`}
      aria-pressed={isPressed}
      aria-label={`Play ${noteName}`}
      onPointerDown={() => onNoteOn(midi, freq)}
      onPointerUp={() => onNoteOff(midi)}
      // Nếu chuột bị kéo ra ngoài nút thì cũng phải tắt tiếng
      onPointerLeave={() => onNoteOff(midi)}
    >
      <span>{noteName}</span>
    </button>
  );
});