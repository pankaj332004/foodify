import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { uploadToCloudinary } from '../services/cloudinary.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Storage destination ────────────────────────────────────────────────────
// Files are saved to /server/uploads/<folder>/
// In production, swap this storage engine for Cloudinary / S3.

const createStorage = (folder) =>
    multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, '../../uploads', folder);
            fs.mkdirSync(uploadPath, { recursive: true });   // create if not exists
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
    });

// ─── File filter — images only ───────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and WebP images are allowed.'), false);
    }
};

// ─── Cloudinary Sync Middleware ──────────────────────────────────────────────
const syncToCloudinary = (folder) => async (req, res, next) => {
    try {
        if (req.file) {
            const { url, publicId } = await uploadToCloudinary(req.file.path, folder);
            req.file.cloudinaryUrl = url;
            req.file.cloudinaryPublicId = publicId;
        } else if (req.files) {
            if (Array.isArray(req.files)) {
                for (let i = 0; i < req.files.length; i++) {
                    const { url, publicId } = await uploadToCloudinary(req.files[i].path, folder);
                    req.files[i].cloudinaryUrl = url;
                    req.files[i].cloudinaryPublicId = publicId;
                }
            } else {
                for (const fieldName in req.files) {
                    const filesArray = req.files[fieldName];
                    for (let i = 0; i < filesArray.length; i++) {
                        const { url, publicId } = await uploadToCloudinary(filesArray[i].path, folder);
                        filesArray[i].cloudinaryUrl = url;
                        filesArray[i].cloudinaryPublicId = publicId;
                    }
                }
            }
        }
        next();
    } catch (err) {
        console.error('Cloudinary sync error:', err);
        next(); // Proceed even if Cloudinary fails, to use the local file
    }
};

// ─── Multer instances ────────────────────────────────────────────────────────

/** Upload a single profile picture */
const multerProfileImage = multer({
    storage: createStorage('profiles'),
    fileFilter: imageFilter,
    limits: { fileSize: 2 * 1024 * 1024 },   // 2 MB
}).single('profileImage');
export const uploadProfileImage = [multerProfileImage, syncToCloudinary('profiles')];

/** Upload up to 5 restaurant images (gallery + cover) */
const multerRestaurantImages = multer({
    storage: createStorage('restaurants'),
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 },   // 5 MB per file
}).fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 5 },
]);
export const uploadRestaurantImages = [multerRestaurantImages, syncToCloudinary('restaurants')];

/** Upload a single menu item image */
const multerMenuItemImage = multer({
    storage: createStorage('menu'),
    fileFilter: imageFilter,
    limits: { fileSize: 3 * 1024 * 1024 },   // 3 MB
}).single('image');
export const uploadMenuItemImage = [multerMenuItemImage, syncToCloudinary('menu')];

/** Upload review photos (up to 3) */
const multerReviewImages = multer({
    storage: createStorage('reviews'),
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).array('images', 3);
export const uploadReviewImages = [multerReviewImages, syncToCloudinary('reviews')];

// ─── Helper to build public URL from saved file path ─────────────────────────
export const getFileUrl = (req, filePath) => {
    return `${req.protocol}://${req.get('host')}/${filePath.replace(/\\/g, '/')}`;
};
