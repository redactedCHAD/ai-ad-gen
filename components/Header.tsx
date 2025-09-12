import React from 'react';

interface HeaderProps {
    title: React.ReactNode;
    subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="mb-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-100">
        {title}
      </h1>
      <p className="mt-2 text-md text-gray-400">
        {subtitle}
      </p>
    </header>
  );
};

export default Header;