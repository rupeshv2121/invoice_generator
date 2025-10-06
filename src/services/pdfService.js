import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getMyCompanyProfile } from './companyProfileService';
import { getTermsAndConditions } from './settingsService';

// Helper function to format Indian numbers
const formatIndianNumber = (num) => {
    if (!num) return '0.00';
    const numStr = parseFloat(num).toFixed(2);
    const parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

// Helper function to convert numbers to words (simplified version)
const numberToWordsIndian = (num) => {
    if (num === 0) return 'Zero';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convertHundreds = (n) => {
        let result = '';
        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }
        if (n >= 20) {
            result += tens[Math.floor(n / 10)];
            if (n % 10 > 0) result += ' ' + ones[n % 10];
        } else if (n >= 10) {
            result += teens[n - 10];
        } else if (n > 0) {
            result += ones[n];
        }
        return result;
    };

    if (num >= 10000000) { // Crores
        const crores = Math.floor(num / 10000000);
        let result = convertHundreds(crores) + ' Crore ';
        num %= 10000000;
        if (num >= 100000) {
            const lakhs = Math.floor(num / 100000);
            result += convertHundreds(lakhs) + ' Lakh ';
            num %= 100000;
        }
        if (num >= 1000) {
            const thousands = Math.floor(num / 1000);
            result += convertHundreds(thousands) + ' Thousand ';
            num %= 1000;
        }
        if (num > 0) {
            result += convertHundreds(num);
        }
        return result.trim();
    } else if (num >= 100000) { // Lakhs
        const lakhs = Math.floor(num / 100000);
        let result = convertHundreds(lakhs) + ' Lakh ';
        num %= 100000;
        if (num >= 1000) {
            const thousands = Math.floor(num / 1000);
            result += convertHundreds(thousands) + ' Thousand ';
            num %= 1000;
        }
        if (num > 0) {
            result += convertHundreds(num);
        }
        return result.trim();
    } else if (num >= 1000) { // Thousands
        const thousands = Math.floor(num / 1000);
        let result = convertHundreds(thousands) + ' Thousand ';
        num %= 1000;
        if (num > 0) {
            result += convertHundreds(num);
        }
        return result.trim();
    } else {
        return convertHundreds(num).trim();
    }
};

