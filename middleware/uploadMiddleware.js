const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/venues';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Processing file:', file);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        console.log('Creating filename for:', file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    console.log('Filtering file:', file);
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Create the multer instance with debugging
const uploadMiddleware = (req, res, next) => {
    console.log('Request Method:', req.method);
    console.log('Raw request headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Raw body:', req.body);

    // Parse multipart form data
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 5 * 1024 * 1024,
            files: 1
        },
        fileFilter: fileFilter
    }).single('image');

    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            console.error('Other error:', err);
            return res.status(400).json({ message: err.message });
        }

        console.log('Form fields:', req.body);
        console.log('Uploaded file:', req.file);
        
        // Check if we received any data
        if (!req.file && Object.keys(req.body).length === 0) {
            console.warn('No file or form data received');
        }

        next();
    });
};

module.exports = uploadMiddleware;