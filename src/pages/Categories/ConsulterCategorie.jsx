import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategorieById } from "../../service/CategoryService.js";
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner.jsx";
import "../../Style/consulter.css";

function ConsulterCategorie() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categorie, setCategorie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCategorieById(id)
            .then((res) => {
                setCategorie(res.data);
            })
            .catch(() => {
                setError("Impossible de charger les détails de la catégorie.");
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
                    onClick={() => navigate("/categories")}
                >
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="consulter-main-area">
            <div className="consulter-card-container">
                <h3 className="consulter-title">Détails de la Catégorie</h3>

                <div className="consulter-info-group">
                    <span className="consulter-label">ID :</span>
                    <span className="consulter-value">{categorie?.id}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Nom :</span>
                    <span className="consulter-value">{categorie?.nom}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Description :</span>
                    <span className="consulter-value">
                        {categorie?.description || "Aucune description"}
                    </span>
                </div>

                <div className="consulter-actions">
                    <button
                        type="button"
                        className="consulter-btn-retour"
                        onClick={() => navigate("/categories")}
                    >
                        Retour
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConsulterCategorie;