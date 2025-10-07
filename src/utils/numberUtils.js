// Utility function to convert numbers to words in Indian format
export const numberToWordsIndian = (num) => {
    // Handle edge cases
    if (num === null || num === undefined || isNaN(num)) return 'Zero';
    if (num === 0) return 'Zero';

    // Convert to integer to avoid decimal issues
    num = Math.floor(Math.abs(num));

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
            result += tens[Math.floor(n / 10)] + ' ';
            n %= 10;
        } else if (n >= 10) {
            result += teens[n - 10] + ' ';
            n = 0;
        }
        if (n > 0) {
            result += ones[n] + ' ';
        }
        return result;
    };

    let result = '';

    // Handle crores (10,000,000)
    if (num >= 10000000) {
        result += convertHundreds(Math.floor(num / 10000000)) + 'Crore ';
        num %= 10000000;
    }

    // Handle lakhs (100,000)
    if (num >= 100000) {
        result += convertHundreds(Math.floor(num / 100000)) + 'Lakh ';
        num %= 100000;
    }

    // Handle thousands (1,000)
    if (num >= 1000) {
        result += convertHundreds(Math.floor(num / 1000)) + 'Thousand ';
        num %= 1000;
    }

    // Handle remaining hundreds
    if (num > 0) {
        result += convertHundreds(num);
    }

    return result.trim();
};

// Format currency for Indian format
export const formatCurrency = (amount) => {
    // Handle null, undefined, or NaN values
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '₹0.00';
    }

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(Number(amount));
};

// Format number in Indian style (with commas)
export const formatIndianNumber = (num) => {
    // Handle null, undefined, or NaN values
    if (num === null || num === undefined || isNaN(num)) {
        return '0';
    }

    return new Intl.NumberFormat('en-IN').format(Number(num));
};