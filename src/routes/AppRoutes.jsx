import { Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Landing from "../pages/Landing/Landing";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profil from "../pages/Profil/Profil";
//import AccesRefuse from "../pages/AccesRefuse/AccesRefuse";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

import Affectations from "../pages/Affectations/Affectations";
import AjouterAffectation from "../pages/Affectations/AjouterAffectation";
import ConsulterAffectation from "../pages/Affectations/ConsulterAffectation";
//import ModifierAffectation from "../pages/Affectations/ModifierAffectation";

import Categories from "../pages/Categories/Categories";
import AjouterCategorie from "../pages/Categories/AjouterCategorie";
import ConsulterCategorie from "../pages/Categories/ConsulterCategorie";
import ModifierCategorie from "../pages/Categories/ModifierCategorie";

//import Employes from "../pages/Employes/Employes";
//import AjouterEmploye from "../pages/Employes/AjouterEmploye";
//import ConsulterEmploye from "../pages/Employes/ConsulterEmploye";
//import ModifierEmploye from "../pages/Employes/ModifierEmploye";

import Equipements from "../pages/Equipements/admin/Equipements.jsx";
import AjouterEquipement from "../pages/Equipements/admin/AjouterEquipement.jsx";
import ModifierEquipement from "../pages/Equipements/admin/ModifierEquipement.jsx";

import Incidents from "../pages/Incidents/admin/Incidents.jsx";
//import AjouterIncident from "../pages/Incidents/AjouterIncident";
import ConsulterIncident from "../pages/Incidents/admin/ConsulterIncident.jsx";
//import ModifierIncident from "../pages/Incidents/ModifierIncident";

//import Techniciens from "../pages/Techniciens/Techniciens";
//import AjouterTechnicien from "../pages/Techniciens/AjouterTechnicien";
//import ConsulterTechnicien from "../pages/Techniciens/ConsulterTechnicien";
//import ModifierTechnicien from "../pages/Techniciens/ModifierTechnicien";

import Utilisateurs from "../pages/Utilisateurs/Utilisateurs";
import AjouterUtilisateur from "../pages/Utilisateurs/AjouterUtilisateur";
import ConsulterUtilisateur from "../pages/Utilisateurs/ConsulterUtilisateur";
//import ModifierUtilisateur from "../pages/Utilisateurs/ModifierUtilisateur";

//import NotFound from "../pages/NotFound";

const ADMIN = "ADMIN";
const EMPLOYE = "EMPLOYE";
const TECHNICIEN = "TECHNICIEN";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />


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
                        <RoleGuard roles={[ADMIN, TECHNICIEN]}>
                            <Equipements />
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
                        <RoleGuard roles={[ADMIN, TECHNICIEN]}>
                            <Incidents />
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
                {/*

                <Route
                    path="/modifierAffectation/:id"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <ModifierAffectation />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/ajouterEmploye"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <AjouterEmploye />
                        </RoleGuard>
                    }
                />
                <Route
                    path="/consulterEmploye/:id"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <ConsulterEmploye />
                        </RoleGuard>
                    }
                />
                <Route
                    path="/modifierEmploye/:id"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <ModifierEmploye />
                        </RoleGuard>
                    }
                />


                <Route
                    path="/ajouterIncident"
                    element={
                        <RoleGuard roles={[EMPLOYE]}>
                            <AjouterIncident />
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
                    path="/techniciens"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <Techniciens />
                        </RoleGuard>
                    }
                />
                <Route
                    path="/ajouterTechnicien"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <AjouterTechnicien />
                        </RoleGuard>
                    }
                />

                <Route
                    path="/modifierTechnicien/:id"
                    element={
                        <RoleGuard roles={[ADMIN]}>
                            <ModifierTechnicien />
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


            <Route path="/acces-refuse" element={<AccesRefuse />} />
            <Route path="*" element={<NotFound />} />

              */}
            </Route>
        </Routes>
    );
}

export default AppRoutes;