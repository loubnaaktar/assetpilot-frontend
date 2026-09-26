import { NavLink, useNavigate } from "react-router-dom";
import {
    FiGrid,
    FiArchive,
    FiCheckSquare,
    FiTool,
    FiUsers,
    FiLogOut,
    FiTag,
    FiCheckCircle
} from "react-icons/fi";
import './Sidebar.css';
import { getRoleFromToken } from '../../utils/auth.js';

function Sidebar() {
    const navigate = useNavigate();
    const role = getRoleFromToken() || "EMPLOYE";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h2 className="sidebar-brand-name">AssetPilot</h2>
            </div>

            <nav className="sidebar-menu">
                {role === "ADMIN" && (
                    <NavLink to="/dashboard" className="sidebar-item">
                        <FiGrid className="sidebar-icon" />
                        <span>Tableau de bord</span>
                    </NavLink>
                )}

                {role === "ADMIN" && (
                    <NavLink to="/equipements" className="sidebar-item">
                        <FiArchive className="sidebar-icon" />
                        <span>Équipements</span>
                    </NavLink>
                )}

                {role === "ADMIN" && (
                    <NavLink to="/categories" className="sidebar-item">
                        <FiTag className="sidebar-icon" />
                        <span>Catégories</span>
                    </NavLink>
                )}

                {role === "ADMIN" && (
                    <NavLink to="/affectations" className="sidebar-item">
                        <FiCheckSquare className="sidebar-icon" />
                        <span>Affectations</span>
                    </NavLink>
                )}

                {role === "EMPLOYE" ? (
                    <>
                        <NavLink to="/mesEquipements" className="sidebar-item">
                            <FiArchive className="sidebar-icon" />
                            <span>Mes équipements</span>
                        </NavLink>
                        <NavLink to="/declarerIncident" className="sidebar-item">
                            <FiTool className="sidebar-icon" />
                            <span>Déclarer un incident</span>
                        </NavLink>
                    </>
                ) : (
                    role === "ADMIN" && (
                        <NavLink to="/incidents" className="sidebar-item">
                            <FiTool className="sidebar-icon" />
                            <span>Incidents et Maintenance</span>
                        </NavLink>
                    )
                )}

                {role === "TECHNICIEN" && (
                    <NavLink to="/suivi-incidents" className="sidebar-item">
                        <FiCheckCircle className="sidebar-icon" />
                        <span>Suivi des incidents</span>
                    </NavLink>
                )}

                {role === "ADMIN" && (
                    <NavLink to="/utilisateurs" className="sidebar-item">
                        <FiUsers className="sidebar-icon" />
                        <span>Utilisateurs</span>
                    </NavLink>
                )}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <FiLogOut className="sidebar-icon" />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
