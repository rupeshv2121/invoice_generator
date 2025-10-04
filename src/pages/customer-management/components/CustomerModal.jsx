import { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CustomerModal = ({
    isOpen,
    onClose,
    customer,
    onSave,
    mode = 'add' // 'add', 'edit', 'view'
}) => {
    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        email: '',
        phone: '',
        gstNumber: '',
        customerType: 'Business',
        billingAddress: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
        },
        shippingAddress: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India',
            sameAsBilling: true
        },
        bankDetails: {
            accountName: '',
            accountNumber: '',
            ifscCode: '',
            bankName: ''
        }
    });

    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        if (customer && mode !== 'add') {
            setFormData({
                businessName: customer?.businessName || '',
                contactPerson: customer?.contactPerson || '',
                email: customer?.email || '',
                phone: customer?.phone || '',
                gstNumber: customer?.gstNumber || '',
                customerType: customer?.customerType || 'Business',
                billingAddress: customer?.billingAddress || {
                    street: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: 'India'
                },
                shippingAddress: customer?.shippingAddress || {
                    street: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: 'India',
                    sameAsBilling: true
                },
                bankDetails: customer?.bankDetails || {
                    accountName: '',
                    accountNumber: '',
                    ifscCode: '',
                    bankName: ''
                }
            });
        } else if (mode === 'add') {
            setFormData({
                businessName: '',
                contactPerson: '',
                email: '',
                phone: '',
                gstNumber: '',
                customerType: 'Business',
                billingAddress: {
                    street: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: 'India'
                },
                shippingAddress: {
                    street: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: 'India',
                    sameAsBilling: true
                },
                bankDetails: {
                    accountName: '',
                    accountNumber: '',
                    ifscCode: '',
                    bankName: ''
                }
            });
        }
    }, [customer, mode]);

    const customerTypeOptions = [
        { value: 'Business', label: 'Business' },
        { value: 'Individual', label: 'Individual' },
        { value: 'Freelancer', label: 'Freelancer' },
        { value: 'Government', label: 'Government' },
        { value: 'Non-Profit', label: 'Non-Profit' }
    ];

    const indianStates = [
        { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
        { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
        { value: 'Assam', label: 'Assam' },
        { value: 'Bihar', label: 'Bihar' },
        { value: 'Chhattisgarh', label: 'Chhattisgarh' },
        { value: 'Goa', label: 'Goa' },
        { value: 'Gujarat', label: 'Gujarat' },
        { value: 'Haryana', label: 'Haryana' },
        { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
        { value: 'Jharkhand', label: 'Jharkhand' },
        { value: 'Karnataka', label: 'Karnataka' },
        { value: 'Kerala', label: 'Kerala' },
        { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
        { value: 'Maharashtra', label: 'Maharashtra' },
        { value: 'Manipur', label: 'Manipur' },
        { value: 'Meghalaya', label: 'Meghalaya' },
        { value: 'Mizoram', label: 'Mizoram' },
        { value: 'Nagaland', label: 'Nagaland' },
        { value: 'Odisha', label: 'Odisha' },
        { value: 'Punjab', label: 'Punjab' },
        { value: 'Rajasthan', label: 'Rajasthan' },
        { value: 'Sikkim', label: 'Sikkim' },
        { value: 'Tamil Nadu', label: 'Tamil Nadu' },
        { value: 'Telangana', label: 'Telangana' },
        { value: 'Tripura', label: 'Tripura' },
        { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
        { value: 'Uttarakhand', label: 'Uttarakhand' },
        { value: 'West Bengal', label: 'West Bengal' },
        { value: 'Delhi', label: 'Delhi' }
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData?.businessName?.trim()) {
            newErrors.businessName = 'Business name is required';
        }

        if (!formData?.contactPerson?.trim()) {
            newErrors.contactPerson = 'Contact person is required';
        }

        if (!formData?.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData?.phone?.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/?.test(formData?.phone?.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (formData?.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/?.test(formData?.gstNumber)) {
            newErrors.gstNumber = 'Invalid GST number format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors)?.length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors?.[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleAddressChange = (addressType, field, value) => {
        setFormData(prev => ({
            ...prev,
            [addressType]: {
                ...prev?.[addressType],
                [field]: value
            }
        }));
    };

    const handleBankDetailsChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            bankDetails: {
                ...prev?.bankDetails,
                [field]: value
            }
        }));
    };

    const handleSameAsBillingChange = (checked) => {
        setFormData(prev => ({
            ...prev,
            shippingAddress: {
                ...prev?.shippingAddress,
                sameAsBilling: checked,
                ...(checked ? {
                    street: prev?.billingAddress?.street,
                    city: prev?.billingAddress?.city,
                    state: prev?.billingAddress?.state,
                    pincode: prev?.billingAddress?.pincode,
                    country: prev?.billingAddress?.country
                } : {})
            }
        }));
    };

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: 'User' },
        { id: 'billing', label: 'Billing Address', icon: 'MapPin' },
        { id: 'shipping', label: 'Shipping Address', icon: 'Truck' },
        { id: 'bank', label: 'Bank Details', icon: 'CreditCard' }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">
                        {mode === 'add' ? 'Add New Customer' : mode === 'edit' ? 'Edit Customer' : 'Customer Details'}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        iconName="X"
                        iconSize={20}
                    >
                        <span className="sr-only">Close</span>
                    </Button>
                </div>

                {/* Tabs */}
                <div className="border-b border-border">
                    <div className="flex space-x-0 overflow-x-auto">
                        {tabs?.map((tab) => (
                            <button
                                key={tab?.id}
                                onClick={() => setActiveTab(tab?.id)}
                                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab?.id
                                    ? 'border-blue-600 text-black bg-gray-100' : 'border-transparent text-black hover:text-foreground '
                                    }`}
                            >
                                <Icon name={tab?.icon} size={16} />
                                <span>{tab?.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <form onSubmit={handleSubmit}>
                        {/* Basic Info Tab */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Business Name"
                                        type="text"
                                        value={formData?.businessName}
                                        onChange={(e) => handleInputChange('businessName', e?.target?.value)}
                                        error={errors?.businessName}
                                        required
                                        disabled={mode === 'view'}
                                    />

                                    <Input
                                        label="Contact Person"
                                        type="text"
                                        value={formData?.contactPerson}
                                        onChange={(e) => handleInputChange('contactPerson', e?.target?.value)}
                                        error={errors?.contactPerson}
                                        required
                                        disabled={mode === 'view'}
                                    />

                                    <Input
                                        label="Email Address"
                                        type="email"
                                        value={formData?.email}
                                        onChange={(e) => handleInputChange('email', e?.target?.value)}
                                        error={errors?.email}
                                        required
                                        disabled={mode === 'view'}
                                    />

                                    <Input
                                        label="Phone Number"
                                        type="tel"
                                        value={formData?.phone}
                                        onChange={(e) => handleInputChange('phone', e?.target?.value)}
                                        error={errors?.phone}
                                        required
                                        disabled={mode === 'view'}
                                    />

                                    <Select
                                        label="Customer Type"
                                        options={customerTypeOptions}
                                        value={formData?.customerType}
                                        onChange={(value) => handleInputChange('customerType', value)}
                                        disabled={mode === 'view'}
                                    />

                                    <Input
                                        label="GST Number"
                                        type="text"
                                        value={formData?.gstNumber}
                                        onChange={(e) => handleInputChange('gstNumber', e?.target?.value?.toUpperCase())}
                                        error={errors?.gstNumber}
                                        placeholder="22AAAAA0000A1Z5"
                                        description="15-character GST identification number"
                                        disabled={mode === 'view'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Billing Address Tab */}
                        {activeTab === 'billing' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-foreground mb-4">Billing Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Street Address"
                                            type="text"
                                            value={formData?.billingAddress?.street}
                                            onChange={(e) => handleAddressChange('billingAddress', 'street', e?.target?.value)}
                                            disabled={mode === 'view'}
                                        />
                                    </div>

                                    <Input
                                        label="City"
                                        type="text"
                                        value={formData?.billingAddress?.city}
                                        onChange={(e) => handleAddressChange('billingAddress', 'city', e?.target?.value)}
                                        disabled={mode === 'view'}
                                    />

                                    <Select
                                        label="State"
                                        options={indianStates}
                                        value={formData?.billingAddress?.state}
                                        onChange={(value) => handleAddressChange('billingAddress', 'state', value)}
                                        searchable
                                        disabled={mode === 'view'}
                                    />

                                    <Input
                                        label="PIN Code"
                                        type="text"
                                        value={formData?.billingAddress?.pincode}
                                        onChange={(e) => handleAddressChange('billingAddress', 'pincode', e?.target?.value)}
                                        disabled={mode === 'view'}
                                    />

                                    <Input
                                        label="Country"
                                        type="text"
                                        value={formData?.billingAddress?.country}
                                        onChange={(e) => handleAddressChange('billingAddress', 'country', e?.target?.value)}
                                        disabled={mode === 'view'}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Shipping Address Tab */}
                        {activeTab === 'shipping' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-foreground">Shipping Address</h3>
                                    {mode !== 'view' && (
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={formData?.shippingAddress?.sameAsBilling}
                                                onChange={(e) => handleSameAsBillingChange(e?.target?.checked)}
                                                className="rounded border-border"
                                            />
                                            <span className="text-sm text-text-secondary">Same as billing address</span>
                                        </label>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Street Address"
                                            type="text"
                                            value={formData?.shippingAddress?.street}
                                            onChange={(e) => handleAddressChange('shippingAddress', 'street', e?.target?.value)}
                                            disabled={mode === 'view' || formData?.shippingAddress?.sameAsBilling}
                                        />
                                    </div>

                                    <Input
                                        label="City"
                                        type="text"
                                        value={formData?.shippingAddress?.city}
                                        onChange={(e) => handleAddressChange('shippingAddress', 'city', e?.target?.value)}
                                        disabled={mode === 'view' || formData?.shippingAddress?.sameAsBilling}
                                    />

                                    <Select
                                        label="State"
                                        options={indianStates}
                                        value={formData?.shippingAddress?.state}
                                        onChange={(value) => handleAddressChange('shippingAddress', 'state', value)}
                                        searchable
                                        disabled={mode === 'view' || formData?.shippingAddress?.sameAsBilling}
                                    />

                                    <Input
                                        label="PIN Code"
                                        type="text"
                                        value={formData?.shippingAddress?.pincode}
                                        onChange={(e) => handleAddressChange('shippingAddress', 'pincode', e?.target?.value)}
                                        disabled={mode === 'view' || formData?.shippingAddress?.sameAsBilling}
                                    />

                                    <Input
                                        label="Country"
                                        type="text"
                                        value={formData?.shippingAddress?.country}
                                        onChange={(e) => handleAddressChange('shippingAddress', 'country', e?.target?.value)}
                                        disabled={mode === 'view' || formData?.shippingAddress?.sameAsBilling}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Bank Details Tab */}
                        {activeTab === 'bank' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-foreground mb-4">Bank Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Account Holder Name"
                                        type="text"
                                        value={formData?.bankDetails?.accountName}
                                        onChange={(e) => handleBankDetailsChange('accountName', e?.target?.value)}
                                        disabled={mode === 'view'}
                                    />

                                    <Input
                                        label="Account Number"
                                        type="text"
                                        value={formData?.bankDetails?.accountNumber}
                                        onChange={(e) => handleBankDetailsChange('accountNumber', e?.target?.value)}
                                        disabled={mode === 'view'}
                                    />

                                    <Input
                                        label="IFSC Code"
                                        type="text"
                                        value={formData?.bankDetails?.ifscCode}
                                        onChange={(e) => handleBankDetailsChange('ifscCode', e?.target?.value?.toUpperCase())}
                                        placeholder="SBIN0001234"
                                        disabled={mode === 'view'}
                                    />

                                    <Input
                                        label="Bank Name"
                                        type="text"
                                        value={formData?.bankDetails?.bankName}
                                        onChange={(e) => handleBankDetailsChange('bankName', e?.target?.value)}
                                        disabled={mode === 'view'}
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                {mode !== 'view' && (
                    <div className="flex items-center justify-end space-x-4 p-6 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleSubmit}
                            iconName="Save"
                            iconSize={16}
                        >
                            {mode === 'add' ? 'Add Customer' : 'Save Changes'}
                        </Button>
                    </div>
                )}

                {mode === 'view' && (
                    <div className="flex items-center justify-end space-x-4 p-6 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerModal;