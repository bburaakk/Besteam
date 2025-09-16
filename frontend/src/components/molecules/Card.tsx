import React from 'react';
import { Button } from '../atoms';

interface CardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  onAction?: () => void;
  actionText?: string;
  className?: string;
  variant?: 'default' | 'career' | 'feature';
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  onAction,
  actionText = 'Detay',
  className = '',
  variant = 'default',
}) => {
  const baseClasses = 'rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1';
  
  const variantClasses = {
    default: 'bg-white border-gray-200',
    career: 'bg-gradient-to-br from-accent to-accent-100 border-primary-200',
    feature: 'bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-300',
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
        {description && (
          <p className="text-gray-600 leading-relaxed">{description}</p>
        )}
      </div>
      
      {children && (
        <div className="mb-4">
          {children}
        </div>
      )}
      
      {onAction && (
        <div className="flex justify-end">
          <Button onClick={onAction} variant="career" size="sm">
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Card;
