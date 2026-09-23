import { useState, useEffect } from "react";
import { getStatistiques } from "../../service/StatisticsService.js";
import { getIncidents } from "../../service/IncidentService.js";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { FiBox, FiCheckCircle, FiAlertTriangle, FiLayers, FiTool } from "react-icons/fi";
import ErrorBanner from "../../components/ErrorBanner/ErrorBanner.jsx";
import "./Dashboard.css";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentIncidents, setRecentIncidents] = useState([]);
    const [weeklyIncidents, setWeeklyIncidents] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.allSettled([
            getStatistiques(),
            getIncidents({ page: 0, size: 50 }) 
        ]).then(([statsResult, incidentsResult]) => {
            if (statsResult.status === "fulfilled") {
                setStats(statsResult.value.data);
            } else {
                setError("Erreur lors du chargement des statistiques.");
            }

            if (incidentsResult.status === "fulfilled") {
                const incidentsList = incidentsResult.value.data.content || incidentsResult.value.data || [];

                
                incidentsList.sort((a, b) => {
                    return new Date(b.dateDeclaration) - new Date(a.dateDeclaration);
                });

                setRecentIncidents(incidentsList.slice(0, 5)); 

                
                const counts = [0, 0, 0, 0, 0, 0, 0];
                incidentsList.forEach((inc) => {
                    if (inc.dateDeclaration) {
                        const day = new Date(inc.dateDeclaration).getDay();
                        
                        const index = day === 0 ? 6 : day - 1; 
                        counts[index] += 1;
                    }
                });
                setWeeklyIncidents(counts);
            } else {
                setError("Erreur lors du chargement des incidents.");
            }

            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="loading-text">Chargement du tableau de bord...</div>;
    }

    
    const doughnutData = {
        labels: ["Affectés", "En stock", "En panne"],
        datasets: [
            {
                data: [
                    stats?.equipementsAffectes || 0,
                    stats?.equipementsEnStock || 0,
                    stats?.equipementsEnPanne || 0,
                ],
                backgroundColor: ["#10b981", "#3b82f6", "#ef4444"],
                borderWidth: 0,
            },
        ],
    };

    const doughnutOptions = {
        cutout: "75%",
        plugins: { legend: { display: false } },
    };

    
    const lineData = {
        labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        datasets: [
            {
                label: "Incidents signalés",
                data: weeklyIncidents,
                borderColor: "#0b132b",
                backgroundColor: "#0b132b",
                tension: 0.4,
                pointRadius: 4,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
                grid: { borderDash: [4, 4] }
            },
        },
    };

    return (
        <div className="dashboard-container">
            <ErrorBanner type="error" message={error} />
            <div className="dashboard-header">
                <div>
                    <h2>Aperçu du système</h2>
                    <p>Surveillance en temps réel de l'infrastructure de votre organisation.</p>
                </div>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-icon icon-dark"><FiBox /></span>
                    </div>
                    <span className="kpi-title">Total des actifs</span>
                    <h3 className="kpi-value">{stats?.totalEquipements || 0}</h3>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-icon icon-green"><FiCheckCircle /></span>
                    </div>
                    <span className="kpi-title">Actifs affectés</span>
                    <h3 className="kpi-value">{stats?.equipementsAffectes || 0}</h3>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-icon icon-red"><FiAlertTriangle /></span>
                    </div>
                    <span className="kpi-title">En réparation</span>
                    <h3 className="kpi-value">{stats?.equipementsEnPanne || 0}</h3>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-icon icon-blue"><FiLayers /></span>
                    </div>
                    <span className="kpi-title">Stock disponible</span>
                    <h3 className="kpi-value">{stats?.equipementsEnStock || 0}</h3>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Statut des équipements</h3>
                    <div className="donut-wrapper">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                        <div className="donut-center-text">
                            <span className="number">{stats?.totalEquipements || 0}</span>
                            <span className="label">Total</span>
                        </div>
                    </div>
                    <div className="chart-legend">
                        <div className="legend-item"><span className="dot green"></span> Affectés <strong>{stats?.equipementsAffectes || 0}</strong></div>
                        <div className="legend-item"><span className="dot blue"></span> En stock <strong>{stats?.equipementsEnStock || 0}</strong></div>
                        <div className="legend-item"><span className="dot red"></span> En panne <strong>{stats?.equipementsEnPanne || 0}</strong></div>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-card-header">
                        <h3>Incidents récents</h3>
                        <span className="badge-live">● Surveillance en direct</span>
                    </div>
                    <div className="line-wrapper">
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>
            </div>

            <div className="dashboard-card">
                <div className="card-header">
                    <h3>Derniers incidents signalés</h3>
                </div>
                <div className="recent-incidents-list">
                    {recentIncidents.length === 0 ? (
                        <p className="no-data">Aucun incident enregistré.</p>
                    ) : (
                        recentIncidents.map((incident) => (
                            <div key={incident.id} className="incident-item">
                                <div className="incident-item-icon">
                                    <FiTool />
                                </div>
                                <div className="incident-item-details">
                                    <strong>{incident.equipementNom || incident.equipement?.nom || `Équipement #${incident.id}`}</strong>
                                    <p>
                                        Déclaré par {incident.declareParNom || incident.declarePar?.nom || "Employé"}
                                        {incident.dateDeclaration && ` • ${new Date(incident.dateDeclaration).toLocaleDateString()}`}
                                    </p>
                                </div>
                                <span className={`status-badge ${(incident.statut || "OUVERT").toLowerCase()}`}>
                                    {incident.statut}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;