import api from "../api/axios.js";

export const getQrCodeEquipement = (id) =>
  api.get(`/equipements/${id}/qr-code`, { responseType: "blob" });