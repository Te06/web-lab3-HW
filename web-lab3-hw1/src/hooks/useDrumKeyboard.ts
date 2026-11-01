import { useEffect } from 'react';

// Định nghĩa kiểu dữ liệu cho hàm nhận diện phím bấm
type PadMap = Map<string, { id: string }>;

export function useDrumKeyboard(
  padMap: PadMap,
  onTriggerPad: (padId: string) => void,
  isEnabled: boolean = true
) {
  useEffect(() => {
    // Nếu tính năng bị tắt thì không làm gì cả
    if (!isEnabled) return undefined;

    const onKeyDown = (e: KeyboardEvent) => {
      // Chặn việc giữ phím lâu làm âm thanh bị lặp lại liên tục
      if (e.repeat) return;

      // Nếu người dùng đang gõ chữ trong ô input/textarea thì bỏ qua, không đánh trống
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      // Dùng e.code để lấy mã vật lý của phím (ví dụ KeyA), tránh lỗi bộ gõ tiếng Việt
      const pad = padMap.get(e.code);
      if (pad) {
        e.preventDefault(); // Chặn các hành vi mặc định của trình duyệt
        onTriggerPad(pad.id);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    // Hàm dọn dẹp: khi component bị hủy thì gỡ bỏ sự kiện để tránh rò rỉ bộ nhớ
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [padMap, onTriggerPad, isEnabled]);
}