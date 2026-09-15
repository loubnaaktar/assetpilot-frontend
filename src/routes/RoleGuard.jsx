import AccesRefuse from "../pages/AccesRefuse/AccesRefuse.jsx";
import { getRoleFromToken } from "../utils/auth.js";

export default function RoleGuard({ children, roles }) {

    const role = getRoleFromToken();

    if (!role || !roles.includes(role)) {
        return <AccesRefuse />;
    }

    return children;
}