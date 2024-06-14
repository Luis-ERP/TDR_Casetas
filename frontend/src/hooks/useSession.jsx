import { useState, useEffect } from "react";
import { login as loginAPI } from "../client/auth";

export default function useSession() {
    const [token, setToken] = useState(null);

    const login = async (username, password) => {
        const token = await loginAPI(username, password);
        localStorage.setItem('televia_token', token);
    };

    const logout = () => {
        localStorage.removeItem('televia_token');
        window.location.reload();
    };

    const isAuthenticated = () => {
        const token = localStorage.getItem('televia_token', null);
        return token !== null;
    };

    return { login, logout, isAuthenticated };
}
