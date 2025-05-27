

import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  // Fix: Added optional placeholder prop
  placeholder?: string; 
}

const Select: React.FC<SelectProps> = ({ label, id, error, options, className, placeholder, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-4 py-2.5 rounded-lg bg-white/50 dark:bg-slate-700/50 border 
        ${ error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-neutral-DEFAULT/30 dark:border-slate-600 focus:ring-primary focus:border-primary'} 
        text-neutral-dark dark:text-neutral-light 
        focus:outline-none focus:ring-2 focus:ring-offset-0
        transition-colors duration-200 ease-in-out appearance-none ${className || ''}`}
        {...props}
      >
        {/* Fix: Use the added placeholder prop to render a disabled, selected option */}
        {placeholder && <option value="" disabled={props.value === undefined || props.value === ''} hidden={!(props.value === undefined || props.value === '')}>{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Select;