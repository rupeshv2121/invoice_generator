import { Building2, CreditCard, MapPin, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMyCompanyService } from '../../api/myCompany';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Setup = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { createCompany, getMyCompany } = useMyCompanyService();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        // Company Details
        fullName: '',
        companyName: '',
        phone: '',
        email: '',
        website: '',

        // Address
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',

        // GST & Compliance
        gstRegistered: false,
        gstin: '',
        pan: '',
        arn: '',
        iecCode: '',

        // Bank Details
        bankName: '',
        bankAccountNumber: '',
        bankIfscCode: '',
        bankBranch: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        checkExistingProfile();
    }, []);

    const checkExistingProfile = async () => {
        try {
            const profile = await getMyCompany();
            if (profile && profile.id) {
                // Profile already exists, redirect to dashboard
                navigate('/dashboard', { replace: true });
            } else {
                // Pre-fill with user metadata if available
                if (user?.user_metadata) {
                    setFormData(prev => ({
                        ...prev,
                        fullName: user.user_metadata.fullName || '',
                        companyName: user.user_metadata.companyName || '',
                        phone: user.user_metadata.phone || '',
                        email: user.email || '',
                        gstRegistered: user.user_metadata.gstRegistered || false,
                        gstin: user.user_metadata.gstin || ''
                    }));
                }
            }
        } catch (error) {
            console.error('Error checking profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
            if (!formData.companyName?.trim()) newErrors.companyName = 'Company name is required';
            if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
            if (!formData.email?.trim()) newErrors.email = 'Email is required';
        }

        if (step === 2) {
            if (!formData.address?.trim()) newErrors.address = 'Address is required';
            if (!formData.city?.trim()) newErrors.city = 'City is required';
            if (!formData.state?.trim()) newErrors.state = 'State is required';
            if (!formData.pincode?.trim()) newErrors.pincode = 'Pincode is required';
        }

        if (step === 3) {
            if (formData.gstRegistered && !formData.gstin?.trim()) {
                newErrors.gstin = 'GSTIN is required for GST registered businesses';
            }
            if (formData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) {
                newErrors.gstin = 'Please enter a valid GSTIN format';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSkip = () => {
        if (currentStep === 4) {
            // Skip bank details
            handleFinish();
        }
    };

    const handleFinish = async () => {
        // Validate all required steps before submitting
        if (!validateStep(1) || !validateStep(2)) {
            alert('Please complete all required fields in previous steps');
            return;
        }

        if (currentStep === 3 && !validateStep(3)) {
            return;
        }

        setSaving(true);
        try {
            const profileData = {
                fullName: formData.fullName.trim(),
                companyName: formData.companyName.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                website: formData.website?.trim() || '',
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                pincode: formData.pincode.trim(),
                country: formData.country || 'India',
                gstRegistered: formData.gstRegistered,
                gstin: formData.gstin?.trim() || '',
                pan: formData.pan?.trim() || '',
                arn: formData.arn?.trim() || '',
                iecCode: formData.iecCode?.trim() || '',
                bankName: formData.bankName?.trim() || '',
                bankAccountNumber: formData.bankAccountNumber?.trim() || '',
                bankIfscCode: formData.bankIfscCode?.trim() || '',
                bankBranch: formData.bankBranch?.trim() || ''
            };

            console.log('Creating company profile with data:', profileData);
            const result = await createCompany(profileData);
            console.log('Company profile created successfully:', result);
            navigate('/dashboard', { replace: true });
        } catch (error) {
            console.error('Error creating profile:', error);
            console.error('Error response:', error.response?.data);
            
            const errorMessage = error.response?.data?.details 
                ? `Validation error: ${JSON.stringify(error.response.data.details)}`
                : error.response?.data?.error 
                ? error.response.data.error
                : 'Failed to create company profile. Please try again.';
            
            alert(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const renderProgressBar = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                            step === currentStep
                                ? 'bg-indigo-600 text-white'
                                : step < currentStep
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                        }`}>
                            {step < currentStep ? '✓' : step}
                        </div>
                        {step < 4 && (
                            <div className={`flex-1 h-1 mx-2 ${
                                step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Company</span>
                <span>Address</span>
                <span>GST/Tax</span>
                <span>Bank</span>
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <Building2 className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                <h3 className="text-xl font-semibold text-gray-900">Company Information</h3>
                <p className="text-sm text-gray-600">Let's start with your business details</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                    />
                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 1234567890"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="company@example.com"
                            type="email"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website <span className="text-gray-400">(Optional)</span>
                    </label>
                    <Input
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://www.example.com"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <MapPin className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                <h3 className="text-xl font-semibold text-gray-900">Business Address</h3>
                <p className="text-sm text-gray-600">Where is your business located?</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street address"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="State"
                        />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="123456"
                        />
                        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="India"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                <h3 className="text-xl font-semibold text-gray-900">GST & Compliance</h3>
                <p className="text-sm text-gray-600">Tax registration details</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="gstRegistered"
                        checked={formData.gstRegistered}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                        GST Registered Business
                    </label>
                </div>

                {formData.gstRegistered && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            GSTIN <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="gstin"
                            value={formData.gstin}
                            onChange={handleInputChange}
                            placeholder="22AAAAA0000A1Z5"
                            maxLength={15}
                        />
                        {errors.gstin && <p className="text-red-500 text-xs mt-1">{errors.gstin}</p>}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        PAN Number <span className="text-gray-400">(Optional)</span>
                    </label>
                    <Input
                        name="pan"
                        value={formData.pan}
                        onChange={handleInputChange}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ARN <span className="text-gray-400">(Optional)</span>
                        </label>
                        <Input
                            name="arn"
                            value={formData.arn}
                            onChange={handleInputChange}
                            placeholder="ARN Number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            IEC Code <span className="text-gray-400">(Optional)</span>
                        </label>
                        <Input
                            name="iecCode"
                            value={formData.iecCode}
                            onChange={handleInputChange}
                            placeholder="IEC Code"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <CreditCard className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                <h3 className="text-xl font-semibold text-gray-900">Bank Details</h3>
                <p className="text-sm text-gray-600">For invoice payments (you can skip this)</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name
                    </label>
                    <Input
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        placeholder="State Bank of India"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number
                    </label>
                    <Input
                        name="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={handleInputChange}
                        placeholder="1234567890"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            IFSC Code
                        </label>
                        <Input
                            name="bankIfscCode"
                            value={formData.bankIfscCode}
                            onChange={handleInputChange}
                            placeholder="SBIN0001234"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Branch Name
                        </label>
                        <Input
                            name="bankBranch"
                            value={formData.bankBranch}
                            onChange={handleInputChange}
                            placeholder="Main Branch"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
                    <p className="text-gray-600">Let's set up your business for invoicing</p>
                </div>

                {renderProgressBar()}

                <div className="mb-8">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                </div>

                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1 || saving}
                    >
                        Previous
                    </Button>

                    <div className="flex gap-2">
                        {currentStep === 4 && (
                            <Button
                                variant="ghost"
                                onClick={handleSkip}
                                disabled={saving}
                            >
                                Skip
                            </Button>
                        )}
                        
                        {currentStep < 4 ? (
                            <Button onClick={handleNext}>
                                Next
                            </Button>
                        ) : (
                            <Button onClick={handleFinish} disabled={saving}>
                                {saving ? 'Saving...' : 'Finish Setup'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setup;
