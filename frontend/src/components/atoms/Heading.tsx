import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  className = '',
}) => {
  
  const sizeClasses = {
    1: 'text-4xl font-bold',
    2: 'text-3xl font-bold',
    3: 'text-2xl font-semibold',
    4: 'text-xl font-semibold',
    5: 'text-lg font-medium',
    6: 'text-base font-medium',
  };
  
  return React.createElement(
    `h${level}`,
    { className: `${sizeClasses[level]} text-gray-900 ${className}` },
    children
  );
};

export default Heading;
