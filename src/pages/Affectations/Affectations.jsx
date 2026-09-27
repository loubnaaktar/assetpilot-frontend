import { useState, useEffect } from "react";
import { getAffectations, restituerAffectation } from "../../service/AffectationService.js";
import { Link } from "react-router-dom";
import { FiEye, FiCornerUpLeft } from "react-icons/fi";
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner.jsx";
import "../../Style/Liste.css";

function Affectations() {
    const [affectations, setAffectations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(5);

    const [sortDir, setSortDir] = useState("desc");

    const fetchAffectations = () => {
        setLoading(true);

        const params = {
            page: page,
            size: pageSize,
            sort: `dateDebut,${sortDir}`,
        };

        getAffectations(params)
            .then((response) => {
                setAffectations(response.data.content || response.data);
                setTotalPages(response.data.totalPages || 1);
                setError(null);
            })
            .catch(() => {
                setError("Erreur lors du chargement des affectations.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAffectations();
    }, [page, sortDir]);

    const handleSort = () => {
        setSortDir(sortDir === "asc" ? "desc" : "asc");
        setPage(0);
    };

    const handleRestituer = async (id) => {
        if (window.confirm("Voulez-vous vraiment restituer cet équipement ?")) {
            try {
                await restituerAffectation(id);
                fetchAffectations();
            } catch (err) {
                setError("Erreur lors de la restitution de l'équipement.");
            }
        }
    };

    if (loading) {
        return (
            <div className="clients-container">
                <p>Chargement des affectations en cours...</p>
            </div>
        );
    }

    return (
        <div className="clients-container">
            <ErrorBanner type="error" message={error} />
            <div className="clients-header">
                <h2 className="clients-titre">Gestion des Affectations</h2>
                <Link className="btn-ajouter" to="/ajouterAffectation">+ Nouvelle Affectation</Link>
            </div>

            <div className="table-responsive">
                <table className="clients-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Équipement</th>
                        <th>Employé</th>
                        <th onClick={handleSort} style={{ cursor: "pointer" }}>
                            Date Début {sortDir === "asc" ? "▲" : "▼"}
                        </th>
                        <th>Date Fin</th>
                        <th>Statut</th>
                        <th className="text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {affectations.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                Aucune affectation trouvée.
                            </td>
                        </tr>
                    ) : (
                        affectations.map((aff) => (
                            <tr key={aff.id}>
                                <td>{aff.id}</td>
                                <td>{aff.equipementNom || aff.equipement?.modele || `Équipement #${aff.equipementId || aff.equipement?.id}`}</td>
                                <td>
                                    {!aff.employeNom
                                        ? `Employé #${aff.employeId}`
                                        : aff.employeId
                                            ? aff.employeNom
                                            : `${aff.employeNom} (utilisateur supprimé)`}
                                </td>
                                <td>{aff.dateDebut ? new Date(aff.dateDebut).toLocaleDateString() : "-"}</td>
                                <td>{aff.dateFin ? new Date(aff.dateFin).toLocaleDateString() : "En cours"}</td>
                                <td>
                                    <span className={`status-chip ${aff.dateFin ? "en_stock" : "actif"}`}>
                                        {aff.dateFin ? "RESTITUÉ" : "EN COURS"}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <Link className="btn-icon-action btn-consulter" to={`/consulterAffectation/${aff.id}`} title="Consulter">
                                        <FiEye />
                                    </Link>
                                    {!aff.dateFin && (
                                        <button
                                            className="btn-icon-action btn-supprimer"
                                            onClick={() => handleRestituer(aff.id)}
                                            title="Restituer l'équipement"
                                        >
                                            <FiCornerUpLeft />
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
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="btn-pagination"
                >
                    Précédent
                </button>
                <span>Page {page + 1} sur {totalPages === 0 ? 1 : totalPages}</span>
                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="btn-pagination"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}

export default Affectations;