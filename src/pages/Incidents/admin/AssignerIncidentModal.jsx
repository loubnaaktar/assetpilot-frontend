import { useState, useEffect } from "react";
import { assignerIncident } from "../../../service/IncidentService.js";
import { getSpecialites, getTechniciensParSpecialite } from "../../../service/TechnicienService.js";
import { FiX, FiUserCheck } from "react-icons/fi";
import ErrorBanner from "../../../components/ErrorBanner/ErrorBanner.jsx";

function AssignerIncidentModal({ incident, onClose, onSuccess }) {
    const [specialites, setSpecialites] = useState([]);
    const [selectedSpecialite, setSelectedSpecialite] = useState("");
    const [techniciens, setTechniciens] = useState([]);
    const [selectedTechnicien, setSelectedTechnicien] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getSpecialites()
            .then((res) => setSpecialites(res.data))
            .catch(() => setSpecialites([]));
    }, []);

    const handleSpecialiteChange = (e) => {
        const specialite = e.target.value;
        setSelectedSpecialite(specialite);
        setSelectedTechnicien("");
        setTechniciens([]);

        if (specialite === "") return;

        getTechniciensParSpecialite(specialite)
            .then((res) => {
                const liste = [...res.data].sort((a, b) => a.incidentsNonResolus - b.incidentsNonResolus);
                setTechniciens(liste);
                if (liste.length > 0) setSelectedTechnicien(String(liste[0].id));
            })
            .catch(() => setTechniciens([]));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTechnicien) {
            setError("Veuillez sélectionner un technicien.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await assignerIncident(incident.id, Number(selectedTechnicien));
            onSuccess();
            onClose();
        } catch (err) {
            setError("Impossible d'assigner cet incident.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: "440px" }}>
                <div className="modal-header">
                    <h3>Assigner l'incident #{incident?.id}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body" style={{ textAlign: "left", alignItems: "stretch" }}>
                    <ErrorBanner type="error" message={error} />

                    <div className="form-form-group" style={{ marginBottom: "16px" }}>
                        <label className="form-form-label">Spécialité :</label>
                        <select
                            className="form-form-input"
                            value={selectedSpecialite}
                            onChange={handleSpecialiteChange}
                        >
                            <option value="">Choisir une spécialité</option>
                            {specialites.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedSpecialite !== "" && (
                        <div className="form-form-group" style={{ marginBottom: "16px" }}>
                            <label className="form-form-label">Technicien{techniciens.length > 1 ? "s" : ""} disponible{techniciens.length > 1 ? "s" : ""} :</label>

                            {techniciens.length === 0 ? (
                                <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                                    Aucun technicien pour cette spécialité.
                                </p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {techniciens.map((tech) => (
                                        <label
                                            key={tech.id}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                padding: "8px 10px",
                                                border: "1px solid #e2e8f0",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                background: String(tech.id) === selectedTechnicien ? "#f1f5f9" : "#ffffff",
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="technicien"
                                                value={tech.id}
                                                checked={String(tech.id) === selectedTechnicien}
                                                onChange={() => setSelectedTechnicien(String(tech.id))}
                                            />
                                            <span style={{ fontSize: "0.9rem" }}>
                                                {tech.prenom} {tech.nom}
                                                <span
                                                    style={{
                                                        display: "block",
                                                        fontSize: "0.8rem",
                                                        color: tech.incidentsNonResolus === 0 ? "#059669" : "#b45309",
                                                    }}
                                                >
                                                    {tech.incidentsNonResolus === 0
                                                        ? "Aucun incident en cours"
                                                        : `${tech.incidentsNonResolus} incident(s) non résolu(s)`}
                                                </span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="form-form-actions" style={{ marginTop: "12px" }}>
                        <button type="button" className="form-btn-annuler" onClick={onClose}>
                            Annuler
                        </button>
                        <button type="submit" className="form-btn-enregistrer" disabled={loading}>
                            <FiUserCheck style={{ marginRight: "6px" }} />
                            {loading ? "Assignation..." : "Confirmer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AssignerIncidentModal;