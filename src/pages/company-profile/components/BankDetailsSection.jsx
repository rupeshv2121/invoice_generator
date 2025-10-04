import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BankDetailsSection = ({ bankAccounts, onUpdate }) => {
    const [accounts, setAccounts] = useState(bankAccounts);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(-1);

    const handleAddAccount = () => {
        const newAccount = {
            id: Date.now(),
            bankName: "",
            accountNumber: "",
            ifscCode: "",
            accountType: "Current",
            branchName: "",
            isPrimary: accounts?.length === 0
        };
        setAccounts([...accounts, newAccount]);
        setEditingIndex(accounts?.length);
        setIsEditing(true);
    };

    const handleEditAccount = (index) => {
        setEditingIndex(index);
        setIsEditing(true);
    };

    const handleDeleteAccount = (index) => {
        const updatedAccounts = accounts?.filter((_, i) => i !== index);
        setAccounts(updatedAccounts);
        onUpdate(updatedAccounts);
    };

    const handleSave = () => {
        onUpdate(accounts);
        setIsEditing(false);
        setEditingIndex(-1);
    };

    const handleCancel = () => {
        setAccounts(bankAccounts);
        setIsEditing(false);
        setEditingIndex(-1);
    };

    const handleAccountChange = (index, field, value) => {
        const updatedAccounts = [...accounts];
        updatedAccounts[index] = {
            ...updatedAccounts?.[index],
            [field]: value
        };
        setAccounts(updatedAccounts);
    };

    const setPrimaryAccount = (index) => {
        const updatedAccounts = accounts?.map((account, i) => ({
            ...account,
            isPrimary: i === index
        }));
        setAccounts(updatedAccounts);
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Bank Details</h2>
                <div className="flex space-x-2">
                    {!isEditing ? (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAddAccount}
                                iconName="Plus"
                                iconPosition="left"
                            >
                                Add Account
                            </Button>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
            <div className="space-y-6">
                {accounts?.map((account, index) => (
                    <div key={account?.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-medium text-foreground">
                                    Account {index + 1}
                                </h3>
                                {account?.isPrimary && (
                                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                                        Primary
                                    </span>
                                )}
                            </div>
                            {!isEditing && (
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditAccount(index)}
                                        iconName="Edit"
                                    />
                                    {accounts?.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteAccount(index)}
                                            iconName="Trash2"
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Bank Name"
                                type="text"
                                value={account?.bankName}
                                onChange={(e) => handleAccountChange(index, 'bankName', e?.target?.value)}
                                disabled={!isEditing || editingIndex !== index}
                                required
                                className="mb-4"
                            />

                            <Input
                                label="Account Number"
                                type="text"
                                value={account?.accountNumber}
                                onChange={(e) => handleAccountChange(index, 'accountNumber', e?.target?.value)}
                                disabled={!isEditing || editingIndex !== index}
                                required
                                className="mb-4"
                            />

                            <Input
                                label="IFSC Code"
                                type="text"
                                value={account?.ifscCode}
                                onChange={(e) => handleAccountChange(index, 'ifscCode', e?.target?.value?.toUpperCase())}
                                disabled={!isEditing || editingIndex !== index}
                                required
                                pattern="[A-Z]{4}0[A-Z0-9]{6}"
                                description="Format: ABCD0123456"
                                className="mb-4"
                            />

                            <Input
                                label="Account Type"
                                type="text"
                                value={account?.accountType}
                                onChange={(e) => handleAccountChange(index, 'accountType', e?.target?.value)}
                                disabled={!isEditing || editingIndex !== index}
                                className="mb-4"
                            />

                            <div className="md:col-span-2">
                                <Input
                                    label="Branch Name"
                                    type="text"
                                    value={account?.branchName}
                                    onChange={(e) => handleAccountChange(index, 'branchName', e?.target?.value)}
                                    disabled={!isEditing || editingIndex !== index}
                                    className="mb-4"
                                />
                            </div>
                        </div>

                        {accounts?.length > 1 && !account?.isPrimary && (isEditing && editingIndex === index) && (
                            <div className="mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPrimaryAccount(index)}
                                    iconName="Star"
                                    iconPosition="left"
                                >
                                    Set as Primary
                                </Button>
                            </div>
                        )}
                    </div>
                ))}

                {accounts?.length === 0 && (
                    <div className="text-center py-8">
                        <Icon name="CreditCard" size={48} className="mx-auto text-text-secondary mb-4" />
                        <p className="text-text-secondary mb-4">No bank accounts added yet</p>
                        <Button
                            variant="outline"
                            onClick={handleAddAccount}
                            iconName="Plus"
                            iconPosition="left"
                        >
                            Add First Account
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BankDetailsSection;