import { useEffect, useState } from 'react';
import Icon from '../../components/AppIcon';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import { getMyCompanyProfile } from '../../services/companyProfileService';
// import BankDetailsSection from './components/BankDetailsSection';
// import CompanyDetailsForm from './components/CompanyDetailsForm';
// import GSTComplianceSection from './components/GSTComplianceSection';
// import InvoiceTemplateSettings from './components/InvoiceTemplateSettings';
// import LogoUploadSection from './components/LogoUploadSection';

const CompanyProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState('company');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Load company profile data from service
        const profile = getMyCompanyProfile();
        setProfileData(profile);
    }, []);

    const tabs = [
        { id: 'company', label: 'Company Details', icon: 'Building' },
        { id: 'compliance', label: 'Compliance', icon: 'FileText' },
        { id: 'banking', label: 'Banking', icon: 'CreditCard' }
    ];

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
        setHasUnsavedChanges(true);
    };

    const handleNestedInputChange = (section, field, value) => {
        setProfileData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
        setHasUnsavedChanges(true);
    };

    const handleSave = () => {
        // In a real app, this would call an API to update the profile
        console.log('Saving profile:', profileData);
        setIsEditing(false);
        setHasUnsavedChanges(false);
        // Show success message
        alert('Company profile updated successfully!');
    };

    const renderTabContent = () => {
        if (!profileData) return <div>Loading...</div>;

        switch (activeTab) {
            case 'company':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-foreground">Company Information</h3>
                            <Button
                                variant={isEditing ? "default" : "outline"}
                                onClick={() => setIsEditing(!isEditing)}
                                iconName={isEditing ? "Save" : "Edit"}
                            >
                                {isEditing ? "Save Changes" : "Edit"}
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Company Name</label>
                                <input
                                    type="text"
                                    value={profileData.companyName}
                                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Contact Person</label>
                                <input
                                    type="text"
                                    value={profileData.contactPerson}
                                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Email</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Phone</label>
                                <input
                                    type="text"
                                    value={profileData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Website</label>
                                <input
                                    type="text"
                                    value={profileData.website}
                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Company Type</label>
                                <select
                                    value={profileData.companyType}
                                    onChange={(e) => handleInputChange('companyType', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                >
                                    <option value="Private Limited">Private Limited</option>
                                    <option value="Public Limited">Public Limited</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                                    <option value="LLP">LLP</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <h4 className="text-md font-medium text-foreground">Address</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Address Line 1</label>
                                    <input
                                        type="text"
                                        value={profileData.addressLine1}
                                        onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Address Line 2</label>
                                    <input
                                        type="text"
                                        value={profileData.addressLine2}
                                        onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">City</label>
                                        <input
                                            type="text"
                                            value={profileData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">State</label>
                                        <input
                                            type="text"
                                            value={profileData.state}
                                            onChange={(e) => handleInputChange('state', e.target.value)}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Postal Code</label>
                                        <input
                                            type="text"
                                            value={profileData.postalCode}
                                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Country</label>
                                        <input
                                            type="text"
                                            value={profileData.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'compliance':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-foreground">Compliance Information</h3>
                            <Button
                                variant={isEditing ? "default" : "outline"}
                                onClick={() => setIsEditing(!isEditing)}
                                iconName={isEditing ? "Save" : "Edit"}
                            >
                                {isEditing ? "Save Changes" : "Edit"}
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">GST Number</label>
                                <input
                                    type="text"
                                    value={profileData.gstNumber}
                                    onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">IEC Code</label>
                                <input
                                    type="text"
                                    value={profileData.iecCode}
                                    onChange={(e) => handleInputChange('iecCode', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">PAN Number</label>
                                <input
                                    type="text"
                                    value={profileData.panNumber}
                                    onChange={(e) => handleInputChange('panNumber', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">CIN Number</label>
                                <input
                                    type="text"
                                    value={profileData.cinNumber}
                                    onChange={(e) => handleInputChange('cinNumber', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary font-mono"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">BOND Number</label>
                            <input
                                type="text"
                                value={profileData.bondNumber}
                                onChange={(e) => handleInputChange('bondNumber', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary font-mono"
                            />
                        </div>
                    </div>
                );
            case 'banking':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-foreground">Banking Information</h3>
                            <Button
                                variant={isEditing ? "default" : "outline"}
                                onClick={() => setIsEditing(!isEditing)}
                                iconName={isEditing ? "Save" : "Edit"}
                            >
                                {isEditing ? "Save Changes" : "Edit"}
                            </Button>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                            <p className="text-blue-800 text-sm">
                                <strong>Important:</strong> These bank details will be automatically used in all your invoices.
                                Make sure they are accurate and up-to-date.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Bank Name</label>
                                <input
                                    type="text"
                                    value={profileData.bankDetails.bankName}
                                    onChange={(e) => handleNestedInputChange('bankDetails', 'bankName', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Account Name</label>
                                <input
                                    type="text"
                                    value={profileData.bankDetails.accountName}
                                    onChange={(e) => handleNestedInputChange('bankDetails', 'accountName', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Account Number</label>
                                <input
                                    type="text"
                                    value={profileData.bankDetails.accountNumber}
                                    onChange={(e) => handleNestedInputChange('bankDetails', 'accountNumber', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">IFSC Code</label>
                                <input
                                    type="text"
                                    value={profileData.bankDetails.ifscCode}
                                    onChange={(e) => handleNestedInputChange('bankDetails', 'ifscCode', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Account Type</label>
                                <select
                                    value={profileData.bankDetails.accountType}
                                    onChange={(e) => handleNestedInputChange('bankDetails', 'accountType', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                >
                                    <option value="Current">Current</option>
                                    <option value="Savings">Savings</option>
                                    <option value="CC/OD">CC/OD</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Branch Name</label>
                                <input
                                    type="text"
                                    value={profileData.bankDetails.branchName}
                                    onChange={(e) => handleNestedInputChange('bankDetails', 'branchName', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb />

                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Company Profile</h1>
                            <p className="text-text-secondary mt-2">
                                Manage your business information, GST compliance, and invoice settings
                            </p>
                        </div>

                        {hasUnsavedChanges && (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-warning">
                                    <Icon name="AlertCircle" size={16} />
                                    <span className="text-sm">Unsaved changes</span>
                                </div>
                                <Button
                                    variant="default"
                                    onClick={handleSave}
                                    iconName="Save"
                                    iconPosition="left"
                                >
                                    Save All Changes
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-b border-border mb-8">
                        <nav className="flex space-x-8 overflow-x-auto">
                            {tabs?.map((tab) => (
                                <button
                                    key={tab?.id}
                                    onClick={() => setActiveTab(tab?.id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${activeTab === tab?.id
                                        ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-foreground hover:border-border'
                                        }`}
                                >
                                    <Icon name={tab?.icon} size={16} />
                                    <span>{tab?.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="mb-8">
                        {renderTabContent()}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                        <div className="bg-card rounded-lg border border-border p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                                    <Icon name="CheckCircle" size={20} className="text-success" />
                                </div>
                                <div>
                                    <p className="text-sm text-text-secondary">Profile Status</p>
                                    <p className="text-lg font-semibold text-foreground">Complete</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Icon name="FileText" size={20} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-text-secondary">GST Status</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {profileData?.gstNumber ? 'Configured' : 'Pending'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                                    <Icon name="CreditCard" size={20} className="text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-text-secondary">Bank Details</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {profileData?.bankDetails?.bankName ? 'Configured' : 'Pending'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                                    <Icon name="Building" size={20} className="text-secondary" />
                                </div>
                                <div>
                                    <p className="text-sm text-text-secondary">Company Type</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {profileData?.companyType || 'Not Set'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <QuickActionButton />
        </div>
    );
};

export default CompanyProfile;