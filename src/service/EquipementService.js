import api from "../api/axios.js";

export const creerEquipement = (data) => api.post("/equipements", data);

export const getEquipements = (params) => api.get("/equipements", { params });

export const getEquipementById = (id) => api.get(`/equipements/${id}`);

export const modifierEquipement = (id, data) => api.put(`/equipements/${id}`, data);

export const getEquipementsByStatut = (statut, params) =>
  api.get(`/equipements/statut/${statut}`, { params });

export const getEquipementsByCategorie = (categorieId, params) =>
  api.get(`/equipements/Categorie/${categorieId}`, { params });

export const supprimerEquipement = (id) => api.delete(`/equipements/${id}`);