import React from 'react';

const Loader = ({ 
  size = 'md', 
  color = 'primary',
  fullScreen = false,
  text = ''
}) => {
  
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const colors = {
    primary: 'border-blue-600',
    secondary: 'border-purple-600',
    success: 'border-green-600',
    danger: 'border-red-600',
    white: 'border-white'
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center">
      <div className={`
        ${sizes[size]} 
        border-4 
        ${colors[color]} 
        border-t-transparent 
        rounded-full 
        animate-spin
        shadow-lg
      `} />
      {text && (
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 backdrop-blur-sm">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;