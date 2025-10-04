import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CustomerDetailsSection = ({
    customerData,
    onCustomerDataChange,
    customers,
    sameAsShipping,
    onSameAsShippingChange
}) => {
    const customerOptions = customers?.map(customer => ({
        value: customer?.id,
        label: customer?.name,
        description: customer?.email
    }));

    const handleCustomerSelect = (customerId) => {
        const selectedCustomer = customers?.find(c => c?.id === customerId);
        if (selectedCustomer) {
            onCustomerDataChange('selectedCustomer', selectedCustomer);
            onCustomerDataChange('billingAddress', {
                name: selectedCustomer?.name,
                address: selectedCustomer?.address,
                city: selectedCustomer?.city,
                state: selectedCustomer?.state,
                pincode: selectedCustomer?.pincode,
                gstin: selectedCustomer?.gstin || ''
            });
            if (sameAsShipping) {
                onCustomerDataChange('shippingAddress', {
                    name: selectedCustomer?.name,
                    address: selectedCustomer?.address,
                    city: selectedCustomer?.city,
                    state: selectedCustomer?.state,
                    pincode: selectedCustomer?.pincode
                });
            }
        }
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Customer Details</h2>
            <div className="mb-4">
                <Select
                    label="Select Customer"
                    options={customerOptions}
                    value={customerData?.selectedCustomer?.id || ''}
                    onChange={handleCustomerSelect}
                    placeholder="Choose a customer"
                    searchable
                    required
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Billing Address */}
                <div>
                    <h3 className="text-md font-medium text-foreground mb-3">Billing Address</h3>
                    <div className="space-y-3">
                        <Input
                            label="Name"
                            type="text"
                            value={customerData?.billingAddress?.name}
                            onChange={(e) => onCustomerDataChange('billingAddress', {
                                ...customerData?.billingAddress,
                                name: e?.target?.value
                            })}
                            placeholder="Enter billing name"
                            required
                        />
                        <Input
                            label="Address"
                            type="text"
                            value={customerData?.billingAddress?.address}
                            onChange={(e) => onCustomerDataChange('billingAddress', {
                                ...customerData?.billingAddress,
                                address: e?.target?.value
                            })}
                            placeholder="Enter billing address"
                            required
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                label="City"
                                type="text"
                                value={customerData?.billingAddress?.city}
                                onChange={(e) => onCustomerDataChange('billingAddress', {
                                    ...customerData?.billingAddress,
                                    city: e?.target?.value
                                })}
                                placeholder="City"
                                required
                            />
                            <Input
                                label="Pincode"
                                type="text"
                                value={customerData?.billingAddress?.pincode}
                                onChange={(e) => onCustomerDataChange('billingAddress', {
                                    ...customerData?.billingAddress,
                                    pincode: e?.target?.value
                                })}
                                placeholder="Pincode"
                                required
                            />
                        </div>
                        <Input
                            label="State"
                            type="text"
                            value={customerData?.billingAddress?.state}
                            onChange={(e) => onCustomerDataChange('billingAddress', {
                                ...customerData?.billingAddress,
                                state: e?.target?.value
                            })}
                            placeholder="State"
                            required
                        />
                        <Input
                            label="GSTIN (Optional)"
                            type="text"
                            value={customerData?.billingAddress?.gstin}
                            onChange={(e) => onCustomerDataChange('billingAddress', {
                                ...customerData?.billingAddress,
                                gstin: e?.target?.value
                            })}
                            placeholder="Customer GSTIN"
                        />
                    </div>
                </div>

                {/* Shipping Address */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md font-medium text-foreground">Shipping Address</h3>
                        <Checkbox
                            label="Same as billing"
                            checked={sameAsShipping}
                            onChange={(e) => onSameAsShippingChange(e?.target?.checked)}
                        />
                    </div>
                    <div className="space-y-3">
                        <Input
                            label="Name"
                            type="text"
                            value={customerData?.shippingAddress?.name}
                            onChange={(e) => onCustomerDataChange('shippingAddress', {
                                ...customerData?.shippingAddress,
                                name: e?.target?.value
                            })}
                            placeholder="Enter shipping name"
                            disabled={sameAsShipping}
                            required
                        />
                        <Input
                            label="Address"
                            type="text"
                            value={customerData?.shippingAddress?.address}
                            onChange={(e) => onCustomerDataChange('shippingAddress', {
                                ...customerData?.shippingAddress,
                                address: e?.target?.value
                            })}
                            placeholder="Enter shipping address"
                            disabled={sameAsShipping}
                            required
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                label="City"
                                type="text"
                                value={customerData?.shippingAddress?.city}
                                onChange={(e) => onCustomerDataChange('shippingAddress', {
                                    ...customerData?.shippingAddress,
                                    city: e?.target?.value
                                })}
                                placeholder="City"
                                disabled={sameAsShipping}
                                required
                            />
                            <Input
                                label="Pincode"
                                type="text"
                                value={customerData?.shippingAddress?.pincode}
                                onChange={(e) => onCustomerDataChange('shippingAddress', {
                                    ...customerData?.shippingAddress,
                                    pincode: e?.target?.value
                                })}
                                placeholder="Pincode"
                                disabled={sameAsShipping}
                                required
                            />
                        </div>
                        <Input
                            label="State"
                            type="text"
                            value={customerData?.shippingAddress?.state}
                            onChange={(e) => onCustomerDataChange('shippingAddress', {
                                ...customerData?.shippingAddress,
                                state: e?.target?.value
                            })}
                            placeholder="State"
                            disabled={sameAsShipping}
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsSection;