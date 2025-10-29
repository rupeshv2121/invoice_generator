import { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CustomerModal = ({
    isOpen,
    onClose,
    customer,
    onSave,
    mode = 'add' // 'add', 'edit', 'view'
}) => {
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        gstin: '',
        EximCode: '',
        pan: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (customer && mode !== 'add') {
            setFormData({
                name: customer?.name || '',
                companyName: customer?.companyName || '',
                email: customer?.email || '',
                phone: customer?.phone || '',
                gstin: customer?.gstin || '',
                EximCode: customer?.EximCode || '',
                pan: customer?.pan || '',
                address: customer?.address || '',
                city: customer?.city || '',
                state: customer?.state || '',
                pincode: customer?.pincode || '',
                country: customer?.country || 'India'
            });
        } else if (mode === 'add') {
            setFormData({
                name: '',
                companyName: '',
                email: '',
                phone: '',
                gstin: '',
                EximCode: '',
                pan: '',
                address: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India'
            });
        }
    }, [customer, mode]);



    const validateForm = () => {
        const newErrors = {};

        if (!formData?.companyName?.trim()) {
            newErrors.companyName = 'Company name is required';
        }

        if (!formData?.name?.trim()) {
            newErrors.name = 'Contact person name is required';
        }

        if (!formData?.address?.trim()) {
            newErrors.address = 'Address is required';
        }

        if (formData?.email && !/\S+@\S+\.\S+/?.test(formData?.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (formData?.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/?.test(formData?.gstin)) {
            newErrors.gstin = 'Invalid GST number format';
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

    const handleSubmit = async (e) => {
        e?.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(formData);
            handleClose();
        } catch (error) {
            console.error('Error saving customer:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            companyName: '',
            email: '',
            phone: '',
            gstin: '',
            EximCode: '',
            pan: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
        });
        setErrors({});
        onClose();
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {mode === 'add' ? 'Add New Customer' : mode === 'edit' ? 'Edit Customer' : 'Customer Details'}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Icon name="X" className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Company Name"
                                type="text"
                                value={formData?.companyName}
                                onChange={(e) => handleInputChange('companyName', e?.target?.value)}
                                error={errors?.companyName}
                                required
                                disabled={mode === 'view'}
                            />

                            <Input
                                label="Contact Person Name"
                                type="text"
                                value={formData?.name}
                                onChange={(e) => handleInputChange('name', e?.target?.value)}
                                error={errors?.name}
                                required
                                disabled={mode === 'view'}
                            />

                            <Input
                                label="Email"
                                type="email"
                                value={formData?.email}
                                onChange={(e) => handleInputChange('email', e?.target?.value)}
                                error={errors?.email}
                                disabled={mode === 'view'}
                            />

                            <Input
                                label="Phone"
                                type="tel"
                                value={formData?.phone}
                                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                                error={errors?.phone}
                                disabled={mode === 'view'}
                            />

                            <Input
                                label="GST Number"
                                type="text"
                                value={formData?.gstin}
                                onChange={(e) => handleInputChange('gstin', e?.target?.value?.toUpperCase())}
                                error={errors?.gstin}
                                placeholder="22AAAAA0000A1Z5"
                                disabled={mode === 'view'}
                            />

                            <Input
                                label="EXIM Code"
                                type="text"
                                value={formData?.EximCode}
                                onChange={(e) => handleInputChange('EximCode', e?.target?.value?.toUpperCase())}
                                error={errors?.EximCode}
                                placeholder="301806927014NP"
                                disabled={mode === 'view'}
                            />

                            <Input
                                label="PAN Number"
                                type="text"
                                value={formData?.pan}
                                onChange={(e) => handleInputChange('pan', e?.target?.value?.toUpperCase())}
                                error={errors?.pan}
                                placeholder="ABCDE1234F"
                                disabled={mode === 'view'}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Address Information</h3>

                            <Input
                                label="Address"
                                type="textarea"
                                value={formData?.address}
                                onChange={(e) => handleInputChange('address', e?.target?.value)}
                                error={errors?.address}
                                required
                                disabled={mode === 'view'}
                                rows={3}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Input
                                    label="City"
                                    type="text"
                                    value={formData?.city}
                                    onChange={(e) => handleInputChange('city', e?.target?.value)}
                                    error={errors?.city}
                                    disabled={mode === 'view'}
                                />

                                <Input
                                    label="State"
                                    type="text"
                                    value={formData?.state}
                                    onChange={(e) => handleInputChange('state', e?.target?.value)}
                                    error={errors?.state}
                                    disabled={mode === 'view'}
                                />

                                <Input
                                    label="Pincode"
                                    type="text"
                                    value={formData?.pincode}
                                    onChange={(e) => handleInputChange('pincode', e?.target?.value)}
                                    error={errors?.pincode}
                                    disabled={mode === 'view'}
                                />
                            </div>

                            <Input
                                label="Country"
                                type="text"
                                value={formData?.country}
                                onChange={(e) => handleInputChange('country', e?.target?.value)}
                                error={errors?.country}
                                disabled={mode === 'view'}
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                {mode !== 'view' && (
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                loading={isSubmitting}
                            >
                                {mode === 'add' ? 'Add Customer' : 'Update Customer'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerModal;