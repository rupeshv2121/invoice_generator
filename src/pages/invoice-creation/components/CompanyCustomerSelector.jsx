import Select from '../../../components/ui/Select';

import { Link } from 'react-router-dom';

const CompanyCustomerSelector = ({
    customers,
    selectedCustomerId,
    onCustomerChange,
    myCompanyProfile,
    loading = false
}) => {
    console.log('CompanyCustomerSelector props:', { customers, selectedCustomerId, loading });

    const customerOptions = customers?.map(customer => ({
        value: customer.id,
        label: customer.businessName,
        description: `${customer.email} - ${customer.location} ${customer.eximCode ? `(EXIM: ${customer.eximCode})` : ''}`
    }));

    console.log('Customer options:', customerOptions);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Customer (Buyer) *
                    </label>
                    <Select
                        value={selectedCustomerId || ''}
                        onChange={(value) => onCustomerChange(value ? parseInt(value) : null)}
                        options={customerOptions}
                        placeholder={loading ? 'Loading customers...' : 'Choose a customer...'}
                        className="w-full"
                        disabled={loading}
                        loading={loading}
                    />
                    {customers?.length === 0 && !loading && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <div className="text-sm text-yellow-800">
                                No customers found.
                                <Link to="/customer-management" className="font-medium underline hover:no-underline">
                                    Add your first customer
                                </Link> to start creating invoices.
                            </div>
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Customer billing/shipping address and EXIM code will be auto-filled
                    </p>
                </div>
                <div className="flex flex-col items-end  space-x-4">
                    <Link
                        to="/customer-management"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        + Add New Customer
                    </Link>
                </div>
            </div>

            {/* Quick Info Display */}
            {selectedCustomerId && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Your Business Details</h4>
                            <div className="space-y-1 text-gray-600">
                                <div><strong>Bank:</strong> {myCompanyProfile?.bankDetails?.bankName}</div>
                                <div><strong>Account:</strong> {myCompanyProfile?.bankDetails?.accountNumber}</div>
                                <div><strong>IFSC:</strong> {myCompanyProfile?.bankDetails?.ifscCode}</div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Selected Customer</h4>
                            <div className="space-y-1 text-gray-600">
                                <div><strong>EXIM Code:</strong> {customers?.find(c => c.id === selectedCustomerId)?.eximCode || 'N/A'}</div>
                                <div><strong>GST:</strong> {customers?.find(c => c.id === selectedCustomerId)?.gstNumber || 'Unregistered'}</div>
                                <div><strong>Country:</strong> {customers?.find(c => c.id === selectedCustomerId)?.billingAddress?.country}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyCustomerSelector;