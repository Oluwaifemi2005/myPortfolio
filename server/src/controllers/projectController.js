import mongoose from 'mongoose';
import Project from '../models/Project.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryService.js';

/**
 * Helper to safely parse tags whether sent as JSON array or comma-separated string
 * @param {any} tags
 * @returns {string[]}
 */
function parseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(t => String(t).trim()).filter(Boolean);
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed.map(t => String(t).trim()).filter(Boolean);
    } catch {
      // Comma-separated string fallback
    }
    return tags.split(',').map(t => t.trim()).filter(Boolean);
  }
  return [];
}

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
 * @desc   Get all software projects with optional filtering
 * @route  GET /api/projects
 * @access Public
 */
export async function getProjects(req, res, next) {
  try {
    if (!checkDbConnected(res)) return;

    const { featured, limit } = req.query;
    const filter = {};

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    let query = Project.find(filter).sort({ order: 1, createdAt: -1 });

    if (limit && !isNaN(Number(limit))) {
      query = query.limit(Number(limit));
    }

    const projects = await query.exec();

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Get featured software projects for homepage
 * @route  GET /api/projects/featured
 * @access Public
 */
export async function getFeaturedProjects(req, res, next) {
  try {
    if (!checkDbConnected(res)) return;

    const limit = req.query.limit ? Number(req.query.limit) : 3;
    const projects = await Project.find({ featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .exec();

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Get single software project by ID
 * @route  GET /api/projects/:id
 * @access Public
 */
export async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid project ID format'
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Create a new software project (with image upload or imageUrl)
 * @route  POST /api/projects
 * @access Private (Admin only)
 */
export async function createProject(req, res, next) {
  try {
    const { title, description, tags, githubUrl, liveDemoUrl, imageUrl, featured, order } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Please provide both title and description'
      });
    }

    let finalImageUrl = imageUrl;
    let finalImagePublicId = null;

    // Handle uploaded image file via Multer
    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'portfolio/projects'
      });
      finalImageUrl = uploadResult.imageUrl;
      finalImagePublicId = uploadResult.imagePublicId;
    }

    if (!finalImageUrl) {
      return res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'A project image is required (either upload an image file or provide an imageUrl)'
      });
    }

    const project = new Project({
      title,
      description,
      tags: parseTags(tags),
      githubUrl: githubUrl || null,
      liveDemoUrl: liveDemoUrl || null,
      imageUrl: finalImageUrl,
      imagePublicId: finalImagePublicId,
      featured: featured === true || featured === 'true',
      order: order ? Number(order) : 0
    });

    const savedProject = await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: savedProject
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Update an existing software project
 * @route  PUT /api/projects/:id
 * @access Private (Admin only)
 */
export async function updateProject(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid project ID format'
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const { title, description, tags, githubUrl, liveDemoUrl, imageUrl, featured, order } = req.body;

    // Handle new image upload
    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'portfolio/projects'
      });

      // Cleanup old image on Cloudinary if previously uploaded
      if (project.imagePublicId) {
        deleteFromCloudinary(project.imagePublicId).catch(err => {
          console.warn('[Cloudinary Cleanup Warning]', err.message);
        });
      }

      project.imageUrl = uploadResult.imageUrl;
      project.imagePublicId = uploadResult.imagePublicId;
    } else if (imageUrl !== undefined && imageUrl.trim()) {
      project.imageUrl = imageUrl.trim();
    }

    if (title !== undefined) project.title = title.trim();
    if (description !== undefined) project.description = description.trim();
    if (tags !== undefined) project.tags = parseTags(tags);
    if (githubUrl !== undefined) project.githubUrl = githubUrl ? githubUrl.trim() : null;
    if (liveDemoUrl !== undefined) project.liveDemoUrl = liveDemoUrl ? liveDemoUrl.trim() : null;
    if (featured !== undefined) project.featured = featured === true || featured === 'true';
    if (order !== undefined) project.order = Number(order);

    const updatedProject = await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Delete a software project & remove image from Cloudinary
 * @route  DELETE /api/projects/:id
 * @access Private (Admin only)
 */
export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid project ID format'
      });
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Clean up Cloudinary asset if present
    if (project.imagePublicId) {
      deleteFromCloudinary(project.imagePublicId).catch(err => {
        console.warn('[Cloudinary Cleanup Warning]', err.message);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc   Toggle project featured status
 * @route  PATCH /api/projects/:id/featured
 * @access Private (Admin only)
 */
export async function toggleProjectFeatured(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid project ID format'
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    project.featured = !project.featured;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project ${project.featured ? 'featured' : 'unfeatured'} successfully`,
      data: project
    });
  } catch (error) {
    next(error);
  }
}
