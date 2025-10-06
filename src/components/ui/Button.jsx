import Icon from '../AppIcon';

const Button = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  iconName,
  iconPosition = 'left',
  iconSize,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    link: "text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizeClasses = {
    sm: "h-9 sm:h-8 px-3 text-sm min-w-[44px]", // Minimum 44px touch target for mobile
    md: "h-11 sm:h-10 px-4 py-2 min-w-[44px]",
    lg: "h-12 px-6 text-lg min-w-[44px]"
  };

  // Icon size based on button size
  const getIconSize = () => {
    if (iconSize) return iconSize;
    switch (size) {
      case 'sm': return 14;
      case 'lg': return 20;
      default: return 16;
    }
  };

  const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.md} ${className}`;

  const renderIcon = () => {
    if (!iconName) return null;
    const iconClass = children
      ? (iconPosition === 'right' ? 'ml-2' : 'mr-2')
      : '';
    return <Icon name={iconName} size={getIconSize()} className={iconClass} />;
  };

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {iconName && iconPosition === 'left' && renderIcon()}
      {children}
      {iconName && iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default Button;
