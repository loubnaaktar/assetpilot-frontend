import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { creerEquipement } from "../../service/EquipementService.js";
import { getCategories } from "../../service/CategoryService.js";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../../Style/form.css";

const schema = yup.object({
    numeroSerie: yup.string().required("Le numéro de série est obligatoire"),
    modele: yup.string().required("Le modèle est obligatoire"),
    marque: yup.string().required("La marque est obligatoire"),
    dateAchat: yup.string().nullable(),
    categorie: yup.string().required("La catégorie est obligatoire"),
    statut: yup.string().required("Le statut est obligatoire"),
});

function AjouterEquipement() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            statut: "EN_STOCK",
            categorie: "",
        },
    });

    useEffect(() => {
        getCategories({ size: 100 })
            .then((response) => {
                const liste = response.data.content || response.data;
                setCategories(liste);
                if (liste.length > 0 && !getValues("categorie")) {
                    setValue("categorie", liste[0].nom);
                }
            })
            .catch(() => setCategories([]));
    }, [getValues, setValue]);

    const onSubmit = async (data) => {
        try {
            const categorie = categories.find(
                (c) => c.nom.trim().toLowerCase() === data.categorie.trim().toLowerCase()
            );

            const payload = {
                numeroSerie: data.numeroSerie,
                modele: data.modele,
                marque: data.marque,
                dateAchat: data.dateAchat || null,
                statut: data.statut,
                categorieId: categorie.id,
            };
            await creerEquipement(payload);
            navigate("/equipements");
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'équipement :", error);
        }
    };

    return (
        <div className="form-main-area">
            <main className="form-content-wrapper">
                <div className="form-card-container">
                    <h3 className="form-form-title">Ajouter un nouvel équipement</h3>

                    <form onSubmit={handleSubmit(onSubmit)} className="form-form">
                        <div className="form-form-group">
                            <label className="form-form-label">Numéro de série :</label>
                            <input
                                type="text"
                                placeholder="Entrez le numéro de série (ex. SN-2026-001)"
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
                                placeholder="Entrez le modèle (ex. ThinkPad T14)"
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
                                placeholder="Entrez la marque (ex. Lenovo, Apple)"
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
                            <select className="form-form-input" {...register("categorie")}>
                                {categories.length === 0 && (
                                    <option value="">Aucune catégorie disponible</option>
                                )}
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.nom}>
                                        {cat.nom}
                                    </option>
                                ))}
                            </select>
                            {errors.categorie && (
                                <span className="form-error-message">
                                    {errors.categorie.message}
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
                            <button type="submit" className="form-btn-enregistrer" disabled={isSubmitting}>
                                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default AjouterEquipement;