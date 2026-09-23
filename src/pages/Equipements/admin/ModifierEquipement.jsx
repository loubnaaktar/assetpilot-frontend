import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getEquipementById, modifierEquipement } from "../../../service/EquipementService.js";
import { getCategories } from "../../../service/CategoryService.js";
import ErrorBanner from "../../../components/ErrorBanner/ErrorBanner.jsx";
import "../../../Style/form.css";

const schema = yup.object({
    numeroSerie: yup.string().required("Le numéro de série est obligatoire"),
    modele: yup.string().required("Le modèle est obligatoire"),
    marque: yup.string().required("La marque est obligatoire"),
    dateAchat: yup.string().nullable(),
    categorieId: yup.string().required("La catégorie est obligatoire"),
    statut: yup.string().required("Le statut est obligatoire"),
});

function ModifierEquipement() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [categories, setCategories] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        getCategories({ size: 100 })
            .then((response) => setCategories(response.data.content || response.data))
            .catch(() => setCategories([]));
    }, []);

    const chargerEquipement = () => {
        getEquipementById(id)
            .then((res) => {
                const data = res.data;
                reset({
                    numeroSerie: data.numeroSerie || "",
                    modele: data.modele || "",
                    marque: data.marque || "",
                    dateAchat: data.dateAchat ? data.dateAchat.split("T")[0] : "",
                    categorieId: data.categorieId ? String(data.categorieId) : "",
                    statut: data.statut || "EN_STOCK",
                });
            })
            .catch(() => {
                setError("Impossible de charger les données de l'équipement.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        chargerEquipement();
    }, [id, reset]);

    const onSubmit = async (data) => {
        setSubmitError(null);
        try {
            const payload = {
                numeroSerie: data.numeroSerie,
                modele: data.modele,
                marque: data.marque,
                dateAchat: data.dateAchat || null,
                categorieId: Number(data.categorieId),
                statut: data.statut,
            };
            await modifierEquipement(id, payload);
            navigate("/equipements");
        } catch (err) {
            setSubmitError("Erreur lors de la modification de l'équipement.");
        }
    };

    if (loading) {
        return (
            <div className="form-main-area">
                <p>Chargement des informations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="form-main-area">
                <ErrorBanner type="error" message={error} />
                <button
                    className="form-btn-annuler"
                    onClick={() => navigate("/equipements")}
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
                    <h3 className="form-form-title">Modifier l'équipement</h3>

                    <ErrorBanner type="error" message={submitError} />

                    <form onSubmit={handleSubmit(onSubmit)} className="form-form">
                        <div className="form-form-group">
                            <label className="form-form-label">Numéro de série :</label>
                            <input
                                type="text"
                                className="form-form-input"
                                {...register("numeroSerie")}
                            />
                            {errors.numeroSerie && (
                                <span className="form-error-message">
                                    {errors.numeroSerie.message}
                                </span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Modèle :</label>
                            <input
                                type="text"
                                className="form-form-input"
                                {...register("modele")}
                            />
                            {errors.modele && (
                                <span className="form-error-message">
                                    {errors.modele.message}
                                </span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Marque :</label>
                            <input
                                type="text"
                                className="form-form-input"
                                {...register("marque")}
                            />
                            {errors.marque && (
                                <span className="form-error-message">
                                    {errors.marque.message}
                                </span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Date d'achat :</label>
                            <input
                                type="date"
                                className="form-form-input"
                                {...register("dateAchat")}
                            />
                            {errors.dateAchat && (
                                <span className="form-error-message">
                                    {errors.dateAchat.message}
                                </span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Catégorie :</label>
                            <select className="form-form-input" {...register("categorieId")}>
                                {categories.length === 0 && (
                                    <option value="">Aucune catégorie disponible</option>
                                )}
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nom}
                                    </option>
                                ))}
                            </select>
                            {errors.categorieId && (
                                <span className="form-error-message">
                                    {errors.categorieId.message}
                                </span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Statut :</label>
                            <select className="form-form-input" {...register("statut")}>
                                <option value="EN_STOCK">EN_STOCK</option>
                                <option value="AFFECTE">AFFECTE</option>
                                <option value="EN_PANNE">EN_PANNE</option>
                            </select>
                            {errors.statut && (
                                <span className="form-error-message">
                                    {errors.statut.message}
                                </span>
                            )}
                        </div>

                        <div className="form-form-actions">
                            <button
                                type="button"
                                className="form-btn-annuler"
                                onClick={() => navigate("/equipements")}
                            >
                                Annuler
                            </button>
                            <button type="submit" className="form-btn-enregistrer">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default ModifierEquipement;