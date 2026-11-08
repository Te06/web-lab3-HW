import { CrateList } from './components/CrateList';
import { INITIAL_CRATES } from './data/mockData';

function App() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>KRAFTON x PUBG VN Arena</h1>
      <CrateList crates={INITIAL_CRATES} />
    </main>
  );
}

export default App;