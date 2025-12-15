import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MenuGenerator from './pages/MenuGenerator';
import History from './pages/History';
import Layout from './components/Layout';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Profile from './pages/Profile';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Route */}
        <Route path="/login" element={
          <PageTransition>
            <Login />
          </PageTransition>
        } />

        {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/portions" replace />} />

        <Route
          path="/portions"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
                <Navigation />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu-generator"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <MenuGenerator />
                </PageTransition>
                <Navigation />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <History />
                </PageTransition>
                <Navigation />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Profile />
                </PageTransition>
                <Navigation />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
