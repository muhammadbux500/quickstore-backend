import React from 'react';

const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  bordered = false,
  shadow = 'md',
  hover = false,
  glassmorphism = false
}) => {
  
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8'
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };

  const borderClass = bordered ? 'border border-gray-200 dark:border-gray-700' : '';
  const hoverClass = hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : '';
  const glassClass = glassmorphism ? 'backdrop-blur-lg bg-white/30 dark:bg-gray-900/30' : 'bg-white dark:bg-gray-800';

  return (
    <div 
      className={`
        rounded-xl
        ${glassClass}
        ${borderClass}
        ${shadows[shadow]}
        ${paddings[padding]}
        ${hoverClass}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;