import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMesIncidents } from "../../../service/IncidentService.js";
import { FiEdit, FiEye } from "react-icons/fi";
import ErrorBanner from "../../../components/ErrorBanner/ErrorBanner.jsx";
import "../../../Style/Liste.css";

function SuiviIncidents() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getMesIncidents({ size: 100 })
            .then((res) => {
                setIncidents(res.data.content || res.data);
                setError(null);
            })
            .catch(() => {
                setError("Impossible de charger vos incidents.");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="clients-container"><p>Chargement de vos incidents...</p></div>;

    return (
        <div className="clients-container">
            <ErrorBanner type="error" message={error} />
            <div className="clients-header">
                <h2 className="clients-titre">Suivi des incidents</h2>
            </div>

            {incidents.length === 0 ? (
                <p>Aucun incident ne vous est attribué pour le moment.</p>
            ) : (
                <table className="clients-table">
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Équipement</th>
                            <th>Description</th>
                            <th>Employé</th>
                            <th>Date de déclaration</th>
                            <th>Statut</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.map((inc) => (
                            <tr key={inc.id}>
                                <td>#{inc.id}</td>
                                <td>{`${inc.equipementModele || "-"} · ${inc.equipementNumeroSerie || `#${inc.equipementId}`}`}</td>
                                <td>{inc.description}</td>
                                <td>
                                    {!inc.declareParNom
                                        ? `Employé #${inc.declareParId}`
                                        : inc.declareParId
                                            ? inc.declareParNom
                                            : `${inc.declareParNom} (utilisateur supprimé)`}
                                </td>
                                <td>{inc.dateDeclaration ? inc.dateDeclaration.slice(0, 10) : "-"}</td>
                                <td>
                                    <span className={`status-chip ${(inc.statut || "").toLowerCase()}`}>
                                        {inc.statut}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <Link
                                        className="btn-icon-action btn-consulter"
                                        to={`/consulterIncident/${inc.id}`}
                                        title="Consulter"
                                    >
                                        <FiEye />
                                    </Link>
                                    {inc.statut === "RESOLU" ? (
                                        <span style={{ color: "#888" }}>Résolu</span>
                                    ) : (
                                        <Link
                                            className="btn-icon-action btn-modifier"
                                            to={`/modifierIncident/${inc.id}`}
                                            title="Modifier"
                                        >
                                            <FiEdit />
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default SuiviIncidents;