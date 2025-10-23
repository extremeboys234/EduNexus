import api from "../../../services/api";

export const signup = (data) =>
  api.post("/auth/signup", data, { withCredentials: true });

export const login = (data) =>
  api.post("/auth/login", data, { withCredentials: true });

export const logout = () =>
  api.post("/auth/logout", {}, { withCredentials: true });