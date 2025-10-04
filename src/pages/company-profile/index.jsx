import { useState } from 'react';
import Icon from '../../components/AppIcon';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import BankDetailsSection from './components/BankDetailsSection';
import CompanyDetailsForm from './components/CompanyDetailsForm';
import GSTComplianceSection from './components/GSTComplianceSection';
import InvoiceTemplateSettings from './components/InvoiceTemplateSettings';
import LogoUploadSection from './components/LogoUploadSection';

const CompanyProfile = () => {
    // Mock company data
    const [companyData, setCompanyData] = useState({
        companyName: "TechSolutions Pvt Ltd",
        legalName: "TechSolutions Private Limited",
        registeredAddress: "Plot No. 123, Sector 15, Cyber City",
        city: "Gurgaon",
        state: "Haryana",
        pinCode: "122001",
        country: "India",
        phone: "+91 9876543210",
        email: "info@techsolutions.com",
        website: "https://www.techsolutions.com",
        businessType: "Information Technology Services"
    });

    const [gstData, setGstData] = useState({
        gstin: "06AABCT1332L1ZM",
        pan: "AABCT1332L",
        tan: "DELH12345E",
        cin: "U72200HR2020PTC089123",
        registrationDate: "2020-03-15",
        primaryHsn: "998314",
        gstRegistered: true
    });

    const [bankAccounts, setBankAccounts] = useState([
        {
            id: 1,
            bankName: "HDFC Bank",
            accountNumber: "50200012345678",
            ifscCode: "HDFC0001234",
            accountType: "Current",
            branchName: "Cyber City Branch",
            isPrimary: true
        },
        {
            id: 2,
            bankName: "ICICI Bank",
            accountNumber: "123456789012",
            ifscCode: "ICIC0001234",
            accountType: "Savings",
            branchName: "Sector 14 Branch",
            isPrimary: false
        }
    ]);

    const [logoData, setLogoData] = useState({
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=100&fit=crop&crop=center",
        name: "company-logo.png",
        size: 45678,
        lastModified: Date.now() - 86400000
    });

    const [templateSettings, setTemplateSettings] = useState({
        headerLayout: "split",
        colorScheme: "Professional Blue",
        invoicePrefix: "INV",
        startingNumber: 1,
        currentNumber: 1247,
        showLogo: true,
        showHsnCodes: true,
        showTaxBreakup: true,
        showBankDetails: true,
        showSignature: true,
        defaultTerms: `1. Payment is due within 30 days of invoice date.\n2. Late payments may incur additional charges.\n3. All disputes must be raised within 7 days of invoice receipt.\n4. Goods once sold will not be taken back.\n5. Subject to Gurgaon jurisdiction only.`
    });

    const [activeTab, setActiveTab] = useState('company');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const tabs = [
        { id: 'company', label: 'Company Details', icon: 'Building' },
        { id: 'gst', label: 'GST Compliance', icon: 'FileText' },
        { id: 'bank', label: 'Bank Details', icon: 'CreditCard' },
        { id: 'logo', label: 'Logo & Branding', icon: 'Image' },
        { id: 'template', label: 'Invoice Templates', icon: 'Layout' }
    ];

    const handleCompanyUpdate = (data) => {
        setCompanyData(data);
        setHasUnsavedChanges(true);
    };

    const handleGSTUpdate = (data) => {
        setGstData(data);
        setHasUnsavedChanges(true);
    };

    const handleBankUpdate = (data) => {
        setBankAccounts(data);
        setHasUnsavedChanges(true);
    };

    const handleLogoUpdate = (data) => {
        setLogoData(data);
        setHasUnsavedChanges(true);
    };

    const handleTemplateUpdate = (data) => {
        setTemplateSettings(data);
        setHasUnsavedChanges(true);
    };

    const handleSaveAll = () => {
        // Simulate saving all changes
        setTimeout(() => {
            setHasUnsavedChanges(false);
            // Show success message
        }, 1000);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'company':
                return (
                    <CompanyDetailsForm
                        companyData={companyData}
                        onUpdate={handleCompanyUpdate}
                    />
                );
            case 'gst':
                return (
                    <GSTComplianceSection
                        gstData={gstData}
                        onUpdate={handleGSTUpdate}
                    />
                );
            case 'bank':
                return (
                    <BankDetailsSection
                        bankAccounts={bankAccounts}
                        onUpdate={handleBankUpdate}
                    />
                );
            case 'logo':
                return (
                    <LogoUploadSection
                        logoData={logoData}
                        onUpdate={handleLogoUpdate}
                    />
                );
            case 'template':
                return (
                    <InvoiceTemplateSettings
                        templateData={templateSettings}
                        onUpdate={handleTemplateUpdate}
                    />
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
                                    onClick={handleSaveAll}
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
                                    <p className="text-lg font-semibold text-foreground">Verified</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                                    <Icon name="CreditCard" size={20} className="text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-text-secondary">Bank Accounts</p>
                                    <p className="text-lg font-semibold text-foreground">{bankAccounts?.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-lg border border-border p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                                    <Icon name="Layout" size={20} className="text-secondary" />
                                </div>
                                <div>
                                    <p className="text-sm text-text-secondary">Next Invoice</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {templateSettings?.invoicePrefix}-{String(templateSettings?.currentNumber)?.padStart(4, '0')}
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