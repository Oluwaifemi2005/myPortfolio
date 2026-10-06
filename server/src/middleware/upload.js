import multer from 'multer';

// Use in-memory buffer storage for direct stream uploading to Cloudinary
const storage = multer.memoryStorage();

// Supported image MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];

export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 25MB per individual image

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      `Unsupported file type: ${file.mimetype}. Allowed types are JPEG, PNG, WebP, and GIF.`
    );
    error.status = 400;
    cb(error, false);
  }
};

// 25MB maximum per-image file size limit
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES, // Applied per individual file
    files: 20 // Up to 20 files per batch
  }
});

// Middleware for single image (e.g., project cover image or single photo)
export const uploadSingleImage = upload.single('image');

// Middleware for batch photography upload (up to 20 images at once, 25MB each)
export const uploadMultipleImages = upload.array('images', 20);

export default upload;
