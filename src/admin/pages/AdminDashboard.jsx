import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { photoService } from '../../services/photoService';
import './AdminDashboard.css';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    totalPhotos: 0,
    featuredPhotos: 0,
    categoriesCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projects, photos, categories] = await Promise.all([
          projectService.getProjects().catch(() => []),
          photoService.getPhotos().catch(() => []),
          photoService.getCategories().catch(() => [])
        ]);

        setStats({
          totalProjects: projects.length,
          featuredProjects: projects.filter((p) => p.featured).length,
          totalPhotos: photos.length,
          featuredPhotos: photos.filter((p) => p.featured).length,
          categoriesCount: categories.length
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard-page">
      <header className="admin-dash-header">
        <h2 className="admin-dash-title">Overview</h2>
        <p className="admin-dash-sub">
          Manage your software projects, photography archive, and portfolio showcases.
        </p>
      </header>

      {/* Metric Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-label">Software Projects</span>
          <span className="admin-stat-val">{loading ? '—' : stats.totalProjects}</span>
          <span className="admin-stat-meta">
            {stats.featuredProjects} featured on homepage
          </span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">Photography Archive</span>
          <span className="admin-stat-val">{loading ? '—' : stats.totalPhotos}</span>
          <span className="admin-stat-meta">
            {stats.featuredPhotos} featured in latest shots
          </span>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-label">Photo Categories</span>
          <span className="admin-stat-val">{loading ? '—' : stats.categoriesCount}</span>
          <span className="admin-stat-meta">Distinct archive categories</span>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <section className="admin-quick-actions">
        <h3 className="admin-quick-title">Quick Actions</h3>
        <div className="admin-action-buttons">
          <Link to="/admin/projects/new" className="admin-action-btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Software Project</span>
          </Link>

          <Link to="/admin/photography/upload" className="admin-action-btn-primary" style={{ backgroundColor: '#059669' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>Batch Upload Photography</span>
          </Link>

          <Link to="/admin/projects" className="admin-action-btn-secondary">
            <span>Manage All Projects →</span>
          </Link>

          <Link to="/admin/photography" className="admin-action-btn-secondary">
            <span>Manage Photo Gallery →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
