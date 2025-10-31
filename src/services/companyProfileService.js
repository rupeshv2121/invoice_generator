
// import axios from 'axios';

// export const getMyCompanyProfile = async () => {
//     const response = await axios.get('/api/company/profile/main');
//     return response.data;
// };

// // In a real app, you might also have:
// // export const updateMyCompanyProfile = (profileData) => { ... }
// // export const getMyCompanyBankDetails = () => { ... }
// // export const updateCompanyBankDetails = (bankData) => { ... }

// export const getMyCompanyBankDetails = () => {
//     const profile = getMyCompanyProfile();
//     return profile.bankDetails;
// };

// export const getMyCompanyAddress = () => {
//     const profile = getMyCompanyProfile();
//     return {
//         addressLine1: profile.addressLine1,
//         addressLine2: profile.addressLine2,
//         city: profile.city,
//         state: profile.state,
//         postalCode: profile.postalCode,
//         country: profile.country
//     };
// };

// export const getMyCompanyExportDetails = () => {
//     const profile = getMyCompanyProfile();
//     return {
//         eximCode: profile.eximCode,
//         iecCode: profile.iecCode,
//         arn: profile.arn,
//         gstNumber: profile.gstNumber,
//         stateCode: profile.stateCode
//     };
// };