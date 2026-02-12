"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
    id: number;
    email: string;
    name: string;
    picture: string;
    googleUserId: string;
    credits: string; // 对应你 Schema 中的 credits
    score: string;   // 对应你 Schema 中的 score
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoaded: boolean;
    isLoggingIn: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [tokenClient, setTokenClient] = useState<any>(null);

    // --- 1. 同步用户到数据库 ---
    const syncUserToDatabase = useCallback(async (accessToken: string) => {
        setIsLoggingIn(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken })
            });

            if (res.ok) {
                const data = await res.json();
                const dbUser = data.user;
                setUser(dbUser);
                localStorage.setItem("auth_token", accessToken);
                localStorage.setItem("app_user", JSON.stringify(dbUser));
            }
        } catch (e) {
            console.error("Database sync failed", e);
        } finally {
            setIsLoggingIn(false);
        }
    }, []);

    // --- 2. 初始化逻辑 ---
    useEffect(() => {
        const initialize = () => {
            const savedToken = localStorage.getItem("auth_token");
            const savedUser = localStorage.getItem("app_user");

            if (savedToken && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    localStorage.removeItem("auth_token");
                }
            }
            setIsLoaded(true);
        };

        const loadGoogleSDK = () => {
            const google = (window as any).google;
            if (google?.accounts?.oauth2) {
                const client = google.accounts.oauth2.initTokenClient({
                    client_id: "131343215251-vaqu6k4mrbd3k95uoc9l7419jc2m173v.apps.googleusercontent.com",

                    scope: "openid profile email",
                    callback: (tokenResponse: any) => {
                        if (tokenResponse?.access_token) {
                            syncUserToDatabase(tokenResponse.access_token);
                        }
                    },
                });
                setTokenClient(client);
            } else {
                setTimeout(loadGoogleSDK, 300);
            }
        };

        initialize();
        loadGoogleSDK();
    }, [syncUserToDatabase]);

    const login = () => {
        if (tokenClient) tokenClient.requestAccessToken();
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("app_user");
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            isLoaded,
            isLoggingIn,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};