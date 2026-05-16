import { v2 as cloudinary } from 'cloudinary';

// ─── Configure Cloudinary ─────────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a local file to Cloudinary.
 * @param {string} localFilePath  - Absolute path to the file on disk
 * @param {string} folder         - Cloudinary sub-folder (e.g. 'foodify/menu')
 * @returns {{ url: string, publicId: string }}
 */
export const uploadToCloudinary = async (localFilePath, folder = 'foodify') => {
    const result = await cloudinary.uploader.upload(localFilePath, {
        folder: `foodify/${folder}`,
        resource_type: 'image',
        // Auto-quality and format for best performance
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });

    return {
        url: result.secure_url,
        publicId: result.public_id,
    };
};

/**
 * Delete an image from Cloudinary by its public_id.
 * Used when replacing an existing image.
 * @param {string} publicId
 */
export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
