import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const CompanyDetailsForm = ({ companyData, onUpdate }) => {
    const [formData, setFormData] = useState(companyData);
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
        setFormData(companyData);
        setIsEditing(false);
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Company Details</h2>
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
                    label="Company Name"
                    type="text"
                    value={formData?.companyName}
                    onChange={(e) => handleInputChange('companyName', e?.target?.value)}
                    disabled={!isEditing}
                    required
                    className="mb-4"
                />

                <Input
                    label="Legal Name"
                    type="text"
                    value={formData?.legalName}
                    onChange={(e) => handleInputChange('legalName', e?.target?.value)}
                    disabled={!isEditing}
                    className="mb-4"
                />

                <div className="md:col-span-2">
                    <Input
                        label="Registered Address"
                        type="text"
                        value={formData?.registeredAddress}
                        onChange={(e) => handleInputChange('registeredAddress', e?.target?.value)}
                        disabled={!isEditing}
                        required
                        className="mb-4"
                    />
                </div>

                <Input
                    label="City"
                    type="text"
                    value={formData?.city}
                    onChange={(e) => handleInputChange('city', e?.target?.value)}
                    disabled={!isEditing}
                    required
                    className="mb-4"
                />

                <Input
                    label="State"
                    type="text"
                    value={formData?.state}
                    onChange={(e) => handleInputChange('state', e?.target?.value)}
                    disabled={!isEditing}
                    required
                    className="mb-4"
                />

                <Input
                    label="PIN Code"
                    type="text"
                    value={formData?.pinCode}
                    onChange={(e) => handleInputChange('pinCode', e?.target?.value)}
                    disabled={!isEditing}
                    required
                    pattern="[0-9]{6}"
                    className="mb-4"
                />

                <Input
                    label="Country"
                    type="text"
                    value={formData?.country}
                    onChange={(e) => handleInputChange('country', e?.target?.value)}
                    disabled={!isEditing}
                    required
                    className="mb-4"
                />

                <Input
                    label="Phone Number"
                    type="tel"
                    value={formData?.phone}
                    onChange={(e) => handleInputChange('phone', e?.target?.value)}
                    disabled={!isEditing}
                    required
                    className="mb-4"
                />

                <Input
                    label="Email Address"
                    type="email"
                    value={formData?.email}
                    onChange={(e) => handleInputChange('email', e?.target?.value)}
                    disabled={!isEditing}
                    required
                    className="mb-4"
                />

                <Input
                    label="Website"
                    type="url"
                    value={formData?.website}
                    onChange={(e) => handleInputChange('website', e?.target?.value)}
                    disabled={!isEditing}
                    className="mb-4"
                />

                <Input
                    label="Business Type"
                    type="text"
                    value={formData?.businessType}
                    onChange={(e) => handleInputChange('businessType', e?.target?.value)}
                    disabled={!isEditing}
                    className="mb-4"
                />
            </div>
        </div>
    );
};

export default CompanyDetailsForm;