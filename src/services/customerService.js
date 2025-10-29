// // Customer Service for managing customers in JSON file storage

// // Initial customer data - will be stored in localStorage for now
// // In production, this would be replaced with API calls
// const STORAGE_KEY = 'invoice_customers';

// const defaultCustomers = [
//     {
//         id: 1,
//         businessName: "TechCorp Solutions Pvt Ltd",
//         contactPerson: "Rajesh Kumar",
//         email: "rajesh@techcorp.com",
//         phone: "+91 98765 43210",
//         location: "Mumbai",
//         customerType: "Business",
//         gstNumber: "27AAAAA0000A1Z5",
//         eximCode: "3018069270141",
//         billingAddress: {
//             street: "123 Business Park, Andheri East",
//             city: "Mumbai",
//             state: "Maharashtra",
//             pincode: "400069",
//             country: "India"
//         },
//         shippingAddress: {
//             street: "123 Business Park, Andheri East",
//             city: "Mumbai",
//             state: "Maharashtra",
//             pincode: "400069",
//             country: "India"
//         },
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//     },
//     {
//         id: 2,
//         businessName: "JEEVAN HARDWARE",
//         contactPerson: "Jeevan Kumar",
//         email: "info@jeevanhardware.com",
//         phone: "+977 98765 43210",
//         location: "Kathmandu",
//         customerType: "Business",
//         gstNumber: "",
//         eximCode: "301806927014NP",
//         billingAddress: {
//             street: "Kathmandu, kathmandu MC-11, Bhotebahali",
//             city: "Kathmandu",
//             state: "Bagmati",
//             pincode: "00",
//             country: "Nepal"
//         },
//         shippingAddress: {
//             street: "Kathmandu, kathmandu MC-11, Bhotebahali",
//             city: "Kathmandu",
//             state: "Bagmati",
//             pincode: "00",
//             country: "Nepal"
//         },
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//     }
// ];

// /**
//  * Initialize customer storage with default data if not exists
//  */
// const initializeCustomerStorage = () => {
//     const existingData = localStorage.getItem(STORAGE_KEY);
//     if (!existingData) {
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCustomers));
//         return defaultCustomers;
//     }
//     return JSON.parse(existingData);
// };

// /**
//  * Get all customers
//  * @returns {Array} Array of customer objects
//  */
// export const getAllCustomers = () => {
//     try {
//         const customers = initializeCustomerStorage();
//         return customers.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
//     } catch (error) {
//         console.error('Error loading customers:', error);
//         return [];
//     }
// };

// /**
//  * Get customer by ID
//  * @param {number} id - Customer ID
//  * @returns {Object|null} Customer object or null if not found
//  */
// export const getCustomerById = (id) => {
//     try {
//         const customers = getAllCustomers();
//         return customers.find(customer => customer.id === parseInt(id)) || null;
//     } catch (error) {
//         console.error('Error getting customer by ID:', error);
//         return null;
//     }
// };

// /**
//  * Add new customer
//  * @param {Object} customerData - Customer data object
//  * @returns {Object} Created customer with ID and timestamps
//  */
// export const addCustomer = (customerData) => {
//     try {
//         const customers = getAllCustomers();
        
//         // Generate new ID
//         const maxId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) : 0;
//         const newId = maxId + 1;
        
//         // Create new customer with ID and timestamps
//         const newCustomer = {
//             ...customerData,
//             id: newId,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString()
//         };
        
//         // Add to customers array
//         customers.push(newCustomer);
        
//         // Save to localStorage
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
        
//         return newCustomer;
//     } catch (error) {
//         console.error('Error adding customer:', error);
//         throw error;
//     }
// };

// /**
//  * Update existing customer
//  * @param {number} id - Customer ID
//  * @param {Object} customerData - Updated customer data
//  * @returns {Object|null} Updated customer or null if not found
//  */
// export const updateCustomer = (id, customerData) => {
//     try {
//         const customers = getAllCustomers();
//         const customerIndex = customers.findIndex(customer => customer.id === parseInt(id));
        
//         if (customerIndex === -1) {
//             return null;
//         }
        
//         // Update customer with new data and timestamp
//         customers[customerIndex] = {
//             ...customers[customerIndex],
//             ...customerData,
//             id: parseInt(id), // Ensure ID doesn't change
//             updatedAt: new Date().toISOString()
//         };
        
