import { useEffect, useState } from 'react';
import { useInvoiceService } from '../../api/invoice';
import { downloadInvoicePDF, getInvoicePDFBlob } from '../../services/pdfService';

const PDFPreview = () => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [loading, setLoading] = useState(true);

    const { getInvoices } = useInvoiceService();

    // Fetch real invoices on component mount
    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const data = await getInvoices();
                console.log('Fetched invoices:', data);
                setInvoices(data || []);
                // Auto-select first invoice if available
                if (data && data.length > 0) {
                    setSelectedInvoiceId(data[0].id);
                }
            } catch (error) {
                console.error('Error fetching invoices:', error);
                setInvoices([]);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    // Get selected invoice data
    const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId);

    // Transform invoice data for PDF service
    const transformInvoiceForPDF = (invoice) => {
        if (!invoice) return null;

        const rawInvoice = invoice.raw || invoice;

        return {
            companyData: {
                name: rawInvoice?.company?.companyName || 'Your Company Name',
                companyName: rawInvoice?.company?.companyName || 'Your Company Name',
                address: rawInvoice?.company?.address || '',
                city: rawInvoice?.company?.city || '',
                state: rawInvoice?.company?.state || '',
                stateCode: rawInvoice?.stateCode || '',
                pincode: rawInvoice?.company?.pincode || '',
                phone: rawInvoice?.company?.phone || '',
                email: rawInvoice?.company?.email || '',
                gstin: rawInvoice?.company?.gstin || '',
                iecCode: rawInvoice?.company?.iecCode || '',
                arn: rawInvoice?.company?.arn || '',
                bankName: rawInvoice?.company?.bankName || '',
                bankAccountNumber: rawInvoice?.company?.bankAccountNumber || '',
                bankIfscCode: rawInvoice?.company?.bankIfscCode || '',
                bankBranch: rawInvoice?.company?.bankBranch || ''
            },
            customerData: {
                billingAddress: {
                    name: rawInvoice?.customer?.name || invoice?.customerName || 'Customer Name',
                    address: rawInvoice?.customer?.address || '',
                    city: rawInvoice?.customer?.city || '',
                    eximCode: rawInvoice?.customer?.EximCode || '',
                    country: rawInvoice?.customer?.country || 'Nepal'
                },
                shippingAddress: {
                    name: rawInvoice?.customer?.name || invoice?.customerName || 'Customer Name',
                    address: rawInvoice?.customer?.address || '',
                    city: rawInvoice?.customer?.city || '',
                    eximCode: rawInvoice?.customer?.EximCode || '',
                    country: rawInvoice?.customer?.country || 'Nepal'
                }
            },
            invoiceDetails: {
                invoiceNumber: rawInvoice?.invoiceNumber || invoice?.invoiceNumber || '1',
                invoiceDate: rawInvoice?.invoiceDate || invoice?.date || new Date().toISOString().split('T')[0],
                supplyDate: rawInvoice?.dateOfSupply || rawInvoice?.invoiceDate || invoice?.date || new Date().toISOString().split('T')[0],
                marka: rawInvoice?.marka || '',
                transport: rawInvoice?.transportation || ''
            },
            items: rawInvoice?.invoiceItems?.map(item => ({
                description: item?.description || '',
                hsnCode: item?.hsnCode || '',
                unit: item?.unit || 'PCS',
                quantity: parseFloat(item?.quantity) || 0,
                rate: parseFloat(item?.rate) || 0,
                taxableAmount: parseFloat(item?.amount) || 0,
                cgstAmount: parseFloat(item?.cgstAmount) || 0,
                sgstAmount: parseFloat(item?.sgstAmount) || 0,
                igstAmount: parseFloat(item?.igstAmount) || 0,
                totalAmount: parseFloat(item?.totalAmount) || 0
            })) || [],
            additionalCharges: {
                shipping: 0,
                other: 0
            }
        };
    };

    const invoiceData = transformInvoiceForPDF(selectedInvoice);

    const handleDownloadPDF = async () => {
        if (!invoiceData) {
            toast.warning('Please select an invoice first');
            return;
        }
        setIsGenerating(true);
        try {
            const result = downloadInvoicePDF(invoiceData, `invoice-${invoiceData.invoiceDetails.invoiceNumber}.pdf`);
            if (result.success) {
                console.log('PDF downloaded successfully');
            } else {
                console.error('Failed to download PDF:', result.error);
                toast.error('Failed to download PDF: ' + result.error);
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            toast.error('Error downloading PDF: ' + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGeneratePreview = async () => {
        if (!invoiceData) {
            toast.warning('Please select an invoice first');
            return;
        }
        setIsGenerating(true);
        try {
            const result = getInvoicePDFBlob(invoiceData);
            if (result.success) {
                // Revoke old URL if exists
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
                const url = URL.createObjectURL(result.blob);
                setPreviewUrl(url);
            } else {
                console.error('Failed to generate PDF blob:', result.error);
                toast.error('Failed to generate preview: ' + result.error);
            }
        } catch (error) {
            console.error('Error generating PDF preview:', error);
            toast.error('Error generating preview: ' + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const clearPreview = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">PDF Preview & Test</h1>

                    {/* Loading State */}
                    {loading && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-blue-700">Loading invoices...</p>
                            </div>
                        </div>
                    )}

                    {/* No Invoices State */}
                    {!loading && invoices.length === 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-yellow-700">No invoices found. Please create an invoice first.</p>
                        </div>
                    )}

                    {/* Invoice Selector */}
                    {!loading && invoices.length > 0 && (
                        <div className="bg-gray-100 rounded-lg p-4 mb-6">
                            <h2 className="text-lg font-semibold mb-3">Select Invoice</h2>
                            <select
                                value={selectedInvoiceId || ''}
                                onChange={(e) => {
                                    setSelectedInvoiceId(e.target.value);
                                    // Clear preview when changing invoice
                                    if (previewUrl) {
                                        URL.revokeObjectURL(previewUrl);
                                        setPreviewUrl(null);
                                    }
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {invoices.map((invoice) => (
                                    <option key={invoice.id} value={invoice.id}>
                                        Invoice #{invoice.raw?.invoiceNumber || invoice.invoiceNumber} - {invoice.customerName} - ₹{parseFloat(invoice.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Control Panel */}
                    {!loading && invoices.length > 0 && (
                        <div className="bg-gray-100 rounded-lg p-4 mb-6">
                            <h2 className="text-lg font-semibold mb-4">Test Controls</h2>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={handleDownloadPDF}
                                    disabled={isGenerating}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Download PDF
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handlePreviewPDF}
                                    disabled={isGenerating}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Preview PDF
                                        </>
                                    )}
                                </button>

                                {previewUrl && (
                                    <button
                                        onClick={clearPreview}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Clear Preview
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Invoice Data Display */}
                    {!loading && invoices.length > 0 && invoiceData && (
                        <div className="bg-gray-100 rounded-lg p-4 mb-6">
                            <h2 className="text-lg font-semibold mb-4">Selected Invoice Data</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-2">Company Details</h3>
                                    <div className="space-y-1 text-gray-600">
                                        <p><span className="font-medium">Name:</span> {invoiceData.companyData.companyName}</p>
                                        <p><span className="font-medium">GSTIN:</span> {invoiceData.companyData.gstin}</p>
                                        <p><span className="font-medium">IEC:</span> {invoiceData.companyData.iecCode}</p>
                                        <p><span className="font-medium">City:</span> {invoiceData.companyData.city}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-2">Invoice Details</h3>
                                    <div className="space-y-1 text-gray-600">
                                        <p><span className="font-medium">Number:</span> {invoiceData.invoiceDetails.invoiceNumber}</p>
                                        <p><span className="font-medium">Date:</span> {invoiceData.invoiceDetails.invoiceDate}</p>
                                        <p><span className="font-medium">Marka:</span> {invoiceData.invoiceDetails.marka || 'N/A'}</p>
                                        <p><span className="font-medium">Transport:</span> {invoiceData.invoiceDetails.transport || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-2">Customer</h3>
                                    <div className="space-y-1 text-gray-600">
                                        <p><span className="font-medium">Name:</span> {invoiceData.customerData.billingAddress.name}</p>
                                        <p><span className="font-medium">City:</span> {invoiceData.customerData.billingAddress.city}</p>
                                        <p><span className="font-medium">Country:</span> {invoiceData.customerData.billingAddress.country}</p>
                                        <p><span className="font-medium">Exim Code:</span> {invoiceData.customerData.billingAddress.eximCode || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="font-medium text-gray-700 mb-2">Items ({invoiceData.items.length})</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-600 text-sm">
                                    <div>
                                        <span className="font-medium">Subtotal:</span> ₹{invoiceData.items.reduce((sum, item) => sum + item.taxableAmount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </div>
                                    <div>
                                        <span className="font-medium">IGST:</span> ₹{invoiceData.items.reduce((sum, item) => sum + item.igstAmount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </div>
                                    <div>
                                        <span className="font-medium">Total:</span> ₹{invoiceData.items.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </div>
                                    <div>
                                        <span className="font-medium">Items:</span> {invoiceData.items.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PDF Preview */}
                    {previewUrl && (
                        <div className="bg-white rounded-lg border-2 border-gray-200">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold">PDF Preview</h2>
                            </div>
                            <div className="p-4">
                                <iframe
                                    src={previewUrl}
                                    className="w-full h-[800px] border border-gray-300 rounded"
                                    title="PDF Preview"
                                >
                                    <p>Your browser doesn't support iframe. <a href={previewUrl} target="_blank" rel="noopener noreferrer">Click here to view the PDF</a>.</p>
                                </iframe>
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Instructions</h3>
                        <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                            <li><strong>Select Invoice:</strong> Choose any invoice from your invoice list to test PDF generation</li>
                            <li><strong>Download PDF:</strong> Generates and downloads the PDF file directly to your computer</li>
                            <li><strong>Preview PDF:</strong> Shows the PDF in an embedded viewer below for testing</li>
                            <li><strong>Real Data:</strong> Uses actual invoice data from your database for accurate testing</li>
                            <li>Check the browser console for any error messages or debugging information</li>
                            <li>Test different invoices to ensure the PDF layout remains consistent</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFPreview;