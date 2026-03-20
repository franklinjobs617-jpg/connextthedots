"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
    id: number;
    email: string;
    name: string;
    picture: string;
    googleUserId: string;
    credits: string;
    score: string;
    type: string; // 站点 ID (例如 "6")
    plan: string; // ★ 会员等级 (例如 "free", "premium", "pro")
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [tokenClient, setTokenClient] = useState<any>(null);

    // --- 1. 同步用户到数据库 (登录/SDK回调专用) ---
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

    // --- 2. 核心：请求后端获取最新数据 (静默刷新) ---
    const fetchLatestUser = useCallback(async (token: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken: token })
            });

            if (res.ok) {
                const data = await res.json();
                const dbUser = data.user;

                setUser(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(dbUser)) {
                        console.log("User data refreshed from DB/API");
                        localStorage.setItem("app_user", JSON.stringify(dbUser));
                        return dbUser;
                    }
                    return prev;
                });
            }
        } catch (e) {
            console.error("Silent refresh failed", e);
        }
    }, []);

    // --- 3. 封装给外部调用的手动刷新方法 ---
    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            await fetchLatestUser(token);
        }
    }, [fetchLatestUser]);

    const reloadFromLocalStorage = useCallback(() => {
        const savedUser = localStorage.getItem("app_user");
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
                        return parsed;
                    }
                    return prev;
                });
            } catch (e) {
                console.error("Parse local user failed");
            }
        }
    }, []);

    // --- 5. 初始化与事件监听 ---
    useEffect(() => {
        const initialize = async () => {
            const savedToken = localStorage.getItem("auth_token");
            const savedUser = localStorage.getItem("app_user");

            // A. 优先显示本地缓存
            if (savedToken && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    localStorage.removeItem("auth_token");
                }
            }

            // B. 后台发起网络请求，获取最新状态
            if (savedToken) {
                await fetchLatestUser(savedToken);
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

        window.addEventListener('auth-updated', reloadFromLocalStorage);

        return () => {
            window.removeEventListener('auth-updated', reloadFromLocalStorage);
        };
    }, [syncUserToDatabase, fetchLatestUser, reloadFromLocalStorage]);

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