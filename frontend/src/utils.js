export const BASE_URL = "http://localhost:3000/api";  

export const getToken = () => localStorage.getItem("token");
export const getUserRole = () => localStorage.getItem("role");

export const setAuth = (token, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

export const isAdmin = () => getUserRole() === "admin";
export const isUser = () => getUserRole() === "user";
