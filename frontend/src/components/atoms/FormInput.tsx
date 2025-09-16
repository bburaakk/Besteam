import React from 'react';
import { Field, ErrorMessage } from 'formik';

interface FormInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  className?: string;
  errors?: any;
  touched?: any;
  required?: boolean;
  autoComplete?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  className = '',
  errors,
  touched,
  required = false,
  autoComplete,
}) => {
  const hasError = errors && touched && errors[name] && touched[name];

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm font-bold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <Field
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        className={`w-full px-4 py-3 border rounded-xl bg-gray-50/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white placeholder:text-gray-400 ${
          hasError
            ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400 bg-red-50/30'
            : 'border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300'
        }`}
        placeholder={placeholder}
      />
      
      <ErrorMessage 
        name={name} 
        component="div" 
        className="mt-2"
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

export default FormInput;
