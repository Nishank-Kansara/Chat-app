import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import SignupPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './Store/useAuthStore';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './Store/useThemeStore.js';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();

    // Apply theme to the `html` tag dynamically
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', theme || 'light'); // Default to 'light'

    // Ensure the body element also reflects the theme
    document.body.className = theme || 'light';
  }, [checkAuth, theme]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  console.log(onlineUsers);

  return (
    <div className={`w-screen min-h-screen ${theme}`}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
