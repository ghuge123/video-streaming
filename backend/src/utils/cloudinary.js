import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import { CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from 'multer';


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

console.log(process.env.CLOUD_NAME);
export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'youtube',
      allowedFormates: ['png' , 'jpg' , 'jpeg']
    },
  });

export const upload = multer({storage});

  