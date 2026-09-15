import api from "../api/axios.js";

export const getStatistiques = () => api.get("/statistiques");