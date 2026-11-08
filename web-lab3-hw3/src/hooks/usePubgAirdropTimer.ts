import { useEffect, useState } from 'react';

export function usePubgAirdropTimer(targetEpochMs: number, serverOffsetMs: number = 0) {
  // Hàm tính thời gian còn lại thực tế
  const calcRemaining = () => Math.max(0, targetEpochMs - (Date.now() + serverOffsetMs));
  
  const [remainingMs, setRemainingMs] = useState(calcRemaining);

  useEffect(() => {
    // Hàm đồng bộ thời gian
    const syncClock = () => setRemainingMs(calcRemaining());
    
    syncClock(); // Chạy ngay lần đầu
    const timerId = window.setInterval(syncClock, 200); // Cập nhật mỗi 200ms

    // Khi tab được mở lại (quay lại từ tab khác), đồng bộ ngay lập tức để chống trôi
    const onWake = () => {
      if (document.visibilityState === 'visible') {
        syncClock();
      }
    };
    
    document.addEventListener('visibilitychange', onWake);

    // Dọn dẹp khi component bị hủy
    return () => {
      window.clearInterval(timerId);
      document.removeEventListener('visibilitychange', onWake);
    };
  }, [targetEpochMs, serverOffsetMs]);

  return { remainingMs, isLive: remainingMs === 0 };
}