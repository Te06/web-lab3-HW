# Lab 3 - Homework 2: 88-Key Piano & Concurrent FIFO Sequencer

## Block 1: Audio Engine & Key Generation (Commit 1)
- [ ] Sinh 88 phím bằng toán học (MIDI 21 đến 108).
- [ ] Viết class PolyphonicSynth (giới hạn 8 voices, FIFO voice stealing).
- [ ] Áp dụng React.memo cho component PianoKey.

## Block 2: UI & Keyboard Interaction (Commit 2)
- [ ] Render 88 nút bấm bằng map.
- [ ] Gắn sự kiện chuột (onPointerDown/Up) và bàn phím.
- [ ] Xử lý CSS cho phím trắng/đen.

## Block 3: Sequencer & AbortController (Commit 3)
- [ ] Ghi âm (Record) sự kiện bấm phím.
- [ ] Phát lại (Replay) đúng nhịp, hỗ trợ thay đổi tốc độ (0.5x, 1.0x, 2.0x).
- [ ] Dùng AbortController để hủy chuỗi âm thanh khi bấm Stop.