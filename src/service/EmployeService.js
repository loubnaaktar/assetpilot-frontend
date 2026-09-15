import api from "../api/axios.js";

export const creerEmploye = (data) => api.post("/employes", data);

export const getEmployes = (params) => api.get("/employes", { params });

export const getEmployeById = (id) => api.get(`/employes/${id}`);

export const modifierEmploye = (id, data) => api.put(`/employes/${id}`, data);

export const supprimerEmploye = (id) => api.delete(`/employes/${id}`);