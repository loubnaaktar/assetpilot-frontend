import api from "../api/axios.js";

export const login = (data) => api.post("/auth/login", data);