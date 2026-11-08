import { useState } from 'react';
import { usePubgAirdropTimer } from '../hooks/usePubgAirdropTimer';
import type { PubgCrateDrop } from '../types/pubg';
import { claimCrateApi } from '../api/pubgApi';
import styles from './CrateList.module.css';

function CrateItem({ 
  crate, 
  onClaim, 
  isClaiming 
}: { 
  crate: PubgCrateDrop; 
  onClaim: (id: string) => void; 
  isClaiming: boolean;
}) {
  const { remainingMs, isLive } = usePubgAirdropTimer(crate.dropEpochMs);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');

  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(crate.priceVnd);

  return (
    <article className={styles.crateCard}>
      <h3 className={styles.title}>{crate.title}</h3>
      <p className={styles.price}>{formattedPrice}</p>
      <p className={styles.stock}>Còn lại: <strong>{crate.remainingStock}</strong></p>
      
      <div style={{ marginBottom: '1rem' }}>
        Trạng thái: {isLive ? (
          <span style={{ color: 'green', fontWeight: 'bold' }}>Đang mở</span>
        ) : (
          <span className={styles.timer}>Kết thúc sau: {m}:{s}</span>
        )}
      </div>

      <button 
        type="button"
        onClick={() => onClaim(crate.id)}
        disabled={isClaiming || crate.remainingStock === 0 || isLive}
        style={{ padding: '8px 16px', cursor: isClaiming ? 'not-allowed' : 'pointer' }}
      >
        {isClaiming ? 'Đang xử lý...' : 'Mua ngay'}
      </button>
    </article>
  );
}

export function CrateList({ initialCrates }: { initialCrates: PubgCrateDrop[] }) {
  // Đưa data vào state để có thể thay đổi khi mua
  const [crates, setCrates] = useState<PubgCrateDrop[]>(initialCrates);
  
  // State lưu ID của rương đang được xử lý (để khóa nút)
  const [claimingId, setClaimingId] = useState<string | null>(null);
  
  // State lưu thông báo lỗi nếu có
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleClaim = async (crateId: string) => {
    setErrorMsg(null);
    setClaimingId(crateId);

    // LƯU LẠI STOCK CŨ ĐỂ PHÒNG HỜ ROLLBACK
    const prevCrates = crates;

    // 1. OPTIMISTIC UPDATE: Trừ kho ngay lập tức trên UI
    setCrates((prev) =>
      prev.map((c) => c.id === crateId ? { ...c, remainingStock: c.remainingStock - 1 } : c)
    );

    try {
      // Gọi API
      await claimCrateApi(crateId);
      // Nếu thành công thì giữ nguyên, không làm gì cả
    } catch (error: any) {
      // 2. ROLLBACK: Nếu lỗi, trả lại stock như cũ
      setCrates(prevCrates);
      setErrorMsg(error.message);
    } finally {
      // Mở khóa nút
      setClaimingId(null);
    }
  };

  return (
    <section aria-label="Danh sách rương">
      <h2>Airdrop Crates</h2>
      
      {/* Hiển thị lỗi nếu có */}
      {errorMsg && (
        <div role="alert" style={{ color: 'red', fontWeight: 'bold', marginBottom: '1rem' }}>
          {errorMsg}
        </div>
      )}

      <div className={styles.crateGrid}>
        {crates.map((crate) => (
          <CrateItem 
            key={crate.id} 
            crate={crate} 
            onClaim={handleClaim} 
            isClaiming={claimingId === crate.id}
          />
        ))}
      </div>
    </section>
  );
}