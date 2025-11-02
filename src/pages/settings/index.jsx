import { useEffect, useState } from 'react';
import Icon from '../../components/AppIcon';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionButton from '../../components/ui/QuickActionButton';
import {
    getSettings,
    updateDefaultValues,
    updateDisplayPreferences,
    updateInvoiceSettings,
    updateTermsAndConditions
} from '../../services/settingsService';

const Settings = () => {
    const [settings, setSettings] = useState(null);
    const [activeTab, setActiveTab] = useState('terms');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Load settings data from service
        const settingsData = getSettings();
        setSettings(settingsData);
    }, []);

    const handleTermsChange = (index, value) => {
        const newTerms = [...settings.termsAndConditions];
        newTerms[index] = value;
        setSettings(prev => ({
            ...prev,
            termsAndConditions: newTerms
        }));
        setHasUnsavedChanges(true);
    };

    const addNewTerm = () => {
        const newTerms = [...settings.termsAndConditions, ""];
        setSettings(prev => ({
            ...prev,
            termsAndConditions: newTerms
        }));
        setHasUnsavedChanges(true);
    };

    const removeTerm = (index) => {
        const newTerms = settings.termsAndConditions.filter((_, i) => i !== index);
        setSettings(prev => ({
            ...prev,
            termsAndConditions: newTerms
        }));
        setHasUnsavedChanges(true);
    };

    const handleInvoiceSettingsChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            invoiceSettings: {
                ...prev.invoiceSettings,
                [field]: value
            }
        }));
        setHasUnsavedChanges(true);
    };

    const handleDefaultValuesChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            defaultValues: {
                ...prev.defaultValues,
                [field]: value
            }
        }));
        setHasUnsavedChanges(true);
    };

    const handleDisplayChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            display: {
                ...prev.display,
                [field]: value
            }
        }));
        setHasUnsavedChanges(true);
    };

    const handleSave = () => {
        // Validate invoice settings
        if (settings.invoiceSettings.currentNumber < 1) {
            alert('Invoice number must be at least 1');
            return;
        }

        // Update all settings
        updateTermsAndConditions(settings.termsAndConditions);
        updateInvoiceSettings(settings.invoiceSettings);
        updateDefaultValues(settings.defaultValues);
        updateDisplayPreferences(settings.display);

        setHasUnsavedChanges(false);
        setIsEditing(false);
        alert('Settings saved successfully!');
    };

    const tabs = [
        { id: 'terms', label: 'Terms & Conditions', icon: 'FileText' },
        { id: 'invoice', label: 'Invoice Settings', icon: 'Receipt' },
        { id: 'defaults', label: 'Default Values', icon: 'Settings' },
        { id: 'display', label: 'Display', icon: 'Monitor' }
    ];

    if (!settings) {
        return <div>Loading...</div>;
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'terms':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-foreground">Terms & Conditions</h3>
                                <p className="text-sm text-text-secondary mt-1">
                                    These terms will be automatically added to all invoices
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {isEditing && hasUnsavedChanges && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const settingsData = getSettings();
                                            setSettings(settingsData);
                                            setHasUnsavedChanges(false);
                                            setIsEditing(false);
                                        }}
                                        iconName="X"
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    variant={isEditing ? "default" : "outline"}
                                    onClick={() => {
                                        if (isEditing) {
                                            handleSave();
                                        } else {
                                            setIsEditing(true);
                                        }
                                    }}
                                    iconName={isEditing ? "Save" : "Edit"}
                                >
                                    {isEditing ? "Save Changes" : "Edit"}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {settings.termsAndConditions.map((term, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <span className="text-sm text-text-secondary min-w-[30px]">
                                        {index + 1}.
                                    </span>
                                    <input
                                        type="text"
                                        value={term}
                                        onChange={(e) => handleTermsChange(index, e.target.value)}
                                        disabled={!isEditing}
                                        className="flex-1 px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                        placeholder="Enter term or condition"
                                    />
                                    {isEditing && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeTerm(index)}
                                            iconName="X"
                                            className="text-red-600 hover:text-red-700"
                                        />
                                    )}
                                </div>
                            ))}

                            {isEditing && (
                                <Button
                                    variant="outline"
                                    onClick={addNewTerm}
                                    iconName="Plus"
                                    className="mt-4"
                                >
                                    Add New Term
                                </Button>
                            )}
                        </div>
                    </div>
                );

            case 'invoice':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-foreground">Invoice Settings</h3>
                            <div className="flex gap-2">
                                {isEditing && hasUnsavedChanges && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const settingsData = getSettings();
                                            setSettings(settingsData);
                                            setHasUnsavedChanges(false);
                                            setIsEditing(false);
                                        }}
                                        iconName="X"
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    variant={isEditing ? "default" : "outline"}
                                    onClick={() => {
                                        if (isEditing) {
                                            handleSave();
                                        } else {
                                            setIsEditing(true);
                                        }
                                    }}
                                    iconName={isEditing ? "Save" : "Edit"}
                                >
                                    {isEditing ? "Save Changes" : "Edit"}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Current Invoice Number</label>
                                <input
                                    type="number"
                                    value={settings.invoiceSettings.currentNumber}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 1;
                                        handleInvoiceSettingsChange('currentNumber', value > 0 ? value : 1);
                                    }}
                                    disabled={!isEditing}
                                    min="1"
                                    step="1"
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                                <p className="text-xs text-text-secondary">Next invoice number will be: {settings.invoiceSettings.currentNumber}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Default Currency</label>
                                <select
                                    value={settings.invoiceSettings.defaultCurrency}
                                    onChange={(e) => handleInvoiceSettingsChange('defaultCurrency', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="INR">INR</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Default Payment Terms</label>
                                <input
                                    type="text"
                                    value={settings.invoiceSettings.defaultPaymentTerms}
                                    onChange={(e) => handleInvoiceSettingsChange('defaultPaymentTerms', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-md font-medium text-foreground">Display Options</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={settings.invoiceSettings.showBankDetails}
                                        onChange={(e) => handleInvoiceSettingsChange('showBankDetails', e.target.checked)}
                                        disabled={!isEditing}
                                        className="rounded border-border"
                                    />
                                    <span className="text-sm text-foreground">Show Bank Details</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={settings.invoiceSettings.showTermsAndConditions}
                                        onChange={(e) => handleInvoiceSettingsChange('showTermsAndConditions', e.target.checked)}
                                        disabled={!isEditing}
                                        className="rounded border-border"
                                    />
                                    <span className="text-sm text-foreground">Show Terms & Conditions</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={settings.invoiceSettings.showHSNCode}
                                        onChange={(e) => handleInvoiceSettingsChange('showHSNCode', e.target.checked)}
                                        disabled={!isEditing}
                                        className="rounded border-border"
                                    />
                                    <span className="text-sm text-foreground">Show HSN Code</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={settings.invoiceSettings.showExportCompliance}
                                        onChange={(e) => handleInvoiceSettingsChange('showExportCompliance', e.target.checked)}
                                        disabled={!isEditing}
                                        className="rounded border-border"
                                    />
                                    <span className="text-sm text-foreground">Show Export Compliance</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 'defaults':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-foreground">Default Values</h3>
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
                                <label className="text-sm font-medium text-foreground">Default Payment Terms</label>
                                <input
                                    type="text"
                                    value={settings.defaultValues.paymentTerms}
                                    onChange={(e) => handleDefaultValuesChange('paymentTerms', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Default Due Days</label>
                                <input
                                    type="number"
                                    value={settings.defaultValues.dueDays}
                                    onChange={(e) => handleDefaultValuesChange('dueDays', parseInt(e.target.value))}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Default Shipping Terms</label>
                                <select
                                    value={settings.defaultValues.shippingTerms}
                                    onChange={(e) => handleDefaultValuesChange('shippingTerms', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                >
                                    <option value="FOB">FOB</option>
                                    <option value="CIF">CIF</option>
                                    <option value="CFR">CFR</option>
                                    <option value="EXW">EXW</option>
                                    <option value="FCA">FCA</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Default Bank Charges</label>
                                <select
                                    value={settings.defaultValues.bankCharges}
                                    onChange={(e) => handleDefaultValuesChange('bankCharges', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                >
                                    <option value="On Account of Buyer">On Account of Buyer</option>
                                    <option value="On Account of Seller">On Account of Seller</option>
                                    <option value="Shared">Shared</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Default MARKA</label>
                                <input
                                    type="text"
                                    value={settings.defaultValues.marka}
                                    onChange={(e) => handleDefaultValuesChange('marka', e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="Default marking/branding"
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Default Transport</label>
                                <input
                                    type="text"
                                    value={settings.defaultValues.transport}
                                    onChange={(e) => handleDefaultValuesChange('transport', e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="Default transport method"
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'display':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-foreground">Display Preferences</h3>
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
                                <label className="text-sm font-medium text-foreground">Date Format</label>
                                <select
                                    value={settings.display.dateFormat}
                                    onChange={(e) => handleDisplayChange('dateFormat', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                >
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Number Format</label>
                                <select
                                    value={settings.display.numberFormat}
                                    onChange={(e) => handleDisplayChange('numberFormat', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:bg-muted disabled:text-text-secondary"
                                >
                                    <option value="indian">Indian (1,00,000)</option>
                                    <option value="international">International (100,000)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={settings.display.showAdvancedFields}
                                    onChange={(e) => handleDisplayChange('showAdvancedFields', e.target.checked)}
                                    disabled={!isEditing}
                                    className="rounded border-border"
                                />
                                <span className="text-sm text-foreground">Show Advanced Fields</span>
                            </label>
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
                            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                            <p className="text-text-secondary mt-2">
                                Manage your application settings, terms & conditions, and preferences
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
                </div>
            </main>
            <QuickActionButton />
        </div>
    );
};

export default Settings;