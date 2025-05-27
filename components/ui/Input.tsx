
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, id, error, icon, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`w-full px-4 py-2.5 rounded-lg bg-white/50 dark:bg-slate-700/50 border 
          ${ error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-neutral-DEFAULT/30 dark:border-slate-600 focus:ring-primary focus:border-primary'} 
          text-neutral-dark dark:text-neutral-light placeholder-neutral-DEFAULT/70 dark:placeholder-neutral-light/70 
          focus:outline-none focus:ring-2 focus:ring-offset-0
          transition-colors duration-200 ease-in-out ${icon ? 'pl-10' : ''} ${className || ''}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
    