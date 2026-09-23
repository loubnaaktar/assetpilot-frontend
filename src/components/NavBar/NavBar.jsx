import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import './NavBar.css';
import { getRoleFromToken } from "../../utils/auth.js";
import { getMonProfil } from "../../service/UtilisateurService.js";

function NavBar() {
    const role = getRoleFromToken() || "EMPLOYE";
    const [profil, setProfil] = useState(null);

    useEffect(() => {
        getMonProfil()
            .then((res) => setProfil(res.data))
            .catch(() => setProfil(null));
    }, []);

    const roleLabel = {
        ADMIN: "Administrateur",
        TECHNICIEN: "Technicien",
        EMPLOYE: "Employé",
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <div className="brand-logo-icon">
                    <div className="logo-compass-ring">
                        <div className="logo-needle"></div>
                    </div>
                </div>
                <h3 className="brand-title">AssetPilot</h3>
                <span className="navbar-badge">IT MANAGEMENT</span>
            </div>

            <div className="navbar-right">
                <NavLink to="/profil" className="profile-menu-button" title="Mon profil">
                    <div className="avatar">
                        <FiUser />
                    </div>
                    <div className="user-info">
                        <span className="user-name">
                            {profil ? `${profil.prenom} ${profil.nom}` : "Utilisateur"}
                        </span>
                        <span className="user-role">{roleLabel[role] || role}</span>
                    </div>
                </NavLink>
            </div>
        </header>
    );
}

export default NavBar;