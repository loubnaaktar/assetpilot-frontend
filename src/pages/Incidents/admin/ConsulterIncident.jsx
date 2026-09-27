import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIncidentById } from "../../../service/IncidentService.js";
import { getRoleFromToken } from "../../../utils/auth.js";
import ErrorBanner from "../../../components/ErrorBanner/ErrorBanner.jsx";
import "../../../Style/consulter.css";

function ConsulterIncident() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [incident, setIncident] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const pageRetour = getRoleFromToken() === "TECHNICIEN" ? "/suivi-incidents" : "/incidents";

    useEffect(() => {
        getIncidentById(id)
            .then((res) => {
                setIncident(res.data);
            })
            .catch(() => {
                setError("Impossible de charger les détails de l'incident.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const getUrgenceStyle = (urgence) => {
        if (urgence === "ELEVE") return { backgroundColor: "#fee2e2", color: "#dc2626" };
        if (urgence === "MOYEN") return { backgroundColor: "#fef3c7", color: "#d97706" };
        return { backgroundColor: "#dbeafe", color: "#2563eb" };
    };

    const getStatutStyle = (statut) => {
        if (statut === "RESOLU") return { backgroundColor: "#d1fae5", color: "#059669" };
        if (statut === "EN_COURS") return { backgroundColor: "#fef3c7", color: "#d97706" };
        return { backgroundColor: "#fee2e2", color: "#dc2626" };
    };

    if (loading) {
        return (
            <div className="consulter-main-area">
                <p>Chargement des détails...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="consulter-main-area">
                <ErrorBanner type="error" message={error} />
                <button
                    className="consulter-btn-retour"
                    onClick={() => navigate(pageRetour)}
                >
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="consulter-main-area">
            <div className="consulter-card-container">
                <h3 className="consulter-title">Détails de l'Incident</h3>

                <div className="consulter-info-group">
                    <span className="consulter-label">ID :</span>
                    <span className="consulter-value">{incident?.id}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Équipement :</span>
                    <span className="consulter-value">
                        {incident?.equipementNumeroSerie || `Équipement #${incident?.equipementId}`}
                    </span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Déclaré par :</span>
                    <span className="consulter-value">
                        {!incident?.declareParNom
                            ? `Employé #${incident?.declareParId}`
                            : incident?.declareParId
                                ? incident.declareParNom
                                : `${incident.declareParNom} (utilisateur supprimé)`}
                    </span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Technicien :</span>
                    <span className="consulter-value">
                        {!incident?.traiteParNom
                            ? "Non assigné"
                            : incident?.traiteParId
                                ? incident.traiteParNom
                                : `${incident.traiteParNom} (utilisateur supprimé)`}
                    </span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Description :</span>
                    <span className="consulter-value">{incident?.description || "-"}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Niveau d'urgence :</span>
                    <span className="consulter-value">
                        <span className="status-chip" style={getUrgenceStyle(incident?.niveauUrgence)}>
                            {incident?.niveauUrgence}
                        </span>
                    </span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Statut :</span>
                    <span className="consulter-value">
                        <span className="status-chip" style={getStatutStyle(incident?.statut)}>
                            {incident?.statut}
                        </span>
                    </span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Date de déclaration :</span>
                    <span className="consulter-value">
                        {incident?.dateDeclaration ? new Date(incident.dateDeclaration).toLocaleString() : "-"}
                    </span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Date de résolution :</span>
                    <span className="consulter-value">
                        {incident?.dateResolution ? new Date(incident.dateResolution).toLocaleString() : "-"}
                    </span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Rapport d'intervention :</span>
                    <span className="consulter-value">{incident?.rapportIntervention || "-"}</span>
                </div>

                <div className="consulter-actions">
                    <button
                        type="button"
                        className="consulter-btn-retour"
                        onClick={() => navigate(pageRetour)}
                    >
                        Retour
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConsulterIncident;