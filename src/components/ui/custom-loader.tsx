import React from 'react';

interface CustomLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CustomLoader({ size = 'md', className = '' }: CustomLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700"></div>
        
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin"></div>
        
        {/* Inner dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

export default CustomLoader;
