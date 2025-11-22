
import { Calculator, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';

const Footer = () => {
    const footerLinks = {
        product: [
            { name: 'Features', href: '#features' },
            { name: 'Pricing', href: '#pricing' },
            { name: 'Demo', href: '#demo' },
            // { name: 'Templates', href: '#' },
            // { name: 'Integrations', href: '#' }
        ],
        // company: [
        //     { name: 'About Us', href: '#' },
        //     { name: 'Careers', href: '#' },
        //     { name: 'Press Kit', href: '#' },
        //     { name: 'Contact', href: '#' },
        //     { name: 'Partners', href: '#' }
        // ],
        support: [
            { name: 'Help Center', href: '#' },
            { name: 'Documentation', href: '#' },
            { name: 'API Reference', href: '#' },
            { name: 'Community', href: '#' },
            { name: 'Status', href: '#' }
        ],
        legal: [
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
            { name: 'Cookie Policy', href: '#' },
            { name: 'GDPR', href: '#' },
            { name: 'Compliance', href: '#' }
        ]
    };

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Instagram, href: '#', label: 'Instagram' }
    ];

    const contactInfo = [
        { icon: Mail, text: 'rupeshvarshney7@gmail.com', href: 'mailto:rupeshvarshney7@gmail.com' },
        { icon: Phone, text: '+91 8954849868', href: 'tel:+918954849868' },
        { icon: MapPin, text: 'Aligarh, Uttar Pradesh, India', href: '#' }
    ];

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-12 sm:py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
                        {/* Company Info */}
                        <div className="sm:col-span-2 lg:col-span-2 space-y-6">
                            <div className="flex items-center space-x-2">
                                <Calculator className="h-8 w-8 text-blue-400" />
                                <span className="text-2xl font-bold">InvoicePro</span>
                            </div>

                            <p className="text-gray-400 leading-relaxed">
                                The most trusted GST invoicing solution for Indian businesses.
                                Automate your invoicing, ensure compliance, and focus on growing your business.
                            </p>

                            {/* Contact Information */}
                            <div className="space-y-3">
                                {contactInfo?.map((contact, index) => {
                                    const IconComponent = contact?.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={contact?.href}
                                            className="flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                                        >
                                            <IconComponent className="h-5 w-5" />
                                            <span>{contact?.text}</span>
                                        </a>
                                    );
                                })}
                            </div>

                            {/* Social Links */}
                            <div className="flex space-x-4">
                                {socialLinks?.map((social, index) => {
                                    const IconComponent = social?.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={social?.href}
                                            aria-label={social?.label}
                                            className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                                        >
                                            <IconComponent className="h-5 w-5" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Product Links */}
                        <div>
                            <h3 className="font-semibold text-white mb-4">Product</h3>
                            <ul className="space-y-3">
                                {footerLinks?.product?.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link?.href}
                                            className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                                        >
                                            {link?.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Links */}
                        {/* <div>
                            <h3 className="font-semibold text-white mb-4">Company</h3>
                            <ul className="space-y-3">
                                {footerLinks?.company?.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link?.href}
                                            className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                                        >
                                            {link?.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div> */}

                        {/* Support Links */}
                        <div>
                            <h3 className="font-semibold text-white mb-4">Support</h3>
                            <ul className="space-y-3">
                                {footerLinks?.support?.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link?.href}
                                            className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                                        >
                                            {link?.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal Links */}
                        <div>
                            <h3 className="font-semibold text-white mb-4">Legal</h3>
                            <ul className="space-y-3">
                                {footerLinks?.legal?.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link?.href}
                                            className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                                        >
                                            {link?.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Newsletter Signup */}
                <div className="py-6 sm:py-8 border-t border-gray-800">
                    <div className="flex flex-col space-y-4">
                        <div className="text-center sm:text-left">
                            <h3 className="font-semibold text-white mb-2 text-lg">Stay Updated</h3>
                            <p className="text-gray-400 text-sm sm:text-base">
                                Get the latest features and GST compliance updates
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap text-sm sm:text-base">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="py-6 border-t border-gray-800">
                    <div className="flex flex-col space-y-3 text-center sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                        <div className="text-gray-400 text-xs sm:text-sm">
                            © 2025 InvoicePro. All rights reserved.
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400">
                            <span>Made with ❤️ in India</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>All systems operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;