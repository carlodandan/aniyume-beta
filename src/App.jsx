import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AnimeDetail from './pages/AnimeDetail';
import Watch from './pages/Watch';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime/:slug" element={<AnimeDetail />} />
        <Route path="/watch/:slug/:ep" element={<Watch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;