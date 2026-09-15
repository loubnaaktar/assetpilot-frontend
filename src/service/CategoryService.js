import api from "../api/axios.js";

export const creerCategorie = (data) => api.post("/categories", data);

export const getCategories = (params) => api.get("/categories", { params });

export const getCategorieById = (id) => api.get(`/categories/${id}`);

export const modifierCategorie = (id, data) => api.put(`/categories/${id}`, data);

export const supprimerCategorie = (id) => api.delete(`/categories/${id}`);