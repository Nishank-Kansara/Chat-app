import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./Store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./Store/useThemeStore.js";
import Navbar from "./components/Navbar.jsx";
import AddFriendModal from "./components/AddFriendModal.jsx";
import FriendRequestsModal from "./components/FriendRequestsModal.jsx"; // Import Friend Requests Modal
import AddFriendsPage from "./pages/AddFriendsPage.jsx";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation(); // Get the current route

  useEffect(() => {
    checkAuth();
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("data-theme", theme || "light");
    document.body.className = theme || "light";
  }, [checkAuth, theme]);

  // Loader for auth checking
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`w-screen min-h-screen ${theme}`}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/add-friends" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/add-friends"
          element={authUser ? <AddFriendsPage /> : <Navigate to="/signup" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-friends-modal"
          element={
            authUser ? (
              <AddFriendModal isOpen={true} closeModal={() => window.history.back()} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/friend-requests"
          element={
            authUser ? (
              <FriendRequestsModal isOpen={true} closeModal={() => window.history.back()} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
};

export default App;
