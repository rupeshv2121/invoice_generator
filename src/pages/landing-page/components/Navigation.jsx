import { Calculator, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Demo', href: '#demo' },
        { name: 'About', href: '#about' }
    ];

    return (
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Calculator className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">InvoicePro</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks?.map((link) => (
                            <a
                                key={link?.name}
                                href={link?.href}
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            >
                                {link?.name}
                            </a>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/login"
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            Sign In
                        </Link>
                        <Link
                            as={Link}
                            to="/register"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                        >
                            Start Free Trial
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-blue-600"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                            {navLinks?.map((link) => (
                                <a
                                    key={link?.name}
                                    href={link?.href}
                                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link?.name}
                                </a>
                            ))}
                            <div className="pt-4 space-y-2">
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Button
                                    as={Link}
                                    to="/dashboard"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Start Free Trial
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;