import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AnimeDetail from './pages/AnimeDetail'
import WatchPage from './pages/WatchPage'  // ← new

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/watch/:id" element={<WatchPage />} />  {/* ← new */}
      </Routes>
    </BrowserRouter>
  )
}

export default App