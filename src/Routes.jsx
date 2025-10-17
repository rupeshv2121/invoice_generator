import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";

import NotFound from "./pages/NotFound";
import CompanyProfile from "./pages/company-profile";
import CustomerManagement from "./pages/customer-management";
import Dashboard from "./pages/dashboard";
import InvoiceCreation from "./pages/invoice-creation";
import InvoiceList from "./pages/invoice-list";
import ItemsManagement from "./pages/items-management";
import LandingPage from "./pages/landing-page";
import Login from "./pages/login";
import PDFPreview from "./pages/pdf-preview";
import Register from "./pages/register";
import Reports from "./pages/reports";
import Settings from "./pages/settings";

const Routes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ErrorBoundary>
                    <ScrollToTop />
                    <RouterRoutes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route
                            path="/invoice-list"
                            element={
                                <ProtectedRoute>
                                    <InvoiceList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/invoice-creation"
                            element={
                                <ProtectedRoute>
                                    <InvoiceCreation />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/company-profile"
                            element={
                                <ProtectedRoute>
                                    <CompanyProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/customer-management"
                            element={
                                <ProtectedRoute>
                                    <CustomerManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/items-management"
                            element={
                                <ProtectedRoute>
                                    <ItemsManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <Settings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/pdf-preview"
                            element={
                                <ProtectedRoute>
                                    <PDFPreview />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/reports"
                            element={
                                <ProtectedRoute>
                                    <Reports />
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                    </RouterRoutes>
                </ErrorBoundary>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default Routes;
