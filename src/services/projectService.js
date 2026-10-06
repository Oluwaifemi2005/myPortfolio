import { apiRequest } from './api';

export const projectService = {
  /**
   * Get all projects
   * @param {Object} [params]
   * @param {boolean} [params.featured]
   * @param {number} [params.limit]
   */
  async getProjects(params = {}) {
    const query = new URLSearchParams();
    if (params.featured !== undefined) query.set('featured', String(params.featured));
    if (params.limit) query.set('limit', String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await apiRequest(`/projects${qs}`);
    return res.data;
  },

  /**
   * Get featured projects for homepage
   */
  async getFeaturedProjects(limit = 3) {
    const res = await apiRequest(`/projects/featured?limit=${limit}`);
    return res.data;
  },

  /**
   * Get project by ID
   */
  async getProjectById(id) {
    const res = await apiRequest(`/projects/${id}`);
    return res.data;
  },

  /**
   * Create new project (Admin)
   */
  async createProject(formDataOrJson) {
    const body = formDataOrJson instanceof FormData ? formDataOrJson : JSON.stringify(formDataOrJson);
    const res = await apiRequest('/projects', {
      method: 'POST',
      body
    });
    return res.data;
  },

  /**
   * Update existing project (Admin)
   */
  async updateProject(id, formDataOrJson) {
    const body = formDataOrJson instanceof FormData ? formDataOrJson : JSON.stringify(formDataOrJson);
    const res = await apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body
    });
    return res.data;
  },

  /**
   * Delete project (Admin)
   */
  async deleteProject(id) {
    return apiRequest(`/projects/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Toggle project featured status (Admin)
   */
  async toggleFeatured(id) {
    const res = await apiRequest(`/projects/${id}/featured`, {
      method: 'PATCH'
    });
    return res.data;
  }
};
