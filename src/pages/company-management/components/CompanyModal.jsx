import { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import Select from '../../../components/ui/Select';

const CompanyModal = ({ isOpen, onClose, onSave, company, mode = 'add' }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        alternatePhone: '',
        website: '',
        eximCode: '',
        gstNumber: '',
        cinNumber: '',
        panNumber: '',
        companyType: 'Private Limited',
        industry: '',

        // Address fields
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',

        // Bank details
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountType: 'Current',

        status: 'Active',
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        if (company && mode === 'edit') {
            setFormData({ ...company });
        } else {
            setFormData({
                companyName: '',
                contactPerson: '',
                email: '',
                phone: '',
                alternatePhone: '',
                website: '',
                eximCode: '',
                gstNumber: '',
                cinNumber: '',
                panNumber: '',
                companyType: 'Private Limited',
                industry: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                postalCode: '',
                country: 'India',
                bankName: '',
                accountNumber: '',
                ifscCode: '',
                accountType: 'Current',
                status: 'Active',
                notes: ''
            });
        }
        setErrors({});
        setActiveTab('basic');
    }, [company, mode, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields validation
        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required';
        }

        if (!formData.contactPerson.trim()) {
            newErrors.contactPerson = 'Contact person is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        // EXIM Code validation (if provided)
        if (formData.eximCode && !/^[A-Z0-9]{10}$/.test(formData.eximCode)) {
            newErrors.eximCode = 'EXIM Code must be 10 alphanumeric characters';
        }

        // GST Number validation (if provided)
        if (formData.gstNumber && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(formData.gstNumber)) {
            newErrors.gstNumber = 'Please enter a valid GST number';
        }

        // PAN Number validation (if provided)
        if (formData.panNumber && !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(formData.panNumber)) {
            newErrors.panNumber = 'Please enter a valid PAN number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const dataToSave = {
                ...formData,
                id: mode === 'edit' ? company.id : Date.now(),
                createdAt: mode === 'edit' ? company.createdAt : new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            onSave(dataToSave);
            onClose();
        }
    };

    const tabs = [
        { id: 'basic', name: 'Basic Info', icon: 'Building2' },
        { id: 'documents', name: 'Documents & Compliance', icon: 'FileText' },
        { id: 'address', name: 'Address', icon: 'MapPin' },
        { id: 'banking', name: 'Banking Details', icon: 'CreditCard' }
    ];

    const companyTypes = [
        'Private Limited',
        'Public Limited',
        'Partnership',
        'Sole Proprietorship',
        'LLP'
    ];

    const accountTypes = ['Current', 'Savings', 'CC/OD'];
    const statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${mode === 'edit' ? 'Edit' : 'Add'} Company`} size="xl">
            <form onSubmit={handleSubmit}>
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon name={tab.icon} size={16} className="mr-2" />
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Basic Information Tab */}
                {activeTab === 'basic' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name *
                                </label>
                                <Input
                                    required
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    error={errors.companyName}
                                    placeholder="Enter company name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Person *
                                </label>
                                <Input
                                    required
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleInputChange}
                                    error={errors.contactPerson}
                                    placeholder="Enter contact person name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={errors.email}
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    error={errors.phone}
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alternate Phone
                                </label>
                                <Input
                                    name="alternatePhone"
                                    value={formData.alternatePhone}
                                    onChange={handleInputChange}
                                    placeholder="Enter alternate phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Website
                                </label>
                                <Input
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    placeholder="Enter website URL"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Type
                                </label>
                                <Select
                                    name="companyType"
                                    value={formData.companyType}
                                    onChange={handleInputChange}
                                >
                                    {companyTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Industry
                                </label>
                                <Input
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleInputChange}
                                    placeholder="Enter industry type"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </Select>
                        </div>
                    </div>
                )}

                {/* Documents & Compliance Tab */}
                {activeTab === 'documents' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    EXIM Code
                                    <span className="text-red-600 ml-1">*</span>
                                </label>
                                <Input
                                    required
                                    name="eximCode"
                                    value={formData.eximCode}
                                    onChange={handleInputChange}
                                    error={errors.eximCode}
                                    placeholder="Enter 10-digit EXIM code"
                                    className="font-mono"
                                />
                                <p className="text-xs text-red-500 mt-1">
                                    Required for export/import invoicing
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    GST Number
                                </label>
                                <Input
                                    name="gstNumber"
                                    value={formData.gstNumber}
                                    onChange={handleInputChange}
                                    error={errors.gstNumber}
                                    placeholder="Enter GST number"
                                    className="font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CIN Number
                                </label>
                                <Input
                                    name="cinNumber"
                                    value={formData.cinNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter CIN number"
                                    className="font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PAN Number
                                </label>
                                <Input
                                    name="panNumber"
                                    value={formData.panNumber}
                                    onChange={handleInputChange}
                                    error={errors.panNumber}
                                    placeholder="Enter PAN number"
                                    className="font-mono"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Address Tab */}
                {activeTab === 'address' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address Line 1
                            </label>
                            <Input
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleInputChange}
                                placeholder="Enter address line 1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address Line 2
                            </label>
                            <Input
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleInputChange}
                                placeholder="Enter address line 2 (optional)"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <Input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Enter city"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <Input
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder="Enter state"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Postal Code
                                </label>
                                <Input
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="Enter postal code"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Country
                                </label>
                                <Input
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="Enter country"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Banking Details Tab */}
                {activeTab === 'banking' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bank Name
                                </label>
                                <Input
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                    placeholder="Enter bank name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Account Type
                                </label>
                                <Select
                                    name="accountType"
                                    value={formData.accountType}
                                    onChange={handleInputChange}
                                >
                                    {accountTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Account Number
                                </label>
                                <Input
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter account number"
                                    className="font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    IFSC Code
                                </label>
                                <Input
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleInputChange}
                                    placeholder="Enter IFSC code"
                                    className="font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter any additional notes..."
                            />
                        </div>
                    </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">
                        {mode === 'edit' ? 'Update Company' : 'Add Company'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CompanyModal;