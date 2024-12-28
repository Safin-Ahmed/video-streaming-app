"use client";
import { handleSignIn, handleSignOut } from "@/lib/cognitoActions";
import { JWT } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define types for authentication state
interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  token: string | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactElement;
}

// Create context with initial state
const AuthContext = createContext<AuthState | undefined>(undefined);

// AuthProvider component to wrap your application
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated (e.g., check localStorage or cookies)
    const checkAuth = () => {
      // Replace with your actual authentication check (e.g., token validation)
      const auth = localStorage.getItem("auth");
      if (auth) {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function (replace with your actual login logic)
  const login = async (email: string, password: string) => {
    // Replace with your actual login logic
    const formData = {
      email,
      password,
    };
    const result = await handleSignIn(formData);
    localStorage.setItem("auth", "true");
    setIsAuthenticated(true);
    setToken(result?.jwtToken);
  };

  // Logout function
  const logout = async () => {
    // Replace with your actual logout logic
    await handleSignOut();
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
    setToken(undefined);
  };

  const authContextValue = {
    isAuthenticated,
    token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
