import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getMonProfil } from "../../../service/UtilisateurService.js";
import { getEquipementsEmploye } from "../../../service/EquipementService.js";
import { declarerIncident } from "../../../service/IncidentService.js";
import ErrorBanner from "../../../components/ErrorBanner/ErrorBanner.jsx";
import "../../../Style/form.css";

const schema = yup.object({
    equipementId: yup.string().required("L'équipement est obligatoire"),
    equipe: yup.string().required("L'équipe est obligatoire"),
    etage: yup.string().required("L'étage est obligatoire"),
    description: yup.string().required("La description de l'incident est obligatoire"),
});

function DeclarerIncident() {
    const navigate = useNavigate();
    const [employeId, setEmployeId] = useState(null);
    const [equipements, setEquipements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            equipementId: "",
            equipe: "",
            etage: "",
            niveauUrgence: "FAIBLE",
            description: "",
        },
    });

    useEffect(() => {
        getMonProfil()
            .then((profilRes) => {
                const id = profilRes.data.id;
                setEmployeId(id);
                return getEquipementsEmploye(id, { size: 100 });
            })
            .then((res) => {
                setEquipements(res.data.content || res.data);
            })
            .catch(() => {
                setMessage({ type: "error", text: "Impossible de charger vos équipements." });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const onSubmit = async (data) => {
        setMessage(null);
        const descriptionCompletee =
            `[Équipe : ${data.equipe}] [Étage : ${data.etage}]\n\n` + data.description;

        try {
            await declarerIncident(employeId, {
                equipementId: Number(data.equipementId),
                niveauUrgence: data.niveauUrgence,
                description: descriptionCompletee,
            });
            setMessage({ type: "success", text: "Incident déclaré avec succès !" });
            reset();
        } catch (err) {
            setMessage({ type: "error", text: "Erreur lors de la déclaration de l'incident." });
        }
    };

    return (
        <div className="form-main-area">
            <main className="form-content-wrapper">
                <div className="form-card-container">
                    <h3 className="form-form-title">Déclarer un incident</h3>

                    {loading && <p>Chargement de vos équipements...</p>}

                    {!loading && message && (
                        <ErrorBanner type={message.type} message={message.text} />
                    )}

                    {!loading && (
                        <form onSubmit={handleSubmit(onSubmit)} className="form-form">
                            <div className="form-form-group">
                                <label className="form-form-label">Équipement concerné :</label>
                                <select className="form-form-input" {...register("equipementId")}>
                                    <option value="">-- Sélectionner un équipement --</option>
                                    {equipements.map((eq) => (
                                        <option key={eq.id} value={eq.id}>
                                            {eq.modele || "-"} ({eq.numeroSerie || `#${eq.id}`})
                                        </option>
                                    ))}
                                </select>
                                {errors.equipementId && (
                                    <span className="form-error-message">{errors.equipementId.message}</span>
                                )}
                            </div>

                            <div className="form-form-group">
                                <label className="form-form-label">Équipe :</label>
                                <input
                                    type="text"
                                    placeholder="Ex : Équipe IT"
                                    className="form-form-input"
                                    {...register("equipe")}
                                />
                                {errors.equipe && (
                                    <span className="form-error-message">{errors.equipe.message}</span>
                                )}
                            </div>

                            <div className="form-form-group">
                                <label className="form-form-label">Étage :</label>
                                <input
                                    type="text"
                                    placeholder="Ex : 2ème étage"
                                    className="form-form-input"
                                    {...register("etage")}
                                />
                                {errors.etage && (
                                    <span className="form-error-message">{errors.etage.message}</span>
                                )}
                            </div>

                            <div className="form-form-group">
                                <label className="form-form-label">Niveau d'urgence :</label>
                                <select className="form-form-input" {...register("niveauUrgence")}>
                                    <option value="FAIBLE">Faible</option>
                                    <option value="MOYEN">Moyen</option>
                                    <option value="ELEVE">Élevé</option>
                                </select>
                            </div>

                            <div className="form-form-group">
                                <label className="form-form-label">Description du problème :</label>
                                <textarea
                                    rows="4"
                                    placeholder="Décrivez la panne ou le dysfonctionnement..."
                                    className="form-form-input"
                                    {...register("description")}
                                />
                                {errors.description && (
                                    <span className="form-error-message">{errors.description.message}</span>
                                )}
                            </div>

                            <div className="form-form-actions">
                                <button
                                    type="button"
                                    className="form-btn-annuler"
                                    onClick={() => navigate(-1)}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="form-btn-enregistrer"
                                    style={{ backgroundColor: "#dc2626" }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Envoi..." : "Déclarer l'incident"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}

export default DeclarerIncident;