import { usePubgAirdropTimer } from '../hooks/usePubgAirdropTimer';
import type { PubgCrateDrop } from '../types/pubg';
import styles from './CrateList.module.css';

// Component con hiển thị từng cái rương
function CrateItem({ crate }: { crate: PubgCrateDrop }) {
  // Dùng hook chống trôi
  const { remainingMs, isLive } = usePubgAirdropTimer(crate.dropEpochMs);

  // Tính toán phút và giây để hiển thị
  const totalSeconds = Math.floor(remainingMs / 1000);
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');

  // Định dạng giá theo chuẩn VNĐ
  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(crate.priceVnd);

  return (
    <article className={styles.crateCard}>
      <h3 className={styles.title}>{crate.title}</h3>
      <p className={styles.price}>{formattedPrice}</p>
      <p className={styles.stock}>Còn lại: <strong>{crate.remainingStock}</strong></p>
      
      <div>
        Trạng thái: {isLive ? (
          <span style={{ color: 'green', fontWeight: 'bold' }}>Đang mở</span>
        ) : (
          <span className={styles.timer}>Kết thúc sau: {m}:{s}</span>
        )}
      </div>
    </article>
  );
}

export function CrateList({ crates }: { crates: PubgCrateDrop[] }) {
  return (
    <section aria-label="Danh sách rương">
      <h2>Airdrop Crates</h2>
      <div className={styles.crateGrid}>
        {crates.map((crate) => (
          <CrateItem key={crate.id} crate={crate} />
        ))}
      </div>
    </section>
  );
}