import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { login } from "../../service/AuthService.js";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const schema = yup.object({
    email: yup
        .string()
        .email("Format d'email invalide")
        .required("L'email est obligatoire"),
    motDePasse: yup.string().required("Le mot de passe est obligatoire"),
});

function Login() {
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setMessage(null);
        try {
            const response = await login(data);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            setMessage({ type: "success", text: "Connexion réussie" });
            navigate("/dashboard");
        } catch (error) {
            const errorMsg =
                error.response?.data?.message || "Email ou mot de passe incorrect";
            setMessage({ type: "error", text: errorMsg });
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="left-content">
                    <div className="brand-card">
                        <div className="logo-box">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                            </svg>
                        </div>
                        <span className="brand-name">AssetPilot</span>
                    </div>

                    <h1 className="hero-title">
                        Gouvernance des infrastructures, simplifiée.
                    </h1>

                    <p className="hero-description">
                        Donner aux administrateurs IT des outils précis pour assurer le suivi des équipements, gérer leur affectation et accéder aux informations de maintenance en temps réel depuis un tableau de bord unifié.
                    </p>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">99.9%</span>
                            <span className="stat-label">TEMPS DE FONCTIONNEMENT</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">50k+</span>
                            <span className="stat-label">ACTIFS GÉRÉS</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">SURVEILLANCE</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-right">
                <div className="form-box">
                    <h2 className="login-title">Bon retour</h2>
                    <p className="login-subtitle">
                        Accédez à votre inventaire IT et portail de gestion.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                        {message && (
                            <div className={`message-banner ${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="login-group">
                            <label className="login-label">Adresse e-mail</label>
                            <div className="input-wrapper">
                                <span className="input-icon">✉</span>
                                <input
                                    type="email"
                                    placeholder="alex.rivers@societe.com"
                                    {...register("email")}
                                    className="login-field"
                                />
                            </div>
                            <p className="error-msg">{errors.email?.message}</p>
                        </div>

                        <div className="login-group">
                            <div className="label-row">
                                <label className="login-label">Mot de passe</label>
                                <a href="#forgot" className="forgot-link">Mot de passe oublié ?</a>
                            </div>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    {...register("motDePasse")}
                                    className="login-field"
                                />
                            </div>
                            <p className="error-msg">{errors.motDePasse?.message}</p>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="login-btn">
                            {isSubmitting ? "Connexion..." : "Se connecter au portail →"}
                        </button>

                        <div className="login-footer">
                            <span>Des problèmes pour vous connecter ? </span>
                            <a href="#help" className="help-link">Contactez le bureau d'assistance.</a>
                        </div>

                        <p className="copyright">
                            © 2026 ASSETPILOT TECHNOLOGIES. TOUS DROITS RÉSERVÉS.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;