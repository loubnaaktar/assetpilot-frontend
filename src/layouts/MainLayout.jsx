import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar/NavBar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import "./MainLayout.css";

export default function MainLayout() {
    return (
        <div className="layout-container">
            <Sidebar />

            <div className="layout-main">
                <Navbar />

                <main className="content-zone">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}