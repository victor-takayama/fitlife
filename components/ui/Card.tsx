
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={`bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg border border-white/20 dark:border-slate-700/20 rounded-xl shadow-lg p-6 transition-all duration-300 ${className || ''} ${onClick ? 'cursor-pointer hover:shadow-xl' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
    