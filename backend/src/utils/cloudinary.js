import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "youtube";
    let resource_type = "image";

    if (file.mimetype.startsWith("video/")) {
      resource_type = "video";
    }

    return {
      folder,
      resource_type,
      public_id: `${Date.now()}-${file.originalname}`,
      allowedFormats: ["jpg", "jpeg", "png", "mp4", "mov"], // You can adjust this
    };
  },
});

export const upload = multer({ storage });
