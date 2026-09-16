import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiArchive, FiCheckSquare, FiTool, FiLogIn, FiShield } from "react-icons/fi";
import logoImg from "../../assets/logo .png";
import "./Landing.css";

function Landing() {
    const navigate = useNavigate();

    const features = [
        { icon: FiArchive, title: "Inventaire des actifs", desc: "Suivez tous vos équipements IT en temps réel depuis une vue centralisée." },
        { icon: FiCheckSquare, title: "Affectations", desc: "Affectez et suivez les équipements auprès de vos employés et techniciens." },
        { icon: FiTool, title: "Incidents & Maintenance", desc: "Signalez les incidents et gérez la maintenance de toute votre infrastructure." },
    ];

    const stats = [
        { value: "99.9%", label: "Temps de fonctionnement" },
        { value: "50k+", label: "Actifs gérés" },
        { value: "24/7", label: "Surveillance" },
    ];

    return (
        <div className="landing">
            <div className="landing-nav">
                <div className="landing-brand">
                    <img src={logoImg} alt="AssetPilot Logo" className="landing-logo" />
                    <span className="landing-brand-name">AssetPilot</span>
                </div>
                <button className="landing-login-btn" onClick={() => navigate("/login")}>
                    <FiLogIn className="landing-btn-icon" />
                    Se connecter
                </button>
            </div>

            <section className="landing-hero">
                <div className="landing-logo-card">
                    <img src={logoImg} alt="AssetPilot Logo" className="landing-logo-lg" />
                </div>

                <h1 className="landing-title">
                    Gouvernance des infrastructures, <span className="landing-highlight">simplifiée.</span>
                </h1>
                <p className="landing-subtitle">
                    Gérez votre parc informatique, les affectations et la maintenance depuis un tableau de bord unique.
                </p>
                <button className="landing-cta" onClick={() => navigate("/login")}>
                    Commencer maintenant
                    <FiArrowRight className="landing-btn-icon" />
                </button>

                <div className="landing-stats">
                    {stats.map(({ value, label }) => (
                        <div className="landing-stat" key={label}>
                            <span className="landing-stat-value">{value}</span>
                            <span className="landing-stat-label">{label.toUpperCase()}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="landing-features">
                <div className="landing-section-head">
                    <FiShield className="landing-section-icon" />
                    <h2 className="landing-section-title">Une plateforme, tout votre IT</h2>
                    <p className="landing-section-sub">Les outils essentiels pour piloter votre infrastructure au quotidien.</p>
                </div>

                <div className="landing-features-grid">
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div className="feature-card" key={title}>
                            <div className="feature-icon-wrap">
                                <Icon className="feature-icon" />
                            </div>
                            <h3 className="feature-title">{title}</h3>
                            <p className="feature-desc">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="landing-footer">
                © 2026 ASSETPILOT TECHNOLOGIES. TOUS DROITS RÉSERVÉS.
            </footer>
        </div>
    );
}

export default Landing;