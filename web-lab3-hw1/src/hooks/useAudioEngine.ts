// Khởi tạo AudioContext DUY NHẤT một lần ở ngoài
// Tránh việc tạo mới liên tục gây nghẽn âm thanh
const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
let audioContext: AudioContext | null = null;

export function playDrumSound(padId: string) {
  if (!audioContext) {
    audioContext = new AudioCtx();
  }

  // Một số trình duyệt yêu cầu tương tác người dùng mới cho phát âm thanh
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);

  let frequency = 150;
  let duration = 0.5;
  let waveType: OscillatorType = 'triangle';

  switch (padId) {
    case 'kick':
      frequency = 150;
      break;
    case 'snare':
      frequency = 250;
      duration = 0.2;
      break;
    case 'hihat':
      frequency = 800;
      duration = 0.1; // Tăng lên 0.1s để kịp nghe thấy
      waveType = 'square'; // Đổi sang sóng vuông cho giống tiếng chũm chọe
      break;
    case 'tom':
      frequency = 400;
      duration = 0.3;
      break;
  }

  osc.type = waveType;
  osc.frequency.setValueAtTime(frequency, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  gain.gain.setValueAtTime(1, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

  osc.start();
  osc.stop(audioContext.currentTime + duration);

  // Dọn dẹp node sau khi phát xong, KHÔNG đóng AudioContext
  setTimeout(() => {
    osc.disconnect();
    gain.disconnect();
  }, duration * 1000);
}