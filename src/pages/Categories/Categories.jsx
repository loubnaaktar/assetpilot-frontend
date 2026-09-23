import { useState, useEffect } from "react";
import { getCategories, supprimerCategorie } from "../../service/CategoryService.js";
import { Link } from "react-router-dom";
import { FiRefreshCw, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner.jsx";
import "../../Style/Liste.css";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(5);

    const [search, setSearch] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [sortDir, setSortDir] = useState("asc");

    const fetchCategories = () => {
        setLoading(true);

        const params = {
            page: page,
            size: pageSize,
            sort: `nom,${sortDir}`,
        };

        if (appliedSearch.trim() !== "") {
            params.mot = appliedSearch;
        }

        getCategories(params)
            .then((response) => {
                setCategories(response.data.content || response.data);
                setTotalPages(response.data.totalPages || 1);
                setError(null);
            })
            .catch((error) => {
                setError("Erreur lors du chargement des catégories.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCategories();
    }, [page, sortDir, appliedSearch]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setAppliedSearch(search);
        setPage(0);
    };

    const clearFilters = () => {
        setSearch("");
        setAppliedSearch("");
        setPage(0);
    };

    const handleSort = () => {
        setSortDir(sortDir === "asc" ? "desc" : "asc");
        setPage(0);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
            try {
                await supprimerCategorie(id);
                fetchCategories();
            } catch (err) {
                setError("Erreur lors de la suppression de la catégorie.");
            }
        }
    };

    if (loading) {
        return (
            <div className="clients-container">
                <p>Chargement des catégories en cours...</p>
            </div>
        );
    }

    return (
        <div className="clients-container">
            <ErrorBanner type="error" message={error} />
            <div className="clients-header">
                <h2 className="clients-titre">Gestion des Catégories</h2>
                <Link className="btn-ajouter" to="/ajouterCategorie">+ Ajouter une catégorie</Link>
            </div>

            <form className="search-bar" onSubmit={handleSearchSubmit}>
                <div className="search-input-group">
                    {appliedSearch !== "" && (
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
                        placeholder="Rechercher par nom..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="btn-search">Chercher</button>
                </div>
            </form>

            <table className="clients-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th onClick={handleSort} style={{ cursor: "pointer" }}>
                        Nom {sortDir === "asc" ? "▲" : "▼"}
                    </th>
                    <th>Description</th>
                    <th className="text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                {categories.length === 0 ? (
                    <tr>
                        <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                            Aucune catégorie trouvée.
                        </td>
                    </tr>
                ) : (
                    categories.map((cat) => (
                        <tr key={cat.id}>
                            <td>{cat.id}</td>
                            <td>{cat.nom}</td>
                            <td>{cat.description || "-"}</td>
                            <td className="actions-cell">
                                <Link className="btn-icon-action btn-consulter" to={`/consulterCategorie/${cat.id}`} title="Consulter">
                                    <FiEye />
                                </Link>
                                <Link className="btn-icon-action btn-modifier" to={`/modifierCategorie/${cat.id}`} title="Modifier">
                                    <FiEdit />
                                </Link>
                                <button
                                    className="btn-icon-action btn-supprimer"
                                    onClick={() => handleDelete(cat.id)}
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
        </div>
    );
}

export default Categories;