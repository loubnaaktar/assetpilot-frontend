import api from "../api/axios.js";

export const declarerIncident = (employeId, data) =>
  api.post(`/incidents/declarer/${employeId}`, data);

export const assignerIncident = (incidentId, technicienId) =>
  api.put(`/incidents/${incidentId}/assigner/${technicienId}`);

export const modifierIncident = (incidentId, data) =>
  api.put(`/incidents/${incidentId}`, data);

export const getIncidents = (params) => api.get("/incidents", { params });

export const getIncidentsByEmploye = (employeId, params) =>
  api.get(`/incidents/employe/${employeId}`, { params });

export const getIncidentsByTechnicien = (technicienId, params) =>
  api.get(`/incidents/technicien/${technicienId}`, { params });

export const getIncidentById = (id) => api.get(`/incidents/${id}`);

export const exporterIncidentsExcel = () =>
  api.get("/incidents/excel", { responseType: "blob" });