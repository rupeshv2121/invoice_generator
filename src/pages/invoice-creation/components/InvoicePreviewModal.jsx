import Button from '../../../components/ui/Button';


const InvoicePreviewModal = ({
    isOpen,
    onClose,
    companyData,
    customerData,
    invoiceDetails,
    items,
    additionalCharges,
    bankDetails,
    termsAndConditions
}) => {
    if (!isOpen) return null;

    const calculateTotals = () => {
        const subtotal = items?.reduce((sum, item) => sum + (item?.taxableAmount || 0), 0);
        const totalDiscount = items?.reduce((sum, item) => sum + (item?.discountAmount || 0), 0);
        const totalCGST = items?.reduce((sum, item) => sum + (item?.cgstAmount || 0), 0);
        const totalSGST = items?.reduce((sum, item) => sum + (item?.sgstAmount || 0), 0);
        const totalIGST = items?.reduce((sum, item) => sum + (item?.igstAmount || 0), 0);
        const shipping = parseFloat(additionalCharges?.shipping) || 0;
        const otherCharges = parseFloat(additionalCharges?.other) || 0;
        const grandTotal = subtotal + totalCGST + totalSGST + totalIGST + shipping + otherCharges;

        return {
            subtotal,
            totalDiscount,
            totalCGST,
            totalSGST,
            totalIGST,
            shipping,
            otherCharges,
            grandTotal
        };
    };

    const totals = calculateTotals();
    const isInterState = companyData?.state !== customerData?.billingAddress?.state;

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        // PDF generation would be implemented here
        alert('PDF download functionality would be implemented with a PDF library like jsPDF or react-pdf');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Invoice Preview</h2>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            iconName="Printer"
                            iconPosition="left"
                        >
                            Print
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleDownloadPDF}
                            iconName="Download"
                            iconPosition="left"
                        >
                            Download PDF
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            iconName="X"
                        />
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div className="p-8 bg-white text-black" id="invoice-content">
                        {/* Invoice Header */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">{companyData?.name}</h1>
                                <p className="text-sm text-gray-600 mb-1">{companyData?.address}</p>
                                <p className="text-sm text-gray-600 mb-1">Phone: {companyData?.phone}</p>
                                <p className="text-sm text-gray-600">Email: {companyData?.email}</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-xl font-bold text-gray-800 mb-2">TAX INVOICE</h2>
                                <p className="text-sm text-gray-600 mb-1">GSTIN: {companyData?.gstin}</p>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Invoice Details</h3>
                                <p className="text-sm text-gray-600 mb-1">Invoice No: {invoiceDetails?.invoiceNumber}</p>
                                <p className="text-sm text-gray-600 mb-1">Invoice Date: {new Date(invoiceDetails.invoiceDate)?.toLocaleDateString('en-GB')}</p>
                                <p className="text-sm text-gray-600">Due Date: {new Date(invoiceDetails.dueDate)?.toLocaleDateString('en-GB')}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Payment Terms</h3>
                                <p className="text-sm text-gray-600">{invoiceDetails?.paymentTerms?.replace('net', 'Net ')?.replace('immediate', 'Immediate')}</p>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Billed To</h3>
                                <p className="text-sm text-gray-600 mb-1">{customerData?.billingAddress?.name}</p>
                                <p className="text-sm text-gray-600 mb-1">{customerData?.billingAddress?.address}</p>
                                <p className="text-sm text-gray-600 mb-1">{customerData?.billingAddress?.city}, {customerData?.billingAddress?.state} - {customerData?.billingAddress?.pincode}</p>
                                {customerData?.billingAddress?.gstin && (
                                    <p className="text-sm text-gray-600">GSTIN: {customerData?.billingAddress?.gstin}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Shipped To</h3>
                                <p className="text-sm text-gray-600 mb-1">{customerData?.shippingAddress?.name}</p>
                                <p className="text-sm text-gray-600 mb-1">{customerData?.shippingAddress?.address}</p>
                                <p className="text-sm text-gray-600">{customerData?.shippingAddress?.city}, {customerData?.shippingAddress?.state} - {customerData?.shippingAddress?.pincode}</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-8">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-2 text-left text-xs font-medium">Sr.</th>
                                        <th className="border border-gray-300 p-2 text-left text-xs font-medium">Description</th>
                                        <th className="border border-gray-300 p-2 text-left text-xs font-medium">HSN</th>
                                        <th className="border border-gray-300 p-2 text-left text-xs font-medium">Unit</th>
                                        <th className="border border-gray-300 p-2 text-right text-xs font-medium">Qty</th>
                                        <th className="border border-gray-300 p-2 text-right text-xs font-medium">Rate</th>
                                        <th className="border border-gray-300 p-2 text-right text-xs font-medium">Amount</th>
                                        <th className="border border-gray-300 p-2 text-right text-xs font-medium">Disc%</th>
                                        <th className="border border-gray-300 p-2 text-right text-xs font-medium">Tax%</th>
                                        {isInterState ? (
                                            <th className="border border-gray-300 p-2 text-right text-xs font-medium">IGST</th>
                                        ) : (
                                            <>
                                                <th className="border border-gray-300 p-2 text-right text-xs font-medium">CGST</th>
                                                <th className="border border-gray-300 p-2 text-right text-xs font-medium">SGST</th>
                                            </>
                                        )}
                                        <th className="border border-gray-300 p-2 text-right text-xs font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items?.map((item, index) => (
                                        <tr key={item?.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="border border-gray-300 p-2 text-center text-xs">{index + 1}</td>
                                            <td className="border border-gray-300 p-2 text-xs">{item?.description}</td>
                                            <td className="border border-gray-300 p-2 text-xs">{item?.hsnCode}</td>
                                            <td className="border border-gray-300 p-2 text-xs">{item?.unit}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{item?.quantity}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">₹{parseFloat(item?.rate)?.toFixed(2)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">₹{item?.grossAmount?.toFixed(2)}</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{item?.discountPercent}%</td>
                                            <td className="border border-gray-300 p-2 text-right text-xs">{item?.taxRate}%</td>
                                            {isInterState ? (
                                                <td className="border border-gray-300 p-2 text-right text-xs">₹{item?.igstAmount?.toFixed(2)}</td>
                                            ) : (
                                                <>
                                                    <td className="border border-gray-300 p-2 text-right text-xs">₹{item?.cgstAmount?.toFixed(2)}</td>
                                                    <td className="border border-gray-300 p-2 text-right text-xs">₹{item?.sgstAmount?.toFixed(2)}</td>
                                                </>
                                            )}
                                            <td className="border border-gray-300 p-2 text-right text-xs font-medium">₹{item?.totalAmount?.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end mb-8">
                            <div className="w-80">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>₹{totals?.subtotal?.toFixed(2)}</span>
                                    </div>
                                    {totals?.totalDiscount > 0 && (
                                        <div className="flex justify-between">
                                            <span>Total Discount:</span>
                                            <span>-₹{totals?.totalDiscount?.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {totals?.totalCGST > 0 && (
                                        <div className="flex justify-between">
                                            <span>CGST:</span>
                                            <span>₹{totals?.totalCGST?.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {totals?.totalSGST > 0 && (
                                        <div className="flex justify-between">
                                            <span>SGST:</span>
                                            <span>₹{totals?.totalSGST?.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {totals?.totalIGST > 0 && (
                                        <div className="flex justify-between">
                                            <span>IGST:</span>
                                            <span>₹{totals?.totalIGST?.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {totals?.shipping > 0 && (
                                        <div className="flex justify-between">
                                            <span>Shipping:</span>
                                            <span>₹{totals?.shipping?.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {totals?.otherCharges > 0 && (
                                        <div className="flex justify-between">
                                            <span>Other Charges:</span>
                                            <span>₹{totals?.otherCharges?.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-300 pt-2">
                                        <div className="flex justify-between font-bold text-base">
                                            <span>Grand Total:</span>
                                            <span>₹{totals?.grandTotal?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bank Details and Terms */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Bank Details</h3>
                                <p className="text-xs text-gray-600 mb-1">Account Name: {bankDetails?.accountName}</p>
                                <p className="text-xs text-gray-600 mb-1">Account Number: {bankDetails?.accountNumber}</p>
                                <p className="text-xs text-gray-600 mb-1">IFSC Code: {bankDetails?.ifscCode}</p>
                                <p className="text-xs text-gray-600 mb-1">Bank: {bankDetails?.bankName}</p>
                                <p className="text-xs text-gray-600">Branch: {bankDetails?.branch}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Terms & Conditions</h3>
                                <div className="text-xs text-gray-600 whitespace-pre-line">
                                    {termsAndConditions?.content}
                                </div>
                            </div>
                        </div>

                        {/* Signature */}
                        <div className="flex justify-end">
                            <div className="text-center">
                                <div className="h-16 mb-2"></div>
                                <div className="border-t border-gray-300 pt-2">
                                    <p className="text-sm font-medium text-gray-800">Authorized Signatory</p>
                                    <p className="text-xs text-gray-600">{companyData?.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreviewModal;