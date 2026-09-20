import { useState, useEffect } from "react";
import { getEquipements, supprimerEquipement } from "../../service/EquipementService.js";
import { getCategories } from "../../service/CategoryService.js";
import { Link } from "react-router-dom";
import { MdQrCode } from "react-icons/md";
import { FiRefreshCw, FiX, FiEdit, FiTrash2 } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";
import "../../Style/Liste.css";

function Equipements() {
    const [equipements, setEquipements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(5);

    const [search, setSearch] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");

    const [statutFilter, setStatutFilter] = useState("");
    const [categorieFilter, setCategorieFilter] = useState("");
    const [categories, setCategories] = useState([]);

    const [sortDir, setSortDir] = useState("asc");
    const [selectedQrEquipement, setSelectedQrEquipement] = useState(null);

    useEffect(() => {
        getCategories({ size: 100 })
            .then((response) => setCategories(response.data.content || response.data))
            .catch(() => setCategories([]));
    }, []);

    const fetchEquipements = () => {
        setLoading(true);

        const params = {
            page: page,
            size: pageSize,
            sort: `modele,${sortDir}`,
        };

        if (appliedSearch.trim() !== "") {
            params.mot = appliedSearch;
        }

        if (statutFilter !== "") {
            params.statut = statutFilter;
        }

        if (categorieFilter !== "") {
            params.categorieId = categorieFilter;
        }

        getEquipements(params)
            .then((response) => {
                setEquipements(response.data.content || response.data);
                setTotalPages(response.data.totalPages || 1);
                setError(null);
            })
            .catch((error) => {
                setError("Erreur lors du chargement des équipements.");
                console.error("Erreur lors du chargement des équipements :", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEquipements();
    }, [page, sortDir, appliedSearch, statutFilter, categorieFilter]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setAppliedSearch(search);
        setPage(0);
    };

    const handleStatutChange = (e) => {
        setStatutFilter(e.target.value);
        setPage(0);
    };

    const handleCategorieChange = (e) => {
        setCategorieFilter(e.target.value);
        setPage(0);
    };

    const clearFilters = () => {
        setSearch("");
        setAppliedSearch("");
        setStatutFilter("");
        setCategorieFilter("");
        setPage(0);
    };

    const hasActiveFilters = appliedSearch !== "" || statutFilter !== "" || categorieFilter !== "";

    const handleSort = () => {
        setSortDir(sortDir === "asc" ? "desc" : "asc");
        setPage(0);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet équipement ?")) {
            try {
                await supprimerEquipement(id);
                fetchEquipements();
            } catch (err) {
                console.error("Erreur lors de la suppression:", err);
                alert("Erreur lors de la suppression de l'équipement.");
            }
        }
    };

    if (loading) {
        return (
            <div className="clients-container">
                <p>Chargement des équipements en cours...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="clients-container">
                <p style={{ color: "red" }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="clients-container">
            <div className="clients-header">
                <h2 className="clients-titre">Inventaire des Actifs</h2>
                <Link className="btn-ajouter" to="/ajouterEquipement">+ Ajouter un actif</Link>
            </div>

            <form className="search-bar" onSubmit={handleSearchSubmit}>
                <div className="search-input-group">
                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="btn-clear"
                            onClick={clearFilters}
                            title="Réinitialiser les filtres"
                        >
                            <FiRefreshCw />
                        </button>
                    )}
                    <input
                        type="text"
                        placeholder="Rechercher par modèle, marque ou n° série..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="btn-search">Chercher</button>
                </div>
                <div className="filters-group">
                    <select value={statutFilter} onChange={handleStatutChange} className="filter-select">
                        <option value="">Tous statuts</option>
                        <option value="EN_STOCK">En stock</option>
                        <option value="AFFECTE">Affecté</option>
                        <option value="EN_PANNE">En panne</option>
                        <option value="EN_REPARATION">En réparation</option>
                        <option value="HORS_SERVICE">Hors service</option>
                    </select>
                    <select value={categorieFilter} onChange={handleCategorieChange} className="filter-select">
                        <option value="">Toutes catégories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nom}</option>
                        ))}
                    </select>
                </div>
            </form>

            <table className="clients-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th onClick={handleSort} style={{ cursor: "pointer" }}>
                        Nom / Modèle {sortDir === "asc" ? "▲" : "▼"}
                    </th>
                    <th>N° Série</th>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th className="text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                {equipements.length === 0 ? (
                    <tr>
                        <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                            Aucun équipement trouvé.
                        </td>
                    </tr>
                ) : (
                    equipements.map((equipement) => (
                        <tr key={equipement.id}>
                            <td>{equipement.id}</td>
                            <td>{equipement.nom || equipement.modele}</td>
                            <td>{equipement.numeroSerie || equipement.code || `-`}</td>
                            <td>{equipement.categorieNom || equipement.categorie?.nom || "N/A"}</td>
                            <td>
                                <span className={`status-chip ${(equipement.statut || "EN_STOCK").toLowerCase()}`}>
                                    {equipement.statut}
                                </span>
                            </td>
                            <td className="actions-cell">
                                <button
                                    className="btn-icon-action btn-consulter"
                                    onClick={() => setSelectedQrEquipement(equipement)}
                                    title="Voir QR Code"
                                >
                                    <MdQrCode />
                                </button>
                                <Link
                                    className="btn-icon-action btn-modifier"
                                    to={`/modifierEquipement/${equipement.id}`}
                                    title="Modifier"
                                >
                                    <FiEdit />
                                </Link>
                                <button
                                    className="btn-icon-action btn-supprimer"
                                    onClick={() => handleDelete(equipement.id)}
                                    title="Supprimer"
                                >
                                    <FiTrash2 />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

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

            {}
            {selectedQrEquipement && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Code QR de l'actif</h3>
                            <button className="close-btn" onClick={() => setSelectedQrEquipement(null)}>
                                <FiX />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="qr-box">
                                <QRCodeSVG
                                    value={JSON.stringify({
                                        id: selectedQrEquipement.id,
                                        numeroSerie: selectedQrEquipement.numeroSerie || selectedQrEquipement.code,
                                        nom: selectedQrEquipement.nom || selectedQrEquipement.modele,
                                    })}
                                    size={180}
                                />
                            </div>
                            <h4>{selectedQrEquipement.nom || selectedQrEquipement.modele}</h4>
                            <p className="qr-serial">
                                {selectedQrEquipement.numeroSerie || selectedQrEquipement.code || `#EQ-${selectedQrEquipement.id}`}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Equipements;