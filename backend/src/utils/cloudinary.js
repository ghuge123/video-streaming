import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath , {resource_type : "auto"});
        console.log("file is uploaded on cloudinary " , response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
}

const extractPublicId = (url) => {
    // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image_name.jpg
    const parts = url.split('/');
    const filename = parts[parts.length - 1].split('.')[0]; // "image_name"
    const folder = parts[parts.length - 2]; // "folder"
    return `${folder}/${filename}`; // "folder/image_name"
  };

export {uploadOnCloudinary , deleteFromCloudinary , extractPublicId};