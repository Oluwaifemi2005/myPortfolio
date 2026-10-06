import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import './ProjectForm.css';

export function ProjectForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    githubUrl: '',
    liveDemoUrl: '',
    imageUrl: '',
    featured: false,
    order: 0
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isEditing) {
      async function loadProject() {
        try {
          setLoading(true);
          const data = await projectService.getProjectById(id);
          if (data) {
            setFormData({
              title: data.title || '',
              description: data.description || '',
              tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
              githubUrl: data.githubUrl || '',
              liveDemoUrl: data.liveDemoUrl || '',
              imageUrl: data.imageUrl || data.image || '',
              featured: Boolean(data.featured),
              order: data.order || 0
            });
            setPreviewUrl(data.imageUrl || data.image || '');
          }
        } catch (err) {
          setErrorMsg(err.message || 'Failed to load project details');
        } finally {
          setLoading(false);
        }
      }
      loadProject();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setErrorMsg('Project Name and Description are required.');
      return;
    }

    if (!isEditing && !imageFile && !formData.imageUrl.trim()) {
      setErrorMsg('Please select a project image file or provide an image URL.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      // Build payload: use FormData if file attached, otherwise send JSON
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('description', formData.description.trim());
      payload.append('tags', formData.tags);
      payload.append('githubUrl', formData.githubUrl.trim());
      payload.append('liveDemoUrl', formData.liveDemoUrl.trim());
      payload.append('featured', String(formData.featured));
      payload.append('order', String(formData.order));

      if (imageFile) {
        payload.append('image', imageFile);
      } else if (formData.imageUrl) {
        payload.append('imageUrl', formData.imageUrl.trim());
      }

      if (isEditing) {
        await projectService.updateProject(id, payload);
      } else {
        await projectService.createProject(payload);
      }

      navigate('/admin/projects');
    } catch (err) {
      setErrorMsg(err.message || 'Error saving project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#71717a', padding: '40px' }}>Loading project details...</div>;
  }

  return (
    <div className="project-form-container">
      <header className="project-form-header">
        <h2 className="project-form-title">
          {isEditing ? 'Edit Software Project' : 'Create New Software Project'}
        </h2>
        <p style={{ margin: 0, color: '#71717a', fontSize: '13px' }}>
          Upload screenshots, provide repository links, and configure showcase display
        </p>
      </header>

      {errorMsg && (
        <div style={{ padding: '12px 16px', background: '#3b1c1e', color: '#fca5a5', borderRadius: '8px', marginBottom: '20px' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="project-form-body">
        <div className="project-form-group">
          <label className="project-form-label" htmlFor="title">
            Project Name *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="project-form-input"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. ShutterCloud Asset Manager"
            required
          />
        </div>

        <div className="project-form-group">
          <label className="project-form-label" htmlFor="description">
            Description / Summary *
          </label>
          <textarea
            id="description"
            name="description"
            className="project-form-textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what the application does, architecture details, and key technical achievements..."
            required
          />
        </div>

        <div className="project-form-group">
          <label className="project-form-label" htmlFor="tags">
            Technologies / Tags (comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            className="project-form-input"
            value={formData.tags}
            onChange={handleChange}
            placeholder="React, TypeScript, Node.js, Cloudinary"
          />
        </div>

        <div className="project-form-row">
          <div className="project-form-group">
            <label className="project-form-label" htmlFor="githubUrl">
              GitHub Repository URL
            </label>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              className="project-form-input"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="project-form-group">
            <label className="project-form-label" htmlFor="liveDemoUrl">
              Live Demo / Website URL
            </label>
            <input
              id="liveDemoUrl"
              name="liveDemoUrl"
              type="url"
              className="project-form-input"
              value={formData.liveDemoUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Project Image Selection */}
        <div className="project-form-group">
          <label className="project-form-label">
            Project Image (Upload File to Cloudinary)
          </label>
          <div className="project-image-dropzone">
            <input
              type="file"
              accept="image/*"
              id="image-file-input"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="image-file-input" style={{ cursor: 'pointer', display: 'block' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" style={{ margin: '0 auto 8px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span style={{ color: '#e4e4e7', fontSize: '14px', fontWeight: 500 }}>
                {imageFile ? imageFile.name : 'Click to select project cover image'}
              </span>
              <p style={{ margin: '4px 0 0', color: '#71717a', fontSize: '12px' }}>
                PNG, JPG, or WebP up to 25MB
              </p>
            </label>
          </div>

          {previewUrl && (
            <div className="project-image-preview-box">
              <img src={previewUrl} alt="Preview" className="project-image-preview" />
            </div>
          )}
        </div>

        <div className="project-form-row">
          <label className="project-form-checkbox-row">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
            />
            <span style={{ fontSize: '14px', color: '#e4e4e7' }}>
              Feature this project on Homepage preview
            </span>
          </label>

          <div className="project-form-group">
            <label className="project-form-label" htmlFor="order">
              Display Order Priority
            </label>
            <input
              id="order"
              name="order"
              type="number"
              className="project-form-input"
              value={formData.order}
              onChange={handleChange}
              style={{ maxWidth: '120px' }}
            />
          </div>
        </div>

        <div className="project-form-actions">
          <button
            type="submit"
            className="admin-action-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading & Saving...' : isEditing ? 'Update Project' : 'Create Project'}
          </button>
          <Link to="/admin/projects" className="btn-action-edit" style={{ padding: '10px 18px', fontSize: '14px' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;
