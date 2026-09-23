import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getIncidentById, modifierIncident } from "../../../service/IncidentService.js";
import ErrorBanner from "../../../components/ErrorBanner/ErrorBanner.jsx";
import "../../../Style/form.css";

function ModifierIncident() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [statut, setStatut] = useState("EN_COURS");
    const [rapportIntervention, setRapportIntervention] = useState("");
    const [horsService, setHorsService] = useState(false);
    const [alreadyResolu, setAlreadyResolu] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        getIncidentById(id)
            .then((res) => {
                if (res.data.statut === "RESOLU") {
                    setAlreadyResolu(true);
                } else {
                    setStatut(res.data.statut || "EN_COURS");
                    setRapportIntervention(res.data.rapportIntervention || "");
                }
            })
            .catch(() => setError("Impossible de charger l'incident."))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        modifierIncident(id, {
            statut: statut,
            rapportIntervention: rapportIntervention,
            equipementHorsService: horsService,
        })
            .then(() => {
                setSuccess("Incident mis à jour !");
                setTimeout(() => navigate("/suivi-incidents"), 1200);
            })
            .catch(() => setError("Erreur lors de la mise à jour de l'incident."));
    };

    if (loading) return <div className="form-main-area"><p>Chargement...</p></div>;

    if (alreadyResolu) {
        return (
            <div className="form-main-area">
                <main className="form-content-wrapper">
                    <div className="form-card-container">
                        <h3 className="form-form-title">Incident #{id}</h3>
                        <p>Cet incident est déjà résolu et ne peut plus être modifié.</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="form-main-area">
            <main className="form-content-wrapper">
                <div className="form-card-container">
                    <h3 className="form-form-title">Résoudre l'Incident #{id}</h3>

                    <form onSubmit={handleSubmit} className="form-form">
                        <ErrorBanner type="error" message={error} />
                        <ErrorBanner type="success" message={success} />

                        <div className="form-form-group">
                            <label className="form-form-label">Statut :</label>
                            <select
                                className="form-form-input"
                                value={statut}
                                onChange={(e) => setStatut(e.target.value)}
                            >
                                <option value="OUVERT">OUVERT</option>
                                <option value="EN_COURS">EN COURS</option>
                                <option value="RESOLU">RÉSOLU</option>
                            </select>
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Rapport d'intervention :</label>
                            <textarea
                                className="form-form-input"
                                rows="4"
                                value={rapportIntervention}
                                onChange={(e) => setRapportIntervention(e.target.value)}
                                placeholder="Explication de la réparation..."
                                required
                            />
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">
                                <input
                                    type="checkbox"
                                    className="form-form-checkbox"
                                    checked={horsService}
                                    onChange={(e) => setHorsService(e.target.checked)}
                                />
                                Mettre l'équipement hors service
                            </label>
                        </div>

                        <div className="form-form-actions">
                            <button
                                type="button"
                                className="form-btn-annuler"
                                onClick={() => navigate(-1)}
                            >
                                Annuler
                            </button>
                            <button type="submit" className="form-btn-enregistrer">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default ModifierIncident;