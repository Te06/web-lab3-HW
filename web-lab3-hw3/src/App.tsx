import { CrateList } from './components/CrateList';
import { Leaderboard } from './components/Leaderboard';
import { INITIAL_CRATES, INITIAL_SQUADS } from './data/mockData';

function App() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>KRAFTON x PUBG VN Arena</h1>
      <CrateList initialCrates={INITIAL_CRATES} />
      <Leaderboard squads={INITIAL_SQUADS} />
    </main>
  );
}

export default App;