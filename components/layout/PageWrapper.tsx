
import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, title, className }) => {
  return (
    <main className={`flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 ${className || ''}`}>
      {title && (
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-dark dark:text-white mb-8 animate-fade-in">
          {title}
        </h1>
      )}
      <div className="animate-slide-in-bottom">
        {children}
      </div>
    </main>
  );
};

export default PageWrapper;
    