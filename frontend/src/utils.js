export const BASE_URL = "https://proyekakhirbe27-173-589948883802.us-central1.run.app/api";  

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
