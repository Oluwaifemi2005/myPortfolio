import React from 'react';
import './Skeleton.css';

/**
 * Skeleton placeholder for ProjectCard
 * @param {Object} props
 * @param {boolean} [props.isHome=false] - Whether rendered inside home page featured grid
 */
export function ProjectCardSkeleton({ isHome = false }) {
  return (
    <article
      className={`project-card-skeleton ${isHome ? 'home-project-card' : ''}`}
      aria-hidden="true"
    >
      <div
        className={`project-skeleton-img skeleton-shimmer ${isHome ? 'is-home' : ''}`}
      />

      <div className={`project-skeleton-content ${isHome ? 'is-home' : ''}`}>
        <div className="project-skeleton-title skeleton-shimmer" />

        <div className="project-skeleton-desc-line full skeleton-shimmer" />
        <div className="project-skeleton-desc-line partial skeleton-shimmer" />

        <div className="project-skeleton-tags">
          <div className="project-skeleton-tag skeleton-shimmer" />
          <div className="project-skeleton-tag skeleton-shimmer" />
          <div className="project-skeleton-tag skeleton-shimmer" />
        </div>

        <div className="project-skeleton-actions">
          <div className="project-skeleton-btn skeleton-shimmer" />
          <div className="project-skeleton-link skeleton-shimmer" />
        </div>
      </div>
    </article>
  );
}

export default ProjectCardSkeleton;
