import { useState, useEffect } from "react";
import { getIncidents, exporterIncidentsExcel } from "../../service/IncidentService.js";
import { Link } from "react-router-dom";
import { FiRefreshCw, FiEye, FiUserCheck, FiDownload } from "react-icons/fi";
import AssignerIncidentModal from "./AssignerIncidentModal.jsx";
import "../../Style/Liste.css";

function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [statutFilter, setStatutFilter] = useState("");
    const [urgenceFilter, setUrgenceFilter] = useState("");
    const [nonAssigneeFilter, setNonAssigneeFilter] = useState(false);

    const [selectedIncidentForAssign, setSelectedIncidentForAssign] = useState(null);

    const fetchIncidents = () => {
        setLoading(true);

        const params = {
            page: page,
            size: 5,
        };

        if (statutFilter !== "") {
            params.statut = statutFilter;
        }
        if (urgenceFilter !== "") {
            params.niveauUrgence = urgenceFilter;
        }
        if (nonAssigneeFilter) {
            params.nonAssigne = true;
        }

        getIncidents(params)
            .then((res) => {
                setIncidents(res.data.content || res.data);
                setTotalPages(res.data.totalPages || 1);
                setError(null);
            })
            .catch(() => {
                setError("Erreur lors du chargement des incidents.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchIncidents();
    }, [page, statutFilter, urgenceFilter, nonAssigneeFilter]);

    const handleStatutChange = (e) => {
        setStatutFilter(e.target.value);
        setPage(0);
    };

    const handleUrgenceChange = (e) => {
        setUrgenceFilter(e.target.value);
        setPage(0);
    };

    const handleNonAssigneToggle = () => {
        setNonAssigneeFilter(!nonAssigneeFilter);
        setPage(0);
    };

    const clearFilters = () => {
        setStatutFilter("");
        setUrgenceFilter("");
        setNonAssigneeFilter(false);
        setPage(0);
    };

    const hasActiveFilters = statutFilter !== "" || urgenceFilter !== "" || nonAssigneeFilter;

    const handleExport = async () => {
        try {
            const response = await exporterIncidentsExcel();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = "incidents.xlsx";
            a.click();
        } catch {
            alert("Erreur lors du téléchargement.");
        }
    };

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

    if (loading) return <div className="clients-container"><p>Chargement...</p></div>;
    if (error) return <div className="clients-container"><p style={{ color: "red" }}>{error}</p></div>;

    return (
        <div className="clients-container">
            <div className="clients-header">
                <h2 className="clients-titre">Gestion des Incidents</h2>
                <button className="btn-search" onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <FiDownload /> Export Excel
                </button>
            </div>

            <div className="search-bar">
                <div className="filters-group">
                    {hasActiveFilters && (
                        <button type="button" className="btn-clear" onClick={clearFilters}>
                            <FiRefreshCw />
                        </button>
                    )}

                    <select value={statutFilter} onChange={handleStatutChange} className="filter-select">
                        <option value="">Tous les statuts</option>
                        <option value="OUVERT">OUVERT</option>
                        <option value="EN_COURS">EN_COURS</option>
                        <option value="RESOLU">RESOLU</option>
                    </select>

                    <select value={urgenceFilter} onChange={handleUrgenceChange} className="filter-select">
                        <option value="">Toutes urgences</option>
                        <option value="FAIBLE">FAIBLE</option>
                        <option value="MOYEN">MOYEN</option>
                        <option value="ELEVE">ELEVE</option>
                    </select>

                    <button
                        type="button"
                        className={nonAssigneeFilter ? "filter-toggle active" : "filter-toggle"}
                        onClick={handleNonAssigneToggle}
                        title="Afficher uniquement les incidents non assignés"
                    >
                        Non assigné
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="clients-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Équipement</th>
                        <th>Déclaré par</th>
                        <th>Technicien</th>
                        <th>Urgence</th>
                        <th>Statut</th>
                        <th className="text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {incidents.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>Aucun incident trouvé.</td>
                        </tr>
                    ) : (
                        incidents.map((inc) => (
                            <tr key={inc.id}>
                                <td>{inc.id}</td>
                                <td>{inc.equipementNumeroSerie || inc.equipementId}</td>
                                <td>{inc.declareParNom || inc.declareParId}</td>
                                <td>{inc.traiteParNom || "Non assigné"}</td>
                                <td>
                                        <span className="status-chip" style={getUrgenceStyle(inc.niveauUrgence)}>
                                            {inc.niveauUrgence}
                                        </span>
                                </td>
                                <td>
                                        <span className="status-chip" style={getStatutStyle(inc.statut)}>
                                            {inc.statut}
                                        </span>
                                </td>
                                <td className="actions-cell">
                                    <Link className="btn-icon-action btn-consulter" to={`/consulterIncident/${inc.id}`}>
                                        <FiEye />
                                    </Link>

                                    {inc.statut !== "RESOLU" && (
                                        <button
                                            className="btn-icon-action btn-modifier"
                                            onClick={() => setSelectedIncidentForAssign(inc)}
                                        >
                                            <FiUserCheck />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <div className="pagination-container">
                <button disabled={page === 0} onClick={() => setPage(page - 1)} className="btn-pagination">
                    Précédent
                </button>
                <span>Page {page + 1} sur {totalPages}</span>
                <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} className="btn-pagination">
                    Suivant
                </button>
            </div>

            {selectedIncidentForAssign && (
                <AssignerIncidentModal
                    incident={selectedIncidentForAssign}
                    onClose={() => setSelectedIncidentForAssign(null)}
                    onSuccess={fetchIncidents}
                />
            )}
        </div>
    );
}

export default Incidents;