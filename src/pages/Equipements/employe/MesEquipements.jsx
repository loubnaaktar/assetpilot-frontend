import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMonProfil } from "../../../service/UtilisateurService.js";
import { getEquipementsEmploye } from "../../../service/EquipementService.js";
import ErrorBanner from "../../../components/ErrorBanner/ErrorBanner.jsx";
import "../../../Style/Liste.css";

function MesEquipements() {
    const [equipements, setEquipements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getMonProfil()
            .then((profilRes) => {
                return getEquipementsEmploye(profilRes.data.id, { size: 100 });
            })
            .then((res) => {
                setEquipements(res.data.content || res.data);
                setError(null);
            })
            .catch(() => {
                setError("Impossible de charger vos équipements.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="clients-container"><p>Chargement de vos équipements...</p></div>;

    return (
        <div className="clients-container">
            <ErrorBanner type="error" message={error} />
            <div className="clients-header">
                <h2 className="clients-titre">Mes équipements</h2>
                <Link className="btn-ajouter" to="/declarerIncident">Déclarer un incident</Link>
            </div>

            {equipements.length === 0 ? (
                <p>Aucun équipement affecté pour le moment.</p>
            ) : (
                <table className="clients-table">
                    <thead>
                        <tr>
                            <th>N° Série</th>
                            <th>Marque</th>
                            <th>Modèle</th>
                            <th>Catégorie</th>
                            <th>Date d'affectation</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipements.map((eq) => (
                            <tr key={eq.id}>
                                <td>{eq.numeroSerie || "-"}</td>
                                <td>{eq.marque || "-"}</td>
                                <td>{eq.modele || "-"}</td>
                                <td>{eq.categorieNom || "-"}</td>
                                <td>{eq.dateAffectation || "-"}</td>
                                <td>
                                    <span className={`status-chip ${(eq.statut || "AFFECTE").toLowerCase()}`}>
                                        {eq.statut || "AFFECTE"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MesEquipements;