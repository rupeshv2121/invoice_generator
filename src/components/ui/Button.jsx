import React from 'react'; 
 
const Button = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  disabled = false, 
  onClick, 
  type = 'button', 
  ...props 
}) => { 
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"; 
 
  const variantClasses = { 
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500", 
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500", 
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500", 
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500", 
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500", 
    link: "text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline" 
  }; 
 
  const sizeClasses = { 
    sm: "h-8 px-3 text-sm", 
    md: "h-10 px-4 py-2", 
    lg: "h-12 px-6 text-lg" 
  }; 
 
  const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.md} ${className}`; 
 
  return ( 
    <button 
      type={type} 
      className={classes} 
      disabled={disabled} 
      onClick={onClick} 
      {...props} 
    > 
      {children} 
    </button> 
  ); 
}; 
 
export default Button;
