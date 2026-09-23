import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { getEmployes, supprimerEmploye } from "../../service/EmployeService.js";
import { getTechniciens, supprimerTechnicien } from "../../service/TechnicienService.js";
import { getUtilisateurs, supprimerUtilisateur } from "../../service/UtilisateurService.js";
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner.jsx";
import "../../Style/Liste.css";

function Utilisateurs() {
    const [type, setType] = useState("EMPLOYE"); 
    const [liste, setListe] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        if (type === "EMPLOYE") {
            getEmployes()
                .then((res) => setListe(res.data.content || res.data))
                .catch(() => setListe([]))
                .finally(() => setLoading(false));
        } else if (type === "TECHNICIEN") {
            getTechniciens()
                .then((res) => setListe(res.data.content || res.data))
                .catch(() => setListe([]))
                .finally(() => setLoading(false));
        } else if (type === "ADMIN") {
            getUtilisateurs()
                .then((res) => {
                    const data = res.data.content || res.data;
                    
                    setListe(data.filter((u) => u.role === "ADMIN"));
                })
                .catch(() => setListe([]))
                .finally(() => setLoading(false));
        }
    }, [type]);

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
            try {
                if (type === "EMPLOYE") await supprimerEmploye(id);
                else if (type === "TECHNICIEN") await supprimerTechnicien(id);
                else await supprimerUtilisateur(id);

                setListe(liste.filter((item) => item.id !== id));
            } catch {
                setError("Erreur lors de la suppression.");
            }
        }
    };

    return (
        <div className="clients-container">
            <ErrorBanner type="error" message={error} />
            <div className="clients-header">
                <h2 className="clients-titre">Gestion des Utilisateurs</h2>
                <Link className="btn-ajouter" to="/ajouterUtilisateur">+ Ajouter un utilisateur</Link>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button
                    className={type === "EMPLOYE" ? "btn-ajouter" : "btn-pagination"}
                    onClick={() => setType("EMPLOYE")}
                >
                    Employés
                </button>
                <button
                    className={type === "TECHNICIEN" ? "btn-ajouter" : "btn-pagination"}
                    onClick={() => setType("TECHNICIEN")}
                >
                    Techniciens
                </button>
                <button
                    className={type === "ADMIN" ? "btn-ajouter" : "btn-pagination"}
                    onClick={() => setType("ADMIN")}
                >
                    Administrateurs
                </button>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <table className="clients-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom & Prénom</th>
                        <th>Email</th>
                        {type === "EMPLOYE" && <th>Matricule</th>}
                        {type === "TECHNICIEN" && <th>Spécialité</th>}
                        <th className="text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {liste.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                                Aucun élément trouvé.
                            </td>
                        </tr>
                    ) : (
                        liste.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.nom} {u.prenom}</td>
                                <td>{u.email}</td>
                                {type === "EMPLOYE" && <td>{u.matricule || "-"}</td>}
                                {type === "TECHNICIEN" && <td>{u.specialite || "-"}</td>}
                                <td className="actions-cell">
                                    <Link className="btn-icon-action btn-consulter" to={`/consulterUtilisateur/${u.id}`}>
                                        <FiEye />
                                    </Link>
                                    <Link className="btn-icon-action btn-modifier" to={`/modifierUtilisateur/${u.id}`}>
                                        <FiEdit />
                                    </Link>
                                    <button className="btn-icon-action btn-supprimer" onClick={() => handleDelete(u.id)}>
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Utilisateurs;