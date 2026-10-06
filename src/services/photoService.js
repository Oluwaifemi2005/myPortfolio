import { apiRequest } from './api';

export const photoService = {
  /**
   * Get all photos with optional filters
   * @param {Object} [params]
   * @param {string} [params.category]
   * @param {boolean} [params.featured]
   * @param {number} [params.limit]
   */
  async getPhotos(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.featured !== undefined) query.set('featured', String(params.featured));
    if (params.limit) query.set('limit', String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await apiRequest(`/photos${qs}`);
    return res.data;
  },

  /**
   * Get featured photos for homepage
   */
  async getFeaturedPhotos(limit = 3) {
    const res = await apiRequest(`/photos/featured?limit=${limit}`);
    return res.data;
  },

  /**
   * Get distinct list of photo categories
   */
  async getCategories() {
    const res = await apiRequest('/photos/categories');
    return res.data;
  },

  /**
   * Get photo by ID
   */
  async getPhotoById(id) {
    const res = await apiRequest(`/photos/${id}`);
    return res.data;
  },

  /**
   * Upload single photo (Admin)
   */
  async createPhoto(formDataOrJson) {
    const body = formDataOrJson instanceof FormData ? formDataOrJson : JSON.stringify(formDataOrJson);
    const res = await apiRequest('/photos', {
      method: 'POST',
      body
    });
    return res.data;
  },

  /**
   * Batch upload multiple photos (Admin)
   */
  async createBatchPhotos(formData) {
    const res = await apiRequest('/photos/batch', {
      method: 'POST',
      body: formData
    });
    return res.data;
  },

  /**
   * Update photo metadata (Admin)
   */
  async updatePhoto(id, formDataOrJson) {
    const body = formDataOrJson instanceof FormData ? formDataOrJson : JSON.stringify(formDataOrJson);
    const res = await apiRequest(`/photos/${id}`, {
      method: 'PUT',
      body
    });
    return res.data;
  },

  /**
   * Delete photo (Admin)
   */
  async deletePhoto(id) {
    return apiRequest(`/photos/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Toggle photo featured status (Admin)
   */
  async toggleFeatured(id) {
    const res = await apiRequest(`/photos/${id}/featured`, {
      method: 'PATCH'
    });
    return res.data;
  }
};
