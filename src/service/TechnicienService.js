import api from "../api/axios.js";

export const creerTechnicien = (data) => api.post("/techniciens", data);

export const getTechniciens = (params) => api.get("/techniciens", { params });

export const getTechnicienById = (id) => api.get(`/techniciens/${id}`);

export const modifierTechnicien = (id, data) => api.put(`/techniciens/${id}`, data);

export const supprimerTechnicien = (id) => api.delete(`/techniciens/${id}`);