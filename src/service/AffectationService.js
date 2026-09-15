import api from "../api/axios.js";

export const creerAffectation = (data) => api.post("/affectations", data);

export const restituerAffectation = (id) => api.put(`/affectations/${id}/restituer`);

export const getAffectations = (params) => api.get("/affectations", { params });

export const getAffectationById = (id) => api.get(`/affectations/${id}`);