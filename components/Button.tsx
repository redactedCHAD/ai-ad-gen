import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = "w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4";
  
  const primaryClasses = "text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:ring-cyan-300 dark:focus:ring-cyan-800 disabled:hover:from-cyan-500 disabled:hover:to-blue-600";
  
  const secondaryClasses = "text-gray-200 bg-gray-800 border border-gray-700 hover:bg-gray-700 focus:ring-gray-600 disabled:hover:bg-gray-800";

  const classes = `${baseClasses} ${variant === 'primary' ? primaryClasses : secondaryClasses}`;
  
  return (
    <button
      {...props}
      className={classes}
    >
      {children}
    </button>
  );
};

export default Button;