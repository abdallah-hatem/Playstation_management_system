import { createContext } from "react";
import {
  GetFromLocalStorage,
  RemoveFromLocalStorage,
  StoreToLocalStorage,
} from "../Services/localStorageService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  function login(token) {
    StoreToLocalStorage(
      "user",
      token,
      new Date().setDate(new Date().getDate() + 1)
    );
  }

  function logout() {
    RemoveFromLocalStorage("user");
    RemoveFromLocalStorage("devices");
    RemoveFromLocalStorage("hourRate");
  }

  function isLoggedIn() {
    return GetFromLocalStorage("user");
  }

  function getUserId() {
    return GetFromLocalStorage("user");
  }

  return (
    <AuthContext.Provider value={{ login, logout, isLoggedIn, getUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
