import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { login } from "../../service/AuthService.js";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import logoImg from "../../assets/logo .png";
import { getRoleFromToken } from "../../utils/auth.js";
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner.jsx";
import "./Login.css";

const schema = yup.object({
    email: yup
        .string()
        .email("Format d'email invalide")
        .required("L'email est obligatoire"),
    password: yup.string().required("Le mot de passe est obligatoire"),
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

            const role = getRoleFromToken();

            const pageAccueil = {
                ADMIN: "/dashboard",
                TECHNICIEN: "/suivi-incidents",
                EMPLOYE: "/mesEquipements",
            };

            setMessage({ type: "success", text: "Connexion réussie" });
            navigate(pageAccueil[role] || "/dashboard");
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
                        <img src={logoImg} alt="AssetPilot Logo" className="logo-img" />
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

            {}
            <div className="login-right">
                <div className="form-box">
                    <h2 className="login-title">Bon retour</h2>
                    <p className="login-subtitle">
                        Accédez à votre inventaire IT et portail de gestion.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                        <ErrorBanner type={message?.type} message={message?.text} />

                        <div className="login-group">
                            <label className="login-label">Adresse e-mail</label>
                            <div className="input-wrapper">
                                <FiMail className="input-icon" />
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
                            </div>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    {...register("password")}
                                    className="login-field"
                                />
                            </div>
                            <p className="error-msg">{errors.password?.message}</p>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="login-btn">
                            {isSubmitting ? "Connexion..." : <>Se connecter au portail <FiArrowRight /></>}
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