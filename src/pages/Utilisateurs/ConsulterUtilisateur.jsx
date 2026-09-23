import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUtilisateurById } from "../../service/UtilisateurService.js";
import { getEmployeById } from "../../service/EmployeService.js";
import { getTechnicienById } from "../../service/TechnicienService.js";
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner.jsx";
import "../../Style/consulter.css";

function ConsulterUtilisateur() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [utilisateur, setUtilisateur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        getUtilisateurById(id)
            .then((res) => {
                const data = res.data;

                
                if (data.role === "EMPLOYE") {
                    getEmployeById(id)
                        .then((empRes) => setUtilisateur({ ...data, ...empRes.data }))
                        .catch(() => setUtilisateur(data));
                }
                
                else if (data.role === "TECHNICIEN") {
                    getTechnicienById(id)
                        .then((techRes) => setUtilisateur({ ...data, ...techRes.data }))
                        .catch(() => setUtilisateur(data));
                }
                else {
                    setUtilisateur(data);
                }
            })
            .catch((err) => {
                setError("Impossible de charger les détails de l'utilisateur.");
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
                    onClick={() => navigate("/utilisateurs")}
                >
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="consulter-main-area">
            <div className="consulter-card-container">
                <h3 className="consulter-title">Détails de l'Utilisateur</h3>

                <div className="consulter-info-group">
                    <span className="consulter-label">ID :</span>
                    <span className="consulter-value">{utilisateur?.id}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Nom :</span>
                    <span className="consulter-value">{utilisateur?.nom}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Prénom :</span>
                    <span className="consulter-value">{utilisateur?.prenom}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Email :</span>
                    <span className="consulter-value">{utilisateur?.email}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Rôle :</span>
                    <span className="consulter-value">{utilisateur?.role}</span>
                </div>

                {utilisateur?.role === "EMPLOYE" && (
                    <div className="consulter-info-group">
                        <span className="consulter-label">Matricule :</span>
                        <span className="consulter-value">
                            {utilisateur?.matricule || "Non renseigné"}
                        </span>
                    </div>
                )}

                {utilisateur?.role === "TECHNICIEN" && (
                    <div className="consulter-info-group">
                        <span className="consulter-label">Spécialité :</span>
                        <span className="consulter-value">
                            {utilisateur?.specialite || "Non renseignée"}
                        </span>
                    </div>
                )}

                <div className="consulter-actions">
                    <button
                        type="button"
                        className="consulter-btn-retour"
                        onClick={() => navigate("/utilisateurs")}
                    >
                        Retour
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConsulterUtilisateur;