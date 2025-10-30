
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-slate-200/80 p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`pb-4 border-b border-slate-200 mb-4 ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <h3 className={`text-lg font-semibold text-slate-800 ${className}`}>
            {children}
        </h3>
    );
};


export default Card;
