import { Building, CheckCircle, Eye as EyeIcon, EyeOff, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

const Register = () => {
    const navigate = useNavigate();
    const { setSession } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal Details
        fullName: 'Rupesh Varshney',
        email: 'rupeshvarshney7@gmail.com',
        phone: '1234567890',

        // Business Information
        companyName: 'Rupesh Traders',
        // businessType: '',
        // industry: '',

        // Account Credentials
        password: 'Rupesh@1234',
        confirmPassword: 'Rupesh@1234',

        // GST Information
        gstRegistered: true,
        gstin: '29AAAPL1234C1Z5',

        // Legal
        termsAccepted: false,
        privacyAccepted: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // const businessTypes = [
    //     { value: '', label: 'Select Business Type' },
    //     { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
    //     { value: 'partnership', label: 'Partnership' },
    //     { value: 'private_limited', label: 'Private Limited Company' },
    //     { value: 'public_limited', label: 'Public Limited Company' },
    //     { value: 'llp', label: 'Limited Liability Partnership' },
    //     { value: 'freelancer', label: 'Freelancer/Consultant' }
    // ];

    // const industries = [
    //     { value: '', label: 'Select Industry' },
    //     { value: 'technology', label: 'Technology' },
    //     { value: 'manufacturing', label: 'Manufacturing' },
    //     { value: 'retail', label: 'Retail' },
    //     { value: 'services', label: 'Professional Services' },
    //     { value: 'healthcare', label: 'Healthcare' },
    //     { value: 'education', label: 'Education' },
    //     { value: 'finance', label: 'Finance' },
    //     { value: 'real_estate', label: 'Real Estate' },
    //     { value: 'hospitality', label: 'Hospitality' },
    //     { value: 'other', label: 'Other' }
    // ];

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password?.length >= 8) strength += 25;
        if (password?.match(/[a-z]/)) strength += 25;
        if (password?.match(/[A-Z]/)) strength += 25;
        if (password?.match(/[0-9]/)) strength += 15;
        if (password?.match(/[^a-zA-Z0-9]/)) strength += 10;
        return Math.min(strength, 100);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e?.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Calculate password strength
        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        // Clear error when user starts typing
        if (errors?.[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData?.fullName?.trim()) newErrors.fullName = 'Full name is required';
            if (!formData?.email?.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
            if (!formData?.phone?.trim()) {
                newErrors.phone = 'Phone number is required';
            } else if (!/^\+?[\d\s-()]{10,}$/?.test(formData?.phone)) {
                newErrors.phone = 'Please enter a valid phone number';
            }
        }

        if (step === 2) {
            if (!formData?.companyName?.trim()) newErrors.companyName = 'Company name is required';
            // if (!formData?.businessType) newErrors.businessType = 'Business type is required';
            // if (!formData?.industry) newErrors.industry = 'Industry is required';

            if (formData?.gstRegistered && !formData?.gstin?.trim()) {
                newErrors.gstin = 'GSTIN is required for GST registered businesses';
            } else if (formData?.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/?.test(formData?.gstin)) {
                newErrors.gstin = 'Please enter a valid GSTIN format';
            }
        }

        if (step === 3) {
            if (!formData?.password) {
                newErrors.password = 'Password is required';
            } else if (formData?.password?.length < 8) {
                newErrors.password = 'Password must be at least 8 characters';
            }

            if (formData?.password !== formData?.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }

            if (!formData?.termsAccepted) {
                newErrors.termsAccepted = 'You must accept the terms of service';
            }

            if (!formData?.privacyAccepted) {
                newErrors.privacyAccepted = 'You must accept the privacy policy';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors)?.length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();

        if (!validateStep(3)) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData?.email,
                password: formData?.password,
                options: {
                    data: {
                        fullName: formData?.fullName,
                        phone: formData?.phone,
                        companyName: formData?.companyName,
                        gstRegistered: formData?.gstRegistered,
                        gstin: formData?.gstin
                    }
                }
            })

            console.log(data, error)
            if (data.session) {
                setSession(data.session);
                navigate("/dashboard", { replace: true });
            }
            else {
                // If email confirmation is ON, session will be null
                alert("Please check your email to confirm your account.");
            }
        } catch (error) {
            setErrors({ general: 'Registration failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 40) return 'bg-red-500';
        if (passwordStrength < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength < 40) return 'Weak';
        if (passwordStrength < 70) return 'Medium';
        return 'Strong';
    };

    const renderProgressIndicator = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                {[1, 2, 3]?.map((step) => (
                    <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 p-4 rounded-full flex items-center justify-center text-sm font-medium ${step === currentStep ? 'bg-indigo-600 text-white' :
                            step < currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                            {step < currentStep ? <CheckCircle className="h-4 w-4 text-white" /> : step}
                        </div>
                        {step < 3 && (
                            <div className={`w-full h-1 mx-4 ${step < currentStep ? 'bg-green-500 text-white' : 'bg-gray-200'
                                }`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Step {currentStep} of 3: {
                        currentStep === 1 ? 'Personal Details' :
                            currentStep === 2 ? 'Business Information' : 'Account Setup'
                    }
                </p>
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>

            <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name *
                </label>
                <div className="relative">
                    <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData?.fullName}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors?.fullName ? 'border-red-300' : ''}`}
                        placeholder="Enter your full name"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {errors?.fullName && <p className="text-red-500 text-xs mt-1">{errors?.fullName}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                </label>
                <div className="relative">
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData?.email}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors?.email ? 'border-red-300' : ''}`}
                        placeholder="Enter your email address"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {errors?.email && <p className="text-red-500 text-xs mt-1">{errors?.email}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number *
                </label>
                <div className="relative">
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData?.phone}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors?.phone ? 'border-red-300' : ''}`}
                        placeholder="Enter your phone number"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {errors?.phone && <p className="text-red-500 text-xs mt-1">{errors?.phone}</p>}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>

            <div className="space-y-2">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name *
                </label>
                <div className="relative">
                    <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData?.companyName}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors?.companyName ? 'border-red-300' : ''}`}
                        placeholder="Enter your company name"
                    />
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {errors?.companyName && <p className="text-red-500 text-xs mt-1">{errors?.companyName}</p>}
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                        Business Type *
                    </label>
                    <Select
                        id="businessType"
                        name="businessType"
                        value={formData?.businessType}
                        onChange={handleInputChange}
                        className={errors?.businessType ? 'border-red-300' : ''}
                        options={businessTypes}
                    />
                    {errors?.businessType && <p className="text-red-500 text-xs mt-1">{errors?.businessType}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                        Industry *
                    </label>
                    <Select
                        id="industry"
                        name="industry"
                        value={formData?.industry}
                        onChange={handleInputChange}
                        className={errors?.industry ? 'border-red-300' : ''}
                        options={industries}
                    />
                    {errors?.industry && <p className="text-red-500 text-xs mt-1">{errors?.industry}</p>}
                </div>
            </div> */}

            {/* GST Section */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-3">GST Registration</h4>

                <div className="flex items-center mb-4">
                    <Checkbox
                        id="gstRegistered"
                        name="gstRegistered"
                        checked={formData?.gstRegistered}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="gstRegistered" className="ml-2 text-sm text-gray-700">
                        My business is GST registered
                    </label>
                </div>

                {formData?.gstRegistered && (
                    <div className="space-y-2">
                        <label htmlFor="gstin" className="block text-sm font-medium text-gray-700">
                            GSTIN *
                        </label>
                        <Input
                            id="gstin"
                            name="gstin"
                            type="text"
                            value={formData?.gstin}
                            onChange={handleInputChange}
                            className={errors?.gstin ? 'border-red-300' : ''}
                            placeholder="e.g., 29AAAPL1234C1Z5"
                            maxLength={15}
                        />
                        <p className="text-xs text-gray-500">
                            Format: 15 characters (2 digits + 10 characters + 1 digit + 1 character + 1 character) - e.g. 29AAAPL1234C1Z5
                        </p>
                        {errors?.gstin && <p className="text-red-500 text-xs mt-1">{errors?.gstin}</p>}
                    </div>
                )}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Setup</h3>

            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                </label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData?.password}
                        onChange={handleInputChange}
                        className={`pr-10 ${errors?.password ? 'border-red-300' : ''}`}
                        placeholder="Create a strong password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                </div>

                {formData?.password && (
                    <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">Password strength</span>
                            <span className={`font-medium ${passwordStrength < 40 ? 'text-red-500' :
                                passwordStrength < 70 ? 'text-yellow-500' : 'text-green-500'
                                }`}>
                                {getPasswordStrengthText()}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                                className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                style={{ width: `${passwordStrength}%` }}
                            />
                        </div>
                    </div>
                )}
                {errors?.password && <p className="text-red-500 text-xs mt-1">{errors?.password}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                </label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData?.confirmPassword}
                        onChange={handleInputChange}
                        className={`pr-10 ${errors?.confirmPassword ? 'border-red-300' : ''}`}
                        placeholder="Confirm your password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                </div>
                {errors?.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors?.confirmPassword}</p>}
            </div>

            {/* Legal Agreements */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900">Legal Agreements</h4>

                <div className="space-y-3">
                    <div className="flex items-start">
                        <Checkbox
                            id="termsAccepted"
                            name="termsAccepted"
                            checked={formData?.termsAccepted}
                            onChange={handleInputChange}
                            className="mt-1"
                        />
                        <label htmlFor="termsAccepted" className="ml-2 text-sm text-gray-700">
                            I agree to the{' '}
                            <Link to="/terms" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                Terms of Service
                            </Link>{' '}
                            and understand the service offerings *
                        </label>
                    </div>
                    {errors?.termsAccepted && <p className="text-red-500 text-xs ml-6">{errors?.termsAccepted}</p>}

                    <div className="flex items-start">
                        <Checkbox
                            id="privacyAccepted"
                            name="privacyAccepted"
                            checked={formData?.privacyAccepted}
                            onChange={handleInputChange}
                            className="mt-1"
                        />
                        <label htmlFor="privacyAccepted" className="ml-2 text-sm text-gray-700">
                            I agree to the{' '}
                            <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                Privacy Policy
                            </Link>{' '}
                            and data processing practices *
                        </label>
                    </div>
                    {errors?.privacyAccepted && <p className="text-red-500 text-xs ml-6">{errors?.privacyAccepted}</p>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                        <User className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Join InvoicePro</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create your business account and start managing invoices professionally
                    </p>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {renderProgressIndicator()}

                    <form onSubmit={handleSubmit}>
                        {errors?.general && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                                {errors?.general}
                            </div>
                        )}

                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                            {currentStep > 1 && (
                                <Button
                                    type="button"
                                    onClick={handlePrevious}
                                    variant="outline"
                                    className="px-6"
                                >
                                    Previous
                                </Button>
                            )}

                            <div className="flex-1" />

                            {currentStep < 3 ? (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-8 bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating Account...
                                        </div>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;