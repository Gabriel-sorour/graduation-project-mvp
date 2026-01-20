import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout & Components
import Navbar from './components/layout/Navbar';
import MobileNav from './components/layout/MobileNav';
import Footer from './components/layout/Footer';
import ChatWidget from './components/chat/ChatWidget';
import PageTransition from './components/common/PageTransition';

// Public & User Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import RecipeDetail from './pages/RecipeDetail';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import ProtectedRoute from './pages/auth/ProtectedRoute';
import NotFound from './pages/NotFound';
import CookWithPantry from './pages/CookWithPantry';
import ChatPage from './pages/ChatPage';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import DashboardHome from './admin/DashboardHome';
import IngredientsPage from './admin/IngredientsPage';
import UsersPage from './admin/UsersPage';
import RecipesPage from './admin/RecipesPage';
import AddRecipePage from './admin/AddRecipePage';
import EditRecipePage from './admin/EditRecipePage';
import AdminProfilePage from './admin/AdminProfilePage';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const showChatWidget = !['/chat'].includes(location.pathname) && !isAdminRoute;

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* --- Public Routes --- */}
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
            <ProtectedRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </ProtectedRoute>
          } />

          <Route path="/cook-now" element={
            <ProtectedRoute>
              <PageTransition>
                <CookWithPantry />
              </PageTransition>
            </ProtectedRoute>

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
            <ProtectedRoute>
              <PageTransition>
                <Profile />
              </PageTransition>
            </ProtectedRoute>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <PageTransition>
                <ChatPage />
              </PageTransition>
            </ProtectedRoute>
          } />

          {/* --- Auth Routes --- */}
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

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="recipes" element={<RecipesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="ingredients" element={<IngredientsPage />} />
            <Route path="recipes/create" element={<AddRecipePage />} />
            <Route path="/admin/recipes/edit/:id" element={<EditRecipePage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>

          {/* --- 404 --- */}
          <Route path="*" element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          } />

        </Routes>
      </AnimatePresence>
      {location.pathname === '/' && !isAdminRoute && <Footer />}
      {showChatWidget && <ChatWidget />}
      {!isAdminRoute && <MobileNav />}
    </>
  );
}

export default App;