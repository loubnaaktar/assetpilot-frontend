import { Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Landing from "../pages/Landing/Landing";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profil from "../pages/Profil/Profil";
import AccesRefuse from "../pages/AccesRefuse/AccesRefuse";
import NotFound from "../pages/NotFound/NotFound";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

import Affectations from "../pages/Affectations/Affectations";
import AjouterAffectation from "../pages/Affectations/AjouterAffectation";
import ConsulterAffectation from "../pages/Affectations/ConsulterAffectation";

import Categories from "../pages/Categories/Categories";
import AjouterCategorie from "../pages/Categories/AjouterCategorie";
import ConsulterCategorie from "../pages/Categories/ConsulterCategorie";
import ModifierCategorie from "../pages/Categories/ModifierCategorie";

import Equipements from "../pages/Equipements/admin/Equipements.jsx";
import AjouterEquipement from "../pages/Equipements/admin/AjouterEquipement.jsx";
import ConsulterEquipement from "../pages/Equipements/admin/ConsulterEquipement.jsx";
import ModifierEquipement from "../pages/Equipements/admin/ModifierEquipement.jsx";

import Incidents from "../pages/Incidents/admin/Incidents.jsx";
import DeclarerIncident from "../pages/Incidents/employe/DeclarerIncident.jsx";
import ConsulterIncident from "../pages/Incidents/admin/ConsulterIncident.jsx";
import SuiviIncidents from "../pages/Incidents/technicien/SuiviIncidents.jsx";
import ModifierIncident from "../pages/Incidents/technicien/ModifierIncident.jsx";
import MesEquipements from "../pages/Equipements/employe/MesEquipements.jsx";

import Utilisateurs from "../pages/Utilisateurs/Utilisateurs";
import AjouterUtilisateur from "../pages/Utilisateurs/AjouterUtilisateur";
import ConsulterUtilisateur from "../pages/Utilisateurs/ConsulterUtilisateur";
import ModifierUtilisateur from "../pages/Utilisateurs/ModifierUtilisateur";

const ADMIN = "ADMIN";
const EMPLOYE = "EMPLOYE";
const TECHNICIEN = "TECHNICIEN";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/acces-refuse" element={<AccesRefuse />} />
            <Route path="*" element={<NotFound />} />


            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/dashboard"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <Dashboard />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/profil"
                    element={<Profil />}
                />

                <Route
                    path="/equipements"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <Equipements />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/consulterEquipement/:id"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <ConsulterEquipement />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/ajouterEquipement"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <AjouterEquipement />
                        </RoleGuard>
                    }
                />
                <Route
                    path="/modifierEquipement/:id"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <ModifierEquipement />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/categories"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <Categories />
                        </RoleGuard>
                    }
                />
                <Route
                    path="/ajouterCategorie"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <AjouterCategorie />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/modifierCategorie/:id"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <ModifierCategorie />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/consulterCategorie/:id"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <ConsulterCategorie />
                        </RoleGuard>
                    }
                />
                <Route
                    path="/affectations"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <Affectations />
                        </RoleGuard>
                    }
                />
                <Route
                    path="/ajouterAffectation"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <AjouterAffectation />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/consulterAffectation/:id"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <ConsulterAffectation />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/incidents"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <Incidents />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/declarerIncident"
                    element={
                        <RoleGuard roles={[EMPLOYE]}>
                            <DeclarerIncident />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/mesEquipements"
                    element={
                        <RoleGuard roles={[EMPLOYE]}>
                            <MesEquipements />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/consulterIncident/:id"
                    element={
                        <RoleGuard roles={[ADMIN, TECHNICIEN]}>
                            <ConsulterIncident />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/suivi-incidents"
                    element={
                        <RoleGuard roles={[TECHNICIEN]}>
                            <SuiviIncidents />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/modifierIncident/:id"
                    element={
                        <RoleGuard roles={[TECHNICIEN]}>
                            <ModifierIncident />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/utilisateurs"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <Utilisateurs />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/ajouterUtilisateur"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <AjouterUtilisateur />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/consulterUtilisateur/:id"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <ConsulterUtilisateur />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/modifierUtilisateur/:id"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <ModifierUtilisateur />
                        </RoleGuard>
                    }
                />
            </Route>
        </Routes>
    );
}

export default AppRoutes;