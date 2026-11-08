export class PolyphonicSynth {
  private ctx: AudioContext | null = null;
  private maxVoices: number;
  // Dùng Map để lưu các nốt đang kêu, Map giữ thứ tự chèn (FIFO)
  private voices: Map<number, { osc: OscillatorNode; gain: GainNode }> = new Map();

  constructor(maxVoices = 8) {
    this.maxVoices = maxVoices;
  }

  noteOn(midi: number, freq: number) {
    // Chỉ tạo AudioContext 1 lần duy nhất
    if (!this.ctx) {
      this.ctx = new window.AudioContext();
    }
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Nếu nốt này đang kêu rồi thì bỏ qua
    if (this.voices.has(midi)) return;

    // Nếu đã đạt giới hạn 8 nốt, tìm nốt cũ nhất (đầu tiên trong Map) và tắt nó đi
    if (this.voices.size >= this.maxVoices) {
      const oldestMidi = this.voices.keys().next().value;
      if (oldestMidi !== undefined) {
        this.noteOff(oldestMidi);
      }
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    // Âm lượng vừa phải để không bị rè
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    osc.connect(gain).connect(this.ctx.destination);
    osc.start();

    // Lưu vào Map
    this.voices.set(midi, { osc, gain });
  }

  noteOff(midi: number) {
    const voice = this.voices.get(midi);
    if (!voice || !this.ctx) return;

    const { osc, gain } = voice;

    // Giảm âm lượng từ từ trong 0.04s để tránh bị tiếng "bụp" (Click-free)
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
    
    // Tắt hẳn sau khi giảm âm lượng
    osc.stop(this.ctx.currentTime + 0.04);

    // Xoá khỏi Map
    this.voices.delete(midi);
  }
}