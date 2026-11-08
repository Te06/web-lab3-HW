# AI Failure Mode Audit - Homework 3 (PUBG VN Arena)

Báo cáo này tổng hợp 3 lỗi phổ biến mà AI thường sinh ra khi code bài PUBG Arena liên quan đến Timer, Optimistic Update và Cleanup.

## 1. Lỗi sai lệch thời gian (Timer Drift) do dùng setInterval
- **Vulnerability:** Đồng hồ đếm ngược chạy chậm hơn thực tế khi chuyển sang tab khác.
- **AI Prompt:** "Viết đồng hồ đếm ngược cho rương quà PUBG".
- **AI Generated Code:**

```jsx
const [time, setTime] = useState(600);
useEffect(() => {
  setInterval(() => setTime(t => t - 1), 1000);
}, []);
Risk: Trình duyệt tự động bóp nghẹt (throttle) các tab chạy ngầm để tiết kiệm pin, khiến interval bị trễ. Đồng hồ trên web sẽ bị trôi (drift) so với thời gian thực.

Detection Method: Chuyển sang tab khác 1 phút, sau đó quay lại thấy đồng hồ bị chậm hơn.

Engineering Refactor: Dùng targetEpochMs - Date.now() và lắng nghe sự kiện visibilitychange để đồng bộ lại thời gian khi mở tab.

## 2. Lỗi Desync dữ liệu do thiếu Rollback (Optimistic Update)
Vulnerability: Kho hàng bị trừ sai lệch nếu server báo lỗi 409.

AI Prompt: "Cập nhật giỏ hàng ngay khi bấm mua".

AI Generated Code:

jsx
setCrates(prev => prev.map(c => c.id === id ? { ...c, stock: c.stock - 1 } : c));
fetch('/api/buy').catch(err => console.log(err)); // Không rollback
Risk: Nếu API trả về lỗi (hết hàng), UI vẫn hiển thị số lượng đã bị trừ, gây sai lệch dữ liệu với server.

Detection Method: Giả lập mạng lỗi 409, thấy kho bị trừ đi 1 nhưng không có hàng.

Engineering Refactor: Lưu lại state cũ trước khi trừ, nếu API lỗi thì gán lại state cũ (Rollback).

## 3. Lỗi Memory Leak do thiếu Cleanup Event Listener
Vulnerability: Sự kiện visibilitychange bị nhân đôi mỗi lần component render lại.

AI Prompt: "Lắng nghe sự kiện chuyển tab".

AI Generated Code:

jsx
useEffect(() => {
  document.addEventListener('visibilitychange', handleWake);
}, [targetEpochMs]);
Risk: Mỗi lần prop targetEpochMs thay đổi, một listener mới lại được thêm vào mà không gỡ bỏ listener cũ. Gây rò rỉ bộ nhớ và gọi hàm sai số lần.

Detection Method: Dùng React DevTools kiểm tra số lượng listener (hoặc console.log trong hàm handleWake).

Engineering Refactor: Thêm hàm return () => document.removeEventListener(...) trong useEffect.