import { useState } from 'react';
import { downloadInvoicePDF, getInvoicePDFBlob } from '../../services/pdfService';

const PDFPreview = () => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Sample invoice data for testing
    const sampleInvoiceData = {
        invoiceDetails: {
            invoiceNumber: 'EXP-1001',
            invoiceDate: '06/10/2025',
            marka: 'MARKA',
            dateOfSupply: '06/10/2025',
            state: 'Uttar Pradesh',
            stateCode: '09',
            transportation: 'PawanPutra Roadlines'
        },
        billedTo: {
            name: 'JEEVAN HARDWARE',
            address: 'Kathmandu, kathmandu MC-11, Bhotebahali, 00',
            gstin: '29ABCDE1234F1Z5',
            contactNumber: '+977-9876543210'
        },
        shippedTo: {
            name: 'JEEVAN HARDWARE',
            address: 'Kathmandu, kathmandu MC-11, Bhotebahali, 00',
            gstin: '29ABCDE1234F1Z5'
        },
        items: [
            {
                description: 'Safety 1.5" (Door King Brand)',
                hsnCode: '83024110',
                unit: 'gz',
                quantity: 5,
                rate: 320.00,
                totalAmount: 1600.00
            },
            {
                description: 'Safety 2" (Door King Brand)',
                hsnCode: '83024110',
                unit: 'gz',
                quantity: 10,
                rate: 360.00,
                totalAmount: 3600.00
            },
            {
                description: 'Safety 4" (Door King Brand)',
                hsnCode: '83024110',
                unit: 'gz',
                quantity: 5,
                rate: 500.00,
                totalAmount: 2500.00
            },
            {
                description: 'Tower Bolt 4" (Anti Brand)',
                hsnCode: '83024110',
                unit: 'doz',
                quantity: 200,
                rate: 174.00,
                totalAmount: 34800.00
            }
        ]
    };

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        try {
            const result = downloadInvoicePDF(sampleInvoiceData, 'test-invoice.pdf');
            if (result.success) {
                console.log('PDF downloaded successfully');
            } else {
                console.error('Failed to download PDF:', result.error);
                alert('Failed to download PDF: ' + result.error);
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Error downloading PDF: ' + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePreviewPDF = async () => {
        setIsGenerating(true);
        try {
            const result = getInvoicePDFBlob(sampleInvoiceData);
            if (result.success) {
                const url = URL.createObjectURL(result.blob);
                setPreviewUrl(url);
            } else {
                console.error('Failed to generate PDF blob:', result.error);
                alert('Failed to generate preview: ' + result.error);
            }
        } catch (error) {
            console.error('Error generating PDF preview:', error);
            alert('Error generating preview: ' + error.message);
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

                    {/* Control Panel */}
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

                    {/* Sample Data Display */}
                    <div className="bg-gray-100 rounded-lg p-4 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Sample Invoice Data</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Invoice Details</h3>
                                <div className="space-y-1 text-gray-600">
                                    <p><span className="font-medium">Number:</span> {sampleInvoiceData.invoiceDetails.invoiceNumber}</p>
                                    <p><span className="font-medium">Date:</span> {sampleInvoiceData.invoiceDetails.invoiceDate}</p>
                                    <p><span className="font-medium">State:</span> {sampleInvoiceData.invoiceDetails.state}</p>
                                    <p><span className="font-medium">Transportation:</span> {sampleInvoiceData.invoiceDetails.transportation}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Customer</h3>
                                <div className="space-y-1 text-gray-600">
                                    <p><span className="font-medium">Name:</span> {sampleInvoiceData.billedTo.name}</p>
                                    <p><span className="font-medium">GSTIN:</span> {sampleInvoiceData.billedTo.gstin}</p>
                                    <p><span className="font-medium">Contact:</span> {sampleInvoiceData.billedTo.contactNumber}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-medium text-gray-700 mb-2">Items ({sampleInvoiceData.items.length})</h3>
                            <div className="text-gray-600 text-sm">
                                Total Amount: ₹{sampleInvoiceData.items.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>

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
                            <li><strong>Download PDF:</strong> Generates and downloads the PDF file directly to your computer</li>
                            <li><strong>Preview PDF:</strong> Shows the PDF in an embedded viewer below for testing</li>
                            <li><strong>Sample Data:</strong> Uses predefined invoice data for consistent testing</li>
                            <li>Check the browser console for any error messages or debugging information</li>
                            <li>Test different screen sizes and ensure the PDF layout remains consistent</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFPreview;