import { Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import RecipeDetail from './pages/RecipeDetail';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MobileNav from './components/layout/MobileNav';
import ChatWidget from './components/chat/ChatWidget';

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <ChatWidget />
      <MobileNav />
    </>
  )

}

export default App