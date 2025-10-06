// Settings Service for managing application settings including terms & conditions

let settingsData = {
    // Terms & Conditions that will be automatically added to invoices
    termsAndConditions: [
        "Payment is due within 30 days of invoice date.",
        "Late payments may incur additional charges.",
        "All disputes must be raised within 7 days of invoice receipt.",
        "Goods once sold will not be taken back.",
        "Subject to jurisdiction of exporter's location only."
    ],

    // Invoice Settings
    invoiceSettings: {
        invoicePrefix: "EXP",
        startingNumber: 1,
        currentNumber: 1001, // Natural number starting from 1001
        autoGenerateNumber: true,
        showBankDetails: true,
        showTermsAndConditions: true,
        showCompanyLogo: true,
        defaultCurrency: "USD",
        defaultPaymentTerms: "30 Days from Invoice Date",
        showHSNCode: true,
        showExportCompliance: true
    },

    // Default values for new invoices
    defaultValues: {
        paymentTerms: "30 Days from Invoice Date",
        dueDays: 30,
        currency: "USD",
        shippingTerms: "FOB",
        bankCharges: "On Account of Buyer",
        marka: "",
        transport: ""
    },

    // Notification settings
    notifications: {
        emailOnInvoiceCreation: true,
        emailOnPaymentReceived: true,
        reminderBeforeDueDate: 3 // days
    },

    // Display preferences
    display: {
        theme: "light",
        dateFormat: "DD/MM/YYYY",
        numberFormat: "indian", // indian, international
        showAdvancedFields: false
    }
};

/**
 * Get all settings
 * @returns {Object} Complete settings object
 */
export const getSettings = () => {
    return { ...settingsData };
};

/**
 * Get terms and conditions
 * @returns {Array} Array of terms and conditions strings
 */
export const getTermsAndConditions = () => {
    return [...settingsData.termsAndConditions];
};

/**
 * Update terms and conditions
 * @param {Array} terms - Array of terms and conditions strings
 */
export const updateTermsAndConditions = (terms) => {
    settingsData.termsAndConditions = [...terms];
};

/**
 * Get invoice settings
 * @returns {Object} Invoice settings object
 */
export const getInvoiceSettings = () => {
    return { ...settingsData.invoiceSettings };
};

/**
 * Update invoice settings
 * @param {Object} settings - Invoice settings to update
 */
export const updateInvoiceSettings = (settings) => {
    settingsData.invoiceSettings = {
        ...settingsData.invoiceSettings,
        ...settings
    };
};

/**
 * Get next invoice number
 * @returns {String} Next invoice number with prefix
 */
export const getNextInvoiceNumber = () => {
    const { invoicePrefix, currentNumber } = settingsData.invoiceSettings;
    return `${invoicePrefix}-${String(currentNumber).padStart(4, '0')}`;
};

/**
 * Increment invoice number
 * @returns {String} New invoice number
 */
export const incrementInvoiceNumber = () => {
    settingsData.invoiceSettings.currentNumber += 1;
    return getNextInvoiceNumber();
};

/**
 * Get default values for new invoices
 * @returns {Object} Default values object
 */
export const getDefaultInvoiceValues = () => {
    return { ...settingsData.defaultValues };
};

/**
 * Update default values
 * @param {Object} values - Default values to update
 */
export const updateDefaultValues = (values) => {
    settingsData.defaultValues = {
        ...settingsData.defaultValues,
        ...values
    };
};

/**
 * Get display preferences
 * @returns {Object} Display preferences object
 */
export const getDisplayPreferences = () => {
    return { ...settingsData.display };
};

/**
 * Update display preferences
 * @param {Object} preferences - Display preferences to update
 */
export const updateDisplayPreferences = (preferences) => {
    settingsData.display = {
        ...settingsData.display,
        ...preferences
    };
};

/**
 * Reset settings to default
 */
export const resetToDefault = () => {
    settingsData = {
        termsAndConditions: [
            "Payment is due within 30 days of invoice date.",
            "Late payments may incur additional charges.",
            "All disputes must be raised within 7 days of invoice receipt.",
            "Goods once sold will not be taken back.",
            "Subject to jurisdiction of exporter's location only."
        ],
        invoiceSettings: {
            startingNumber: 1,
            currentNumber: 1001,
            autoGenerateNumber: true,
            showBankDetails: true,
            showTermsAndConditions: true,
            showCompanyLogo: true,
            defaultCurrency: "USD",
            defaultPaymentTerms: "30 Days from Invoice Date",
            showHSNCode: true,
            showExportCompliance: true
        },
        defaultValues: {
            paymentTerms: "30 Days from Invoice Date",
            dueDays: 30,
            currency: "USD",
            shippingTerms: "FOB",
            bankCharges: "On Account of Buyer",
            marka: "",
            transport: ""
        },
        notifications: {
            emailOnInvoiceCreation: true,
            emailOnPaymentReceived: true,
            reminderBeforeDueDate: 3
        },
        display: {
            theme: "light",
            dateFormat: "DD/MM/YYYY",
            numberFormat: "indian",
            showAdvancedFields: false
        }
    };
};