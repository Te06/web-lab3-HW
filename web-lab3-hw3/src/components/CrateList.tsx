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
  const [crates, setCrates] = useState<PubgCrateDrop[]>(initialCrates);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  
  // State lưu thông báo lỗi và thành công
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleClaim = async (crateId: string) => {
    // Reset thông báo cũ trước khi mua
    setErrorMsg(null);
    setSuccessMsg(null);
    setClaimingId(crateId);

    // Lưu lại stock cũ để rollback nếu cần
    const prevCrates = crates;

    // Optimistic Update: Trừ kho ngay lập tức
    setCrates((prev) =>
      prev.map((c) => c.id === crateId ? { ...c, remainingStock: c.remainingStock - 1 } : c)
    );

    try {
      await claimCrateApi(crateId);
      // Mua thành công thì báo xanh
      setSuccessMsg('Mua rương thành công!');
    } catch (error: any) {
      // Lỗi thì rollback lại kho và báo đỏ
      setCrates(prevCrates);
      setErrorMsg(error.message);
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <section aria-label="Danh sách rương">
      <h2>Airdrop Crates</h2>
      
      {/* Vùng thông báo có aria-live để Screen Reader tự động đọc */}
      <div aria-live="polite" style={{ minHeight: '24px', marginBottom: '1rem' }}>
        {errorMsg && <span style={{ color: 'red', fontWeight: 'bold' }}>{errorMsg}</span>}
        {successMsg && <span style={{ color: 'green', fontWeight: 'bold' }}>{successMsg}</span>}
      </div>

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