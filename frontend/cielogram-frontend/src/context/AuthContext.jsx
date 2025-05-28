import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar usuario desde el token al iniciar
    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            try {
                setUser(jwtDecode(token));
            } catch {
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    // Login: guarda el token y usuario
    const login = (access, refresh) => {
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        setUser(jwtDecode(access));
    };

    // Logout: borra el token y usuario
    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
    };

    // Refrescar usuario desde el token actual
    const refreshUser = () => {
        const token = localStorage.getItem("access");
        if (token) {
            setUser(jwtDecode(token));
        } else {
            setUser(null);
        }
    };

    if (loading) return null; // Espera a que termine de cargar el usuario

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
