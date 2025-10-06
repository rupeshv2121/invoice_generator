import Button from '../../../components/ui/Button';
import { downloadInvoicePDF } from '../../../services/pdfService';
import ExportInvoiceTemplate from './ExportInvoiceTemplate';

const InvoicePreviewModal = ({
    isOpen,
    onClose,
    companyData,
    customerData,
    invoiceDetails,
    items,
    additionalCharges
}) => {
    if (!isOpen) return null;

    // Debug logging
    console.log('InvoicePreviewModal props:', { companyData, customerData, invoiceDetails, items, additionalCharges });

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
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        const invoiceData = {
            companyData,
            customerData,
            invoiceDetails,
            items,
            additionalCharges
        };

        const result = downloadInvoicePDF(invoiceData);
        if (result.success) {
            alert('PDF downloaded successfully!');
        } else {
            alert('Error downloading PDF: ' + result.error);
        }
    };

    // Prepare data for the export invoice template
    const exportInvoiceData = {
        companyData: {
            companyName: companyData?.name,
            address: companyData?.address,
            phone: companyData?.phone,
            email: companyData?.email,
            gstin: companyData?.gstin,
            iecCode: companyData?.iecCode,
            arn: companyData?.arn,
            state: companyData?.state,
            stateCode: companyData?.stateCode
        },
        receiverData: {
            name: customerData?.billingAddress?.name,
            address: customerData?.billingAddress?.address,
            eximCode: customerData?.billingAddress?.eximCode,
            city: customerData?.billingAddress?.city,
            country: customerData?.billingAddress?.country || 'Nepal'
        },
        consigneeData: {
            name: customerData?.shippingAddress?.name || customerData?.billingAddress?.name,
            address: customerData?.shippingAddress?.address || customerData?.billingAddress?.address,
            eximCode: customerData?.shippingAddress?.eximCode || customerData?.billingAddress?.eximCode,
            city: customerData?.shippingAddress?.city || customerData?.billingAddress?.city,
            country: customerData?.shippingAddress?.country || customerData?.billingAddress?.country || 'Nepal'
        },
        invoiceDetails: {
            invoiceNumber: invoiceDetails?.invoiceNumber,
            invoiceDate: invoiceDetails?.invoiceDate,
            supplyDate: invoiceDetails?.supplyDate,
            marka: invoiceDetails?.marka,
            transport: invoiceDetails?.transport
        },
        items: items?.map(item => ({
            description: item?.description,
            hsnCode: item?.hsnCode,
            unit: item?.unit,
            quantity: item?.quantity,
            rate: item?.rate,
            amount: item?.grossAmount,
            cgstAmount: item?.cgstAmount,
            sgstAmount: item?.sgstAmount,
            igstAmount: item?.igstAmount
        }))
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-gray-200 space-y-2 sm:space-y-0">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Export Invoice Preview</h2>
                    
                    {/* Desktop buttons */}
                    <div className="hidden sm:flex items-center space-x-2">
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
                    
                    {/* Mobile buttons */}
                    <div className="flex sm:hidden items-center justify-between w-full space-x-2">
                        <div className="flex items-center space-x-2 flex-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrint}
                                iconName="Printer"
                                className="flex-1"
                            >
                                Print
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleDownloadPDF}
                                iconName="Download"
                                className="flex-1"
                            >
                                PDF
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            iconName="X"
                            className="ml-2"
                        />
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-80px)]" id="invoice-content">
                    <div className="p-2 sm:p-4">
                        <ExportInvoiceTemplate
                            companyData={exportInvoiceData.companyData}
                            receiverData={exportInvoiceData.receiverData}
                            consigneeData={exportInvoiceData.consigneeData}
                            invoiceDetails={exportInvoiceData.invoiceDetails}
                            items={exportInvoiceData.items}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreviewModal;