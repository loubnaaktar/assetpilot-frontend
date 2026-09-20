import React from 'react';
import './NavBar.css';
import { getRoleFromToken } from "../../utils/auth.js";

function NavBar() {
    const role = getRoleFromToken() || "EMPLOYE";

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
                <span className="portal-text">Portail {roleLabel[role] || role}</span>
                <div className="user-profile">
                    <div className="avatar">AP</div>
                    <div className="user-info">
                        <span className="user-name">Utilisateur</span>
                        <span className="user-role">{roleLabel[role] || role}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default NavBar;
