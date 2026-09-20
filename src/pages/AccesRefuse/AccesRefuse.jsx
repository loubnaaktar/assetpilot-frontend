import { useNavigate } from "react-router-dom";
import "./AccesRefuse.css";

function AccesRefuse() {
    const navigate = useNavigate();

    return (
        <div className="acces-refuse-container">
            <h1> Accès refusé</h1>

            <p>
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>

            <button
                className="btn-retour"
                onClick={() => navigate(-1)}
            >
                ← Retour
            </button>
        </div>
    );
}

export default AccesRefuse;