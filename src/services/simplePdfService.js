// import jsPDF from 'jspdf';
// import { getMyCompanyProfile } from './companyProfileService';

// // Simple PDF service without autoTable dependency
// export const generateSimpleInvoicePDF = (invoiceData) => {
//     try {
//         const { companyData, customerData, invoiceDetails, items, additionalCharges } = invoiceData;

//         // Get company profile
//         const myCompanyProfile = getMyCompanyProfile();

//         // Create new PDF document
//         const pdf = new jsPDF('portrait', 'mm', 'a4');
//         const pageWidth = pdf.internal.pageSize.width;
//         const pageHeight = pdf.internal.pageSize.height;
//         let yPosition = 20;

//         // Auto-populate company data
//         const autoCompanyData = companyData?.gstin ? companyData : {
//             gstin: myCompanyProfile?.gstNumber,
//             iecCode: myCompanyProfile?.iecCode,
//             arn: myCompanyProfile?.arn,
//             companyName: myCompanyProfile?.companyName,
//             address: `${myCompanyProfile?.addressLine1 || ''}${myCompanyProfile?.addressLine2 ? ', ' + myCompanyProfile.addressLine2 : ''}`,
//             city: myCompanyProfile?.city,
//             state: myCompanyProfile?.state,
//             stateCode: myCompanyProfile?.stateCode || '09',
//             pincode: myCompanyProfile?.postalCode,
//             phone: myCompanyProfile?.phone,
//             email: myCompanyProfile?.email
//         };

//         // Calculate totals
//         const subtotal = items?.reduce((sum, item) => sum + (item.totalAmount || 0), 0) || 0;
//         const grandTotal = subtotal;

//         // Helper function to format Indian numbers
//         const formatIndianNumber = (num) => {
//             if (!num) return '0.00';
//             const numStr = parseFloat(num).toFixed(2);
//             const parts = numStr.split('.');
//             parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//             return parts.join('.');
//         };

//         // Set font
//         pdf.setFont('helvetica');

//         // Header
//         pdf.setFontSize(20);
//         pdf.setFont('helvetica', 'bold');
//         pdf.text('EXPORT INVOICE', pageWidth / 2, yPosition, { align: 'center' });
//         yPosition += 15;

//         // Company details
//         pdf.setFontSize(16);
//         pdf.text(autoCompanyData?.companyName || 'Company Name', pageWidth / 2, yPosition, { align: 'center' });
//         yPosition += 8;

//         pdf.setFontSize(10);
//         pdf.setFont('helvetica', 'normal');
//         pdf.text(autoCompanyData?.address || '', pageWidth / 2, yPosition, { align: 'center' });
//         yPosition += 6;
//         pdf.text(`Phone: ${autoCompanyData?.phone || ''} | Email: ${autoCompanyData?.email || ''}`, pageWidth / 2, yPosition, { align: 'center' });
//         yPosition += 15;

//         // Invoice details
//         pdf.setFontSize(12);
//         pdf.setFont('helvetica', 'bold');
//         pdf.text('Invoice Details:', 20, yPosition);
//         yPosition += 8;

//         pdf.setFontSize(10);
//         pdf.setFont('helvetica', 'normal');
//         pdf.text(`Invoice No: ${invoiceDetails?.invoiceNumber || ''}`, 20, yPosition);
//         pdf.text(`Date: ${invoiceDetails?.invoiceDate ? new Date(invoiceDetails.invoiceDate).toLocaleDateString() : ''}`, 120, yPosition);
//         yPosition += 6;
//         pdf.text(`GSTIN: ${autoCompanyData?.gstin || ''}`, 20, yPosition);
//         pdf.text(`State: ${autoCompanyData?.state || ''} (${autoCompanyData?.stateCode || ''})`, 120, yPosition);
//         yPosition += 15;

//         // Customer details
//         pdf.setFontSize(12);
//         pdf.setFont('helvetica', 'bold');
//         pdf.text('Bill To:', 20, yPosition);
//         yPosition += 8;

//         pdf.setFontSize(10);
//         pdf.setFont('helvetica', 'normal');
//         pdf.text(customerData?.billingAddress?.name || 'Customer Name', 20, yPosition);
//         yPosition += 6;
//         pdf.text(customerData?.billingAddress?.address || 'Customer Address', 20, yPosition);
//         yPosition += 6;
//         pdf.text(`${customerData?.billingAddress?.city || ''}, ${customerData?.billingAddress?.country || ''}`, 20, yPosition);
//         yPosition += 15;

//         // Items table header
//         pdf.setFontSize(12);
//         pdf.setFont('helvetica', 'bold');
//         pdf.text('Items:', 20, yPosition);
//         yPosition += 8;

//         // Table header
//         pdf.setFontSize(9);
//         pdf.setFont('helvetica', 'bold');
//         const headerY = yPosition;
//         pdf.text('Sr.', 20, headerY);
//         pdf.text('Description', 35, headerY);
//         pdf.text('HSN', 100, headerY);
//         pdf.text('Qty', 125, headerY);
//         pdf.text('Rate', 145, headerY);
//         pdf.text('Amount', 170, headerY);

//         // Draw header line
//         pdf.line(20, headerY + 2, 190, headerY + 2);
//         yPosition += 8;

//         // Items
//         pdf.setFont('helvetica', 'normal');
//         const itemsToShow = items && items.length > 0 ? items : [{
//             description: 'Sample Product',
//             hsnCode: '8471',
//             quantity: 1,
//             rate: 42500,
//             totalAmount: 42500
//         }];

//         itemsToShow.forEach((item, index) => {
//             pdf.text((index + 1).toString(), 20, yPosition);
//             pdf.text(item.description || '', 35, yPosition);
//             pdf.text(item.hsnCode || '', 100, yPosition);
//             pdf.text(item.quantity?.toString() || '0', 125, yPosition);
//             pdf.text(formatIndianNumber(item.rate || 0), 145, yPosition);
//             pdf.text(formatIndianNumber(item.totalAmount || 0), 170, yPosition);
//             yPosition += 6;
//         });

//         // Draw line before total
//         pdf.line(20, yPosition + 2, 190, yPosition + 2);
//         yPosition += 8;

//         // Total
//         pdf.setFont('helvetica', 'bold');
//         pdf.text('Total:', 145, yPosition);
//         pdf.text(formatIndianNumber(grandTotal), 170, yPosition);
//         yPosition += 15;

//         // Terms
//         pdf.setFontSize(10);
//         pdf.text('Terms & Conditions:', 20, yPosition);
//         yPosition += 6;
//         pdf.setFont('helvetica', 'normal');
//         pdf.setFontSize(8);
//         pdf.text('1. Payment is due within 30 days', 20, yPosition);
//         yPosition += 4;
//         pdf.text('2. All disputes subject to local jurisdiction', 20, yPosition);

//         return pdf;
//     } catch (error) {
//         console.error('Error in simple PDF generation:', error);
//         throw error;
//     }
// };

// // Simple download function
// export const downloadSimpleInvoicePDF = (invoiceData, filename = null) => {
//     try {
//         const pdf = generateSimpleInvoicePDF(invoiceData);
//         const defaultFilename = `Invoice_${invoiceData.invoiceDetails?.invoiceNumber || 'draft'}_${new Date().toISOString().split('T')[0]}.pdf`;
//         pdf.save(filename || defaultFilename);
//         return { success: true };
//     } catch (error) {
//         console.error('Error downloading simple PDF:', error);
//         return { success: false, error: error.message };
//     }
// };