import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import './ProjectList.css';

export function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionInProgress, setActionInProgress] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data || []);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will also remove the image from Cloudinary.`)) {
      return;
    }

    try {
      setActionInProgress(id);
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => (p.id || p._id) !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      setActionInProgress(id);
      const updated = await projectService.toggleFeatured(id);
      setProjects((prev) =>
        prev.map((p) => ((p.id || p._id) === id ? { ...p, featured: updated.featured } : p))
      );
    } catch (err) {
      alert(`Toggle failed: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="project-list-page">
      <header className="project-list-header">
        <div>
          <h2 className="project-list-title">Software Projects</h2>
          <p style={{ margin: '4px 0 0', color: '#71717a', fontSize: '13px' }}>
            Manage the software engineering portfolio displayed on the public site
          </p>
        </div>
        <Link to="/admin/projects/new" className="admin-action-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add New Project</span>
        </Link>
      </header>

      {errorMsg && (
        <div style={{ padding: '12px 16px', background: '#3b1c1e', color: '#fca5a5', borderRadius: '8px', marginBottom: '20px' }}>
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#71717a' }}>
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="project-empty-state">
          <p style={{ fontSize: '16px', marginBottom: '16px' }}>No software projects created yet.</p>
          <Link to="/admin/projects/new" className="admin-action-btn-primary">
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="project-list-table-wrapper">
          <table className="project-list-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Technologies</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const id = project.id || project._id;
                const img = project.imageUrl || project.image;
                return (
                  <tr key={id}>
                    <td>
                      <img src={img} alt={project.title} className="project-td-thumb" />
                    </td>
                    <td>
                      <div className="project-td-title">{project.title}</div>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '12px', color: '#60a5fa', textDecoration: 'none' }}
                        >
                          GitHub ↗
                        </a>
                      )}
                    </td>
                    <td>
                      <div className="project-td-desc" title={project.description}>
                        {project.description}
                      </div>
                    </td>
                    <td>
                      <div className="project-td-tags">
                        {project.tags?.map((tag) => (
                          <span key={tag} className="project-tag-badge">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(id)}
                        disabled={actionInProgress === id}
                        className={project.featured ? 'project-badge-featured' : 'project-badge-standard'}
                        title="Click to toggle featured state on homepage"
                      >
                        {project.featured ? '★ Featured' : 'Standard'}
                      </button>
                    </td>
                    <td>
                      <div className="project-actions-cell">
                        <Link to={`/admin/projects/${id}/edit`} className="btn-action-edit">
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(id, project.title)}
                          disabled={actionInProgress === id}
                          className="btn-action-delete"
                        >
                          {actionInProgress === id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProjectList;
