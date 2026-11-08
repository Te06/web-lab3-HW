import type { PubgCrateDrop } from '../types/pubg';

// Thời gian kết thúc: 10 phút kể từ lúc mở trang
const NOW = Date.now();
const TEN_MINS_LATER = NOW + 10 * 60 * 1000;

export const INITIAL_CRATES: PubgCrateDrop[] = [
  {
    id: 'crate-1',
    title: 'PVS Finals VIP Pass',
    priceVnd: 5000000,
    remainingStock: 10,
    dropEpochMs: TEN_MINS_LATER,
  },
  {
    id: 'crate-2',
    title: '5,000 G-Coin Bundle',
    priceVnd: 1500000,
    remainingStock: 3,
    dropEpochMs: TEN_MINS_LATER + 60000, // Trễ hơn 1 phút
  },
];