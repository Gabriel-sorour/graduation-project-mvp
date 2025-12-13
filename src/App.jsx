import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import RecipeDetail from './pages/RecipeDetail';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MobileNav from './components/layout/MobileNav';
import ChatWidget from './components/chat/ChatWidget';
import PageTransition from './components/common/PageTransition';

function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      
      {/* Wrap with AnimatePresence */}
      <AnimatePresence mode="wait">
        {/* dd location and key props to Routes */}
        <Routes location={location} key={location.pathname}>
          
          <Route path="/" element={
            <PageTransition>
              <Home />
            </PageTransition>
          } />
          
          <Route path="/explore" element={
            <PageTransition>
              <Explore />
            </PageTransition>
          } />
          
          <Route path="/recipe/:id" element={
            <PageTransition>
              <RecipeDetail />
            </PageTransition>
          } />
          
          <Route path="/dashboard" element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          } />
          
          <Route path="/login" element={
            <PageTransition>
              <Login />
            </PageTransition>
          } />

        </Routes>
      </AnimatePresence>

      <ChatWidget />
      <MobileNav />
    </>
  )
  
}

export default App;