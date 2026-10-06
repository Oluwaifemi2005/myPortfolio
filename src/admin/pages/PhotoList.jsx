import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { photoService } from '../../services/photoService';
import PhotoEditModal from './PhotoEditModal';
import './PhotoList.css';

export function PhotoList() {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const [photoData, catData] = await Promise.all([
        photoService.getPhotos(),
        photoService.getCategories().catch(() => [])
      ]);
      setPhotos(photoData || []);
      setCategories(catData || []);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load photography items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will also remove the image from Cloudinary.`)) {
      return;
    }

    try {
      setActionInProgress(id);
      await photoService.deletePhoto(id);
      setPhotos((prev) => prev.filter((p) => (p.id || p._id) !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      setActionInProgress(id);
      const updated = await photoService.toggleFeatured(id);
      setPhotos((prev) =>
        prev.map((p) => ((p.id || p._id) === id ? { ...p, featured: updated.featured } : p))
      );
    } catch (err) {
      alert(`Toggle failed: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handlePhotoUpdated = (updated) => {
    const updatedId = updated.id || updated._id;
    setPhotos((prev) =>
      prev.map((p) => ((p.id || p._id) === updatedId ? updated : p))
    );
  };

  const filteredPhotos =
    selectedCategory === 'ALL'
      ? photos
      : photos.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="photo-list-page">
      <header className="photo-list-header">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
            Photography Archive
          </h2>
          <p style={{ margin: '4px 0 0', color: '#71717a', fontSize: '13px' }}>
            Manage editorial portraiture, lighting studies, and street photography
          </p>
        </div>

        <div className="photo-list-controls">
          {categories.length > 0 && (
            <select
              className="photo-cat-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">All Categories ({photos.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}

          <Link
            to="/admin/photography/upload"
            className="admin-action-btn-primary"
            style={{ backgroundColor: '#059669' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>Batch Upload Photos</span>
          </Link>
        </div>
      </header>

      {errorMsg && (
        <div style={{ padding: '12px 16px', background: '#3b1c1e', color: '#fca5a5', borderRadius: '8px', marginBottom: '20px' }}>
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#71717a' }}>
          Loading photo archive...
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#71717a', background: '#14151b', borderRadius: '10px', border: '1px solid #232530' }}>
          <p style={{ fontSize: '16px', marginBottom: '16px' }}>No photography items found in this view.</p>
          <Link to="/admin/photography/upload" className="admin-action-btn-primary" style={{ backgroundColor: '#059669' }}>
            Upload Photos Now
          </Link>
        </div>
      ) : (
        <div className="photo-admin-grid">
          {filteredPhotos.map((photo) => {
            const id = photo.id || photo._id;
            const img = photo.imageUrl || photo.image;
            return (
              <article key={id} className="photo-admin-card">
                <div className="photo-admin-img-box">
                  <img src={img} alt={photo.title} className="photo-admin-img" loading="lazy" />
                  <span className="photo-admin-cat-pill">{photo.category}</span>
                </div>

                <div className="photo-admin-body">
                  <h3 className="photo-admin-title">{photo.title}</h3>
                  <p className="photo-admin-desc">{photo.description || 'No description provided.'}</p>

                  <div className="photo-admin-card-actions">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(id)}
                      disabled={actionInProgress === id}
                      className={photo.featured ? 'project-badge-featured' : 'project-badge-standard'}
                      title="Click to toggle featured state on homepage latest shots"
                    >
                      {photo.featured ? '★ Featured' : 'Standard'}
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setEditingPhoto(photo)}
                        className="btn-action-edit"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(id, photo.title)}
                        disabled={actionInProgress === id}
                        className="btn-action-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* In-place edit modal */}
      {editingPhoto && (
        <PhotoEditModal
          photo={editingPhoto}
          onClose={() => setEditingPhoto(null)}
          onUpdated={handlePhotoUpdated}
        />
      )}
    </div>
  );
}

export default PhotoList;