//         // Save to localStorage
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
        
//         return customers[customerIndex];
//     } catch (error) {
//         console.error('Error updating customer:', error);
//         throw error;
//     }
// };

// /**
//  * Delete customer
//  * @param {number} id - Customer ID
//  * @returns {boolean} True if deleted successfully
//  */
// export const deleteCustomer = (id) => {
//     try {
//         const customers = getAllCustomers();
//         const filteredCustomers = customers.filter(customer => customer.id !== parseInt(id));
        
//         if (filteredCustomers.length === customers.length) {
//             return false; // Customer not found
//         }
        
//         // Save updated array to localStorage
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCustomers));
        
//         return true;
//     } catch (error) {
//         console.error('Error deleting customer:', error);
//         return false;
//     }
// };

// /**
//  * Search customers by various criteria
//  * @param {string} searchTerm - Search term
//  * @returns {Array} Filtered array of customers
//  */
// export const searchCustomers = (searchTerm) => {
//     try {
//         const customers = getAllCustomers();
        
//         if (!searchTerm) {
//             return customers;
//         }
        
//         const term = searchTerm.toLowerCase();
        
//         return customers.filter(customer => 
//             customer.businessName.toLowerCase().includes(term) ||
//             customer.contactPerson.toLowerCase().includes(term) ||
//             customer.email.toLowerCase().includes(term) ||
//             customer.phone.includes(term) ||
//             customer.location.toLowerCase().includes(term) ||
//             customer.eximCode?.toLowerCase().includes(term) ||
//             customer.gstNumber?.toLowerCase().includes(term)
//         );
//     } catch (error) {
//         console.error('Error searching customers:', error);
//         return [];
//     }
// };

// /**
//  * Get customers for dropdown options
//  * @returns {Array} Array of customer options for select dropdown
//  */
// export const getCustomerOptions = () => {
//     try {
//         const customers = getAllCustomers();
        
//         return customers.map(customer => ({
//             value: customer.id,
//             label: customer.businessName,
//             description: `${customer.email} - ${customer.location}${customer.eximCode ? ` (EXIM: ${customer.eximCode})` : ''}`
//         }));
//     } catch (error) {
//         console.error('Error getting customer options:', error);
//         return [];
//     }
// };

// /**
//  * Export customers data for backup
//  * @returns {string} JSON string of all customers
//  */
// export const exportCustomersData = () => {
//     try {
//         const customers = getAllCustomers();
//         return JSON.stringify(customers, null, 2);
//     } catch (error) {
//         console.error('Error exporting customers:', error);
//         return '[]';
//     }
// };

// /**
//  * Import customers data from JSON
//  * @param {string} jsonData - JSON string of customers
//  * @returns {boolean} True if imported successfully
//  */
// export const importCustomersData = (jsonData) => {
//     try {
//         const importedCustomers = JSON.parse(jsonData);
        
//         if (!Array.isArray(importedCustomers)) {
//             throw new Error('Invalid data format');
//         }
        
//         // Validate each customer object has required fields
//         const requiredFields = ['businessName', 'contactPerson', 'email', 'phone'];
//         const isValidData = importedCustomers.every(customer => 
//             requiredFields.every(field => customer.hasOwnProperty(field))
//         );
        
//         if (!isValidData) {
//             throw new Error('Invalid customer data structure');
//         }
        
//         // Add IDs and timestamps to imported data if missing
//         const processedCustomers = importedCustomers.map((customer, index) => ({
//             ...customer,
//             id: customer.id || (index + 1),
//             createdAt: customer.createdAt || new Date().toISOString(),
//             updatedAt: customer.updatedAt || new Date().toISOString()
//         }));
        
//         // Save to localStorage
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(processedCustomers));
        
//         return true;
//     } catch (error) {
//         console.error('Error importing customers:', error);
//         return false;
//     }
// };

// /**
//  * Clear all customer data (use with caution)
//  */
// export const clearAllCustomers = () => {
//     try {
//         localStorage.removeItem(STORAGE_KEY);
//         return true;
//     } catch (error) {
//         console.error('Error clearing customers:', error);
//         return false;
//     }
// };