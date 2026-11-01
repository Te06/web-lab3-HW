# AI Failure Mode Audit - HW1 Drum Kit

Báo cáo này ghi lại các lỗi (flaws) phổ biến của AI khi sinh code liên quan đến React, Web Audio API và Event Listener, đồng thời giải trình cách chúng tôi đã phát hiện và khắc phục.

## 1. Vulnerability: Stale Closure (Đóng băng state trong Event Listener)
- **AI Prompt:** "Viết useEffect lắng nghe keydown để đánh trống trong React."
- **AI Generated Code (Dự kiến):** AI thường viết `useEffect(() => { window.addEventListener('keydown', handleKeyPress); }, []);` với hàm `handleKeyPress` định nghĩa bên ngoài effect.
- **Risk:** Hàm `handleKeyPress` đọc state bên ngoài nên bị "đóng băng" ở giá trị lần render đầu tiên (Stale Closure). Âm thanh phát ra không khớp với cấu hình người dùng đang thấy trên UI. Ngoài ra effect không return cleanup khiến listener bị nhân đôi mỗi lần render (đặc biệt khi React 19 StrictMode chạy effect 2 lần ở dev).
- **Detection Method:** Bấm phím, âm thanh vẫn theo cấu hình cũ dù state đã đổi. Gắn breakpoint trong `handleKeyPress`, một lần bấm hit nhiều lần là dấu hiệu listener bị nhân đôi.
- **Engineering Refactor:** Đưa hàm xử lý vào trong `useEffect` và luôn return hàm cleanup: `return () => window.removeEventListener('keydown', handleKeyDown);`. Nếu không muốn effect chạy lại, giữ giá trị mới nhất trong `useRef`.

## 2. Vulnerability: Memory Leak (Rò rỉ bộ nhớ do tạo AudioContext liên tục)
- **AI Prompt:** "Viết hàm phát âm thanh khi người dùng bấm phím."
- **AI Generated Code (Dự kiến):** AI thường viết `function playSound() { const ctx = new AudioContext(); /* ... */ }` — tạo AudioContext mới mỗi lần gọi.
- **Risk:** Browser giới hạn số lượng AudioContext (khoảng 6 cái). Vượt ngưỡng, context mới bị suspended hoặc bị từ chối tạo, dẫn đến mất tiếng hoàn toàn sau vài lần bấm. Mỗi context còn chiếm tài nguyên audio thread, để tồn đọng sẽ làm tab bị ì.
- **Detection Method:** Bấm phím liên tục khoảng 10 lần, Console hiện "The AudioContext was not allowed to start". Mở tab Memory trong DevTools, chụp Heap Snapshot trước/sau khi bấm — số lượng AudioContext tăng dần không giảm là đang rò rỉ.
- **Engineering Refactor:** Khởi tạo AudioContext duy nhất một lần, giữ trong `useRef` hoặc module singleton ngoài component. Các lần phát sau chỉ tạo `OscillatorNode` và `GainNode` gắn vào context đó. Gọi `audioCtx.resume()` ở lần tương tác đầu tiên vì browser mặc định để context ở trạng thái `suspended`.

## 3. Vulnerability: Dùng e.key thay vì e.code (Sai phím khi bật bộ gõ tiếng Việt)
- **AI Prompt:** "Bắt sự kiện bấm phím A, S, D để đánh trống."
- **AI Generated Code (Dự kiến):** AI thường viết `if (e.key === 'a') { playKick(); }`.
- **Risk:** `e.key` phụ thuộc bộ gõ và layout bàn phím. Bật UniKey, gõ phím A có thể trả về `'á'`, `'à'`, `'ả'`... nên điều kiện `=== 'a'` fail, phím trống không hoạt động. CapsLock cũng làm `e.key` trả về `'A'`. Đổi layout AZERTY thì `e.key` trả về ký tự theo layout mới, không phải vị trí vật lý.
- **Detection Method:** Bật UniKey hoặc CapsLock, bấm phím A, xem `console.log(e.key)` — giá trị không phải `'a'`. Đổi layout bàn phím trong OS Settings sang AZERTY, bấm phím ở vị trí chữ A vật lý — `e.key` trả về `'q'`.
- **Engineering Refactor:** Dùng `e.code` — mã vật lý của phím, không phụ thuộc layout hay bộ gõ: `if (e.code === 'KeyA') { playKick(); }`. Các mã thường dùng: `KeyA`, `KeyS`, `KeyD`, `KeyF`, `Space`, `ArrowUp`, `ArrowDown`. `e.code` không phân biệt hoa thường nên không cần xử lý CapsLock.