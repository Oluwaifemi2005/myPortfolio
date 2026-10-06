import mongoose from 'mongoose';
import Photo from '../models/Photo.js';
import {
  uploadBufferToCloudinary,
  uploadBatchToCloudinary,
  deleteFromCloudinary
} from '../utils/cloudinaryService.js';

function checkDbConnected(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      error: 'DatabaseUnavailable',
      message: 'Database connection is currently unavailable'
    });
    return false;
  }
  return true;
}

/**
 * @desc   Get all photography items with optional category/featured filtering
 * @route  GET /api/photos
 * @access Public
 */
export async function getPhotos(req, res, next) {
  try {
    if (!checkDbConnected(res)) return;

    const { category, featured, limit } = req.query;
    const filter = {};

    if (category) {
      filter.category = new RegExp(`^${category}$`, 'i'); // Case-insensitive matching
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    let query = Photo.find(filter).sort({ order: 1, createdAt: -1 });

    if (limit && !isNaN(Number(limit))) {
      query = query.limit(Number(limit));
    }

    const photos = await query.exec();

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Get featured photography items for homepage preview
 * @route  GET /api/photos/featured
 * @access Public
 */
export async function getFeaturedPhotos(req, res, next) {
  try {
    if (!checkDbConnected(res)) return;

    const limit = req.query.limit ? Number(req.query.limit) : 3;
    const photos = await Photo.find({ featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .exec();

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Get distinct list of photo categories
 * @route  GET /api/photos/categories
 * @access Public
 */
export async function getCategories(req, res, next) {
  try {
    if (!checkDbConnected(res)) return;

    const categories = await Photo.distinct('category');

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Get single photography item by ID
 * @route  GET /api/photos/:id
 * @access Public
 */
export async function getPhotoById(req, res, next) {
  try {
    if (!checkDbConnected(res)) return;

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid photo ID format'
      });
    }

    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: 'Photo not found'
      });
    }

    res.status(200).json({
      success: true,
      data: photo
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Create single photography item (with image upload or imageUrl)
 * @route  POST /api/photos
 * @access Private (Admin only)
 */
export async function createPhoto(req, res, next) {
  try {
    const { title, category, description, imageUrl, featured, order } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Photo title is required'
      });
    }

    let finalImageUrl = imageUrl;
    let finalImagePublicId = null;

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'portfolio/photography'
      });
      finalImageUrl = uploadResult.imageUrl;
      finalImagePublicId = uploadResult.imagePublicId;
    }

    if (!finalImageUrl) {
      return res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'A photo image is required (either upload an image file or provide an imageUrl)'
      });
    }

    const photo = new Photo({
      title: title.trim(),
      category: category ? category.trim() : 'General',
      description: description ? description.trim() : '',
      imageUrl: finalImageUrl,
      imagePublicId: finalImagePublicId,
      featured: featured === true || featured === 'true',
      order: order ? Number(order) : 0
    });

    const savedPhoto = await photo.save();

    res.status(201).json({
      success: true,
      message: 'Photo uploaded and created successfully',
      data: savedPhoto
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Batch upload multiple photography items
 * @route  POST /api/photos/batch
 * @access Private (Admin only)
 */
export async function createBatchPhotos(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Please provide at least one image file in the "images" field'
      });
    }

    const { category, featured } = req.body;
    const defaultCategory = category ? category.trim() : 'General';
    const isFeatured = featured === true || featured === 'true';

    // Upload all files concurrently to Cloudinary
    const uploadResults = await uploadBatchToCloudinary(req.files, 'portfolio/photography');

    // Create MongoDB document descriptors
    const photoDocs = uploadResults.map((result, idx) => {
      // Derive a clean title from the original filename (e.g. "sunset-golden-hour.jpg" -> "Sunset Golden Hour")
      const baseName = result.originalname
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        title: baseName || `Photo ${Date.now()}-${idx + 1}`,
        category: defaultCategory,
        description: '',
        imageUrl: result.imageUrl,
        imagePublicId: result.imagePublicId,
        featured: isFeatured,
        order: idx
      };
    });

    const savedPhotos = await Photo.insertMany(photoDocs);

    res.status(201).json({
      success: true,
      message: `Successfully uploaded and registered ${savedPhotos.length} photos`,
      count: savedPhotos.length,
      data: savedPhotos
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Update photography details
 * @route  PUT /api/photos/:id
 * @access Private (Admin only)
 */
export async function updatePhoto(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid photo ID format'
      });
    }

    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: 'Photo not found'
      });
    }

    const { title, category, description, imageUrl, featured, order } = req.body;

    // Handle image replacement if a new file is uploaded
    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'portfolio/photography'
      });

      // Cleanup previous Cloudinary asset
      if (photo.imagePublicId) {
        deleteFromCloudinary(photo.imagePublicId).catch((err) => {
          console.warn('[Cloudinary Cleanup Warning]', err.message);
        });
      }

      photo.imageUrl = uploadResult.imageUrl;
      photo.imagePublicId = uploadResult.imagePublicId;
    } else if (imageUrl !== undefined && imageUrl.trim()) {
      photo.imageUrl = imageUrl.trim();
    }

    if (title !== undefined) photo.title = title.trim();
    if (category !== undefined) photo.category = category.trim();
    if (description !== undefined) photo.description = description.trim();
    if (featured !== undefined) photo.featured = featured === true || featured === 'true';
    if (order !== undefined) photo.order = Number(order);

    const updatedPhoto = await photo.save();

    res.status(200).json({
      success: true,
      message: 'Photo updated successfully',
      data: updatedPhoto
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Delete photography item & remove image from Cloudinary
 * @route  DELETE /api/photos/:id
 * @access Private (Admin only)
 */
export async function deletePhoto(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid photo ID format'
      });
    }

    const photo = await Photo.findByIdAndDelete(id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: 'Photo not found'
      });
    }

    // Clean up remote asset on Cloudinary
    if (photo.imagePublicId) {
      deleteFromCloudinary(photo.imagePublicId).catch((err) => {
        console.warn('[Cloudinary Cleanup Warning]', err.message);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Toggle photography featured status
 * @route  PATCH /api/photos/:id/featured
 * @access Private (Admin only)
 */
export async function togglePhotoFeatured(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid photo ID format'
      });
    }

    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: 'Photo not found'
      });
    }

    photo.featured = !photo.featured;
    await photo.save();

    res.status(200).json({
      success: true,
      message: `Photo ${photo.featured ? 'featured' : 'unfeatured'} successfully`,
      data: photo
    });
  } catch (error) {
    next(error);
  }
}
