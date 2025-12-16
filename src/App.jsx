import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import RecipeDetail from './pages/RecipeDetail';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MobileNav from './components/layout/MobileNav';
import ChatWidget from './components/chat/ChatWidget';
import PageTransition from './components/common/PageTransition';
import Profile from './pages/auth/Profile';

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

          <Route path="/register" element={
            <PageTransition>
              <Register />
            </PageTransition>
          } />

          <Route path="/profile" element={
            <PageTransition>
              <Profile />
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