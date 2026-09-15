import api from "../api/axios.js";

export const creerUtilisateur = (data) => api.post("/utilisateurs", data);

export const getUtilisateurs = (params) => api.get("/utilisateurs", { params });

export const getUtilisateurById = (id) => api.get(`/utilisateurs/${id}`);

export const getUtilisateurByEmail = (email) => api.get(`/utilisateurs/email/${email}`);

export const modifierUtilisateur = (id, data) => api.put(`/utilisateurs/${id}`, data);

export const supprimerUtilisateur = (id) => api.delete(`/utilisateurs/${id}`);