// Mảng tên các nốt nhạc trong 1 quãng tám
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export interface PianoKeyData {
  midi: number;
  noteName: string;
  freq: number;
  isBlack: boolean;
}

export function generate88Keys(): PianoKeyData[] {
  const keys: PianoKeyData[] = [];

  // MIDI từ 21 (nốt A0) đến 108 (nốt C8)
  for (let midi = 21; midi <= 108; midi++) {
    // Tính tần số theo công thức thầy cho
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    
    // Tính tên nốt và quãng tám
    const noteName = NOTE_NAMES[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    
    // Phím đen là các nốt thăng (có dấu #)
    const isBlack = noteName.includes('#');

    keys.push({
      midi,
      noteName: `${noteName}${octave}`,
      freq,
      isBlack,
    });
  }

  return keys;
}