# Lab 3 - Homework 1: Production Studio Drum Kit

## Block 1: Setup & Audio Engine (Commit 1)
- [ ] Khởi tạo project Vite + React 19.
- [ ] Thiết lập Web Audio API (tạo AudioContext, GainNode).
- [ ] Viết hàm triggerPad(âme, key) để phát âm thanh.

## Block 2: Keyboard Hook & Event Isolation (Commit 2)
- [ ] Tạo custom hook useDrumKeyboard.
- [ ] Lắng nghe sự kiện window 'keydown' / 'keyup' bằng e.code (W3C standard).
- [ ] Chặn auto-repeat của OS bằng e.repeat.
- [ ] Bỏ qua sự kiện nếu đang gõ trong thẻ input/textarea.
- [ ] Đảm bảo cleanup removeEventListener khi unmount.

## Block 3: UI & Accessibility (Commit 3)
- [ ] Tạo các nút Drum Pads bằng <button> thay vì <div>.
- [ ] Thêm aria-pressed={isActive} và aria-label cho từng pad.
- [ ] Render lịch sử đánh trống (Hit Log) bằng <output aria-live="polite">.
- [ ] CSS cho các nút, hiệu ứng active.