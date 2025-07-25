import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Explore from './pages/Explore';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard/Dashboard';
import AddHotel from './pages/Dashboard/AddHotel';
import AdminPanel from './pages/Dashboard/AdminPanel';
import HotelDetails from './pages/HotelDetails';
import Profile from './pages/Profile';
import { fetchUserProfile } from './store/slices/authSlice';
import { RootState, AppDispatch } from './store/store';
import ChatBot from './components/AI/ChatBot';

const AppContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Auto-login if token exists
    if (token && !isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [token, isAuthenticated, dispatch]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/add-hotel" element={<AddHotel />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <ChatBot />
    </Layout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </Provider>
  );
}

export default App;