import Input from '../../../components/ui/Input';

const InvoiceTotalsSection = ({ items, additionalCharges, onAdditionalChargesChange }) => {
    const calculateTotals = () => {
        const subtotal = items?.reduce((sum, item) => sum + (item?.taxableAmount || 0), 0);
        const totalDiscount = items?.reduce((sum, item) => sum + (item?.discountAmount || 0), 0);
        const totalCGST = items?.reduce((sum, item) => sum + (item?.cgstAmount || 0), 0);
        const totalSGST = items?.reduce((sum, item) => sum + (item?.sgstAmount || 0), 0);
        const totalIGST = items?.reduce((sum, item) => sum + (item?.igstAmount || 0), 0);
        const totalTax = totalCGST + totalSGST + totalIGST;
        const shipping = parseFloat(additionalCharges?.shipping) || 0;
        const otherCharges = parseFloat(additionalCharges?.other) || 0;
        const grandTotal = subtotal + totalTax + shipping + otherCharges;

        return {
            subtotal,
            totalDiscount,
            totalCGST,
            totalSGST,
            totalIGST,
            totalTax,
            shipping,
            otherCharges,
            grandTotal
        };
    };

    const numberToWords = (num) => {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

        if (num === 0) return 'Zero';

        const convertHundreds = (n) => {
            let result = '';
            if (n >= 100) {
                result += ones?.[Math.floor(n / 100)] + ' Hundred ';
                n %= 100;
            }
            if (n >= 20) {
                result += tens?.[Math.floor(n / 10)] + ' ';
                n %= 10;
            } else if (n >= 10) {
                result += teens?.[n - 10] + ' ';
                return result;
            }
            if (n > 0) {
                result += ones?.[n] + ' ';
            }
            return result;
        };

        let integerPart = Math.floor(num);
        const decimalPart = Math.round((num - integerPart) * 100);

        let result = '';
        let groupIndex = 0;

        if (integerPart === 0) {
            result = 'Zero';
        } else {
            while (integerPart > 0) {
                let group;
                if (groupIndex === 0) {
                    group = integerPart % 1000;
                    integerPart = Math.floor(integerPart / 1000);
                } else if (groupIndex === 1) {
                    group = integerPart % 100;
                    integerPart = Math.floor(integerPart / 100);
                } else {
                    group = integerPart % 100;
                    integerPart = Math.floor(integerPart / 100);
                }

                if (group !== 0) {
                    const groupText = convertHundreds(group);
                    result = groupText + thousands?.[groupIndex] + ' ' + result;
                }
                groupIndex++;
            }
        }

        result += 'Rupees';
        if (decimalPart > 0) {
            result += ' and ' + convertHundreds(decimalPart) + 'Paise';
        }
        result += ' Only';

        return result?.trim();
    };

    const totals = calculateTotals();

    return (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Invoice Totals</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Additional Charges */}
                <div>
                    <h3 className="text-md font-medium text-foreground mb-3">Additional Charges</h3>
                    <div className="space-y-3">
                        <Input
                            label="Shipping Charges (₹)"
                            type="number"
                            value={additionalCharges?.shipping}
                            onChange={(e) => onAdditionalChargesChange('shipping', e?.target?.value)}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                        />
                        <Input
                            label="Other Charges (₹)"
                            type="number"
                            value={additionalCharges?.other}
                            onChange={(e) => onAdditionalChargesChange('other', e?.target?.value)}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Totals Summary */}
                <div>
                    <h3 className="text-md font-medium text-foreground mb-3">Summary</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Subtotal:</span>
                            <span className="font-medium">₹{totals?.subtotal?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        {totals?.totalDiscount > 0 && (
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Total Discount:</span>
                                <span className="font-medium text-success">-₹{totals?.totalDiscount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        {totals?.totalCGST > 0 && (
                            <div className="flex justify-between">
                                <span className="text-text-secondary">CGST:</span>
                                <span className="font-medium">₹{totals?.totalCGST?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        {totals?.totalSGST > 0 && (
                            <div className="flex justify-between">
                                <span className="text-text-secondary">SGST:</span>
                                <span className="font-medium">₹{totals?.totalSGST?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        {totals?.totalIGST > 0 && (
                            <div className="flex justify-between">
                                <span className="text-text-secondary">IGST:</span>
                                <span className="font-medium">₹{totals?.totalIGST?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        {totals?.shipping > 0 && (
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Shipping:</span>
                                <span className="font-medium">₹{totals?.shipping?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        {totals?.otherCharges > 0 && (
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Other Charges:</span>
                                <span className="font-medium">₹{totals?.otherCharges?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        <div className="border-t border-border pt-2 mt-3">
                            <div className="flex justify-between text-lg font-semibold">
                                <span className="text-foreground">Grand Total:</span>
                                <span className="text-primary">₹{totals?.grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Amount in Words */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-2">Amount in Words:</h4>
                <p className="text-sm text-text-secondary font-medium">
                    {numberToWords(totals?.grandTotal)}
                </p>
            </div>
        </div>
    );
};

export default InvoiceTotalsSection;