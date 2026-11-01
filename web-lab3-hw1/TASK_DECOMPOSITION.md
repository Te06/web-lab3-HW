# Lab 3 - Homework 1: Production Studio Drum Kit

## Block 1: Setup & Audio Engine (Commit 1)
- [x] Khởi tạo project Vite + React 19.
- [x] Thiết lập Web Audio API (tạo AudioContext, GainNode).
- [x] Viết hàm triggerPad(âme, key) để phát âm thanh.

## Block 2: Keyboard Hook & Event Isolation (Commit 2)
- [x] Tạo custom hook useDrumKeyboard.
- [x] Lắng nghe sự kiện window 'keydown' / 'keyup' bằng e.code (W3C standard).
- [x] Chặn auto-repeat của OS bằng e.repeat.
- [x] Bỏ qua sự kiện nếu đang gõ trong thẻ input/textarea.
- [x] Đảm bảo cleanup removeEventListener khi unmount.

## Block 3: UI & Accessibility (Commit 3)
- [x] Tạo các nút Drum Pads bằng <button> thay vì <div>.
- [x] Thêm aria-pressed={isActive} và aria-label cho từng pad.
- [x] Render lịch sử đánh trống (Hit Log) bằng <output aria-live="polite">.
- [x] CSS cho các nút, hiệu ứng active.