import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { creerEmploye } from "../../service/EmployeService.js";
import { creerTechnicien } from "../../service/TechnicienService.js";
import api from "../../api/axios.js";
import "../../Style/form.css";

const schema = yup.object({
    nom: yup.string().required("Le nom est obligatoire"),
    prenom: yup.string().required("Le prénom est obligatoire"),
    email: yup.string().email("L'email n'est pas valide").required("L'email est obligatoire"),
    role: yup.string().required("Le rôle est obligatoire"),
    specialite: yup.string().when("role", {
        is: "TECHNICIEN",
        then: (s) => s.required("La spécialité est obligatoire pour un technicien"),
        otherwise: (s) => s.nullable(),
    }),
});

function AjouterUtilisateur() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        unregister,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            nom: "",
            prenom: "",
            email: "",
            role: "EMPLOYE",
            specialite: "",
        },
    });

    const selectedRole = watch("role");

    useEffect(() => {
        if (selectedRole !== "TECHNICIEN") {
            unregister("specialite");
        }
    }, [selectedRole, unregister]);

    const onSubmit = async (data) => {
        try {
            if (data.role === "EMPLOYE") {
                await creerEmploye({
                    nom: data.nom,
                    prenom: data.prenom,
                    email: data.email,
                    role: "EMPLOYE",
                });
            } else if (data.role === "TECHNICIEN") {
                await creerTechnicien({
                    nom: data.nom,
                    prenom: data.prenom,
                    email: data.email,
                    role: "TECHNICIEN",
                    specialite: data.specialite,
                });
            } else if (data.role === "ADMIN") {
                await api.post("/utilisateurs/admin", {
                    nom: data.nom,
                    prenom: data.prenom,
                    email: data.email,
                    role: "ADMIN",
                });
            }
            navigate("/utilisateurs");
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur :", error);
        }
    };

    return (
        <div className="form-main-area">
            <main className="form-content-wrapper">
                <div className="form-card-container">
                    <h3 className="form-form-title">Ajouter un nouvel utilisateur</h3>

                    <form onSubmit={handleSubmit(onSubmit)} className="form-form">
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

                        <div className="form-form-group">
                            <label className="form-form-label">Rôle :</label>
                            <select className="form-form-input" {...register("role")}>
                                <option value="EMPLOYE">Employé</option>
                                <option value="TECHNICIEN">Technicien</option>
                                <option value="ADMIN">Administrateur</option>
                            </select>
                            {errors.role && (
                                <span className="form-error-message">{errors.role.message}</span>
                            )}
                        </div>

                        {selectedRole === "TECHNICIEN" && (
                            <div className="form-form-group">
                                <label className="form-form-label">Spécialité :</label>
                                <input
                                    type="text"
                                    placeholder="Ex. Réseau, Maintenance IT..."
                                    className="form-form-input"
                                    {...register("specialite")}
                                />
                                {errors.specialite && (
                                    <span className="form-error-message">
                                        {errors.specialite.message}
                                    </span>
                                )}
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

export default AjouterUtilisateur;