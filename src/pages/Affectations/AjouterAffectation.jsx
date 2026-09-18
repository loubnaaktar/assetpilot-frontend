import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { creerAffectation } from "../../service/AffectationService.js";
import { getEquipements } from "../../service/EquipementService.js";
import { getEmployes } from "../../service/EmployeService.js";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../../Style/form.css";

const schema = yup.object({
    dateDebut: yup.string().required("La date de début est obligatoire"),
    dateFin: yup.string().nullable(),
    equipementId: yup.string().required("L'équipement est obligatoire"),
    employeId: yup.string().required("L'employé est obligatoire"),
});

function AjouterAffectation() {
    const navigate = useNavigate();
    const [equipements, setEquipements] = useState([]);
    const [employes, setEmployes] = useState([]);
    const [rechercheEquipement, setRechercheEquipement] = useState("");
    const [rechercheEmploye, setRechercheEmploye] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            dateDebut: new Date().toISOString().split("T")[0],
            equipementId: "",
            employeId: "",
        },
    });

    useEffect(() => {
        getEquipements({ statut: "EN_STOCK", size: 100 })
            .then((response) => {
                const liste = response.data.content || response.data;
                setEquipements(liste);
                if (liste.length > 0 && !getValues("equipementId")) {
                    setValue("equipementId", String(liste[0].id));
                }
            })
            .catch(() => setEquipements([]));

        getEmployes({ size: 100 })
            .then((response) => {
                const liste = response.data.content || response.data;
                setEmployes(liste);
                if (liste.length > 0 && !getValues("employeId")) {
                    setValue("employeId", String(liste[0].id));
                }
            })
            .catch(() => setEmployes([]));
    }, [getValues, setValue]);

    const equipementsFiltres = equipements.filter((eq) => {
        const texte = ((eq.modele || "") + " " + (eq.numeroSerie || "") + " " + (eq.nom || "")).toLowerCase();
        return texte.includes(rechercheEquipement.toLowerCase());
    });

    const employesFiltres = employes.filter((emp) => {
        const texte = ((emp.nom || "") + " " + (emp.prenom || "") + " " + (emp.email || "")).toLowerCase();
        return texte.includes(rechercheEmploye.toLowerCase());
    });

    const onSubmit = async (data) => {
        try {
            const payload = {
                dateDebut: data.dateDebut,
                dateFin: data.dateFin || null,
                equipementId: Number(data.equipementId),
                employeId: Number(data.employeId),
            };
            await creerAffectation(payload);
            navigate("/affectations");
        } catch (error) {
            const message = error.response?.data?.message || "Erreur lors de la création de l'affectation.";
            alert(message);
        }
    };

    return (
        <div className="form-main-area">
            <main className="form-content-wrapper">
                <div className="form-card-container">
                    <h3 className="form-form-title">Créer une nouvelle affectation</h3>

                    <form onSubmit={handleSubmit(onSubmit)} className="form-form">
                        <div className="form-form-group">
                            <label className="form-form-label">Équipement (En stock) :</label>
                            <input
                                type="text"
                                placeholder="Rechercher un équipement..."
                                value={rechercheEquipement}
                                onChange={(e) => setRechercheEquipement(e.target.value)}
                                className="form-search-input"
                            />
                            <select className="form-form-input" {...register("equipementId")}>
                                {equipementsFiltres.length === 0 && (
                                    <option value="">Aucun équipement trouvé</option>
                                )}
                                {equipementsFiltres.map((eq) => (
                                    <option key={eq.id} value={eq.id}>
                                        {eq.modele || eq.nom} - ({eq.numeroSerie || `#${eq.id}`})
                                    </option>
                                ))}
                            </select>
                            {errors.equipementId && (
                                <span className="form-error-message">
                                    {errors.equipementId.message}
                                </span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Employé :</label>
                            <input
                                type="text"
                                placeholder="Rechercher un employé..."
                                value={rechercheEmploye}
                                onChange={(e) => setRechercheEmploye(e.target.value)}
                                className="form-search-input"
                            />
                            <select className="form-form-input" {...register("employeId")}>
                                {employesFiltres.length === 0 && (
                                    <option value="">Aucun employé trouvé</option>
                                )}
                                {employesFiltres.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.nom} {emp.prenom} ({emp.email})
                                    </option>
                                ))}
                            </select>
                            {errors.employeId && (
                                <span className="form-error-message">
                                    {errors.employeId.message}
                                </span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Date de début :</label>
                            <input
                                type="date"
                                className="form-form-input"
                                {...register("dateDebut")}
                            />
                            {errors.dateDebut && (
                                <span className="form-error-message">
                                    {errors.dateDebut.message}
                                </span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Date de fin (Optionnel) :</label>
                            <input
                                type="date"
                                className="form-form-input"
                                {...register("dateFin")}
                            />
                            {errors.dateFin && (
                                <span className="form-error-message">
                                    {errors.dateFin.message}
                                </span>
                            )}
                        </div>

                        <div className="form-form-actions">
                            <button
                                type="button"
                                className="form-btn-annuler"
                                onClick={() => navigate("/affectations")}
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

export default AjouterAffectation;
