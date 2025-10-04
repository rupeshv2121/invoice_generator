import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();

    const navigationItems = [
        { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Create Invoice', path: '/invoice-creation', icon: 'FileText' },
        { label: 'Invoice List', path: '/invoice-list', icon: 'List' },
        { label: 'Customers', path: '/customer-management', icon: 'Users' },
        { label: 'Reports', path: '/reports', icon: 'BarChart3' },
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

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Logo */}
                <Link to="/dashboard" className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
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
                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleUserMenu}
                            className="flex items-center space-x-2"
                        >
                            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
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
                                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-20">
                                    <div className="py-1">
                                        <Link
                                            to="/company-profile"
                                            className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                                            onClick={closeUserMenu}
                                        >
                                            <Icon name="Building" size={16} className="mr-3" />
                                            Company Profile
                                        </Link>
                                        <div className="border-t border-border my-1" />
                                        <button
                                            className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                                            onClick={() => {
                                                closeUserMenu();
                                                // Handle logout
                                            }}
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
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={closeMobileMenu}
                    />
                    <div className="fixed top-16 left-0 right-0 bg-surface border-b border-border shadow-lg z-50 lg:hidden">
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
                                    <Icon name={item?.icon} size={20} />
                                    <span>{item?.label}</span>
                                </Link>
                            ))}
                            <div className="border-t border-border my-3" />
                            <Link
                                to="/company-profile"
                                onClick={closeMobileMenu}
                                className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-text-secondary hover:text-foreground hover:bg-muted transition-colors duration-200"
                            >
                                <Icon name="Building" size={20} />
                                <span>Company Profile</span>
                            </Link>
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;