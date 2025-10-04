import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const GSTComplianceSection = ({ gstData, onUpdate }) => {
    const [formData, setFormData] = useState(gstData);
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(gstData);
        setIsEditing(false);
    };

    const validateGSTIN = (gstin) => {
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstinRegex?.test(gstin);
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold text-foreground">GST Compliance</h2>
                    {formData?.gstRegistered && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-success/10 text-success rounded-md text-sm">
                            <Icon name="CheckCircle" size={16} />
                            <span>Verified</span>
                        </div>
                    )}
                </div>
                {!isEditing ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        iconName="Edit"
                        iconPosition="left"
                    >
                        Edit
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="GSTIN Number"
                    type="text"
                    value={formData?.gstin}
                    onChange={(e) => handleInputChange('gstin', e?.target?.value?.toUpperCase())}
                    disabled={!isEditing}
                    required
                    pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
                    description="Format: 22AAAAA0000A1Z5"
                    error={formData?.gstin && !validateGSTIN(formData?.gstin) ? "Invalid GSTIN format" : ""}
                    className="mb-4"
                />

                <Input
                    label="PAN Number"
                    type="text"
                    value={formData?.pan}
                    onChange={(e) => handleInputChange('pan', e?.target?.value?.toUpperCase())}
                    disabled={!isEditing}
                    required
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    description="Format: ABCDE1234F"
                    className="mb-4"
                />

                <Input
                    label="TAN Number"
                    type="text"
                    value={formData?.tan}
                    onChange={(e) => handleInputChange('tan', e?.target?.value?.toUpperCase())}
                    disabled={!isEditing}
                    pattern="[A-Z]{4}[0-9]{5}[A-Z]{1}"
                    description="Format: ABCD12345E"
                    className="mb-4"
                />

                <Input
                    label="CIN Number"
                    type="text"
                    value={formData?.cin}
                    onChange={(e) => handleInputChange('cin', e?.target?.value?.toUpperCase())}
                    disabled={!isEditing}
                    description="Corporate Identity Number"
                    className="mb-4"
                />

                <Input
                    label="Registration Date"
                    type="date"
                    value={formData?.registrationDate}
                    onChange={(e) => handleInputChange('registrationDate', e?.target?.value)}
                    disabled={!isEditing}
                    className="mb-4"
                />

                <Input
                    label="HSN Code (Primary)"
                    type="text"
                    value={formData?.primaryHsn}
                    onChange={(e) => handleInputChange('primaryHsn', e?.target?.value)}
                    disabled={!isEditing}
                    description="Primary business HSN code"
                    className="mb-4"
                />
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="text-sm font-medium text-foreground mb-3">Compliance Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">GST Registration</span>
                        <div className="flex items-center space-x-1 text-success">
                            <Icon name="CheckCircle" size={16} />
                            <span className="text-sm font-medium">Active</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Last Filing</span>
                        <span className="text-sm font-medium text-foreground">Dec 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Next Due</span>
                        <span className="text-sm font-medium text-warning">Jan 20, 2025</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GSTComplianceSection;