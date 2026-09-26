import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { getEquipementById } from "../../../service/EquipementService.js";
import { getIncidentsByEquipement } from "../../../service/IncidentService.js";
import ErrorBanner from "../../../components/ErrorBanner/ErrorBanner.jsx";
import "../../../Style/consulter.css";
import "./ConsulterEquipement.css";

function ConsulterEquipement() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [equipement, setEquipement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [incidents, setIncidents] = useState([]);
    const [incidentsErreur, setIncidentsErreur] = useState(null);

    const [qrOuvert, setQrOuvert] = useState(false);

    useEffect(() => {
        getEquipementById(id)
            .then((res) => {
                setEquipement(res.data);
            })
            .catch(() => {
                setError("Impossible de charger les détails de l'équipement.");
            })
            .finally(() => {
                setLoading(false);
            });

        getIncidentsByEquipement(id, { page: 0, size: 50 })
            .then((res) => {
                setIncidents(res.data.content);
            })
            .catch(() => {
                setIncidentsErreur("Impossible de charger les incidents.");
            });
    }, [id]);

    const contenuQr = JSON.stringify({
        id: equipement?.id,
        numeroSerie: equipement?.numeroSerie,
        modele: equipement?.modele,
        marque: equipement?.marque,
        categorie: equipement?.categorieNom,
        dateAchat: equipement?.dateAchat
    });

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
                    onClick={() => navigate("/equipements")}
                >
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="consulter-main-area">
            <div className="consulter-card-container">

                <h3 className="consulter-title">Détails de l'Équipement</h3>

                <h4 className="consulter-soustitre">Informations</h4>

                <div className="consulter-info-group">
                    <span className="consulter-label">ID :</span>
                    <span className="consulter-value">{equipement?.id}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Numéro de série :</span>
                    <span className="consulter-value">{equipement?.numeroSerie || "-"}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Modèle :</span>
                    <span className="consulter-value">{equipement?.modele}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Marque :</span>
                    <span className="consulter-value">{equipement?.marque || "-"}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Catégorie :</span>
                    <span className="consulter-value">{equipement?.categorieNom || "-"}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Statut :</span>
                    <span className="consulter-value">{equipement?.statut}</span>
                </div>

                <div className="consulter-info-group">
                    <span className="consulter-label">Date d'achat :</span>
                    <span className="consulter-value">{equipement?.dateAchat || "-"}</span>
                </div>

                <h4 className="consulter-soustitre">
                    Incidents de cet équipement ({incidents.length})
                </h4>

                {incidentsErreur && (
                    <ErrorBanner type="error" message={incidentsErreur} />
                )}

                {!incidentsErreur && incidents.length === 0 && (
                    <p className="consulter-vide">Aucun incident enregistré.</p>
                )}

                {!incidentsErreur && incidents.length > 0 && (
                    <table className="consulter-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Description</th>
                                <th>Statut</th>
                                <th>Urgence</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidents.map((incident) => (
                                <tr key={incident.id}>
                                    <td>{incident.id}</td>
                                    <td>{incident.description}</td>
                                    <td>{incident.statut}</td>
                                    <td>{incident.niveauUrgence}</td>
                                    <td>{incident.dateDeclaration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <p className="consulter-astuce">
                    Cliquez sur l'icône QR pour voir le code en grand.
                </p>

                <div
                    className="consulter-qr-icone"
                    onClick={() => setQrOuvert(true)}
                >
                    <QRCodeSVG value={contenuQr} size={70} />
                </div>

                {qrOuvert && (
                    <div className="modal-overlay">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h3>Code QR de l'équipement</h3>
                                <button
                                    className="close-btn"
                                    onClick={() => setQrOuvert(false)}
                                >
                                    X
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="consulter-qr-box">
                                    <QRCodeSVG value={contenuQr} size={260} />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="consulter-btn-pdf"
                                    onClick={() => window.print()}
                                >
                                    Télécharger en PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="consulter-actions">
                    <button
                        type="button"
                        className="consulter-btn-retour"
                        onClick={() => navigate("/equipements")}
                    >
                        Retour
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConsulterEquipement;
