import { getMyCompanyProfile } from '../../../services/companyProfileService';
import { getInvoiceSettings, getTermsAndConditions } from '../../../services/settingsService';
import { formatIndianNumber, numberToWordsIndian } from '../../../utils/numberUtils';

const ExportInvoiceTemplate = ({
    companyData,
    receiverData,
    consigneeData,
    invoiceDetails,
    items
}) => {
    // Debug logging
    console.log('ExportInvoiceTemplate props:', { companyData, receiverData, consigneeData, invoiceDetails, items });

    // Auto-populate company profile, bank details, and terms from services
    let myCompanyProfile, termsAndConditions, invoiceSettings;

    try {
        myCompanyProfile = getMyCompanyProfile();
        termsAndConditions = getTermsAndConditions();
        invoiceSettings = getInvoiceSettings();
        console.log('Service data loaded:', { myCompanyProfile, termsAndConditions, invoiceSettings });
    } catch (error) {
        console.error('Error loading service data:', error);
        return <div>Error loading company data. Please check your company profile settings.</div>;
    }

    // Use service data if companyData is not provided or incomplete
    const autoCompanyData = companyData?.gstin ? companyData : {
        gstin: myCompanyProfile?.gstNumber,
        iecCode: myCompanyProfile?.iecCode,
        arn: myCompanyProfile?.arn,
        companyName: myCompanyProfile?.companyName,
        address: `${myCompanyProfile?.addressLine1 || ''}${myCompanyProfile?.addressLine2 ? ', ' + myCompanyProfile.addressLine2 : ''}`,
        city: myCompanyProfile?.city,
        state: myCompanyProfile?.state,
        pincode: myCompanyProfile?.postalCode,
        phone: myCompanyProfile?.phone,
        email: myCompanyProfile?.email
    };

    // Auto-populate bank details from company profile
    const autoBankDetails = {
        bankName: myCompanyProfile?.bankDetails?.bankName,
        accountNumber: myCompanyProfile?.bankDetails?.accountNumber,
        ifscCode: myCompanyProfile?.bankDetails?.ifscCode,
        accountName: myCompanyProfile?.bankDetails?.accountName,
        accountType: myCompanyProfile?.bankDetails?.accountType,
        branchName: myCompanyProfile?.bankDetails?.branchName
    };
    // Calculate totals
    const calculateTotals = () => {
        const subtotal = items?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
        const totalCGST = items?.reduce((sum, item) => sum + (item.cgstAmount || 0), 0) || 0;
        const totalSGST = items?.reduce((sum, item) => sum + (item.sgstAmount || 0), 0) || 0;
        const totalIGST = items?.reduce((sum, item) => sum + (item.igstAmount || 0), 0) || 0;
        const grandTotal = subtotal + totalCGST + totalSGST + totalIGST;

        return { subtotal, totalCGST, totalSGST, totalIGST, grandTotal };
    };

    const totals = calculateTotals();

    return (
        <div className="bg-white max-w-4xl mx-auto p-6 text-sm print:p-4 print:text-xs">
            {/* Header Section */}
            <div className="border-2 border-black">
                {/* Top Header with GSTIN, IEC, ARN and Invoice Type */}
                <div className="flex justify-between items-start p-2 border-b border-black">
                    <div className="text-xs space-y-1 w-[33%]">
                        <div><strong>GSTIN:</strong> {autoCompanyData?.gstin}</div>
                        <div><strong>IEC:</strong> {autoCompanyData?.iecCode}</div>
                        <div><strong>ARN:</strong> {autoCompanyData?.arn}</div>
                    </div>

                    <div className="text-center w-[34%]">
                        <h1 className="text-xl font-bold">EXPORT INVOICE </h1>
                        <p>Supply / Credit / Cash</p>
                    </div>

                    <div className="flex gap-2 text-xs w-[36%]">
                        <label className=" px-2 py-1 flex items-center">
                            <input type="checkbox" className="mr-1" />
                            ORIGINAL
                        </label>
                        <label className=" px-2 py-1 flex items-center">
                            <input type="checkbox" className="mr-1" />
                            DUPLICATE
                        </label>
                        <label className=" px-2 py-1 flex items-center">
                            <input type="checkbox" className="mr-1" />
                            TRIPLICATE
                        </label>
                    </div>
                </div>

                {/* Company Name and Details */}
                <div className="text-center px-4 py-1 border-b border-black">
                    <h2 className="text-2xl font-bold">{autoCompanyData?.companyName}</h2>
                    <p className="text-sm italic">Supplement for Export under Bond or Letter of Understanding without Payment of IGST</p>
                    <div className="mt-2 text-sm">
                        <p>{autoCompanyData?.address}, {autoCompanyData?.city}, {autoCompanyData?.state} - {autoCompanyData?.pincode}</p>
                        <p>Phone: {autoCompanyData?.phone} | Email: {autoCompanyData?.email}</p>
                    </div>
                </div>

                {/* Invoice Details Row */}
                <div className="grid grid-cols-4 border-b border-black">
                    <div className="p-2 border-r border-black">
                        <div><strong>Invoice No.</strong></div>
                        <div>{invoiceDetails?.invoiceNumber}</div>
                    </div>
                    <div className="p-2 border-r border-black">
                        <div><strong>Invoice Date</strong></div>
                        <div>{invoiceDetails?.invoiceDate ? new Date(invoiceDetails.invoiceDate).toLocaleDateString('en-GB') : ''}</div>
                    </div>
                    <div className="p-2 border-r border-black">
                        <div><strong>MARKA</strong></div>
                        <div>{invoiceDetails?.marka}</div>
                    </div>
                    <div className="p-2">
                        <div><strong>Date of Supply</strong></div>
                        <div>{invoiceDetails?.supplyDate ? new Date(invoiceDetails.supplyDate).toLocaleDateString('en-GB') : ''}</div>
                    </div>
                </div>

                {/* State and Transportation Details */}
                <div className="grid grid-cols-2 border-b border-black">
                    <div className="grid grid-cols-2">
                        <div className="p-2 border-r border-black">
                            <div><strong>State</strong></div>
                            <div>{autoCompanyData?.state}</div>
                        </div>
                        <div className="p-2 border-r border-black">
                            <div><strong>State Code</strong></div>
                            <div>{autoCompanyData?.stateCode || '09'}</div>
                        </div>
                    </div>
                    <div className="p-2">
                        <div><strong>Transportation</strong></div>
                        <div>{invoiceDetails?.transport}</div>
                    </div>
                </div>

                {/* Receiver and Consignee Details */}
                <div className="grid grid-cols-2">
                    {/* Details of Receiver | Billed to */}
                    <div className="border-r border-black">
                        <div className="bg-gray-100 p-2 font-bold border-b border-black text-center">
                            Details of Receiver | Billed to:
                        </div>
                        <div className="p-3 space-y-2">
                            <div><strong>Name</strong>: {receiverData?.name || 'JEEVAN HARDWARE'}</div>
                            <div><strong>Address</strong>: {receiverData?.address || ''}</div>
                            <div><strong>EXIM Code</strong>: {receiverData?.eximCode || '301806927014NP'}</div>
                            <div><strong>City</strong>: {receiverData?.city || ''}</div>
                            <div><strong>Country</strong>: {receiverData?.country || 'Nepal'}</div>
                        </div>
                    </div>

                    {/* Details of Consignee | Shipped to */}
                    <div>
                        <div className="bg-gray-100 p-2 font-bold border-b border-black text-center">
                            Details of Consignee | Shipped to:
                        </div>
                        <div className="p-3 space-y-2">
                            <div><strong>Name</strong>: {consigneeData?.name || 'JEEVAN HARDWARE'}</div>
                            <div><strong>Address</strong>: {consigneeData?.address || 'Kathmandu, kathmandu MC-11, Bhotebahali, 00'}</div>
                            <div><strong>EXIM Code</strong>: {consigneeData?.eximCode || '301806927014NP'}</div>
                            <div><strong>City</strong>: {consigneeData?.city || ''}</div>
                            <div><strong>Country</strong>: {consigneeData?.country || 'Nepal'}</div>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="border-t border-black">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-black p-2 text-center">Sr. No.</th>
                                <th className="border border-black p-2 text-center">Name of Product</th>
                                <th className="border border-black p-2 text-center">HSN ACS</th>
                                <th className="border border-black p-2 text-center">Units</th>
                                <th className="border border-black p-2 text-center">Qty</th>
                                <th className="border border-black p-2 text-center">Rate</th>
                                <th className="border border-black p-2 text-center">Amount</th>
                                <th className="border border-black p-2 text-center">Less: Disc.</th>
                                <th className="border border-black p-2 text-center">CGST<br />Rate</th>
                                <th className="border border-black p-2 text-center">SGST<br />Rate</th>
                                <th className="border border-black p-2 text-center">IGST<br />Rate (Amount)</th>
                                <th className="border border-black p-2 text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items?.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-black p-2 text-center">{index + 1}</td>
                                    <td className="border border-black p-2">{item.description}</td>
                                    <td className="border border-black p-2 text-center">{item.hsnCode}</td>
                                    <td className="border border-black p-2 text-center">{item.unit}</td>
                                    <td className="border border-black p-2 text-center">{item.quantity}</td>
                                    <td className="border border-black p-2 text-right">{formatIndianNumber(item.rate)}</td>
                                    <td className="border border-black p-2 text-right">{formatIndianNumber(item.amount?.toFixed(2))}</td>
                                    <td className="border border-black p-2 text-center">0</td>
                                    <td className="border border-black p-2 text-center">(0.00)</td>
                                    <td className="border border-black p-2 text-center">(0.00)</td>
                                    <td className="border border-black p-2 text-center">(0.00)</td>
                                    <td className="border border-black p-2 text-right">{formatIndianNumber(item.amount?.toFixed(2))}</td>
                                </tr>
                            )) || [
                                    <tr key="1">
                                        <td className="border border-black p-2 text-center">1</td>
                                        <td className="border border-black p-2">Safty 1.5" (Door King Brand)</td>
                                        <td className="border border-black p-2 text-center">83024110</td>
                                        <td className="border border-black p-2 text-center">gz</td>
                                        <td className="border border-black p-2 text-center">5</td>
                                        <td className="border border-black p-2 text-right">320</td>
                                        <td className="border border-black p-2 text-right">1,600.00</td>
                                        <td className="border border-black p-2 text-center">0</td>
                                        <td className="border border-black p-2 text-center">(0.00)</td>
                                        <td className="border border-black p-2 text-center">(0.00)</td>
                                        <td className="border border-black p-2 text-center">(0.00)</td>
                                        <td className="border border-black p-2 text-right">1,600.00</td>
                                    </tr>,
                                    <tr key="2">
                                        <td className="border border-black p-2 text-center">2</td>
                                        <td className="border border-black p-2">Safty 2" (Door King Brand)</td>
                                        <td className="border border-black p-2 text-center">83024110</td>
                                        <td className="border border-black p-2 text-center">gz</td>
                                        <td className="border border-black p-2 text-center">10</td>
                                        <td className="border border-black p-2 text-right">360</td>
                                        <td className="border border-black p-2 text-right">3,600.00</td>
                                        <td className="border border-black p-2 text-center">0</td>
                                        <td className="border border-black p-2 text-center">(0.00)</td>
                                        <td className="border border-black p-2 text-center">(0.00)</td>
                                        <td className="border border-black p-2 text-center">(0.00)</td>
                                        <td className="border border-black p-2 text-right">3,600.00</td>
                                    </tr>,
                                    <tr key="3">
                                        <td className="border border-black p-2 text-center">3</td>
                                        <td className="border border-black p-2">Safty 4" (Door King Brand)</td>
                                        <td className="border border-black p-2 text-center">83024110</td>
                                        <td className="border border-black p-2 text-center">gz</td>
                                        <td className="border border-black p-2 text-center">5</td>
                                        <td className="border border-black p-2 text-right">500</td>
                                        <td className="border border-black p-2 text-right">2,500.00</td>
                                        <td className="border border-black p-2 text-center">0</td>
                                        <td className="border border-black p-2 text-center">(0.00)</td>
                                        <td className="border border-black p-2 text-center">(0.00)</td>
                                        <td className="border border-black p-2 text-center">(0.00)</td>
                                        <td className="border border-black p-2 text-right">2,500.00</td>
                                    </tr>,
                                    <tr key="4">
                                        <td className="border border-black p-2 text-center">4</td>
                                        <td className="border border-black p-2">Tower Bolt 4" (Anti Brand)</td>
                                        <td className="border border-black p-2 text-center">83024110</td>
                                        <td className="border border-black p-2 text-center">doz</td>
                                        <td className="border border-black p-2 text-center">200</td>
                                        <td className="border border-black p-2 text-right">174</td>
                                        <td className="border border-black p-2 text-right">34,800.00</td>
                                        <td className="border border-black p-2 text-center">0</td>
                                        <td className="border border-black p-2 text-center">(0.00)</td>
                                        <td className="border border-black p-2 text-center">(0.00)</td>
                                        <td className="border border-black p-2 text-center">(0.00)</td>
                                        <td className="border border-black p-2 text-right">34,800.00</td>
                                    </tr>
                                ]}

                            {/* Empty rows for spacing */}
                            {Array.from({ length: 4 }, (_, i) => (
                                <tr key={`empty-${i}`}>
                                    <td className="border border-black p-2">{5 + i}</td>
                                    <td className="border border-black p-2"></td>
                                    <td className="border border-black p-2"></td>
                                    <td className="border border-black p-2"></td>
                                    <td className="border border-black p-2"></td>
                                    <td className="border border-black p-2"></td>
                                    <td className="border border-black p-2"></td>
                                    <td className="border border-black p-2"></td>
                                    <td className="border border-black p-2"></td>
                                    <td className="border border-black p-2"></td>
                                    <td className="border border-black p-2"></td>
                                    <td className="border border-black p-2"></td>
                                </tr>
                            ))}

                            {/* Total Row */}
                            <tr className="font-bold">
                                <td className="border border-black p-2 text-center" colSpan="5">Total :</td>
                                <td className="border border-black p-2 text-center">220</td>
                                <td className="border border-black p-2 text-right">42,500.00</td>
                                <td className="border border-black p-2 text-center">0.00</td>
                                <td className="border border-black p-2 text-center">0.00</td>
                                <td className="border border-black p-2 text-center">0.00</td>
                                <td className="border border-black p-2 text-center">0.00</td>
                                <td className="border border-black p-2 text-right">42,500.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Total Amount Section */}
                <div className="border-t border-black p-4">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="font-bold">Total Invoice Amount In Words:</div>
                            <div className="mt-2">{numberToWordsIndian(Math.floor(totals.grandTotal || 42500))} Rupees Only</div>
                        </div>
                        <div className="text-right">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>Total Amount</div>
                                <div className="text-right">{formatIndianNumber((totals.grandTotal || 42500).toFixed(2))}</div>
                                <div>Rounded Amount:</div>
                                <div className="text-right">{formatIndianNumber((totals.grandTotal || 42500).toFixed(2))}</div>
                                <div className="font-bold">GST Payable on Reverse Charge</div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bank Details */}
                <div className="border-t border-black p-4">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="font-bold mb-2">Bank Details :</div>
                            <div className="space-y-1 text-sm">
                                <div><strong>Bank Name</strong>: {autoBankDetails?.bankName}</div>
                                <div><strong>Bank Account Number</strong>: {autoBankDetails?.accountNumber}</div>
                                <div><strong>Bank Branch IFSC</strong>: {autoBankDetails?.ifscCode}</div>
                                <div><strong>Account Name</strong>: {autoBankDetails?.accountName}</div>
                                <div><strong>Account Type</strong>: {autoBankDetails?.accountType}</div>
                                <div><strong>Branch</strong>: {autoBankDetails?.branchName}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm">Certified that the particulars given above are true and correct.</div>
                            <div className="mt-8">
                                <div className="font-bold">For, {companyData?.companyName || 'Shri Pashupatinath Enterprises'}</div>
                                <div className="mt-8 text-sm">Authorised Signatory</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terms & Conditions */}
                <div className="border-t border-black p-4">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="font-bold mb-2">Terms & Conditions</div>
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
            </div>
        </div>
    );
};

export default ExportInvoiceTemplate;