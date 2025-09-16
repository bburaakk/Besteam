import React from 'react';

interface LoadingButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-primary via-primary-600 to-purple-600 text-white hover:from-primary-600 hover:to-purple-600',
  secondary: 'bg-white/90 backdrop-blur-xl border-2 border-gray-200 text-gray-900 hover:bg-white hover:border-primary/40',
  outline: 'bg-white/10 backdrop-blur border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-10 py-4 text-lg',
};

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading = false,
  loadingText = 'Yükleniyor...',
  disabled = false,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        group relative font-bold rounded-xl shadow-lg hover:shadow-xl 
        transform hover:-translate-y-1 transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <svg 
            className="animate-spin h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          {children}
        </div>
      )}
    </button>
  );
};

export default LoadingButton;
