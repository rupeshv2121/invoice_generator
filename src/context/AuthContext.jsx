import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data?.session ?? null);
            setToken(data?.session?.access_token ?? null);
            setLoading(false);
        };

        fetchSession();

        // Listen for login/logout events
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setToken(session?.access_token ?? null);
            setLoading(false);
            if (event === 'SIGNED_IN') {
                navigate('/dashboard', { replace: true });
            }

            // On logout, optionally redirect to login
            if (event === 'SIGNED_OUT') {
                navigate('/login', { replace: true });
            }
        });

        return () => listener?.subscription?.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSession(data.session);
        setToken(data.session?.access_token ?? null);
        return data;
    };

    const register = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSession(data.session);
        setToken(data.session?.access_token ?? null);
        return data;
    };

    const loginWithProvider = async (provider) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.origin + '/dashboard' }
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setToken(null);
    };

    useEffect(() => {
        if (session?.access_token) {
            localStorage.setItem("access_token", session.access_token);
        } else {
            localStorage.removeItem("access_token");
        }
    }, [session]);

    return (
        <AuthContext.Provider
            value={{ session, token, user: session?.user, loading, setSession, login, register, loginWithProvider, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
