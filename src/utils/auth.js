import { jwtDecode } from 'jwt-decode';

export function getRoleFromToken() {
    const token = localStorage.getItem('token');

    if (!token || token === 'undefined' || token === 'null') {
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        return decoded.role || null;
    } catch {
        return null;
    }
}

export function getEmailFromToken() {
    const token = localStorage.getItem('token');

    if (!token || token === 'undefined' || token === 'null') {
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        return decoded.sub || null;
    } catch {
        return null;
    }
}
