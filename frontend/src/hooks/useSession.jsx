import { useState, useEffect } from "react";
import { login as loginAPI } from "../client/auth";

export default function useSession() {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token, user) => {
        loginAPI();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return { token, user, loading, login, logout };
}
