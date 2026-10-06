import express from 'express';
import {
  getProjects,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectFeatured
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import { uploadSingleImage } from '../middleware/upload.js';

const router = express.Router();

// Public routes (accessible to everyone)
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', getProjectById);

// Protected Admin routes (require JWT token)
router.post('/', protect, uploadSingleImage, createProject);
router.put('/:id', protect, uploadSingleImage, updateProject);
router.delete('/:id', protect, deleteProject);
router.patch('/:id/featured', protect, toggleProjectFeatured);

export default router;
