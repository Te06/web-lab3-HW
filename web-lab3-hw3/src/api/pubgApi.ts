export function claimCrateApi(crateId: string): Promise<{ success: boolean }> {
  return new Promise((resolve, reject) => {
    // Giả lập độ trễ mạng 1.5 giây
    setTimeout(() => {
      // Giả lập 30% bị lỗi 409 (Hết hàng do tranh chấp)
      const isConflict = Math.random() < 0.3;
      
      if (isConflict) {
        const error = new Error('409 Conflict: Rương này đã bị người khác nẫng mất rồi!');
        (error as any).status = 409;
        reject(error);
      } else {
        resolve({ success: true });
      }
    }, 1500);
  });
}