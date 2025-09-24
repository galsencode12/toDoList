import { useContext, createContext } from "react";
export const BASE_URL = "http://127.0.0.1:8000/api"; // Je met ca ici pour qu'on puisse y acceder depuis partout
export const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};

// Obtenir le token CSRF depuis le backend
export async function getCSRFToken() {
  const response = await fetch(`${BASE_URL}/csrf/`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const token = await response.json();
  return token.csrfToken;
}
