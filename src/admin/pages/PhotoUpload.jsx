import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { photoService } from '../../services/photoService';
import './PhotoUpload.css';

export function PhotoUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState('Portraits');
  const [customCategory, setCustomCategory] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newItems = files.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      previewUrl: URL.createObjectURL(file)
    }));

    setSelectedFiles((prev) => [...prev, ...newItems]);
    setErrorMsg('');
  };

  const handleRemoveItem = (id) => {
    setSelectedFiles((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      return filtered;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFiles.length) {
      setErrorMsg('Please select at least one photo to upload.');
      return;
    }

    const finalCategory = (category === 'CUSTOM' ? customCategory : category).trim();
    if (!finalCategory) {
      setErrorMsg('Please provide a category for this photo batch.');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg('');

      const formData = new FormData();
      selectedFiles.forEach((item) => {
        formData.append('images', item.file);
      });
      formData.append('category', finalCategory);
      formData.append('featured', String(featured));

      await photoService.createBatchPhotos(formData);
      navigate('/admin/photography');
    } catch (err) {
      setErrorMsg(err.message || 'Batch upload failed. Please verify credentials or connection.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="batch-upload-container">
      <header className="batch-upload-header">
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px', color: '#ffffff' }}>
          Batch Upload Photography
        </h2>
        <p style={{ margin: 0, color: '#71717a', fontSize: '13px' }}>
          Upload single or multiple photographs at once directly to Cloudinary and the database
        </p>
      </header>

      {errorMsg && (
        <div style={{ padding: '12px 16px', background: '#3b1c1e', color: '#fca5a5', borderRadius: '8px', marginBottom: '20px' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Dropzone Area */}
        <div className="batch-upload-dropzone">
          <input
            type="file"
            multiple
            accept="image/*"
            id="batch-file-input"
            style={{ display: 'none' }}
            onChange={handleFilesSelected}
          />
          <label htmlFor="batch-file-input" style={{ cursor: 'pointer', display: 'block' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" style={{ margin: '0 auto 12px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#ffffff' }}>
              Click or Drag Images Here to Select Multiple Photos
            </h4>
            <p style={{ margin: 0, color: '#71717a', fontSize: '12px' }}>
              Select up to 20 images at once (JPEG, PNG, WebP, max 25MB per image)
            </p>
          </label>
        </div>

        {/* Selected Photos Preview Grid */}
        {selectedFiles.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>
                Selected Files ({selectedFiles.length}):
              </span>
              <button
                type="button"
                onClick={() => setSelectedFiles([])}
                style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}
              >
                Clear All
              </button>
            </div>

            <div className="batch-preview-grid">
              {selectedFiles.map((item) => (
                <div key={item.id} className="batch-preview-card">
                  <img src={item.previewUrl} alt={item.file.name} className="batch-preview-thumb" />
                  <span className="batch-preview-meta" title={item.file.name}>
                    {item.file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="batch-preview-remove"
                    title="Remove this photo"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>
              Batch Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="project-form-input"
            >
              <option value="Portraits">Portraits</option>
              <option value="Editorial">Editorial</option>
              <option value="Street">Street</option>
              <option value="Studio">Studio</option>
              <option value="Architecture">Architecture</option>
              <option value="CUSTOM">+ New Custom Category</option>
            </select>
          </div>

          {category === 'CUSTOM' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>
                Enter Custom Category *
              </label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Fashion, Monochrome"
                className="project-form-input"
                required
              />
            </div>
          )}
        </div>

        {/* Featured Switch */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#059669' }}
          />
          <span style={{ fontSize: '14px', color: '#e4e4e7' }}>
            Mark this batch as featured in homepage "Latest shots"
          </span>
        </label>

        {/* Submit Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="submit"
            disabled={isUploading || selectedFiles.length === 0}
            className="admin-action-btn-primary"
            style={{ backgroundColor: '#059669', border: 'none', cursor: 'pointer' }}
          >
            {isUploading ? `Uploading ${selectedFiles.length} Photos to Cloudinary...` : `Upload ${selectedFiles.length} Photos`}
          </button>
          <Link to="/admin/photography" className="btn-action-edit" style={{ padding: '10px 18px', fontSize: '14px' }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default PhotoUpload;
