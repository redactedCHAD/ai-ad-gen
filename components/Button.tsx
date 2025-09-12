import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = "w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  
  const primaryClasses = "text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 disabled:hover:from-cyan-500 disabled:hover:to-blue-600";
  
  const secondaryClasses = "text-cyan-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500 disabled:hover:bg-gray-700";

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