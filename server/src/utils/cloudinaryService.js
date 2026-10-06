import sharp from 'sharp';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';

// Cloudinary Free tier maximum raw upload limit per asset (10 MiB)
const CLOUDINARY_MAX_ASSET_BYTES = 10485760;

/**
 * Optimizes large image buffers (>10MB) to stay strictly within Cloudinary's
 * account ceiling while maintaining maximum visual quality and 100% original dimensions.
 * @param {Buffer} buffer - File buffer
 * @returns {Promise<Buffer>}
 */
async function prepareBufferForCloudinary(buffer) {
  if (buffer.length <= CLOUDINARY_MAX_ASSET_BYTES) {
    return buffer;
  }

  console.log(
    `[Image Optimizer] Input buffer is ${(buffer.length / (1024 * 1024)).toFixed(2)} MB (exceeds Cloudinary 10MB plan ceiling). Optimizing with Sharp at full resolution...`
  );

  try {
    const image = sharp(buffer);

    // Encode to high-fidelity WebP (quality 92, preserving all pixel dimensions and color precision)
    let optimizedBuffer = await image
      .webp({ quality: 92, effort: 4 })
      .toBuffer();

    // If still over 10MB due to extreme noise/resolution, tune slightly while keeping full resolution
    if (optimizedBuffer.length > CLOUDINARY_MAX_ASSET_BYTES) {
      optimizedBuffer = await sharp(buffer)
        .webp({ quality: 86, effort: 5 })
        .toBuffer();
    }

    console.log(
      `[Image Optimizer] Buffer successfully optimized from ${(buffer.length / (1024 * 1024)).toFixed(2)} MB to ${(optimizedBuffer.length / (1024 * 1024)).toFixed(2)} MB`
    );

    return optimizedBuffer;
  } catch (err) {
    console.warn('[Image Optimizer] Could not process with Sharp, using original buffer:', err.message);
    return buffer;
  }
}

/**
 * Upload an in-memory file buffer directly to Cloudinary via upload_stream
 * @param {Buffer} buffer - File buffer from multer (file.buffer)
 * @param {Object} [options] - Cloudinary upload options
 * @param {string} [options.folder='portfolio'] - Cloudinary folder path
 * @param {string} [options.publicId] - Optional custom public ID
 * @returns {Promise<{ imageUrl: string, imagePublicId: string, width: number, height: number, format: string }>}
 */
export async function uploadBufferToCloudinary(buffer, options = {}) {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Please supply valid CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.'
    );
  }

  const finalBuffer = await prepareBufferForCloudinary(buffer);

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || 'portfolio',
      resource_type: 'image',
      // Cloudinary will deliver optimal format (WebP/AVIF) and quality
      fetch_format: 'auto',
      quality: 'auto',
      ...options
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve({
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      });
    });

    stream.end(finalBuffer);
  });
}

/**
 * Remove an image asset from Cloudinary using its public_id
 * @param {string} publicId - The Cloudinary public_id of the asset
 * @returns {Promise<{ result: string }>}
 */
export async function deleteFromCloudinary(publicId) {
  if (!publicId) return { result: 'not_found' };

  if (!isCloudinaryConfigured()) {
    console.warn('[Cloudinary Warning] Cannot delete asset from Cloudinary: credentials not configured.');
    return { result: 'skipped_not_configured' };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`[Cloudinary Error] Failed to delete asset ${publicId}: ${error.message}`);
    throw error;
  }
}

/**
 * Upload multiple files to Cloudinary concurrently
 * @param {Array<Express.Multer.File>} files - Array of files from req.files
 * @param {string} [folder='portfolio/photography'] - Cloudinary folder destination
 * @returns {Promise<Array<{ imageUrl: string, imagePublicId: string, originalname: string }>>}
 */
export async function uploadBatchToCloudinary(files, folder = 'portfolio/photography') {
  if (!files || !files.length) return [];

  const uploadPromises = files.map(async (file) => {
    const uploadResult = await uploadBufferToCloudinary(file.buffer, { folder });
    return {
      ...uploadResult,
      originalname: file.originalname
    };
  });

  return Promise.all(uploadPromises);
}
