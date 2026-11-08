import { useRef, useState } from 'react';

export interface NoteEvent {
  midi: number;
  freq: number;
  duration: number; // Thời gian ngân của nốt (ms)
  deltaMs: number;  // Thời gian chờ từ nốt trước đến nốt này (ms)
}

export function useSequencer(
  onNoteOn: (midi: number, freq: number) => void,
  onNoteOff: (midi: number) => void
) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  const recordedNotes = useRef<NoteEvent[]>([]);
  // Thêm Set này để lưu các nốt đang kêu trong lúc phát lại (để tắt khi bấm Stop)
  const playingNotes = useRef<Set<number>>(new Set());
  
  const activeNotes = useRef<Map<number, { startTime: number; freq: number }>>(new Map());
  const lastNoteTime = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const startRecording = () => {
    recordedNotes.current = [];
    activeNotes.current.clear();
    lastNoteTime.current = performance.now();
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleRecordNoteOn = (midi: number, freq: number) => {
    if (!isRecording) return;
    const now = performance.now();
    activeNotes.current.set(midi, { startTime: now, freq });
    
    const delta = now - lastNoteTime.current;
    lastNoteTime.current = now;
    
    recordedNotes.current.push({ midi, freq, deltaMs: delta, duration: 0 });
  };

  const handleRecordNoteOff = (midi: number) => {
    if (!isRecording) return;
    const activeNote = activeNotes.current.get(midi);
    if (activeNote) {
      const duration = performance.now() - activeNote.startTime;
      const noteIndex = recordedNotes.current.findIndex(
        (n) => n.midi === midi && n.duration === 0
      );
      if (noteIndex !== -1) {
        recordedNotes.current[noteIndex].duration = duration;
      }
      activeNotes.current.delete(midi);
    }
  };

  const playSequence = () => {
    if (recordedNotes.current.length === 0 || isPlaying) return;

    setIsPlaying(true);
    playingNotes.current.clear(); // Xoá danh sách nốt đang kêu trước khi chạy
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    timeoutsRef.current = [];

    let cumulativeTime = 0;

    recordedNotes.current.forEach((note) => {
      cumulativeTime += note.deltaMs / speed;
      
      const timeoutId = window.setTimeout(() => {
        if (controller.signal.aborted) return;
        
        // Bật nốt và thêm vào danh sách đang kêu
        onNoteOn(note.midi, note.freq);
        playingNotes.current.add(note.midi);
        
        // Tắt nốt sau khoảng duration
        const offTimeoutId = window.setTimeout(() => {
          if (controller.signal.aborted) return;
          onNoteOff(note.midi);
          playingNotes.current.delete(note.midi); // Xoá khỏi danh sách khi đã tắt
        }, note.duration / speed);
        
        timeoutsRef.current.push(offTimeoutId);
      }, cumulativeTime);

      timeoutsRef.current.push(timeoutId);
    });

    const lastNote = recordedNotes.current[recordedNotes.current.length - 1];
    const totalTime = cumulativeTime + (lastNote.duration / speed);
    
    const endTimeoutId = window.setTimeout(() => {
      if (!controller.signal.aborted) {
        setIsPlaying(false);
      }
    }, totalTime);
    
    timeoutsRef.current.push(endTimeoutId);
  };

  const stopSequence = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Xóa tất cả các timer đang chờ
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
    
    setIsPlaying(false);
    
    // QUAN TRỌNG: Tắt tất cả các nốt đang kêu dở dang do bị hủy timer
    playingNotes.current.forEach((midi) => {
      onNoteOff(midi);
    });
    playingNotes.current.clear();

    // Tắt các nốt đang kêu nếu đang trong quá trình ghi âm
    activeNotes.current.forEach((_, midi) => onNoteOff(midi));
  };

  return {
    isRecording,
    isPlaying,
    speed,
    setSpeed,
    startRecording,
    stopRecording,
    playSequence,
    stopSequence,
    handleRecordNoteOn,
    handleRecordNoteOff,
    noteCount: recordedNotes.current.length,
  };
}