import React from 'react';
import './Skeleton.css';

/**
 * Skeleton placeholder for Photography cards
 * @param {Object} props
 * @param {boolean} [props.isHome=false] - Whether rendered inside home page latest shots grid
 */
export function PhotoCardSkeleton({ isHome = false }) {
  return (
    <figure
      className={`photo-card-skeleton ${isHome ? 'is-home' : ''}`}
      aria-hidden="true"
    >
      <div className="photo-skeleton-bg skeleton-shimmer" />

      <div className="photo-skeleton-overlay">
        <div className="photo-skeleton-badge skeleton-shimmer" />
        <div className="photo-skeleton-title skeleton-shimmer" />
      </div>
    </figure>
  );
}

export default PhotoCardSkeleton;
