import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, className = '' }) => {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{ width, height }}
    />
  );
};

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <Skeleton width="70%" height="1.5rem" className="skeleton-title" />
    <Skeleton width="50%" height="1rem" className="skeleton-subtitle" />
    <Skeleton width="60%" height="0.875rem" className="skeleton-text" />
  </div>
);

export default Skeleton;
