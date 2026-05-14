"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface User {
    id: number;
    email: string;
    name: string;
    picture: string;
    googleUserId: string;
    credits: string;
    score: string;
    type: string;
    plan: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoaded: boolean;
    isLoggingIn: boolean;
    login: () => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_API_BASE_URL = "https://api.connectthedotsprintable.online";
const GOOGLE_CLIENT_ID = "310385587632-5ibeugvo20btim20lif0fopi442ge90h.apps.googleusercontent.com";
const BACKEND_REDIRECT_URI = `${AUTH_API_BASE_URL}/prod-api/g/callback`;
const APP_TYPE = "content";

function normalizeUser(rawUser: User): User {
    return {
        ...rawUser,
        credits: String(rawUser.credits ?? "0"),
        score: String(rawUser.score ?? "0"),
        type: String(rawUser.type ?? "6"),
        plan: rawUser.plan || "free",
    };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const persistUser = useCallback((nextUser: User) => {
        const normalized = normalizeUser(nextUser);
        setUser(normalized);
        localStorage.setItem("app_user", JSON.stringify(normalized));
    }, []);

    const clearAuth = useCallback(() => {
        setUser(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("app_user");
    }, []);

    const fetchLatestUser = useCallback(async (token: string) => {
        const res = await fetch(`${AUTH_API_BASE_URL}/prod-api/g/getUser?type=6`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-App-Type": APP_TYPE,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to refresh user");
        }

        const data = await res.json();
        const dbUser = data?.data;
        if (!dbUser) {
            throw new Error("User data not found");
        }

        persistUser(dbUser);
    }, [persistUser]);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        try {
            await fetchLatestUser(token);
        } catch (error) {
            console.error("Silent refresh failed", error);
            clearAuth();
        }
    }, [clearAuth, fetchLatestUser]);

    const reloadFromLocalStorage = useCallback(() => {
        const savedUser = localStorage.getItem("app_user");
        if (!savedUser) return;

        try {
            persistUser(JSON.parse(savedUser));
        } catch {
            localStorage.removeItem("app_user");
        }
    }, [persistUser]);

    useEffect(() => {
        const initialize = async () => {
            const savedToken = localStorage.getItem("auth_token");
            const savedUser = localStorage.getItem("app_user");

            if (savedToken && savedUser) {
                try {
                    setUser(normalizeUser(JSON.parse(savedUser)));
                } catch {
                    clearAuth();
                }
            }

            if (savedToken) {
                await refreshUser();
            }

            setIsLoaded(true);
        };

        initialize();
        window.addEventListener("auth-updated", reloadFromLocalStorage);

        return () => {
            window.removeEventListener("auth-updated", reloadFromLocalStorage);
        };
    }, [clearAuth, refreshUser, reloadFromLocalStorage]);

    const login = useCallback(() => {
        const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        const state = `${Date.now()}_${APP_TYPE}`;
        const params = new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: BACKEND_REDIRECT_URI,
            response_type: "code",
            scope: "openid email profile",
            prompt: "select_account",
            state,
        });

        const width = 600;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        setIsLoggingIn(true);

        let cleanup = () => {
            setIsLoggingIn(false);
        };

        const handleMessage = async (event: MessageEvent) => {
            if (event.origin !== AUTH_API_BASE_URL) return;

            try {
                const payload = typeof event.data?.token === "string"
                    ? JSON.parse(event.data.token)
                    : event.data;
                const { user: nextUser, token: jwtToken } = payload || {};

                if (!nextUser || !jwtToken) return;

                localStorage.setItem("auth_token", jwtToken);
                await fetchLatestUser(jwtToken).catch(() => persistUser(nextUser));
                cleanup();
            } catch (error) {
                console.error("Login parsing error:", error);
                cleanup();
            }
        };

        window.addEventListener("message", handleMessage);

        const popup = window.open(
            `${googleAuthUrl}?${params.toString()}`,
            "GoogleLogin",
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
            window.removeEventListener("message", handleMessage);
            setIsLoggingIn(false);
            return;
        }

        const closeTimer = window.setInterval(() => {
            if (popup.closed) cleanup();
        }, 500);

        cleanup = () => {
            window.removeEventListener("message", handleMessage);
            window.clearInterval(closeTimer);
            setIsLoggingIn(false);
        };
    }, [fetchLatestUser, persistUser]);

    const logout = useCallback(() => {
        clearAuth();
    }, [clearAuth]);

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            isLoaded,
            isLoggingIn,
            login,
            logout,
            refreshUser,
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
