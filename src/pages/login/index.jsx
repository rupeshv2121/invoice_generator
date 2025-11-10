import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMyCompanyService } from '../../api/myCompany';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

const Login = () => {
    const navigate = useNavigate();
    const { session, setSession, loading } = useAuth();
    const { getMyCompany } = useMyCompanyService();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        if (!e || !e.target) return;
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors?.[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData?.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData?.password) {
            newErrors.password = 'Password is required';
        } else if (formData?.password?.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors)?.length === 0;
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // Sign in with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                setErrors({ general: error.message });
                return;
            }

            setSession(data.session);

            if (data?.user) {
                console.log('Login success:', data.user);

                // Optional: store session in localStorage
                localStorage.setItem('supabaseSession', JSON.stringify(data.session));

                // Check if user has completed company profile setup
                try {
                    const companyProfile = await getMyCompany();
                    
                    if (companyProfile && companyProfile.id) {
                        // User has completed setup, go to dashboard
                        navigate('/dashboard', { replace: true });
                    } else {
                        // User hasn't completed setup, redirect to setup wizard
                        navigate('/setup', { replace: true });
                    }
                } catch (error) {
                    // If error checking profile, assume setup not complete
                    console.error('Error checking company profile:', error);
                    navigate('/setup', { replace: true });
                }
            } else {
                setErrors({ general: 'Login failed. Please check your credentials.' });
            }
        } catch (err) {
            console.error(err);
            setErrors({ general: 'Something went wrong. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin + '/dashboard', // your frontend page
            },
        });
        if (error) console.error('Google login error:', error);
    };

    useEffect(() => {
        const checkSessionAndProfile = async () => {
            if (session) {
                try {
                    const companyProfile = await getMyCompany();
                    
                    if (companyProfile && companyProfile.id) {
                        navigate("/dashboard", { replace: true });
                    } else {
                        navigate("/setup", { replace: true });
                    }
                } catch (error) {
                    console.error('Error checking company profile:', error);
                    navigate("/setup", { replace: true });
                }
            }
        };
        
        checkSessionAndProfile();
    }, [session]);
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                        <User className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Welcome to InvoicePro</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access your invoice management dashboard
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors?.general && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {errors?.general}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData?.email}
                                    onChange={handleInputChange}
                                    className={`pl-10 ${errors?.email ? 'border-red-300 focus:border-red-500' : ''}`}
                                    placeholder="Enter your email"
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                            {errors?.email && <p className="text-red-500 text-xs mt-1">{errors?.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData?.password}
                                    onChange={handleInputChange}
                                    className={`pl-10 pr-10 ${errors?.password ? 'border-red-300 focus:border-red-500' : ''}`}
                                    placeholder="Enter your password"
                                />
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors?.password && <p className="text-red-500 text-xs mt-1">{errors?.password}</p>}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Checkbox
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={formData?.rememberMe}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                                    Remember me
                                </label>
                            </div>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        {/* Social Login */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleSocialLogin('google')}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="ml-2">Google</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleSocialLogin('microsoft')}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
                                    </svg>
                                    <span className="ml-2">Microsoft</span>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            New to InvoicePro?{' '}
                            <Link
                                to="/register"
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                Create your account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;