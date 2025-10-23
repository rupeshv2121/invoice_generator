import { useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ItemFormModal = ({ isOpen, onClose, onSave, editingItem }) => {
    const [formData, setFormData] = useState({
        name: '',
        hsnCode: '',
        purchasePrice: '',
        sellingPrice: ''
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setFormData({
                name: editingItem.name,
                hsnCode: editingItem.hsnCode,
                purchasePrice: editingItem.purchasePrice,
                sellingPrice: editingItem.sellingPrice
            });
        } else {
            setFormData({
                name: '',
                hsnCode: '',
                purchasePrice: '',
                sellingPrice: ''
            });
        }
        setErrors({});
    }, [editingItem, isOpen]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const normalizedData = {
            name: formData.name.trim(),
            hsnCode: Number(formData.hsnCode),
            purchasePrice: parseFloat(formData.purchasePrice),
            sellingPrice: parseFloat(formData.sellingPrice)
        };

        try {
            const result = await onSave(normalizedData);
            console.log("Edit Result : ", result)

            if (result.success) {
                handleClose();
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                } else {
                    alert('Error saving item: ' + (result.error || 'Unknown error'));
                }
            }
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Error saving item: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            hsnCode: '',
            purchasePrice: '',
            sellingPrice: ''
        });
        setErrors({});
        onClose();
    };

    const calculateMargin = () => {
        const purchase = parseFloat(formData.purchasePrice) || 0;
        const selling = parseFloat(formData.sellingPrice) || 0;

        if (purchase === 0) return 0;

        const margin = ((selling - purchase) / purchase) * 100;
        return Math.round(margin * 100) / 100;
    };

    const calculateProfit = () => {
        const purchase = parseFloat(formData.purchasePrice) || 0;
        const selling = parseFloat(formData.sellingPrice) || 0;
        return Math.round((selling - purchase) * 100) / 100;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full my-8 max-h-full overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {editingItem ? 'Edit Item' : 'Add New Item'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 -m-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                    <div className="space-y-4">
                        {/* Item Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Item Name *
                            </label>
                            <Input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter item name"
                                error={errors.name}
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* HSN Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                HSN Code *
                            </label>
                            <Input
                                type="text"
                                value={formData.hsnCode}
                                onChange={(e) => handleInputChange('hsnCode', e.target.value)}
                                placeholder="Enter HSN code (e.g., 1001)"
                                error={errors.hsnCode}
                                required
                            />
                            {errors.hsnCode && (
                                <p className="text-sm text-red-600 mt-1">{errors.hsnCode}</p>
                            )}
                        </div>

                        {/* Purchase Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Purchase Price *
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.purchasePrice}
                                onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                                placeholder="Enter purchase price"
                                error={errors.purchasePrice}
                                required
                            />
                            {errors.purchasePrice && (
                                <p className="text-sm text-red-600 mt-1">{errors.purchasePrice}</p>
                            )}
                        </div>

                        {/* Selling Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Selling Price *
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.sellingPrice}
                                onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                                placeholder="Enter selling price"
                                error={errors.sellingPrice}
                                required
                            />
                            {errors.sellingPrice && (
                                <p className="text-sm text-red-600 mt-1">{errors.sellingPrice}</p>
                            )}
                        </div>

                        {/* Profit/Margin Display */}
                        {formData.purchasePrice && formData.sellingPrice && (
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Profit:</span>
                                    <span className={`font-medium ${calculateProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ₹{calculateProfit()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Margin:</span>
                                    <span className={`font-medium ${calculateMargin() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {calculateMargin()}%
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={saving}
                            className="w-full sm:w-auto order-2 sm:order-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="default"
                            disabled={saving}
                            loading={saving}
                            className="w-full sm:w-auto order-1 sm:order-2"
                            onClick={handleSubmit}
                        >
                            {saving ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemFormModal;