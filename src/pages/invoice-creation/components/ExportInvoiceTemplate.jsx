import { useEffect, useState } from 'react';
// import { getMyCompanyProfile } from '../../../services/companyProfileService';
import { getInvoiceSettings, getTermsAndConditions } from '../../../services/settingsService';
import { formatIndianNumber, numberToWordsIndian } from '../../../utils/numberUtils';

const ExportInvoiceTemplate = ({
    companyData,
    bankDetails,
    receiverData,
    consigneeData,
    invoiceDetails,
    items = []
}) => {
    const [myCompanyProfile, setMyCompanyProfile] = useState(null);
    const [termsAndConditions, setTermsAndConditions] = useState([]);
    const [invoiceSettings, setInvoiceSettings] = useState(null);

    // Load data from services
    useEffect(() => {
        try {
            // const profile = getMyCompanyProfile();
            const terms = getTermsAndConditions();
            const settings = getInvoiceSettings();

            setMyCompanyProfile(profile);
            setTermsAndConditions(terms);
            setInvoiceSettings(settings);
        } catch (error) {
            console.error('Error loading service data:', error);
        }
    }, []);

    // Use service data if companyData is not provided or incomplete
    const autoCompanyData = companyData?.gstin ? companyData : {
        gstin: myCompanyProfile?.gstNumber || '09AGIPK4533G1ZD',
        iecCode: myCompanyProfile?.iecCode || 'AGIPK4533G',
        arn: myCompanyProfile?.arn || 'AA9604180513ZDE',
        companyName: myCompanyProfile?.companyName || 'SHRI PASHUPATINATH ENTERPRISES',
        address: myCompanyProfile?.addressLine1 || '19/54 Hanuman Puri, Mahendar Nagar, Aligarh',
        city: myCompanyProfile?.city || 'Aligarh',
        state: myCompanyProfile?.state || 'Uttar Pradesh',
        stateCode: myCompanyProfile?.stateCode || '09',
        pincode: myCompanyProfile?.postalCode || '202001',
        phone: myCompanyProfile?.phone || '+91 8923646841',
        email: myCompanyProfile?.email || 'ak6999551@gmail.com'
    };

    // Auto-populate bank details from company profile or use provided bank details
    const autoBankDetails = bankDetails?.bankName ? bankDetails : {
        bankName: myCompanyProfile?.bankDetails?.bankName || companyData?.bankName || 'Canara Bank',
        accountNumber: myCompanyProfile?.bankDetails?.accountNumber || companyData?.bankAccountNumber || '1250006448551',
        ifscCode: myCompanyProfile?.bankDetails?.ifscCode || companyData?.bankIfscCode || 'CNRB0001274',
        accountName: myCompanyProfile?.bankDetails?.accountName || companyData?.companyName || autoCompanyData.companyName,
        accountType: myCompanyProfile?.bankDetails?.accountType || 'Current',
        branchName: myCompanyProfile?.bankDetails?.branchName || companyData?.bankBranch || 'Aligarh Main Branch'
    };

    // Calculate totals from items
    const calculateTotals = () => {
        if (!items || items.length === 0) {
            // Default sample data totals
            return {
                totalQuantity: 220,
                subtotal: 42500,
                totalCGST: 0,
                totalSGST: 0,
                totalIGST: 0,
                grandTotal: 42500
            };
        }

        // Helper function to safely parse numbers
        const safeParseFloat = (value) => {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0 : parsed;
        };

        const totalQuantity = items.reduce((sum, item) => {
            return sum + safeParseFloat(item.quantity);
        }, 0);

        const subtotal = items.reduce((sum, item) => {
            const quantity = safeParseFloat(item.quantity);
            const rate = safeParseFloat(item.rate);
            const totalAmount = safeParseFloat(item.totalAmount);
            // Use totalAmount if available, otherwise calculate from quantity * rate
            return sum + (totalAmount || (quantity * rate));
        }, 0);

        const totalCGST = items.reduce((sum, item) => {
            return sum + safeParseFloat(item.cgstAmount);
        }, 0);

        const totalSGST = items.reduce((sum, item) => {
            return sum + safeParseFloat(item.sgstAmount);
        }, 0);

        const totalIGST = items.reduce((sum, item) => {
            return sum + safeParseFloat(item.igstAmount);
        }, 0);

        const grandTotal = subtotal + totalCGST + totalSGST + totalIGST;

        return { totalQuantity, subtotal, totalCGST, totalSGST, totalIGST, grandTotal };
    };

    const totals = calculateTotals();

    // Safe formatting functions to prevent NaN display
    const safeFormatNumber = (value) => {
        if (value === null || value === undefined || isNaN(value)) {
            return '0';
        }
        return formatIndianNumber(value);
    };

    const safeFormatCurrency = (value) => {
        if (value === null || value === undefined || isNaN(value)) {
            return '0.00';
        }
        return formatIndianNumber(Number(value).toFixed(2));
    };

    const safeNumberToWords = (value) => {
        if (value === null || value === undefined || isNaN(value)) {
            return 'Zero';
        }
        return numberToWordsIndian(Math.floor(Number(value)));
    };

    // Sample data if no items provided
    const sampleItems = [
        {
            description: 'Safty 1.5" (Door King Brand)',
            hsnCode: '83024110',
            unit: 'gz',
            quantity: 5,
            rate: 320,
            totalAmount: 1600
        },
        {
            description: 'Safty 2" (Door King Brand)',
            hsnCode: '83024110',
            unit: 'gz',
            quantity: 10,
            rate: 360,
            totalAmount: 3600
        },
        {
            description: 'Safty 4" (Door King Brand)',
            hsnCode: '83024110',
            unit: 'gz',
            quantity: 5,
            rate: 500,
            totalAmount: 2500
        },
        {
            description: 'Tower Bolt 4" (Anti Brand)',
            hsnCode: '83024110',
            unit: 'doz',
            quantity: 200,
            rate: 174,
            totalAmount: 34800
        }
    ];

    const displayItems = items && items.length > 0 ? items : sampleItems;

    return (
        <div className="bg-white max-w-4xl mx-auto p-6 text-sm print:p-4 print:text-xs">
            {/* Header Section */}
            <div className="border-2 border-black">
                {/* Top Header with GSTIN, IEC, ARN and Invoice Type */}
                <div className="flex justify-between items-start p-2 border-b border-black">
                    <div className="text-xs space-y-1 w-[33%]">
                        <div><strong>GSTIN:</strong> {autoCompanyData.gstin}</div>
                        <div><strong>IEC:</strong> {autoCompanyData.iecCode}</div>
                        <div><strong>ARN:</strong> {autoCompanyData.arn}</div>
                    </div>

                    <div className="text-center w-[34%]">
                        <h1 className="text-xl font-bold">EXPORT INVOICE</h1>
                        <p>Supply / Credit / Cash</p>
                    </div>

                    <div className="text-right text-xs w-[33%] space-y-1">
                        <div className="flex items-center justify-end">
                            <span className="mr-2">☐</span>
                            <span>ORIGINAL</span>
                        </div>
                        <div className="flex items-center justify-end">
                            <span className="mr-2">☐</span>
                            <span>DUPLICATE</span>
                        </div>
                        <div className="flex items-center justify-end">
                            <span className="mr-2">☐</span>
                            <span>TRIPLICATE</span>
                        </div>
                    </div>
                </div>

                {/* Company Name and Details */}
                <div className="text-center px-4 py-3 border-b border-black">
                    <h2 className="text-2xl font-bold mb-2">{autoCompanyData.companyName}</h2>
                    <p className="text-sm italic mb-2">Supplement for Export under Bond or Letter of Understanding without Payment of IGST</p>
                    <div className="text-sm space-y-1">
                        <p>{autoCompanyData.address}, {autoCompanyData.city}, {autoCompanyData.state} - {autoCompanyData.pincode}</p>
                        <p>Phone: {autoCompanyData.phone} | Email: {autoCompanyData.email}</p>
                    </div>
                </div>

                {/* Invoice Details Row */}
                <div className="grid grid-cols-4 border-b border-black min-h-[60px]">
                    <div className="p-2 border-r border-black flex flex-col justify-center">
                        <div className="font-bold text-xs mb-1">Invoice No.</div>
                        <div className="text-sm">{invoiceDetails?.invoiceNumber || 'EXP-1001'}</div>
                    </div>
                    <div className="p-2 border-r border-black flex flex-col justify-center">
                        <div className="font-bold text-xs mb-1">Invoice Date</div>
                        <div className="text-sm">{invoiceDetails?.invoiceDate ? new Date(invoiceDetails.invoiceDate).toLocaleDateString('en-GB') : '06/10/2025'}</div>
                    </div>
                    <div className="p-2 border-r border-black flex flex-col justify-center">
                        <div className="font-bold text-xs mb-1">MARKA</div>
                        <div className="text-sm">{invoiceDetails?.marka || ''}</div>
                    </div>
                    <div className="p-2 flex flex-col justify-center">
                        <div className="font-bold text-xs mb-1">Date of Supply</div>
                        <div className="text-sm">{invoiceDetails?.supplyDate ? new Date(invoiceDetails.supplyDate).toLocaleDateString('en-GB') : '06/10/2025'}</div>
                    </div>
                </div>

                {/* State and Transportation Details */}
                <div className="grid grid-cols-2 border-b border-black min-h-[50px]">
                    <div className="grid grid-cols-2">
                        <div className="p-2 border-r border-black flex flex-col justify-center">
                            <div className="font-bold text-xs mb-1">State</div>
                            <div className="text-sm">{autoCompanyData.state}</div>
                        </div>
                        <div className="p-2 border-r border-black flex flex-col justify-center">
                            <div className="font-bold text-xs mb-1">State Code</div>
                            <div className="text-sm">{autoCompanyData.stateCode}</div>
                        </div>
                    </div>
                    <div className="p-2 flex flex-col justify-center">
                        <div className="font-bold text-xs mb-1">Transportation</div>
                        <div className="text-sm">{invoiceDetails?.transport || 'PawanPutra Roadlines'}</div>
                    </div>
                </div>

                {/* Receiver and Consignee Details */}
                <div className="grid grid-cols-2 min-h-[140px]">
                    {/* Details of Receiver | Billed to */}
                    <div className="border-r border-black">
                        <div className="bg-gray-100 p-2 font-bold border-b border-black text-center text-xs">
                            Details of Receiver | Billed to:
                        </div>
                        <div className="p-3 space-y-1 text-xs">
                            <div><strong>Name:</strong> {receiverData?.name || 'JEEVAN HARDWARE'}</div>
                            <div><strong>Address:</strong> {receiverData?.address || ''}</div>
                            <div><strong>EXIM Code:</strong> {receiverData?.eximCode || '301806927014NP'}</div>
                            <div><strong>City:</strong> {receiverData?.city || ''}</div>
                            <div><strong>Country:</strong> {receiverData?.country || 'Nepal'}</div>
                        </div>
                    </div>

                    {/* Details of Consignee | Shipped to */}
                    <div>
                        <div className="bg-gray-100 p-2 font-bold border-b border-black text-center text-xs">
                            Details of Consignee | Shipped to:
                        </div>
                        <div className="p-3 space-y-1 text-xs">
                            <div><strong>Name:</strong> {consigneeData?.name || 'JEEVAN HARDWARE'}</div>
                            <div><strong>Address:</strong> {consigneeData?.address || 'Kathmandu, kathmandu MC-11, Bhotebahali, 00'}</div>
                            <div><strong>EXIM Code:</strong> {consigneeData?.eximCode || '301806927014NP'}</div>
                            <div><strong>City:</strong> {consigneeData?.city || ''}</div>
                            <div><strong>Country:</strong> {consigneeData?.country || 'Nepal'}</div>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="border-t border-black">
                    <table className="w-full border-collapse table-fixed">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black p-1 text-center text-xs font-bold w-12">Sr. No.</th>
                                <th className="border border-black p-1 text-center text-xs font-bold w-32">Name of Product</th>
                                <th className="border border-black p-1 text-center text-xs font-bold w-16">HSN ACS</th>
                                <th className="border border-black p-1 text-center text-xs font-bold w-12">Units</th>
                                <th className="border border-black p-1 text-center text-xs font-bold w-12">Qty</th>
                                <th className="border border-black p-1 text-center text-xs font-bold w-16">Rate</th>
                                <th className="border border-black p-1 text-center text-xs font-bold w-20">Amount</th>
                                <th className="border border-black p-1 text-center text-xs font-bold w-16">CGST<br />Rate</th>
                                <th className="border border-black p-1 text-center text-xs font-bold w-16">SGST<br />Rate</th>
                                <th className="border border-black p-1 text-center text-xs font-bold w-20">IGST Rate<br />(Amount)</th>
                                <th className="border border-black p-1 text-center text-xs font-bold w-20">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayItems.map((item, index) => (
                                <tr key={index} className="h-8">
                                    <td className="border border-black p-1 text-center text-xs">{index + 1}</td>
                                    <td className="border border-black p-1 text-xs truncate">{item.description || ''}</td>
                                    <td className="border border-black p-1 text-center text-xs">{item.hsnCode || ''}</td>
                                    <td className="border border-black p-1 text-center text-xs">{item.unit || ''}</td>
                                    <td className="border border-black p-1 text-center text-xs">{safeFormatNumber(item.quantity)}</td>
                                    <td className="border border-black p-1 text-right text-xs">{safeFormatCurrency(item.rate)}</td>
                                    <td className="border border-black p-1 text-right text-xs">{safeFormatCurrency(item.totalAmount || (item.quantity * item.rate))}</td>
                                    <td className="border border-black p-1 text-center text-xs">(0.00)</td>
                                    <td className="border border-black p-1 text-center text-xs">(0.00)</td>
                                    <td className="border border-black p-1 text-center text-xs">(0.00)</td>
                                    <td className="border border-black p-1 text-right text-xs">{safeFormatCurrency(item.totalAmount || (item.quantity * item.rate))}</td>
                                </tr>
                            ))}

                            {/* Empty rows for spacing */}
                            {Array.from({ length: Math.max(0, 8 - displayItems.length) }, (_, i) => (
                                <tr key={`empty-${i}`} className="h-8">
                                    <td className="border border-black p-1 text-center text-xs">{displayItems.length + i + 1}</td>
                                    <td className="border border-black p-1 text-xs"></td>
                                    <td className="border border-black p-1 text-xs"></td>
                                    <td className="border border-black p-1 text-xs"></td>
                                    <td className="border border-black p-1 text-xs"></td>
                                    <td className="border border-black p-1 text-xs"></td>
                                    <td className="border border-black p-1 text-xs"></td>
                                    <td className="border border-black p-1 text-xs"></td>
                                    <td className="border border-black p-1 text-xs"></td>
                                    <td className="border border-black p-1 text-xs"></td>
                                    <td className="border border-black p-1 text-xs"></td>
                                </tr>
                            ))}

                            {/* Total Row */}
                            <tr className="font-bold bg-gray-50 h-8">
                                <td className="border border-black p-1 text-center text-xs" colSpan="4">Total :</td>
                                <td className="border border-black p-1 text-center text-xs">{safeFormatNumber(totals.totalQuantity)}</td>
                                <td className="border border-black p-1 text-right text-xs"></td>
                                <td className="border border-black p-1 text-right text-xs">{safeFormatCurrency(totals.subtotal)}</td>
                                <td className="border border-black p-1 text-center text-xs">{safeFormatCurrency(totals.totalCGST)}</td>
                                <td className="border border-black p-1 text-center text-xs">{safeFormatCurrency(totals.totalSGST)}</td>
                                <td className="border border-black p-1 text-center text-xs">{safeFormatCurrency(totals.totalIGST)}</td>
                                <td className="border border-black p-1 text-right text-xs">{safeFormatCurrency(totals.grandTotal)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Total Amount Section */}
                <div className="border-t border-black p-4">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="font-bold mb-2">Total Invoice Amount In Words:</div>
                            <div>{safeNumberToWords(totals.grandTotal)} Rupees Only</div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Total Amount</span>
                                <span className="text-right">{safeFormatCurrency(totals.grandTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Rounded Amount:</span>
                                <span className="text-right">{safeFormatCurrency(totals.grandTotal)}</span>
                            </div>
                            <div className="font-bold text-center mt-4">GST Payable on Reverse Charge</div>
                        </div>
                    </div>
                </div>

                {/* Bank Details and Signature */}
                <div className="border-t border-black p-4">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="font-bold mb-3">Bank Details :</div>
                            <div className="space-y-1 text-sm">
                                <div><strong>Bank Name:</strong> {autoBankDetails.bankName}</div>
                                <div><strong>Bank Account Number:</strong> {autoBankDetails.accountNumber}</div>
                                <div><strong>Bank Branch IFSC:</strong> {autoBankDetails.ifscCode}</div>
                                <div><strong>Account Name:</strong> {autoBankDetails.accountName}</div>
                                <div><strong>Account Type:</strong> {autoBankDetails.accountType}</div>
                                <div><strong>Branch:</strong> {autoBankDetails.branchName}</div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm mb-4">Certified that the particulars given above are</div>
                            <div className="text-sm mb-8">true and correct.</div>
                            <div className="font-bold mb-12">For, {autoCompanyData.companyName}</div>
                            <div className="text-sm">Authorised Signatory</div>
                        </div>
                    </div>
                </div>

                {/* Terms & Conditions */}
                {termsAndConditions && termsAndConditions.length > 0 && (
                    <div className="border-t border-black p-4">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <div className="font-bold mb-3">Terms & Conditions</div>
                                <div className="text-xs space-y-1">
                                    <div>E & O.E</div>
                                    {termsAndConditions.map((term, index) => (
                                        <div key={index}>{index + 1}. {term}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="border border-black h-24 flex items-center justify-center">
                                    (Common Seal)
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExportInvoiceTemplate;