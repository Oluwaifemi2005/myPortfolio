import React from 'react';
import SectionHeader from '../components/SectionHeader';
import ProjectCard from '../components/ProjectCard';
import ProjectCardSkeleton from '../components/skeletons/ProjectCardSkeleton';
import DataStateMessage from '../components/common/DataStateMessage';
import { useProjects } from '../hooks/useProjects';
import { profileData } from '../data/profileData';
import './SoftwarePage.css';

function SoftwarePage() {
  const { projects, loading, error, refetch } = useProjects();

  return (
    <div className="software-page-root">
      <div className="container software-container">
        {/* Page Header */}
        <header className="software-page-header">
          <SectionHeader
            title="SOFTWARE PROJECTS"
            subtitle="Web applications, front-end architecture, and interactive design systems built with clean, modern code."
          />
        </header>

        {/* Loading State: Skeletons */}
        {loading && (
          <section className="software-projects-grid" aria-label="Loading software projects">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ProjectCardSkeleton key={`skeleton-${idx}`} />
            ))}
          </section>
        )}

        {/* Error State */}
        {!loading && error && (
          <DataStateMessage
            type="error"
            title="Unable to Load Projects"
            message={error}
            onRetry={refetch}
          />
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <DataStateMessage
            type="empty"
            title="No Projects Available"
            message="No software projects available yet."
          />
        )}

        {/* Success State: Projects Grid */}
        {!loading && !error && projects.length > 0 && (
          <section className="software-projects-grid">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>
        )}

        {/* GitHub Callout Banner */}
        <aside className="software-github-callout">
          <div className="software-github-callout-content">
            <h3 className="software-github-callout-title">Explore Open Source & Experiments</h3>
            <p className="software-github-callout-text">
              Looking for more repositories, scripts, and code experiments? Visit my personal GitHub profile.
            </p>
          </div>
          <a
            href={profileData.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="software-github-callout-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Visit GitHub Profile</span>
          </a>
        </aside>
      </div>
    </div>
  );
}

export default SoftwarePage;
