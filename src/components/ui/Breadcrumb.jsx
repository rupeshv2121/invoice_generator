import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location?.pathname?.split('/')?.filter((x) => x);

    const breadcrumbMap = {
        'dashboard': 'Dashboard',
        'invoice-creation': 'Create Invoice',
        'invoice-list': 'Invoice List',
        'customer-management': 'Customers',
        'reports': 'Reports',
        'company-profile': 'Company Profile',
    };

    const getBreadcrumbName = (pathname) => {
        return breadcrumbMap?.[pathname] || pathname?.charAt(0)?.toUpperCase() + pathname?.slice(1);
    };

    if (pathnames?.length === 0 || (pathnames?.length === 1 && pathnames?.[0] === 'dashboard')) {
        return null;
    }

    return (
        <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
            <Link
                to="/dashboard"
                className="flex items-center hover:text-foreground transition-colors duration-150"
            >
                <Icon name="Home" size={16} className="mr-1" />
                Dashboard
            </Link>
            {pathnames?.map((pathname, index) => {
                const routeTo = `/${pathnames?.slice(0, index + 1)?.join('/')}`;
                const isLast = index === pathnames?.length - 1;

                return (
                    <React.Fragment key={pathname}>
                        <Icon name="ChevronRight" size={16} className="text-border" />
                        {isLast ? (
                            <span className="text-foreground font-medium">
                                {getBreadcrumbName(pathname)}
                            </span>
                        ) : (
                            <Link
                                to={routeTo}
                                className="hover:text-foreground transition-colors duration-150"
                            >
                                {getBreadcrumbName(pathname)}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;