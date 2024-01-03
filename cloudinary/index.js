const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({                                                 //  <----     specify the credentials
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({                            // <-----      make a new instance of cloudianry storage    and pass through the multer
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg','png','jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}