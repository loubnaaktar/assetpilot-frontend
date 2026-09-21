import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { changerMotDePasse, getMonProfil, modifierMonProfil } from "../../service/UtilisateurService.js";
import "../../Style/form.css";
import "../../Style/consulter.css";
import "./Profil.css";

const schemaInfos = yup.object({
    prenom: yup.string().required("Le prénom est obligatoire"),
    nom: yup.string().required("Le nom est obligatoire"),
    email: yup.string().email("L'email n'est pas valide").required("L'email est obligatoire"),
});

const schemaPassword = yup.object({
    ancienMotDePasse: yup.string().required("L'ancien mot de passe est obligatoire"),
    nouveauMotDePasse: yup
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .required("Le nouveau mot de passe est obligatoire"),
    confirmation: yup
        .string()
        .oneOf([yup.ref("nouveauMotDePasse"), null], "Les mots de passe ne correspondent pas")
        .required("La confirmation est obligatoire"),
});

function Profil() {
    const navigate = useNavigate();

    const [profil, setProfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messageInfos, setMessageInfos] = useState(null);
    const [messagePassword, setMessagePassword] = useState(null);

    const {
        register: registerInfos,
        handleSubmit: handleSubmitInfos,
        reset: resetInfos,
        formState: { errors: errorsInfos },
    } = useForm({ resolver: yupResolver(schemaInfos) });

    const {
        register: registerPass,
        handleSubmit: handleSubmitPass,
        reset: resetPass,
        formState: { errors: errorsPass },
    } = useForm({ resolver: yupResolver(schemaPassword) });

    useEffect(() => {
        getMonProfil()
            .then((res) => {
                setProfil(res.data);
                resetInfos({
                    prenom: res.data.prenom,
                    nom: res.data.nom,
                    email: res.data.email,
                });
            })
            .catch(() => {
                setError("Impossible de charger votre profil.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const onSubmitInfos = async (data) => {
        setMessageInfos(null);
        try {
            const emailAvant = profil.email;
            const res = await modifierMonProfil(data);
            setProfil(res.data);

            if (emailAvant !== res.data.email) {
                setMessageInfos({
                    type: "success",
                    text: "Email modifié, veuillez vous reconnecter.",
                });
                setTimeout(() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                }, 1500);
            } else {
                setMessageInfos({ type: "success", text: "Informations mises à jour." });
            }
        } catch (err) {
            setMessageInfos({
                type: "error",
                text: err.response?.data?.message || "Erreur lors de la mise à jour.",
            });
        }
    };

    const onSubmitPassword = async (data) => {
        setMessagePassword(null);
        try {
            await changerMotDePasse({
                ancienMotDePasse: data.ancienMotDePasse,
                nouveauMotDePasse: data.nouveauMotDePasse,
            });
            setMessagePassword({ type: "success", text: "Mot de passe modifié." });
            resetPass();
        } catch (err) {
            setMessagePassword({
                type: "error",
                text: err.response?.data?.message || "Erreur lors du changement de mot de passe.",
            });
        }
    };

    if (loading) {
        return (
            <div className="form-main-area">
                <p>Chargement du profil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="form-main-area">
                <p className="consulter-error">{error}</p>
            </div>
        );
    }

    return (
        <div className="form-main-area">
            <main className="form-content-wrapper profil-stack">
                <div className="form-card-container">
                    <h3 className="form-form-title">Mes informations</h3>

                    {messageInfos && (
                        <p className={messageInfos.type === "success" ? "profil-message-success" : "profil-message-error"}>
                            {messageInfos.text}
                        </p>
                    )}

                    <form className="form-form" onSubmit={handleSubmitInfos(onSubmitInfos)}>
                        <div className="form-form-group">
                            <label className="form-form-label">Prénom :</label>
                            <input type="text" className="form-form-input" {...registerInfos("prenom")} />
                            {errorsInfos.prenom && (
                                <span className="form-error-message">{errorsInfos.prenom.message}</span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Nom :</label>
                            <input type="text" className="form-form-input" {...registerInfos("nom")} />
                            {errorsInfos.nom && (
                                <span className="form-error-message">{errorsInfos.nom.message}</span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Email :</label>
                            <input type="email" className="form-form-input" {...registerInfos("email")} />
                            {errorsInfos.email && (
                                <span className="form-error-message">{errorsInfos.email.message}</span>
                            )}
                        </div>

                        <div className="form-form-actions">
                            <button
                                type="button"
                                className="form-btn-annuler"
                                onClick={() =>
                                    resetInfos({
                                        prenom: profil.prenom,
                                        nom: profil.nom,
                                        email: profil.email,
                                    })
                                }
                            >
                                Annuler
                            </button>
                            <button type="submit" className="form-btn-enregistrer">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>

                <div className="form-card-container">
                    <h3 className="form-form-title">Informations en lecture seule</h3>

                    <div className="consulter-info-group">
                        <span className="consulter-label">ID :</span>
                        <span className="consulter-value">{profil?.id}</span>
                    </div>

                    <div className="consulter-info-group">
                        <span className="consulter-label">Rôle :</span>
                        <span className="consulter-value">{profil?.role}</span>
                    </div>

                    {profil?.role === "EMPLOYE" && (
                        <div className="consulter-info-group">
                            <span className="consulter-label">Matricule :</span>
                            <span className="consulter-value">{profil?.matricule}</span>
                        </div>
                    )}

                    {profil?.role === "TECHNICIEN" && (
                        <div className="consulter-info-group">
                            <span className="consulter-label">Spécialité :</span>
                            <span className="consulter-value">{profil?.specialite}</span>
                        </div>
                    )}
                </div>

                <div className="form-card-container">
                    <h3 className="form-form-title">Modifier le mot de passe</h3>

                    {messagePassword && (
                        <p className={messagePassword.type === "success" ? "profil-message-success" : "profil-message-error"}>
                            {messagePassword.text}
                        </p>
                    )}

                    <form className="form-form" onSubmit={handleSubmitPass(onSubmitPassword)}>
                        <div className="form-form-group">
                            <label className="form-form-label">Ancien mot de passe :</label>
                            <input type="password" className="form-form-input" {...registerPass("ancienMotDePasse")} />
                            {errorsPass.ancienMotDePasse && (
                                <span className="form-error-message">{errorsPass.ancienMotDePasse.message}</span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Nouveau mot de passe :</label>
                            <input type="password" className="form-form-input" {...registerPass("nouveauMotDePasse")} />
                            {errorsPass.nouveauMotDePasse && (
                                <span className="form-error-message">{errorsPass.nouveauMotDePasse.message}</span>
                            )}
                        </div>

                        <div className="form-form-group">
                            <label className="form-form-label">Confirmation :</label>
                            <input type="password" className="form-form-input" {...registerPass("confirmation")} />
                            {errorsPass.confirmation && (
                                <span className="form-error-message">{errorsPass.confirmation.message}</span>
                            )}
                        </div>

                        <div className="form-form-actions">
                            <button type="submit" className="form-btn-enregistrer">
                                Changer le mot de passe
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Profil;