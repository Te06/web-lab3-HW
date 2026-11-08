export type DropPhase = 'WARMUP' | 'AIRDROP_LIVE' | 'LOOTED_OUT' | 'EXPIRED';

export interface PubgCrateDrop {
  readonly id: string;
  readonly title: string;
  readonly priceVnd: number; // Giá VNĐ
  readonly remainingStock: number;
  readonly dropEpochMs: number; // Mốc thời gian kết thúc
}

export interface PubgVnSquadStanding {
  readonly squadId: string;
  readonly squadName: string;
  readonly wwcdCount: number; // Số lần ăn gà
  readonly placementPts: number;
  readonly killPts: number;
}