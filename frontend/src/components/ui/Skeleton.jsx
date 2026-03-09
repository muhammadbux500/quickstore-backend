import React from 'react';
import { motion } from 'framer-motion';

// Base Skeleton Component
const Skeleton = ({ className = '', width, height, rounded = 'lg' }) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const style = {
    width: width || '100%',
    height: height || '1rem'
  };

  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer ${roundedClasses[rounded]} ${className}`}
      style={style}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};

// Text Skeleton (multiple lines)
export const TextSkeleton = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '80%' : '100%'}
          height="1rem"
        />
      ))}
    </div>
  );
};

// Avatar Skeleton
export const AvatarSkeleton = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return <Skeleton className={`${sizes[size]} ${className}`} rounded="full" />;
};

// Card Skeleton
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <Skeleton width="48px" height="48px" rounded="full" />
        <div className="flex-1">
          <Skeleton width="60%" height="1.2rem" className="mb-2" />
          <Skeleton width="40%" height="0.875rem" />
        </div>
      </div>

      {/* Content */}
      <Skeleton width="100%" height="1rem" className="mb-2" />
      <Skeleton width="90%" height="1rem" className="mb-2" />
      <Skeleton width="80%" height="1rem" className="mb-4" />

      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton width="30%" height="2rem" rounded="md" />
        <Skeleton width="20%" height="1rem" />
      </div>
    </div>
  );
};

// Product Card Skeleton
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      {/* Image */}
      <Skeleton width="100%" height="160px" rounded="lg" className="mb-4" />

      {/* Title */}
      <Skeleton width="80%" height="1.2rem" className="mb-2" />

      {/* Price */}
      <Skeleton width="40%" height="1.5rem" className="mb-3" />

      {/* Rating */}
      <div className="flex items-center space-x-2 mb-3">
        <Skeleton width="60px" height="0.875rem" />
        <Skeleton width="40px" height="0.875rem" />
      </div>

      {/* Button */}
      <Skeleton width="100%" height="2.5rem" rounded="lg" />
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 4 }) => {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3">
          <Skeleton width={i === 0 ? '80%' : '60%'} height="1rem" />
        </td>
      ))}
    </tr>
  );
};

// Dashboard Skeleton
export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton width="200px" height="2rem" />
        <Skeleton width="120px" height="2.5rem" rounded="lg" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <Skeleton width="150px" height="1.5rem" className="mb-4" />
        <Skeleton width="100%" height="200px" rounded="lg" />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <Skeleton width="120px" height="1.5rem" className="mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton width="60px" height="1rem" />
              <Skeleton width="100px" height="1rem" />
              <Skeleton width="80px" height="1rem" />
              <Skeleton width="90px" height="1rem" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
      <div className="flex items-center space-x-4 mb-6">
        <AvatarSkeleton size="xl" />
        <div className="flex-1">
          <Skeleton width="200px" height="1.8rem" className="mb-2" />
          <Skeleton width="150px" height="1rem" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Skeleton width="100px" height="1rem" className="mb-2" />
          <Skeleton width="150px" height="1.2rem" />
        </div>
        <div>
          <Skeleton width="100px" height="1rem" className="mb-2" />
          <Skeleton width="150px" height="1.2rem" />
        </div>
      </div>

      <TextSkeleton lines={4} className="mb-6" />

      <div className="flex space-x-3">
        <Skeleton width="120px" height="2.5rem" rounded="lg" />
        <Skeleton width="120px" height="2.5rem" rounded="lg" />
      </div>
    </div>
  );
};

// List Item Skeleton
export const ListItemSkeleton = ({ hasAvatar = true, hasAction = true }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-3">
        {hasAvatar && <AvatarSkeleton size="sm" />}
        <div>
          <Skeleton width="150px" height="1rem" className="mb-1" />
          <Skeleton width="100px" height="0.875rem" />
        </div>
      </div>
      {hasAction && <Skeleton width="80px" height="2rem" rounded="lg" />}
    </div>
  );
};

// Comment Skeleton
export const CommentSkeleton = () => {
  return (
    <div className="flex space-x-3 p-4">
      <AvatarSkeleton size="md" />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <Skeleton width="100px" height="1rem" />
          <Skeleton width="80px" height="0.875rem" />
        </div>
        <Skeleton width="100%" height="0.875rem" className="mb-1" />
        <Skeleton width="90%" height="0.875rem" className="mb-1" />
        <Skeleton width="60%" height="0.875rem" className="mb-2" />
        <div className="flex space-x-3">
          <Skeleton width="50px" height="1.5rem" />
          <Skeleton width="50px" height="1.5rem" />
        </div>
      </div>
    </div>
  );
};

// Gallery Skeleton
export const GallerySkeleton = ({ columns = 3 }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton width="100%" height="200px" rounded="lg" />
          <Skeleton width="80%" height="1rem" />
          <Skeleton width="60%" height="0.875rem" />
        </div>
      ))}
    </div>
  );
};

// Form Skeleton
export const FormSkeleton = ({ fields = 4 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <Skeleton width="100px" height="1rem" className="mb-1" />
          <Skeleton width="100%" height="2.5rem" rounded="lg" />
        </div>
      ))}
      <div className="flex space-x-3 pt-2">
        <Skeleton width="120px" height="2.5rem" rounded="lg" />
        <Skeleton width="120px" height="2.5rem" rounded="lg" />
      </div>
    </div>
  );
};

export default Skeleton;