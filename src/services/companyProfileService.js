// Company Profile Service - Mock data representing logged-in company
// In a real application, this would come from API calls or authentication context

export const getMyCompanyProfile = () => {
    // This would typically come from:
    // 1. Authentication context (logged-in user's company)
    // 2. API call to get user's company profile
    // 3. Local storage or session storage

    return {
        id: 1,
        companyName: "SHRI PASHUPATINATH ENTERPRISES",
        contactPerson: "Amit Kumar",
        email: "ak6999551@gmail.com",
        phone: "+91 8923646841",
        alternatePhone: "",
        website: "",

        // Export compliance details
        eximCode: "AGIPK4533G",
        gstNumber: "09AGIPK4533G1ZD",
        cinNumber: "U74999UP2017PTC098765",
        panNumber: "AGIPK4533G",
        companyType: "Private Limited",
        industry: "Hardware Manufacturing",

        // Address details
        addressLine1: "19/54 Hanuman Puri, Mahendar Nagar",
        addressLine2: "",
        city: "Aligarh",
        state: "Uttar Pradesh",
        stateCode: "09",
        postalCode: "202001",
        country: "India",

        // Export compliance
        iecCode: "AGIPK4533G",
        arn: "AA090418051260E",

        // Bank details
        bankDetails: {
            bankName: "Canara Bank",
            accountNumber: "12500644851",
            ifscCode: "CNRB0002976",
            accountName: "Shri Pashupatinath Enterprises",
            accountType: "Current",
            branchName: "Aligarh Main Branch"
        },

        // Business status
        status: "Active",
        gstStatus: "Registered",
        incorporationDate: "2017-01-15",

        // Metadata
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-10-05T14:20:00Z"
    };
};

// In a real app, you might also have:
// export const updateMyCompanyProfile = (profileData) => { ... }
// export const getMyCompanyBankDetails = () => { ... }
// export const updateCompanyBankDetails = (bankData) => { ... }

export const getMyCompanyBankDetails = () => {
    const profile = getMyCompanyProfile();
    return profile.bankDetails;
};

export const getMyCompanyAddress = () => {
    const profile = getMyCompanyProfile();
    return {
        addressLine1: profile.addressLine1,
        addressLine2: profile.addressLine2,
        city: profile.city,
        state: profile.state,
        postalCode: profile.postalCode,
        country: profile.country
    };
};

export const getMyCompanyExportDetails = () => {
    const profile = getMyCompanyProfile();
    return {
        eximCode: profile.eximCode,
        iecCode: profile.iecCode,
        arn: profile.arn,
        gstNumber: profile.gstNumber,
        stateCode: profile.stateCode
    };
};