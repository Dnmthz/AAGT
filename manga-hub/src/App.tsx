import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import SeriesDetail from './pages/SeriesDetail';
import Reader from './pages/Reader';
import Favorites from './pages/Favorites';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
        <Route path="/reader/:chapterId" element={<Reader />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
