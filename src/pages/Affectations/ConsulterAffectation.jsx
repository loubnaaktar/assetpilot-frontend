import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAffectationById } from "../../service/AffectationService.js";
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner.jsx";
import "../../Style/consulter.css";

function ConsulterAffectation() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [affectation, setAffectation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAffectationById(id)
            .then((res) => {
                setAffectation(res.data);
            })
            .catch(() => {
                setError("Impossible de charger les détails de l'affectation.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

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
                    onClick={() => navigate("/affectations")}
                >
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="consulter-main-area">
            <div className="consulter-card-container">
                <h3 className="consulter-title">Détails de l'Affectation</h3>

                <div className="consulter-info-group">
                    <span className="consulter-label">ID :</span>
                    <span className="consulter-value">{affectation?.id}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Équipement :</span>
                    <span className="consulter-value">
                        {affectation?.equipementNom || affectation?.equipement?.modele || `#${affectation?.equipementId}`}
                    </span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Employé :</span>
                    <span className="consulter-value">
                        {affectation?.employeNom || affectation?.employe?.nom || `#${affectation?.employeId}`}
                    </span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Date de début :</span>
                    <span className="consulter-value">
                        {affectation?.dateDebut ? new Date(affectation.dateDebut).toLocaleDateString() : "-"}
                    </span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Date de fin :</span>
                    <span className="consulter-value">
                        {affectation?.dateFin ? new Date(affectation.dateFin).toLocaleDateString() : "En cours"}
                    </span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Statut :</span>
                    <span className="consulter-value">
                        {affectation?.dateFin ? "RESTITUÉ" : "EN COURS"}
                    </span>
                </div>

                <div className="consulter-actions">
                    <button
                        type="button"
                        className="consulter-btn-retour"
                        onClick={() => navigate("/affectations")}
                    >
                        Retour
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConsulterAffectation;