import React from 'react';
import { Plus } from 'lucide-react';

interface ComposeButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function ComposeButton({ onClick, className = '', children }: ComposeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 
        px-6 py-3 text-white font-medium transition-all duration-300 ease-out
        hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg
        active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 group-active:animate-ping"></div>
      
      {/* Content */}
      <div className="relative flex items-center gap-2">
        <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
        {children || 'Compose'}
      </div>
    </button>
  );
}

export default ComposeButton;
