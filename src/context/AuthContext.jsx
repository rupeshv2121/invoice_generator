import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ track loading
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data?.session ?? null);
            setLoading(false); // ✅ done checking
        };

        fetchSession();

        // Listen to login/logout changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
            if (session) navigate('/dashboard', { replace: true }); // auto redirect if logged in
        });

        return () => listener?.subscription?.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSession(data.session);
        return data;
    };

    const register = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSession(data.session);
        return data;
    };

    const loginWithProvider = async (provider) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin + '/dashboard'
            }
        });
        if (error) throw error;
        return data; // user will be redirected
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{ session, loading, setSession, login, register, loginWithProvider, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
