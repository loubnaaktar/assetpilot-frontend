import { useNavigate } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
            <h1 className="notfound-code">404</h1>
            <h2 className="notfound-title">Page introuvable</h2>
            <p className="notfound-text">
                Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <button
                className="notfound-btn"
                onClick={() => navigate("/")}
            >
                ← Retour à l'accueil
            </button>
        </div>
    );
}

export default NotFound;