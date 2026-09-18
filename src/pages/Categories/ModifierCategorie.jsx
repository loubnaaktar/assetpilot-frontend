import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getCategorieById, modifierCategorie } from "../../service/CategoryService.js";
import "../../Style/form.css";

const schema = yup.object({
    nom: yup.string().required("Le nom de la catégorie est obligatoire"),
    description: yup.string().nullable(),
});

function ModifierCategorie() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const chargerCategorie = () => {
        getCategorieById(id)
            .then((res) => {
                reset(res.data);
            })
            .catch((err) => {
                console.error("Erreur lors du chargement de la catégorie :", err);
                setError("Impossible de charger les données de la catégorie.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        chargerCategorie();
    }, [id, reset]);

    const onSubmit = async (data) => {
        try {
            await modifierCategorie(id, data);
            navigate("/categories");
        } catch (err) {
            console.error("Erreur lors de la modification :", err);
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
                <p className="form-error">{error}</p>
                <button
                    className="form-btn-annuler"
                    onClick={() => navigate("/categories")}
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
                    <h3 className="form-form-title">Modifier la catégorie</h3>

                    <form onSubmit={handleSubmit(onSubmit)} className="form-form">
                        <div className="form-form-group">
                            <label className="form-form-label">Nom :</label>
                            <input
                                type="text"
                                className="form-form-input"
                                {...register("nom")}
                            />
                            {errors.nom && (
                                <span className="form-error-message">
                                    {errors.nom.message}
                                </span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Description :</label>
                            <input
                                type="text"
                                className="form-form-input"
                                {...register("description")}
                            />
                            {errors.description && (
                                <span className="form-error-message">
                                    {errors.description.message}
                                </span>
                            )}
                        </div>

                        <div className="form-form-actions">
                            <button
                                type="button"
                                className="form-btn-annuler"
                                onClick={() => navigate("/categories")}
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

export default ModifierCategorie;