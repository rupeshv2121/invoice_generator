import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

const OAuthCallback = () => {
    const navigate = useNavigate();
    const { setSession } = useAuth();

    useEffect(() => {
        const handle = async () => {
            const { data } = await supabase.auth.getSession();
            if (data?.session) {
                setSession(data.session);
                navigate("/dashboard");
            } else {
                navigate("/login");
            }
        };

        handle();
    }, []);

    return <div>Loading...</div>;
};

export default OAuthCallback;
