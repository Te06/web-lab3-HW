# Lab 3 - Homework 2: 88-Key Piano & Concurrent FIFO Sequencer

## Block 1: Audio Engine & Key Generation (Commit 1)
- [x] Sinh 88 phím bằng toán học (MIDI 21 đến 108).
- [x] Viết class PolyphonicSynth (giới hạn 8 voices, FIFO voice stealing).
- [x] Áp dụng React.memo cho component PianoKey.

## Block 2: UI & Keyboard Interaction (Commit 2)
- [x] Render 88 nút bấm bằng map.
- [x] Gắn sự kiện chuột (onPointerDown/Up) và bàn phím.
- [x] Xử lý CSS cho phím trắng/đen.

## Block 3: Sequencer & AbortController (Commit 3)
- [x] Ghi âm (Record) sự kiện bấm phím.
- [x] Phát lại (Replay) đúng nhịp, hỗ trợ thay đổi tốc độ (0.5x, 1.0x, 2.0x).
- [x] Dùng AbortController để hủy chuỗi âm thanh khi bấm Stop.