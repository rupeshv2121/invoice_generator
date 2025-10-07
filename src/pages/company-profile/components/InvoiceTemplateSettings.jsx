import { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';


const InvoiceTemplateSettings = ({ templateData, onUpdate }) => {
    const [settings, setSettings] = useState(templateData);
    const [isEditing, setIsEditing] = useState(false);

    const colorSchemes = [
        { name: 'Professional Blue', primary: '#4F46E5', secondary: '#6366F1', accent: '#E0E7FF' },
        { name: 'Corporate Gray', primary: '#374151', secondary: '#6B7280', accent: '#F3F4F6' },
        { name: 'Modern Green', primary: '#059669', secondary: '#10B981', accent: '#D1FAE5' },
        { name: 'Classic Black', primary: '#1F2937', secondary: '#374151', accent: '#F9FAFB' },
        { name: 'Elegant Purple', primary: '#7C3AED', secondary: '#8B5CF6', accent: '#EDE9FE' },
    ];

    const headerLayouts = [
        { id: 'left-aligned', name: 'Left Aligned', description: 'Logo and company info on the left' },
        { id: 'centered', name: 'Centered', description: 'Logo and company info centered' },
        { id: 'split', name: 'Split Layout', description: 'Logo left, company info right' },
    ];

    const handleSettingChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        onUpdate(settings);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setSettings(templateData);
        setIsEditing(false);
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Invoice Template Settings</h2>
                {!isEditing ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        iconName="Settings"
                        iconPosition="left"
                    >
                        Customize
                    </Button>
                ) : (
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleSave}
                            iconName="Save"
                            iconPosition="left"
                        >
                            Save
                        </Button>
                    </div>
                )}
            </div>
            <div className="space-y-8">
                {/* Header Layout */}
                <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Header Layout</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {headerLayouts?.map((layout) => (
                            <div
                                key={layout?.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${settings?.headerLayout === layout?.id
                                    ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                    } ${!isEditing ? 'pointer-events-none opacity-60' : ''}`}
                                onClick={() => isEditing && handleSettingChange('headerLayout', layout?.id)}
                            >
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className={`w-4 h-4 rounded-full border-2 ${settings?.headerLayout === layout?.id
                                        ? 'border-primary bg-primary' : 'border-border'
                                        }`}>
                                        {settings?.headerLayout === layout?.id && (
                                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                        )}
                                    </div>
                                    <h4 className="font-medium text-foreground">{layout?.name}</h4>
                                </div>
                                <p className="text-sm text-text-secondary">{layout?.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Color Scheme */}
                <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Color Scheme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {colorSchemes?.map((scheme) => (
                            <div
                                key={scheme?.name}
                                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${settings?.colorScheme === scheme?.name
                                    ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                    } ${!isEditing ? 'pointer-events-none opacity-60' : ''}`}
                                onClick={() => isEditing && handleSettingChange('colorScheme', scheme?.name)}
                            >
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className={`w-4 h-4 rounded-full border-2 ${settings?.colorScheme === scheme?.name
                                        ? 'border-primary bg-primary' : 'border-border'
                                        }`}>
                                        {settings?.colorScheme === scheme?.name && (
                                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                        )}
                                    </div>
                                    <h4 className="font-medium text-foreground">{scheme?.name}</h4>
                                </div>
                                <div className="flex space-x-2">
                                    <div
                                        className="w-6 h-6 rounded"
                                        style={{ backgroundColor: scheme?.primary }}
                                    ></div>
                                    <div
                                        className="w-6 h-6 rounded"
                                        style={{ backgroundColor: scheme?.secondary }}
                                    ></div>
                                    <div
                                        className="w-6 h-6 rounded border border-border"
                                        style={{ backgroundColor: scheme?.accent }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Invoice Numbering */}
                <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Invoice Numbering</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Prefix"
                            type="text"
                            value={settings?.invoicePrefix}
                            onChange={(e) => handleSettingChange('invoicePrefix', e?.target?.value)}
                            disabled={!isEditing}
                            description="e.g., INV, BILL"
                            className="mb-4"
                        />
                        <Input
                            label="Starting Number"
                            type="number"
                            value={settings?.startingNumber}
                            onChange={(e) => handleSettingChange('startingNumber', e?.target?.value)}
                            disabled={!isEditing}
                            min="1"
                            className="mb-4"
                        />
                        <Input
                            label="Current Number"
                            type="number"
                            value={settings?.currentNumber}
                            onChange={(e) => handleSettingChange('currentNumber', e?.target?.value)}
                            disabled={!isEditing}
                            description="Next invoice number"
                            className="mb-4"
                        />
                    </div>
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-text-secondary">
                            Next invoice will be: <span className="font-medium text-foreground">
                                {settings?.invoicePrefix}-{String(settings?.currentNumber)?.padStart(4, '0')}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Display Options */}
                <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Display Options</h3>
                    <div className="space-y-4">
                        <Checkbox
                            label="Show company logo on invoices"
                            checked={settings?.showLogo}
                            onChange={(e) => handleSettingChange('showLogo', e?.target?.checked)}
                            disabled={!isEditing}
                        />
                        <Checkbox
                            label="Display HSN codes in item table"
                            checked={settings?.showHsnCodes}
                            onChange={(e) => handleSettingChange('showHsnCodes', e?.target?.checked)}
                            disabled={!isEditing}
                        />
                        <Checkbox
                            label="Show tax breakup summary"
                            checked={settings?.showTaxBreakup}
                            onChange={(e) => handleSettingChange('showTaxBreakup', e?.target?.checked)}
                            disabled={!isEditing}
                        />
                        <Checkbox
                            label="Include bank details on invoice"
                            checked={settings?.showBankDetails}
                            onChange={(e) => handleSettingChange('showBankDetails', e?.target?.checked)}
                            disabled={!isEditing}
                        />
                        <Checkbox
                            label="Add digital signature"
                            checked={settings?.showSignature}
                            onChange={(e) => handleSettingChange('showSignature', e?.target?.checked)}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Default Terms & Conditions</h3>
                    <textarea
                        className="w-full h-32 px-3 py-2 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                        value={settings?.defaultTerms}
                        onChange={(e) => handleSettingChange('defaultTerms', e?.target?.value)}
                        disabled={!isEditing}
                        placeholder="Enter default terms and conditions for invoices..."
                    />
                    <p className="text-xs text-text-secondary mt-2">
                        These terms will be automatically added to new invoices
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceTemplateSettings;