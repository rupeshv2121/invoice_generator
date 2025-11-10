// Settings Service for managing application settings including terms & conditions

// Storage key for localStorage
const STORAGE_KEY = 'invoiceGeneratorSettings';

// Load settings from localStorage or use defaults
const loadSettings = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Merge with defaults to ensure new fields are present
            return {
                ...getDefaultSettings(),
                ...parsed,
                invoiceSettings: {
                    ...getDefaultSettings().invoiceSettings,
                    ...parsed.invoiceSettings
                }
            };
        }
    } catch (error) {
        console.error('Error loading settings from localStorage:', error);
    }
    return getDefaultSettings();
};

// Save settings to localStorage
const saveSettings = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsData));
    } catch (error) {
        console.error('Error saving settings to localStorage:', error);
    }
};

// Get default settings structure
const getDefaultSettings = () => ({
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
        invoicePrefix: "",
        startingNumber: 1,
        currentNumber: 1, // Natural number starting from 1
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
});

// Initialize settings from localStorage or defaults
let settingsData = loadSettings();

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
    saveSettings();
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
    saveSettings();
};

/**
 * Get next invoice number
 * @returns {Number} Next invoice number as integer
 */
export const getNextInvoiceNumber = () => {
    return settingsData.invoiceSettings.currentNumber;
};

/**
 * Increment invoice number
 * @returns {Number} New invoice number
 */
export const incrementInvoiceNumber = () => {
    settingsData.invoiceSettings.currentNumber += 1;
    saveSettings(); // Persist the incremented number
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
    saveSettings();
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
    saveSettings();
};

/**
 * Reset settings to default
 */
export const resetToDefault = () => {
    settingsData = getDefaultSettings();
    saveSettings();
};