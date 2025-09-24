import { useState, useEffect } from "react";
import authService from "../services/authService";
import { AuthContext } from "../helpers.js";

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du token:", error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setIsAuthenticated(true);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email) => {
    return await authService.forgotPassword(email);
  };
  console.log(isAuthenticated);
  const value = {
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
