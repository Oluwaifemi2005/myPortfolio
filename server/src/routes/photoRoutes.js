import express from 'express';
import {
  getPhotos,
  getFeaturedPhotos,
  getCategories,
  getPhotoById,
  createPhoto,
  createBatchPhotos,
  updatePhoto,
  deletePhoto,
  togglePhotoFeatured
} from '../controllers/photoController.js';
import { protect } from '../middleware/auth.js';
import { uploadSingleImage, uploadMultipleImages } from '../middleware/upload.js';

const router = express.Router();

// Public routes (accessible to everyone)
router.get('/', getPhotos);
router.get('/featured', getFeaturedPhotos);
router.get('/categories', getCategories);
router.get('/:id', getPhotoById);

// Protected Admin routes (require JWT token)
router.post('/', protect, uploadSingleImage, createPhoto);
router.post('/batch', protect, uploadMultipleImages, createBatchPhotos);
router.put('/:id', protect, uploadSingleImage, updatePhoto);
router.delete('/:id', protect, deletePhoto);
router.patch('/:id/featured', protect, togglePhotoFeatured);

export default router;
