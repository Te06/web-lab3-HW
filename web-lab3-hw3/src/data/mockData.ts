import type { PubgCrateDrop, PubgVnSquadStanding } from '../types/pubg';

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

export const INITIAL_SQUADS: PubgVnSquadStanding[] = [
  // Đội này ăn gà ít nhưng Kill cực khủng (Top 1 nếu sort theo Kill)
  { squadId: 'te', squadName: 'The Expendables', wwcdCount: 1, placementPts: 30, killPts: 99 },
  
  // Đội này số trận vào Top cao nhưng Kill hơi yếu
  { squadId: 'ces', squadName: 'Cerberus Esports', wwcdCount: 3, placementPts: 55, killPts: 40 },
  
  // Vua ăn gà (Top 1 nếu sort theo WWCD)
  { squadId: 'ge', squadName: 'Genius Esports', wwcdCount: 5, placementPts: 20, killPts: 30 },
  
  // Chuyên gia sinh tồn (Top 1 nếu sort theo Điểm vị trí)
  { squadId: 'agg', squadName: 'AGG Esports', wwcdCount: 2, placementPts: 65, killPts: 15 },
];