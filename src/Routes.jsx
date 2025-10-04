import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import CompanyProfile from "./pages/company-profile";
import CustomerManagement from "./pages/customer-management";
import Dashboard from "./pages/dashboard";
import InvoiceCreation from "./pages/invoice-creation";
import InvoiceList from "./pages/invoice-list";
import Login from "./pages/login/index";
import Register from "./pages/register";
import Reports from "./pages/reports";

const Routes = () => {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <ScrollToTop />
                <RouterRoutes>
                    {/* Define your route here */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/invoice-list" element={<InvoiceList />} />
                    <Route path="/invoice-creation" element={<InvoiceCreation />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/company-profile" element={<CompanyProfile />} />
                    <Route path="/customer-management" element={<CustomerManagement />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="*" element={<NotFound />} />
                </RouterRoutes>
            </ErrorBoundary>
        </BrowserRouter>
    );
};

export default Routes;
