import { useNavigate } from "react-router-dom";
import { creerCategorie } from "../../service/CategoryService.js";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../../Style/form.css";

const schema = yup.object({
    nom: yup.string().required("Le nom de la catégorie est obligatoire"),
    description: yup.string().nullable(),
});

function AjouterCategorie() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        try {
            await creerCategorie(data);
            navigate("/categories");
        } catch (error) {
            console.error("Erreur lors de la création de la catégorie :", error);
        }
    };

    return (
        <div className="form-main-area">
            <main className="form-content-wrapper">
                <div className="form-card-container">
                    <h3 className="form-form-title">Ajouter une nouvelle catégorie</h3>

                    <form onSubmit={handleSubmit(onSubmit)} className="form-form">
                        <div className="form-form-group">
                            <label className="form-form-label">Nom :</label>
                            <input
                                type="text"
                                placeholder="Entrez le nom de la catégorie"
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
                                placeholder="Entrez une description (optionnel)"
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

export default AjouterCategorie;