// PDF Generation Service matching ExportInvoiceTemplate exactly
export const generateInvoicePDF = (invoiceData) => {
    const { companyData, customerData, invoiceDetails, items, additionalCharges } = invoiceData;

    // Get company profile and terms from services
    const myCompanyProfile = getMyCompanyProfile();
    const termsAndConditions = getTermsAndConditions();

    // Create new PDF document
    const pdf = new jsPDF('portrait', 'mm', 'a4');

    // Page dimensions
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    let yPosition = 10;

    // Colors
    const blackColor = [0, 0, 0];
    const grayColor = [240, 240, 240];
    const primaryColor = [51, 51, 51]; // Dark gray for primary text
    const lightGray = [245, 245, 245]; // Light gray for backgrounds

    // Auto-populate company data from service if not provided
    const autoCompanyData = companyData?.gstin ? companyData : {
        gstin: myCompanyProfile?.gstNumber,
        iecCode: myCompanyProfile?.iecCode,
        arn: myCompanyProfile?.arn,
        companyName: myCompanyProfile?.companyName,
        address: `${myCompanyProfile?.addressLine1 || ''}${myCompanyProfile?.addressLine2 ? ', ' + myCompanyProfile.addressLine2 : ''}`,
        city: myCompanyProfile?.city,
        state: myCompanyProfile?.state,
        stateCode: myCompanyProfile?.stateCode || '09',
        pincode: myCompanyProfile?.postalCode,
        phone: myCompanyProfile?.phone,
        email: myCompanyProfile?.email
    };

    // Auto-populate bank details
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
        const subtotal = items?.reduce((sum, item) => sum + (item.totalAmount || 0), 0) || 0;
        return { subtotal, grandTotal: subtotal };
    };

    const totals = calculateTotals();

    // Helper functions
    const addText = (text, x, y, options = {}) => {
        const { fontSize = 10, fontStyle = 'normal', align = 'left', maxWidth = null, color = blackColor } = options;
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        pdf.setTextColor(...color);

        if (maxWidth) {
            const lines = pdf.splitTextToSize(text, maxWidth);
            pdf.text(lines, x, y, { align });
            return y + (lines.length * (fontSize / 2.83)); // Convert pt to mm
        } else {
            pdf.text(text, x, y, { align });
            return y + (fontSize / 2.83);
        }
    };

    const drawRect = (x, y, width, height, style = 'S') => {
        pdf.setDrawColor(...blackColor);
        pdf.setLineWidth(0.1);
        pdf.rect(x, y, width, height, style);
    };

    const fillRect = (x, y, width, height) => {
        pdf.setFillColor(...grayColor);
        pdf.rect(x, y, width, height, 'F');
    };

    // Manual table creation as fallback
    const createManualTable = (pdf, headers, data, startY, pageWidth) => {
        let currentY = startY;
        const tableWidth = pageWidth - 20;
        const colWidth = tableWidth / headers.length;

        // Draw header
        pdf.setFillColor(...grayColor);
        pdf.rect(10, currentY, tableWidth, 8, 'F');
        pdf.setDrawColor(...blackColor);
        pdf.rect(10, currentY, tableWidth, 8, 'S');

        headers.forEach((header, index) => {
            const x = 10 + (index * colWidth);
            pdf.line(x, currentY, x, currentY + 8);
            addText(header, x + 2, currentY + 5, { fontSize: 7, fontStyle: 'bold' });
        });

        currentY += 8;

        // Draw data rows
        data.forEach(row => {
            pdf.rect(10, currentY, tableWidth, 6, 'S');
            row.forEach((cell, index) => {
                const x = 10 + (index * colWidth);
                pdf.line(x, currentY, x, currentY + 6);
                const cellText = typeof cell === 'object' ? cell.content || '' : cell || '';
                addText(cellText.toString(), x + 2, currentY + 4, { fontSize: 7 });
            });
            currentY += 6;
        });

        return currentY + 5;
    };

    // Main border around entire document
    drawRect(10, yPosition, pageWidth - 20, pageHeight - 20);

    // Top header section
    yPosition += 5;

    // GSTIN, IEC, ARN section (left third)
    addText(`GSTIN: ${autoCompanyData?.gstin || ''}`, 15, yPosition + 5, { fontSize: 8 });
    addText(`IEC: ${autoCompanyData?.iecCode || ''}`, 15, yPosition + 10, { fontSize: 8 });
    addText(`ARN: ${autoCompanyData?.arn || ''}`, 15, yPosition + 15, { fontSize: 8 });

    // EXPORT INVOICE title (center third)
    addText('EXPORT INVOICE', pageWidth / 2, yPosition + 8, {
        fontSize: 16,
        fontStyle: 'bold',
        align: 'center'
    });
    addText('Supply / Credit / Cash', pageWidth / 2, yPosition + 15, {
        fontSize: 10,
        align: 'center'
    });

    // Checkboxes section (right third)
    const checkboxX = pageWidth - 80;
    addText('☐ ORIGINAL', checkboxX, yPosition + 5, { fontSize: 8 });
    addText('☐ DUPLICATE', checkboxX, yPosition + 10, { fontSize: 8 });
    addText('☐ TRIPLICATE', checkboxX, yPosition + 15, { fontSize: 8 });

    yPosition += 25;

    // Horizontal line
    pdf.line(10, yPosition, pageWidth - 10, yPosition);
    yPosition += 5;

    // Company name and details section
    addText(autoCompanyData?.companyName || 'Company Name', pageWidth / 2, yPosition, {
        fontSize: 18,
        fontStyle: 'bold',
        align: 'center'
    });
    yPosition += 8;

    addText('Supplement for Export under Bond or Letter of Understanding without Payment of IGST', pageWidth / 2, yPosition, {
        fontSize: 10,
        align: 'center'
    });
    yPosition += 8;

    addText(`${autoCompanyData?.address || ''}, ${autoCompanyData?.city || ''}, ${autoCompanyData?.state || ''} - ${autoCompanyData?.pincode || ''}`, pageWidth / 2, yPosition, {
        fontSize: 10,
        align: 'center',
        maxWidth: 160
    });
    yPosition += 8;

    addText(`Phone: ${autoCompanyData?.phone || ''} | Email: ${autoCompanyData?.email || ''}`, pageWidth / 2, yPosition, {
        fontSize: 10,
        align: 'center'
    });
    yPosition += 10;

    // Horizontal line
    pdf.line(10, yPosition, pageWidth - 10, yPosition);
    yPosition += 5;

    // Invoice details row (4 columns)
    const colWidth = (pageWidth - 20) / 4;
    let xPos = 10;

    // Column 1: Invoice No
    pdf.line(xPos + colWidth, yPosition - 5, xPos + colWidth, yPosition + 15);
    addText('Invoice No.', xPos + 2, yPosition, { fontSize: 10, fontStyle: 'bold' });
    addText(invoiceDetails?.invoiceNumber || '', xPos + 2, yPosition + 6, { fontSize: 10 });

    // Column 2: Invoice Date
    xPos += colWidth;
    pdf.line(xPos + colWidth, yPosition - 5, xPos + colWidth, yPosition + 15);
    addText('Invoice Date', xPos + 2, yPosition, { fontSize: 10, fontStyle: 'bold' });
    const invoiceDate = invoiceDetails?.invoiceDate ? new Date(invoiceDetails.invoiceDate).toLocaleDateString('en-GB') : '';
    addText(invoiceDate, xPos + 2, yPosition + 6, { fontSize: 10 });

    // Column 3: MARKA
    xPos += colWidth;
    pdf.line(xPos + colWidth, yPosition - 5, xPos + colWidth, yPosition + 15);
    addText('MARKA', xPos + 2, yPosition, { fontSize: 10, fontStyle: 'bold' });
    addText(invoiceDetails?.marka || '', xPos + 2, yPosition + 6, { fontSize: 10 });

    // Column 4: Date of Supply
    xPos += colWidth;
    addText('Date of Supply', xPos + 2, yPosition, { fontSize: 10, fontStyle: 'bold' });
    const supplyDate = invoiceDetails?.supplyDate ? new Date(invoiceDetails.supplyDate).toLocaleDateString('en-GB') : '';
    addText(supplyDate, xPos + 2, yPosition + 6, { fontSize: 10 });

    yPosition += 20;
    pdf.line(10, yPosition, pageWidth - 10, yPosition);

    yPosition += 5;

    // State and Transportation details row
    xPos = 10;
    const halfWidth = (pageWidth - 20) / 2;

    // Left half - State details (2 sub-columns)
    const quarterWidth = halfWidth / 2;

    // State
    pdf.line(xPos + quarterWidth, yPosition - 5, xPos + quarterWidth, yPosition + 15);
    addText('State', xPos + 2, yPosition, { fontSize: 10, fontStyle: 'bold' });
    addText(autoCompanyData?.state || '', xPos + 2, yPosition + 6, { fontSize: 10 });

    // State Code
    xPos += quarterWidth;
    pdf.line(xPos + quarterWidth, yPosition - 5, xPos + quarterWidth, yPosition + 15);
    addText('State Code', xPos + 2, yPosition, { fontSize: 10, fontStyle: 'bold' });
    addText(autoCompanyData?.stateCode || '09', xPos + 2, yPosition + 6, { fontSize: 10 });

    // Transportation
    xPos += quarterWidth;
    addText('Transportation', xPos + 2, yPosition, { fontSize: 10, fontStyle: 'bold' });
    addText(invoiceDetails?.transport || '', xPos + 2, yPosition + 6, { fontSize: 10 });

    yPosition += 20;
    pdf.line(10, yPosition, pageWidth - 10, yPosition);
    yPosition += 5;

    // Customer details section (2 columns)
    const customerColWidth = (pageWidth - 20) / 2;

    // Left column - Receiver details
    fillRect(10, yPosition, customerColWidth, 8);
    addText('Details of Receiver | Billed to:', pageWidth / 4, yPosition + 5, {
        fontSize: 10,
        fontStyle: 'bold',
        align: 'center'
    });

    // Right column - Consignee details
    pdf.line(10 + customerColWidth, yPosition, 10 + customerColWidth, yPosition + 50);
    fillRect(10 + customerColWidth, yPosition, customerColWidth, 8);
    addText('Details of Consignee | Shipped to:', (pageWidth / 4) * 3, yPosition + 5, {
        fontSize: 10,
        fontStyle: 'bold',
        align: 'center'
    });

    yPosition += 12;

    // Receiver details (left)
    addText(`Name: ${customerData?.billingAddress?.name || 'JEEVAN HARDWARE'}`, 12, yPosition, { fontSize: 9 });
    addText(`Address: ${customerData?.billingAddress?.address || ''}`, 12, yPosition + 6, { fontSize: 9 });
    addText(`EXIM Code: ${customerData?.billingAddress?.eximCode || '301806927014NP'}`, 12, yPosition + 12, { fontSize: 9 });
    addText(`City: ${customerData?.billingAddress?.city || ''}`, 12, yPosition + 18, { fontSize: 9 });
    addText(`Country: ${customerData?.billingAddress?.country || 'Nepal'}`, 12, yPosition + 24, { fontSize: 9 });

    // Consignee details (right)
    const rightX = 10 + customerColWidth + 2;
    addText(`Name: ${customerData?.shippingAddress?.name || customerData?.billingAddress?.name || 'JEEVAN HARDWARE'}`, rightX, yPosition, { fontSize: 9 });
    addText(`Address: ${customerData?.shippingAddress?.address || customerData?.billingAddress?.address || 'Kathmandu, kathmandu MC-11, Bhotebahali, 00'}`, rightX, yPosition + 6, { fontSize: 9, maxWidth: customerColWidth - 4 });
    addText(`EXIM Code: ${customerData?.shippingAddress?.eximCode || customerData?.billingAddress?.eximCode || '301806927014NP'}`, rightX, yPosition + 12, { fontSize: 9 });
    addText(`City: ${customerData?.shippingAddress?.city || customerData?.billingAddress?.city || ''}`, rightX, yPosition + 18, { fontSize: 9 });
    addText(`Country: ${customerData?.shippingAddress?.country || customerData?.billingAddress?.country || 'Nepal'}`, rightX, yPosition + 24, { fontSize: 9 });

    yPosition += 35;
    pdf.line(10, yPosition, pageWidth - 10, yPosition);

    yPosition += 5;

    // Create the items table with exact template structure
    const tableHeaders = [
        'Sr. No.', 'Name of Product', 'HSN ACS', 'Units', 'Qty', 'Rate',
        'Amount', 'Less: Disc.', 'CGST Rate', 'SGST Rate', 'IGST Rate (Amount)', 'Total'
    ];

    const tableData = [];

    // Add actual items or default sample data
    const itemsToShow = items && items.length > 0 ? items : [
        {
            description: 'Sample Product',
            hsnCode: '8471',
            unit: 'Nos',
            quantity: 1,
            rate: 42500,
            totalAmount: 42500
        }
    ];

    itemsToShow.forEach((item, index) => {
        tableData.push([
            (index + 1).toString(),
            item.description || '',
            item.hsnCode || '',
            item.unit || '',
            item.quantity?.toString() || '0',
            formatIndianNumber(item.rate || 0),
            formatIndianNumber(item.totalAmount?.toFixed(2) || '0.00'),
            '0',
            '(0.00)',
            '(0.00)',
            '(0.00)',
            formatIndianNumber(item.totalAmount?.toFixed(2) || '0.00')
        ]);
    });

    // Add empty rows to fill space (minimum 3 total rows)
    const minRows = 3;
    for (let i = itemsToShow.length; i < minRows; i++) {
        tableData.push(['', '', '', '', '', '', '', '', '', '', '', '']);
    }

    // Total row
    const totalQty = itemsToShow.reduce((sum, item) => sum + (item.quantity || 0), 0);
    tableData.push([
        { content: 'Total :', colSpan: 5, styles: { fontStyle: 'bold', halign: 'center' } },
        totalQty.toString(),
        formatIndianNumber(totals.grandTotal.toFixed(2)),
        '0.00',
        '0.00',
        '0.00',
        '0.00',
        formatIndianNumber(totals.grandTotal.toFixed(2))
    ]);

    try {
        if (typeof pdf.autoTable === 'function') {
            pdf.autoTable({
                head: [tableHeaders],
                body: tableData,
                startY: yPosition,
                theme: 'grid',
                styles: {
                    fontSize: 7,
                    cellPadding: 1,
                    lineColor: [0, 0, 0],
                    lineWidth: 0.1,
                    overflow: 'linebreak'
                },
                headStyles: {
                    fillColor: [240, 240, 240],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                    halign: 'center',
                    fontSize: 8
                },
                bodyStyles: {
                    textColor: [0, 0, 0]
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 12 },
                    1: { halign: 'left', cellWidth: 45 },
                    2: { halign: 'center', cellWidth: 15 },
                    3: { halign: 'center', cellWidth: 12 },
                    4: { halign: 'center', cellWidth: 12 },
                    5: { halign: 'right', cellWidth: 20 },
                    6: { halign: 'right', cellWidth: 20 },
                    7: { halign: 'center', cellWidth: 12 },
                    8: { halign: 'center', cellWidth: 15 },
                    9: { halign: 'center', cellWidth: 15 },
                    10: { halign: 'center', cellWidth: 20 },
                    11: { halign: 'right', cellWidth: 20 }
                },
                margin: { left: 10, right: 10 },
                tableWidth: 'auto'
            });
            yPosition = pdf.lastAutoTable.finalY + 5;
        } else {
            // Fallback if autoTable is not available
            yPosition = createManualTable(pdf, tableHeaders, tableData, yPosition, pageWidth);
        }
    } catch (error) {
        console.error('AutoTable failed:', error);
        // Fallback to manual table creation
        yPosition = createManualTable(pdf, tableHeaders, tableData, yPosition, pageWidth);
    }

    // Total Amount in Words section
    addText('Total Invoice Amount In Words:', 15, yPosition, { fontSize: 9, fontStyle: 'bold' });
    yPosition += 5;
    const amountInWords = numberToWordsIndian(Math.floor(totals.grandTotal)) + ' Rupees Only';
    addText(amountInWords, 15, yPosition, { fontSize: 9, maxWidth: 120 });

    // Right side - Amount summary (aligned with amount in words)
    const summaryX = pageWidth - 70;
    let summaryY = yPosition - 5;

    addText('Total Amount', summaryX, summaryY, { fontSize: 9 });
    addText(formatIndianNumber(totals.grandTotal.toFixed(2)), pageWidth - 15, summaryY, { fontSize: 9, align: 'right' });

    summaryY += 5;
    addText('Rounded Amount:', summaryX, summaryY, { fontSize: 9 });
    addText(formatIndianNumber(totals.grandTotal.toFixed(2)), pageWidth - 15, summaryY, { fontSize: 9, align: 'right' });

    summaryY += 5;
    addText('GST Payable on Reverse Charge', summaryX, summaryY, { fontSize: 8, fontStyle: 'bold' });

    yPosition += 15;

    // Bank Details and Signature section
    pdf.line(10, yPosition, pageWidth - 10, yPosition);
    yPosition += 5;

    // Left side - Bank Details
    addText('Bank Details :', 15, yPosition, { fontSize: 9, fontStyle: 'bold' });
    const bankStartY = yPosition + 5;

    addText(`Bank Name: ${autoBankDetails?.bankName || ''}`, 15, bankStartY, { fontSize: 8 });
    addText(`Bank Account Number: ${autoBankDetails?.accountNumber || ''}`, 15, bankStartY + 4, { fontSize: 8 });
    addText(`Bank Branch IFSC: ${autoBankDetails?.ifscCode || ''}`, 15, bankStartY + 8, { fontSize: 8 });
    addText(`Account Name: ${autoBankDetails?.accountName || ''}`, 15, bankStartY + 12, { fontSize: 8 });
    addText(`Account Type: ${autoBankDetails?.accountType || ''}`, 15, bankStartY + 16, { fontSize: 8 });
    addText(`Branch: ${autoBankDetails?.branchName || ''}`, 15, bankStartY + 20, { fontSize: 8 });

    // Right side - Certification and signature
    const signX = pageWidth - 70;

    addText('Certified that the particulars given above are true and correct.', signX, yPosition, {
        fontSize: 8,
        maxWidth: 60,
        align: 'center'
    });

    addText(`For, ${autoCompanyData?.companyName || 'Company Name'}`, signX, yPosition + 15, {
        fontSize: 9,
        fontStyle: 'bold',
        align: 'center'
    });

    addText('Authorised Signatory', signX, yPosition + 25, { fontSize: 8, align: 'center' });

    yPosition += 30;

    // Terms and Conditions (compact)
    if (yPosition < pageHeight - 40) {
        addText('Terms & Conditions :-', 15, yPosition, {
            fontSize: 9,
            fontStyle: 'bold'
        });
        yPosition += 5;

        const terms = [
            '1. Payment is due within 30 days of invoice date.',
            '2. Interest @ 24% p.a. will be charged on overdue amounts.',
            '3. All disputes subject to local jurisdiction only.'
        ];

        terms.forEach(term => {
            addText(term, 15, yPosition, { fontSize: 7 });
            yPosition += 3;
        });
    }

    return pdf;
};

// Function to download the PDF
export const downloadInvoicePDF = (invoiceData, filename = null) => {
    try {
        console.log('Starting PDF generation with data:', invoiceData);

        const pdf = generateInvoicePDF(invoiceData);

        if (!pdf) {
            throw new Error('Failed to generate PDF document');
        }

        const defaultFilename = `Invoice_${invoiceData.invoiceDetails?.invoiceNumber || 'draft'}_${new Date().toISOString().split('T')[0]}.pdf`;

        console.log('Downloading PDF as:', filename || defaultFilename);

        pdf.save(filename || defaultFilename);
        return { success: true };
    } catch (error) {
        console.error('Error generating PDF:', error);
        console.error('Error stack:', error.stack);
        return { success: false, error: error.message };
    }
};

// Function to get PDF as blob (for previewing or uploading)
export const getInvoicePDFBlob = (invoiceData) => {
    try {
        const pdf = generateInvoicePDF(invoiceData);
        return { success: true, blob: pdf.output('blob') };
    } catch (error) {
        console.error('Error generating PDF blob:', error);
        return { success: false, error: error.message };
    }
};