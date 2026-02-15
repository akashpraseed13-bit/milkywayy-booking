"use client";

import { createContext, useContext, useState } from "react";
import { logout as logoutAction } from "@/lib/actions/auth";
import DashboardLoginModal from "@/components/DashboardLoginModal";

const AuthContext = createContext(null);

export function AuthProvider({ children, initialUser }) {
  const [authState, setAuthState] = useState({
    user: initialUser || null,
    isLoading: false,
    isAuthenticated: !!initialUser,
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const login = () => {
    setIsLoginModalOpen(true);
  };

  const logout = async () => {
    await logoutAction();
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const handleLoginSuccess = (userData) => {
    setAuthState({
      user: userData,
      isLoading: false,
      isAuthenticated: true,
    });
    setIsLoginModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}

      {/* ✅ LOGIN MODAL MOUNTED ONCE */}
      <DashboardLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
