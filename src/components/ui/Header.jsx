import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { supabase } from '../../supabaseClient';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { setSession } = useAuth();
    const {
        subscription,
        isTrialActive,
        getDaysRemaining,
        getSubscriptionPlan
    } = useSubscription();

    const navigationItems = [
        { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Customers', path: '/customer-management', icon: 'Users' },
        { label: 'Items', path: '/items-management', icon: 'Package' },
        // { label: 'Company', path: '/company-management', icon: 'Building' },
        { label: 'Create Invoice', path: '/invoice-creation', icon: 'FileText' },
        { label: 'Invoice List', path: '/invoice-list', icon: 'List' },
        { label: 'Reports', path: '/reports', icon: 'BarChart3' },
        { label: 'PDF Preview', path: '/pdf-preview', icon: 'Eye' },

    ];

    const isActivePath = (path) => location?.pathname === path;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const closeUserMenu = () => {
        setIsUserMenuOpen(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        navigate("/login", { replace: true });
    }
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Logo */}
                <Link to="/dashboard" className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                        <Icon name="Receipt" size={20} color="white" />
                    </div>
                    <span className="text-xl font-semibold text-foreground">InvoicePro</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-1">
                    {navigationItems?.map((item) => (
                        <Link
                            key={item?.path}
                            to={item?.path}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActivePath(item?.path)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-text-secondary hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            <Icon name={item?.icon} size={16} />
                            <span>{item?.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">
                    {/* Subscription Badge (Desktop) */}
                    {subscription && (
                        <Link
                            to="/pricing"
                            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 hover:border-indigo-300 transition-all cursor-pointer group"
                        >
                            <Icon name="Crown" size={14} className="text-indigo-600" />
                            <span className="text-xs font-medium text-indigo-700">
                                {isTrialActive() ? (
                                    <>Trial: {getDaysRemaining()}d left</>
                                ) : (
                                    <>{getSubscriptionPlan()}</>
                                )}
                            </span>
                            <Icon name="ChevronRight" size={12} className="text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    )}

                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleUserMenu}
                            className="flex items-center space-x-2"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <Icon name="User" size={16} color="white" />
                            </div>
                            <Icon name="ChevronDown" size={16} />
                        </Button>

                        {/* User Dropdown Menu */}
                        {isUserMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={closeUserMenu}
                                />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-md shadow-lg z-20">
                                    <div className="py-1">
                                        <Link
                                            to="/company-profile"
                                            className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                                            onClick={closeUserMenu}
                                        >
                                            <Icon name="Building" size={16} className="mr-3" />
                                            Company Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                                            onClick={closeUserMenu}
                                        >
                                            <Icon name="Settings" size={16} className="mr-3" />
                                            Settings
                                        </Link>
                                        <div className="border-t border-border my-1" />
                                        <button
                                            className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                                            onClick={handleLogout}
                                        >
                                            <Icon name="LogOut" size={16} className="mr-3" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMobileMenu}
                        className="lg:hidden"
                    >
                        <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
                    </Button>
                </div>
            </div>
            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0  z-40 lg:hidden"
                        onClick={closeMobileMenu}
                    />
                    <div className="fixed top-16 left-0 right-0 bg-white border-b  border-border shadow-lg z-50 lg:hidden">
                        <nav className="px-4 py-4 space-y-2">
                            {navigationItems?.map((item) => (
                                <Link
                                    key={item?.path}
                                    to={item?.path}
                                    onClick={closeMobileMenu}
                                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath(item?.path)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-text-secondary hover:text-foreground hover:bg-muted'
                                        }`}
                                >
                                    <Icon name={item?.icon} size={20} className='z-10' />
                                    <span>{item?.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;