import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getUtilisateurById, modifierUtilisateur } from "../../service/UtilisateurService.js";
import { getEmployeById, modifierEmploye } from "../../service/EmployeService.js";
import { getTechnicienById, modifierTechnicien } from "../../service/TechnicienService.js";
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner.jsx";
import "../../Style/form.css";

const schema = yup.object({
    nom: yup.string().required("Le nom est obligatoire"),
    prenom: yup.string().required("Le prénom est obligatoire"),
    email: yup.string().email("L'email n'est pas valide").required("L'email est obligatoire"),
});

function ModifierUtilisateur() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [utilisateur, setUtilisateur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    useEffect(() => {
        getUtilisateurById(id)
            .then((res) => {
                const data = res.data;
                let details = { nom: data.nom, prenom: data.prenom, email: data.email };

                if (data.role === "EMPLOYE") {
                    return getEmployeById(id)
                        .then((empRes) => {
                            setUtilisateur({ ...data, ...empRes.data });
                            reset({ ...details, matricule: empRes.data.matricule || "" });
                        })
                        .catch(() => {
                            setUtilisateur(data);
                            reset(details);
                        });
                }
                if (data.role === "TECHNICIEN") {
                    return getTechnicienById(id)
                        .then((techRes) => {
                            setUtilisateur({ ...data, ...techRes.data });
                            reset({ ...details, specialite: techRes.data.specialite || "" });
                        })
                        .catch(() => {
                            setUtilisateur(data);
                            reset(details);
                        });
                }

                setUtilisateur(data);
                reset(details);
            })
            .catch(() => setError("Impossible de charger l'utilisateur."))
            .finally(() => setLoading(false));
    }, [id]);

    const onSubmit = async (data) => {
        setSubmitError(null);
        try {
            if (utilisateur.role === "EMPLOYE") {
                await modifierEmploye(id, {
                    nom: data.nom,
                    prenom: data.prenom,
                    email: data.email,
                    matricule: data.matricule || null,
                });
            } else if (utilisateur.role === "TECHNICIEN") {
                await modifierTechnicien(id, {
                    nom: data.nom,
                    prenom: data.prenom,
                    email: data.email,
                    specialite: data.specialite || null,
                });
            } else {
                await modifierUtilisateur(id, {
                    nom: data.nom,
                    prenom: data.prenom,
                    email: data.email,
                    role: utilisateur.role,
                });
            }
            navigate("/utilisateurs");
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Erreur lors de la modification.");
        }
    };

    if (loading) {
        return (
            <div className="form-main-area">
                <p>Chargement de l'utilisateur...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="form-main-area">
                <ErrorBanner type="error" message={error} />
                <button
                    className="form-btn-annuler"
                    onClick={() => navigate("/utilisateurs")}
                >
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="form-main-area">
            <main className="form-content-wrapper">
                <div className="form-card-container">
                    <h3 className="form-form-title">Modifier l'utilisateur #{id}</h3>

                    <ErrorBanner type="error" message={submitError} />

                    <form onSubmit={handleSubmit(onSubmit)} className="form-form">
                        <div className="form-form-group">
                            <label className="form-form-label">Rôle :</label>
                            <input
                                type="text"
                                className="form-form-input"
                                value={utilisateur?.role || ""}
                                readOnly
                            />
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Nom :</label>
                            <input
                                type="text"
                                placeholder="Entrez le nom"
                                className="form-form-input"
                                {...register("nom")}
                            />
                            {errors.nom && (
                                <span className="form-error-message">{errors.nom.message}</span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Prénom :</label>
                            <input
                                type="text"
                                placeholder="Entrez le prénom"
                                className="form-form-input"
                                {...register("prenom")}
                            />
                            {errors.prenom && (
                                <span className="form-error-message">{errors.prenom.message}</span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Email :</label>
                            <input
                                type="email"
                                placeholder="nom.prenom@exemple.com"
                                className="form-form-input"
                                {...register("email")}
                            />
                            {errors.email && (
                                <span className="form-error-message">{errors.email.message}</span>
                            )}
                        </div>

                        {utilisateur?.role === "EMPLOYE" && (
                            <div className="form-form-group">
                                <label className="form-form-label">Matricule :</label>
                                <input
                                    type="text"
                                    placeholder="Ex. EMP-001"
                                    className="form-form-input"
                                    {...register("matricule")}
                                />
                            </div>
                        )}

                        {utilisateur?.role === "TECHNICIEN" && (
                            <div className="form-form-group">
                                <label className="form-form-label">Spécialité :</label>
                                <input
                                    type="text"
                                    placeholder="Ex. Réseau, Maintenance IT..."
                                    className="form-form-input"
                                    {...register("specialite")}
                                />
                            </div>
                        )}

                        <div className="form-form-actions">
                            <button
                                type="button"
                                className="form-btn-annuler"
                                onClick={() => navigate("/utilisateurs")}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="form-btn-enregistrer"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default ModifierUtilisateur;