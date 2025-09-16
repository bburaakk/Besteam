import React from 'react';
import { Field, ErrorMessage } from 'formik';

interface CheckboxProps {
  id: string;
  name: string;
  label: React.ReactNode;
  className?: string;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  label,
  className = '',
  errors,
  touched,
}) => {
  const hasError = errors && touched && errors[name] && touched[name];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start">
        <Field
          id={id}
          name={name}
          type="checkbox"
          className={`h-5 w-5 rounded border transition-colors focus:ring-2 focus:ring-offset-2 mt-0.5 ${
            hasError
              ? 'text-red-500 border-red-300 focus:ring-red-500/20'
              : 'text-primary border-gray-300 focus:ring-primary/20'
          }`}
        />
        <label htmlFor={id} className="ml-3 block text-sm text-gray-700">
          {label}
        </label>
      </div>
      
      <ErrorMessage 
        name={name} 
        component="div" 
        className="ml-8 mt-2"
      >
        {(msg: string) => (
          <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-red-700 text-sm font-medium leading-tight">{msg}</span>
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};

export default Checkbox;
