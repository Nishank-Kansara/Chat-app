import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../Store/useAuthStore';
import { MessageSquare, Settings, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-[3.3rem]">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Home Link */}
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">JChats</h1>
          </Link>

          {/* Right Side (Settings, Profile, Logout) */}
          <div className="flex items-center gap-2">
            {/* Settings */}
            <Link
              to="/settings"
              className="btn btn-sm gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser ? (
              <>
                {/* Profile */}
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User size={20} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* Logout */}
                <button
                  className="btn btn-sm gap-2 bg-error/10 hover:bg-error/20 text-error"
                  onClick={logout}
                >
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
