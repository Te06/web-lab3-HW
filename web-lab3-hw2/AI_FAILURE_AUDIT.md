# AI Failure Mode Audit - Homework 2 (88-Key Piano)

Báo cáo này tổng hợp 3 lỗi phổ biến mà AI thường sinh ra khi code bài 88-Key Piano liên quan đến tối ưu hiệu năng và quản lý bộ nhớ.

## 1. Lỗi React.memo bị vô hiệu hóa do truyền Function/Array mới
- **Vulnerability:** Component con bị re-render dư thừa, làm sập hiệu năng (Render 88 phím cùng lúc).
- **AI Prompt:** "Viết component cha truyền hàm xử lý âm thanh xuống 88 component con được bọc React.memo".
- **AI Generated Code:** 
  ```jsx
  <PianoKey onNoteOn={(midi) => handleNoteOn(midi)} />
  - Risk: Mỗi lần component cha re-render, một hàm arrow function mới lại được tạo ra. React.memo so sánh thấy prop onNoteOn thay đổi (dù logic bên trong y hệt) nên vẫn ép component con phải re-render.
- Detection Method: Bật React DevTools Profiler, bấm 1 phím thấy cả 88 phím đều bị highlight sáng.
- Engineering Refactor: Dùng hook useCallback để giữ nguyên tham chiếu của hàm qua các lần render.
  const handleNoteOn = useCallback((midi) => {
    // ...
  }, []);
  
  <PianoKey onNoteOn={handleNoteOn} />

## 2. Lỗi rò rỉ bộ nhớ do không dọn dẹp Timer (Sequencer)
- Vulnerability: Âm thanh vẫn tiếp tục phát ngầm hoặc crash app khi đã chuyển trang (unmount).
- AI Prompt: "Viết chức năng phát lại chuỗi nốt nhạc đã ghi âm".
- AI Generated Code:
  useEffect(() => {
    notes.forEach(n => setTimeout(() => playNote(n), n.deltaMs));
  }, []); // Không có cleanup
- Risk: Nếu người dùng chuyển trang khi đang phát nhạc, các timer vẫn chạy ngầm và cố gắng phát âm thanh trên một component đã bị hủy, gây giật lag hoặc crash.
- Detection Method: Bấm Play, sau đó chuyển sang tab khác hoặc unmount component, nghe thấy tiếng nhạc vẫn vang lên.
- Engineering Refactor: Lưu trữ các timer ID và dùng clearTimeout trong hàm cleanup của useEffect.

## 3. Lỗi "Kẹt nốt" (Stuck Notes) khi hủy AbortController
- Vulnerability: Nốt nhạc bị ngân mãi không dứt khi người dùng bấm nút Stop.
- AI Prompt: "Dùng AbortController để hủy quá trình phát nhạc khi bấm Stop".
- AI Generated Code:
  abortController.abort(); // Hủy toàn bộ setTimeout
- Risk: Việc hủy setTimeout sẽ chặn cả cái timer dùng để gọi hàm noteOff (tắt tiếng). Kết quả là nốt đang kêu bị kẹt lại trong AudioContext và ngân mãi mãi.
- Detection Method: Bấm Play, đang phát mà bấm Stop, thấy âm thanh ngân dài không tắt.
- Engineering Refactor: Phải lưu lại danh sách các nốt đang kêu (VD: Set) và chủ động gọi hàm onNoteOff(midi) cho tất cả các nốt này ngay khi bấm nút Stop.