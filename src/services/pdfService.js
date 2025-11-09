import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import { getMyCompanyProfile } from './companyProfileService';
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
    // const myCompanyProfile = getMyCompanyProfile();
    const termsAndConditions = getTermsAndConditions();

    // Create new PDF document
    const pdf = new jsPDF('portrait', 'mm', 'a4');

    // Page dimensions
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 10;
    const contentWidth = pageWidth - (2 * margin);
    let yPosition = margin;

    // Auto-populate company data from service if not provided
    const autoCompanyData = {
        gstin: companyData?.gstin || '09AGIPK4533G1ZD',
        iecCode: companyData?.iecCode || 'AGIPK4533G',
        arn: companyData?.arn || 'AA9604180513ZDE',
        companyName: companyData?.name || 'SHRI PASHUPATINATH ENTERPRISES',
        address: companyData?.address || '19/54 Hanuman Puri, Mahendar Nagar, Aligarh',
        city: companyData?.city || 'Aligarh',
        state: companyData?.state || 'Uttar Pradesh',
        stateCode: companyData?.stateCode || '09',
        pincode: companyData?.pincode || '202001',
        phone: companyData?.phone || '+91 8923646841',
        email: companyData?.email || 'ak6999551@gmail.com'
    };

    // Auto-populate bank details
    const autoBankDetails = {
        bankName: companyData?.bankName || 'Canara Bank',
        accountNumber: companyData?.bankAccountNumber || '1250006448551',
        ifscCode: companyData?.bankIfscCode || 'CNRB0001274',
        accountName: companyData?.name || autoCompanyData.companyName,
        accountType: 'Current',
        branchName: companyData?.bankBranch || 'Main Branch'
    };

    // Calculate totals
    const calculateTotals = () => {
        const subtotal = items?.reduce((sum, item) => sum + (item.totalAmount || 0), 0) || 42500;
        return { subtotal, grandTotal: subtotal };
    };

    const totals = calculateTotals();

    // Helper functions for consistent styling
    const addText = (text, x, y, options = {}) => {
        const { fontSize = 9, fontStyle = 'normal', align = 'left', maxWidth = null } = options;
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        pdf.setTextColor(0, 0, 0);

        if (maxWidth) {
            const lines = pdf.splitTextToSize(text, maxWidth);
            pdf.text(lines, x, y, { align });
            return y + (lines.length * (fontSize / 2.5));
        } else {
            pdf.text(text, x, y, { align });
            return y + (fontSize / 2.5);
        }
    };

    const drawBorder = (x, y, width, height) => {
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.rect(x, y, width, height);
    };

    const drawLine = (x1, y1, x2, y2) => {
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.3);
        pdf.line(x1, y1, x2, y2);
    };

    // Main document border
    drawBorder(margin, margin, contentWidth, pageHeight - (2 * margin));

    // Header section with three columns
    yPosition += 3;

    // Left column - GSTIN, IEC, ARN
    addText(`GSTIN: ${autoCompanyData.gstin}`, margin + 2, yPosition + 4, { fontSize: 8 });
    addText(`IEC: ${autoCompanyData.iecCode}`, margin + 2, yPosition + 8, { fontSize: 8 });
    addText(`ARN: ${autoCompanyData.arn}`, margin + 2, yPosition + 12, { fontSize: 8 });

    // Center column - EXPORT INVOICE
    addText('EXPORT INVOICE', pageWidth / 2, yPosition + 6, {
        fontSize: 14,
        fontStyle: 'bold',
        align: 'center'
    });
    addText('Supply / Credit / Cash', pageWidth / 2, yPosition + 11, {
        fontSize: 10,
        align: 'center'
    });

    // Right column - Checkboxes
    addText('ORIGINAL', pageWidth - 30, yPosition + 4, { fontSize: 8 });
    addText('DUPLICATE', pageWidth - 30, yPosition + 8, { fontSize: 8 });
    addText('TRIPLICATE', pageWidth - 30, yPosition + 12, { fontSize: 8 });

    yPosition += 16;

    // Company details section
    drawLine(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 3;

    addText(autoCompanyData.companyName, pageWidth / 2, yPosition + 5, {
        fontSize: 16,
        fontStyle: 'bold',
        align: 'center'
    });
    yPosition += 8;

    addText('Supplement for Export under Bond or Letter of Understanding without Payment of IGST',
        pageWidth / 2, yPosition + 2, { fontSize: 9, align: 'center' });
    yPosition += 6;

    addText(`${autoCompanyData.address}, ${autoCompanyData.city}, ${autoCompanyData.state} - ${autoCompanyData.pincode}`,
        pageWidth / 2, yPosition, { fontSize: 9, align: 'center' });
    yPosition += 6;

    addText(`Phone: ${autoCompanyData.phone} | Email: ${autoCompanyData.email}`,
        pageWidth / 2, yPosition, { fontSize: 9, align: 'center' });
    yPosition += 4;

    // Invoice details grid
    drawLine(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 2;

    const gridHeight = 12;
    const col1Width = contentWidth * 0.25;
    const col2Width = contentWidth * 0.25;
    const col3Width = contentWidth * 0.25;
    const col4Width = contentWidth * 0.25;

    // Draw vertical lines for grid
    drawLine(margin + col1Width, yPosition - 2, margin + col1Width, yPosition + gridHeight);
    drawLine(margin + col1Width + col2Width, yPosition - 2, margin + col1Width + col2Width, yPosition + gridHeight);
    drawLine(margin + col1Width + col2Width + col3Width, yPosition - 2, margin + col1Width + col2Width + col3Width, yPosition + gridHeight);

    // Invoice details content
    addText('Invoice No.', margin + 2, yPosition + 4, { fontSize: 9, fontStyle: 'bold' });
    addText(invoiceDetails?.invoiceNumber || 'EXP-1001', margin + 2, yPosition + 9, { fontSize: 9 });

    addText('Invoice Date', margin + col1Width + 2, yPosition + 4, { fontSize: 9, fontStyle: 'bold' });
    const invoiceDate = invoiceDetails?.invoiceDate ? new Date(invoiceDetails.invoiceDate).toLocaleDateString('en-GB') : '06/10/2025';
    addText(invoiceDate, margin + col1Width + 2, yPosition + 9, { fontSize: 9 });

    addText('MARKA', margin + col1Width + col2Width + 2, yPosition + 4, { fontSize: 9, fontStyle: 'bold' });
    addText(invoiceDetails?.marka || '', margin + col1Width + col2Width + 2, yPosition + 9, { fontSize: 9 });

    addText('Date of Supply', margin + col1Width + col2Width + col3Width + 2, yPosition + 4, { fontSize: 9, fontStyle: 'bold' });
    const supplyDate = invoiceDetails?.supplyDate ? new Date(invoiceDetails.supplyDate).toLocaleDateString('en-GB') : '06/10/2025';
    addText(supplyDate, margin + col1Width + col2Width + col3Width + 2, yPosition + 9, { fontSize: 9 });

    yPosition += gridHeight;

    // State and Transportation row
    drawLine(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 2;

    const stateRowHeight = 15;
    const stateCol1 = contentWidth * 0.25;
    const stateCol2 = contentWidth * 0.25;
    const transportCol = contentWidth * 0.5;

    drawLine(margin + stateCol1, yPosition - 2, margin + stateCol1, yPosition + stateRowHeight);
    drawLine(margin + stateCol1 + stateCol2, yPosition - 2, margin + stateCol1 + stateCol2, yPosition + stateRowHeight);

    addText('State', margin + 2, yPosition + 4, { fontSize: 9, fontStyle: 'bold' });
    addText(autoCompanyData.state, margin + 2, yPosition + 9, { fontSize: 9 });

    addText('State Code', margin + stateCol1 + 2, yPosition + 4, { fontSize: 9, fontStyle: 'bold' });
    addText(autoCompanyData.stateCode, margin + stateCol1 + 2, yPosition + 9, { fontSize: 9 });

    addText('Transportation', margin + stateCol1 + stateCol2 + 2, yPosition + 4, { fontSize: 9, fontStyle: 'bold' });
    addText(invoiceDetails?.transport || 'PawanPutra Roadlines', margin + stateCol1 + stateCol2 + 2, yPosition + 9, { fontSize: 9 });

    yPosition += stateRowHeight;

    // Customer details section
    drawLine(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 0.2;

    const customerSectionHeight = 45;
    const customerColWidth = contentWidth / 2.01;

    // Draw vertical line between customer sections
    drawLine(margin + customerColWidth, yPosition, margin + customerColWidth, yPosition + customerSectionHeight);

    // Headers with gray background (simulated with border)
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin + 0.5, yPosition, customerColWidth, 8, 'F');
    pdf.rect(margin + customerColWidth, yPosition, customerColWidth, 8, 'F');

    addText('Details of Receiver | Billed to:', margin + 1 + customerColWidth / 2, yPosition + 5, {
        fontSize: 9,
        fontStyle: 'bold',
        align: 'center'
    });
    addText('Details of Consignee | Shipped to:', margin + customerColWidth + customerColWidth / 2, yPosition + 5, {
        fontSize: 9,
        fontStyle: 'bold',
        align: 'center'
    });

    yPosition += 10;

    // Customer details content
    const receiverName = customerData?.billingAddress?.name || 'JEEVAN HARDWARE';
    const receiverAddress = customerData?.billingAddress?.address || '';
    const receiverExim = customerData?.billingAddress?.eximCode || '301806927014NP';
    const receiverCity = customerData?.billingAddress?.city || '';
    const receiverCountry = customerData?.billingAddress?.country || 'Nepal';

    addText(`Name: ${receiverName}`, margin + 2, yPosition + 2, { fontSize: 8 });
    addText(`Address: ${receiverAddress}`, margin + 2, yPosition + 6, { fontSize: 8 });
    addText(`EXIM Code: ${receiverExim}`, margin + 2, yPosition + 10, { fontSize: 8 });
    addText(`City: ${receiverCity}`, margin + 2, yPosition + 14, { fontSize: 8 });
    addText(`Country: ${receiverCountry}`, margin + 2, yPosition + 18, { fontSize: 8 });

    // Consignee details
    const consigneeName = customerData?.shippingAddress?.name || receiverName;
    const consigneeAddress = customerData?.shippingAddress?.address || 'Kathmandu, kathmandu MC-11, Bhotebahali, 00';
    const consigneeExim = customerData?.shippingAddress?.eximCode || receiverExim;
    const consigneeCity = customerData?.shippingAddress?.city || receiverCity;
    const consigneeCountry = customerData?.shippingAddress?.country || receiverCountry;

    addText(`Name: ${consigneeName}`, margin + customerColWidth + 2, yPosition + 2, { fontSize: 8 });
    addText(`Address: ${consigneeAddress}`, margin + customerColWidth + 2, yPosition + 6, { fontSize: 8, maxWidth: customerColWidth - 4 });
    addText(`EXIM Code: ${consigneeExim}`, margin + customerColWidth + 2, yPosition + 10, { fontSize: 8 });
    addText(`City: ${consigneeCity}`, margin + customerColWidth + 2, yPosition + 14, { fontSize: 8 });
    addText(`Country: ${consigneeCountry}`, margin + customerColWidth + 2, yPosition + 18, { fontSize: 8 });

    yPosition += 25;

    // Items table - using autoTable for better reliability with page break support
    drawLine(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 0;

    // Table headers
    const tableHeaders = [
        'Sr. No.', 'Name of Product', 'HSN ACS', 'Units', 'Qty', 'Rate',
        'Amount', 'CGST Rate', 'SGST Rate', 'IGST Rate (Amount)', 'Total'
    ];

    // Sample data or actual items
    const itemsToShow = items && items.length > 0 ? items : [
        {
            description: 'Safty 1.5" (Door King Brand)',
            hsnCode: '83024110',
            unit: 'gz',
            quantity: 5,
            rate: 320.00,
            totalAmount: 1600.00
        },
        {
            description: 'Safty 2" (Door King Brand)',
            hsnCode: '83024110',
            unit: 'gz',
            quantity: 10,
            rate: 360.00,
            totalAmount: 3600.00
        },
        {
            description: 'Safty 4" (Door King Brand)',
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
    ];

    // Prepare table data
    const tableData = [];

    // Add items data - no more empty rows padding
    itemsToShow.forEach((item, index) => {
        tableData.push([
            (index + 1).toString(),
            item.description || '',
            item.hsnCode || '',
            item.unit || '',
            item.quantity?.toString() || '0',
            formatIndianNumber(item.rate || 0),
            formatIndianNumber(item.totalAmount || 0),
            '(0.00)',
            '(0.00)',
            '(0.00)',
            formatIndianNumber(item.totalAmount || 0)
        ]);
    });

    // Calculate totals
    const totalQty = itemsToShow.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalAmount = itemsToShow.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

    // Reserve space for footer (amount in words, bank details, terms)
    const footerHeight = 55; // Reduced to minimum to allow 12+ items per page
    const availableTableHeight = pageHeight - yPosition - footerHeight - margin;

    // Try to use autoTable if available with page break support
    try {
        if (pdf.autoTable) {
            pdf.autoTable({
                head: [tableHeaders],
                body: tableData,
                startY: yPosition,
                margin: { left: margin, right: margin, bottom: margin + footerHeight },
                theme: 'grid',
                styles: {
                    fontSize: 6.5,  // Slightly smaller font
                    cellPadding: 1.5,  // Reduced padding
                    lineColor: [0, 0, 0],
                    lineWidth: 0.3,
                    halign: 'center'
                },
                headStyles: {
                    fillColor: [240, 240, 240],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                    halign: 'center'
                },
                columnStyles: {
                    0: { cellWidth: 12, halign: 'center' },   // Sr. No.
                    1: { cellWidth: 51, halign: 'left' },     // Name of Product
                    2: { cellWidth: 15, halign: 'center' },   // HSN ACS
                    3: { cellWidth: 10, halign: 'center' },   // Units
                    4: { cellWidth: 12, halign: 'center' },   // Qty
                    5: { cellWidth: 16, halign: 'right' },    // Rate
                    6: { cellWidth: 18, halign: 'right' },    // Amount
                    7: { cellWidth: 12, halign: 'center' },   // CGST Rate
                    8: { cellWidth: 12, halign: 'center' },   // SGST Rate
                    9: { cellWidth: 12, halign: 'center' },   // IGST Rate
                    10: { cellWidth: 20, halign: 'right' }    // Total
                },
                // Handle page breaks
                didDrawPage: function (data) {
                    // If we're on a new page (not the first), add page border
                    if (data.pageNumber > 1) {
                        const currentPageWidth = pdf.internal.pageSize.width;
                        const currentPageHeight = pdf.internal.pageSize.height;
                        pdf.setDrawColor(0, 0, 0);
                        pdf.setLineWidth(0.5);
                        pdf.rect(margin, margin, currentPageWidth - (2 * margin), currentPageHeight - (2 * margin));

                        // Add page header info on continuation pages
                        pdf.setFontSize(10);
                        pdf.setFont('helvetica', 'bold');
                        pdf.text(`Invoice ${invoiceDetails?.invoiceNumber || 'EXP-1001'} (Continued...)`,
                            currentPageWidth / 2, margin + 15, { align: 'center' });
                    }
                },
                // Ensure table doesn't go into footer area
                pageBreak: 'auto',
                pageBreakBefore: function (hookData) {
                    return hookData.cursor.y >= pageHeight - footerHeight - margin;
                }
            });

            // Add total row manually after autoTable
            const finalY = pdf.lastAutoTable.finalY;

            // Check if we need a new page for the total row
            if (finalY + 20 > pageHeight - footerHeight - margin) {
                pdf.addPage();
                // Add border to new page
                drawBorder(margin, margin, contentWidth, pageHeight - (2 * margin));
                yPosition = margin + 20;
            } else {
                yPosition = finalY;
            }

            // Total row
            pdf.setFillColor(240, 240, 240);
            pdf.rect(margin, yPosition, contentWidth, 8, 'F');

            // Draw total row borders and content
            drawLine(margin, yPosition, pageWidth - margin, yPosition);
            drawLine(margin, yPosition + 8, pageWidth - margin, yPosition + 8);
            drawLine(margin, yPosition, margin, yPosition + 8);
            drawLine(pageWidth - margin, yPosition, pageWidth - margin, yPosition + 8);

            // Add total text
            addText('Total :', margin + 80, yPosition + 5, { fontSize: 7, fontStyle: 'bold', align: 'center' });
            addText(totalQty.toString(), margin + 95, yPosition + 5, { fontSize: 7, fontStyle: 'bold', align: 'center' });
            addText(formatIndianNumber(totalAmount), margin + 131, yPosition + 5, { fontSize: 7, fontStyle: 'bold', align: 'right' });
            addText('0.00', margin + 166, yPosition + 5, { fontSize: 7, fontStyle: 'bold', align: 'center' });
            addText('0.00', margin + 186, yPosition + 5, { fontSize: 7, fontStyle: 'bold', align: 'center' });
            addText(formatIndianNumber(totalAmount), pageWidth - margin - 5, yPosition + 5, { fontSize: 7, fontStyle: 'bold', align: 'right' });

            yPosition = yPosition + 8;
        } else {
            throw new Error('autoTable not available');
        }
    } catch (error) {
        console.warn('autoTable failed, using simple table:', error);
        // Fallback to simple table implementation would go here
    }

    // Enhanced border structure with professional styling
    drawLine(margin, yPosition, pageWidth - margin, yPosition, 0.5); // Thicker top border

    // Calculate fixed footer position - increased to accommodate all footer content
    const footerStartY = pageHeight - margin - 93; // Fixed position from bottom (93mm for footer sections)

    // Check if we need to add spacing to push footer to bottom
    if (yPosition < footerStartY) {
        yPosition = footerStartY; // Move to fixed footer position
    } else if (yPosition > footerStartY - 10) {
        // If table is close to footer area, add new page
        pdf.addPage();
        drawBorder(margin, margin, contentWidth, pageHeight - (2 * margin));
        yPosition = margin + 20;
        // Re-calculate footer position for new page
        const newFooterStartY = pageHeight - margin - 93;
        yPosition = newFooterStartY;
    }

    // Main bottom section - 3 rows structure with enhanced styling
    const sectionHeight = 45;
    const rightColumnX = pageWidth - 80; // Slightly wider right column

    // Row 1: Amount in words and totals with enhanced borders
    const row1Height = 20; // Increased height for better spacing

    // Draw enhanced borders for row 1
    drawLine(margin, yPosition, pageWidth - margin, yPosition, 0.4); // Top border
    drawLine(margin, yPosition + row1Height, pageWidth - margin, yPosition + row1Height, 0.4); // Bottom border
    drawLine(margin, yPosition, margin, yPosition + row1Height, 0.4); // Left border
    drawLine(rightColumnX, yPosition, rightColumnX, yPosition + row1Height, 0.3); // Vertical separator

    // Left side - Enhanced Amount in words section
    // Header with professional background
    pdf.setFillColor(245, 247, 250);
    pdf.rect(margin + 0.55, yPosition + 0.5, rightColumnX - margin - 1.5, 6, 'F');
    addText('Total Invoice Amount In Words:', margin + 2, yPosition + 4, { fontSize: 8, fontStyle: 'bold' });

    // Amount in words with better formatting
    const amountInWords = numberToWordsIndian(Math.floor(totalAmount)) + ' Rupees Only';

    // Split long text for better readability
    const maxLineLength = 45;
    if (amountInWords.length > maxLineLength) {
        const words = amountInWords.split(' ');
        let line1 = '';
        let line2 = '';
        let currentLine = 1;

        for (const word of words) {
            if (currentLine === 1 && (line1 + word).length <= maxLineLength) {
                line1 += (line1 ? ' ' : '') + word;
            } else {
                currentLine = 2;
                line2 += (line2 ? ' ' : '') + word;
            }
        }

        addText(line1, margin + 2, yPosition + 10, { fontSize: 8, fontStyle: 'bold' });
        if (line2) {
            addText(line2, margin + 2, yPosition + 14, { fontSize: 8, fontStyle: 'bold' });
        }
    } else {
        addText(amountInWords, margin + 2, yPosition + 10, { fontSize: 8, fontStyle: 'bold' });
    }

    // Right side - Enhanced Totals table with professional formatting
    const totalRowHeight = 6;
    let totalY = yPosition + 2;
    const colonX = rightColumnX + 38; // Consistent colon position

    // Total Amount row with light background
    addText('Total Amount', rightColumnX + 2, totalY + 2, { fontSize: 8, fontStyle: 'bold' });
    addText(':', colonX, totalY + 2, { fontSize: 8, fontStyle: 'bold' });
    addText(formatIndianNumber(totalAmount), pageWidth - margin - 1, totalY + 2, { fontSize: 8, fontStyle: 'bold', align: 'right' });
    drawLine(rightColumnX, totalY + totalRowHeight, pageWidth - margin, totalY + totalRowHeight, 0.2);

    // Rounded Amount row
    totalY += totalRowHeight;
    addText('Rounded Amount', rightColumnX + 2, totalY + 4, { fontSize: 8, fontStyle: 'bold' });
    addText(':', colonX, totalY + 4, { fontSize: 8, fontStyle: 'bold' });
    addText(formatIndianNumber(totalAmount), pageWidth - margin - 2, totalY + 4, { fontSize: 8, fontStyle: 'bold', align: 'right' });
    drawLine(rightColumnX, totalY + totalRowHeight, pageWidth - margin, totalY + totalRowHeight, 0.2);

    // GST Payable row with emphasis
    totalY += totalRowHeight + 0.5;
    pdf.setFillColor(252, 248, 227); // Light yellow background for GST
    pdf.rect(rightColumnX + 0.5, totalY - 0.5, pageWidth - margin - rightColumnX - 0.6, totalRowHeight - 0.5, 'F');
    addText('GST Payable on Reverse Charge', rightColumnX + 2, totalY + 4, { fontSize: 7, fontStyle: 'bold' });
    addText(':', colonX, totalY + 4, { fontSize: 7 });

    yPosition += row1Height;

    // Row 2: Bank Details and Company Info with enhanced styling
    const row2Height = 25; // Increased height for better spacing

    // Draw enhanced borders for row 2
    drawLine(margin, yPosition + row2Height, pageWidth - margin, yPosition + row2Height, 0.4); // Bottom border
    drawLine(margin, yPosition, margin, yPosition + row2Height, 0.4); // Left border
    drawLine(pageWidth - margin, yPosition, pageWidth - margin, yPosition + row2Height, 0.4); // Right border
    drawLine(rightColumnX, yPosition, rightColumnX, yPosition + row2Height, 0.3); // Vertical separator

    // Left side - Enhanced Bank details with better alignment
    // Bank details header with background
    pdf.setFillColor(240, 242, 247);
    pdf.rect(margin + 0.5, yPosition + 0.5, rightColumnX - margin - 1.5, 6, 'F');
    addText('Bank Details :', margin + 2, yPosition + 4, { fontSize: 8, fontStyle: 'bold' });

    // Bank details with consistent formatting
    const bankLabelX = margin + 5;
    const bankValueX = margin + 50;
    addText('Bank Name', bankLabelX, yPosition + 10, { fontSize: 8, fontStyle: 'bold' });
    addText(':', bankValueX - 5, yPosition + 10, { fontSize: 8 });
    addText(`${autoBankDetails.bankName} (Vikas Bhavan, Aligarh)`, bankValueX, yPosition + 10, { fontSize: 8 });

    addText('Bank Account Number', bankLabelX, yPosition + 14, { fontSize: 8, fontStyle: 'bold' });
    addText(':', bankValueX - 5, yPosition + 14, { fontSize: 8 });
    addText(autoBankDetails.accountNumber, bankValueX, yPosition + 14, { fontSize: 8 });

    addText('Bank Branch IFSC', bankLabelX, yPosition + 18, { fontSize: 8, fontStyle: 'bold' });
    addText(':', bankValueX - 5, yPosition + 18, { fontSize: 8 });
    addText(autoBankDetails.ifscCode, bankValueX, yPosition + 18, { fontSize: 8 });

    // Right side - Enhanced Certification section
    const certWidth = pageWidth - margin - rightColumnX;

    // Certification text with better wrapping
    addText('Certified that the particulars given above are', rightColumnX + 2, yPosition + 4, { fontSize: 7 });
    addText('true and correct.', rightColumnX + 2, yPosition + 8, { fontSize: 7 });

    // Company name with enhanced styling
    addText(`For, ${autoCompanyData.companyName}`, rightColumnX + certWidth / 2, yPosition + 13, { fontSize: 8, fontStyle: 'bold', align: 'center' });

    yPosition += row2Height;

    // Row 3: Terms & Conditions and Signature with enhanced styling
    const row3Height = 28; // Adjusted height to fit within page

    // Draw enhanced borders for row 3
    drawLine(margin, yPosition + row3Height, pageWidth - margin, yPosition + row3Height, 0.5); // Bottom border
    drawLine(margin, yPosition, margin, yPosition + row3Height, 0.4); // Left border
    drawLine(pageWidth - margin, yPosition, pageWidth - margin, yPosition + row3Height, 0.4); // Right border
    drawLine(rightColumnX, yPosition, rightColumnX, yPosition + row3Height, 0.3); // Vertical separator

    // Left side - Enhanced Terms & Conditions
    // Terms header with background
    pdf.setFillColor(240, 242, 247);
    pdf.rect(margin + 0.5, yPosition + 0.5, rightColumnX - margin - 1.5, 6, 'F');
    addText('Terms & Conditions', margin + 2, yPosition + 4, { fontSize: 8, fontStyle: 'bold' });

    // Enhanced terms with better formatting - compact version
    const defaultTerms = [
        { num: '1.', text: 'Country of Origin - India' },
        { num: '2.', text: 'Custom Point - Bhairahwa' },
        { num: '3.', text: 'Incoterms - EX-Works-Aligarh' },
        { num: '4.', text: 'Payment Terms Credit 60 Days' }
    ];

    const termsToShow = termsAndConditions?.terms || defaultTerms;
    termsToShow.slice(0, 4).forEach((term, index) => {
        const termY = yPosition + 10 + (index * 4);
        if (typeof term === 'object') {
            addText(term.num, margin + 5, termY, { fontSize: 7, fontStyle: 'bold' });
            addText(term.text, margin + 10, termY, { fontSize: 7 });
        } else {
            addText(term, margin + 5, termY, { fontSize: 7 });
        }
    });

    // Right side - Enhanced Signature area
    const signatureWidth = pageWidth - margin - rightColumnX - 1;
    const signatureX = rightColumnX + signatureWidth / 2;

    // Signature box - centered and within borders
    const sigBoxWidth = signatureWidth - 10;
    const sigBoxHeight = 15;
    const sigBoxX = rightColumnX + 5;
    const sigBoxY = yPosition + 6;

    pdf.setFillColor(250, 250, 250);
    pdf.rect(sigBoxX, sigBoxY, sigBoxWidth, sigBoxHeight, 'F');

    // Vertically center the label inside the signature box
    const labelY = sigBoxY + (sigBoxHeight / 2) + 1.5;
    addText('Authorised Signatory', signatureX, labelY, { fontSize: 8, fontStyle: 'bold', align: 'center' });

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