import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export const uploadFromBuffer = (buffer: Buffer): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'video' }, (error, result) => {
            if (error) reject(error);
            else resolve(result!);
        });
        stream.end(buffer);
    });
};

export default cloudinary;
