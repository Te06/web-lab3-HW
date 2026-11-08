import { useState, useId } from 'react';
import type { PubgVnSquadStanding } from '../types/pubg';

export function Leaderboard({ squads }: { squads: PubgVnSquadStanding[] }) {
  const sortId = useId();
  
  // State lưu tiêu chí sắp xếp
  const [sortBy, setSortBy] = useState<'wwcd' | 'placement' | 'kill'>('wwcd');

  // DERIVED STATE: Sắp xếp trực tiếp khi render
  const sortedSquads = [...squads].toSorted((a, b) => {
    if (sortBy === 'wwcd') return b.wwcdCount - a.wwcdCount;
    if (sortBy === 'placement') return b.placementPts - a.placementPts;
    return b.killPts - a.killPts;
  });

  return (
    <section aria-label="Bảng xếp hạng" style={{ marginTop: '2rem' }}>
      <h2>PUBG VN Leaderboard</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor={sortId} style={{ marginRight: '8px', fontWeight: 'bold' }}>
          Sắp xếp theo:
        </label>
        <select 
          id={sortId} 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as any)}
          style={{ padding: '4px' }}
        >
          <option value="wwcd">Số lần Ăn Gà (WWCD)</option>
          <option value="placement">Điểm Vị Trí</option>
          <option value="kill">Điểm Hạ Gục</option>
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ padding: '8px' }}>Đội Tuyển</th>
            <th style={{ padding: '8px' }}>WWCD</th>
            <th style={{ padding: '8px' }}>Điểm Vị Trí</th>
            <th style={{ padding: '8px' }}>Điểm Kill</th>
          </tr>
        </thead>
        <tbody>
          {sortedSquads.map((squad) => (
            <tr key={squad.squadId} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>{squad.squadName}</td>
              <td style={{ padding: '8px' }}>{squad.wwcdCount}</td>
              <td style={{ padding: '8px' }}>{squad.placementPts}</td>
              <td style={{ padding: '8px' }}>{squad.killPts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}