import fs from 'fs';
import { v2 as cloudinary } from "cloudinary";
const uploadCloudinary =  async(file)=>{
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET   
    });

    const result = await cloudinary.uploader.upload(file, {
        resource_type:"auto"
    });

  
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    } else {
        console.log("File not found, skipping unlink:", file);
    }

    return result.secure_url;
}
export default uploadCloudinary;
