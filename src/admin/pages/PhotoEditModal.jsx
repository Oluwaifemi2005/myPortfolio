import React, { useState } from 'react';
import { photoService } from '../../services/photoService';
import './PhotoEditModal.css';

export function PhotoEditModal({ photo, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    title: photo.title || '',
    category: photo.category || 'General',
    description: photo.description || '',
    featured: Boolean(photo.featured)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      const id = photo.id || photo._id;
      const updated = await photoService.updatePhoto(id, formData);
      onUpdated(updated);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update photo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Photo Information</h3>
          <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            ✕
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: '#3b1c1e', color: '#fca5a5', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 600 }}>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="project-form-input"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 600 }}>Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Portraits, Editorial, Street"
              required
              className="project-form-input"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 600 }}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="project-form-textarea"
              style={{ minHeight: '80px' }}
              placeholder="Background lighting, lens, concept details..."
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
            />
            <span style={{ fontSize: '14px', color: '#e4e4e7' }}>
              Feature in Latest Shots preview
            </span>
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn-action-edit">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="admin-action-btn-primary" style={{ border: 'none', cursor: 'pointer' }}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PhotoEditModal;
