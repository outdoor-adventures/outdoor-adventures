const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;



const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});

// Create multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to upload file to S3
const uploadToS3 = async (req, res, next) => {
    console.log('S3 middleware called, file exists:', !!req.file);
    
    if (!req.file) {
        console.log('No file found, skipping S3 upload');
        return next();
    }

    try {
        console.log('Starting S3 upload for file:', req.file.originalname);
        
        // Generate unique filename
        const randomName = crypto.randomBytes(32).toString('hex');
        const fileName = `${randomName}-${req.file.originalname}`;

        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };
        
        console.log('S3 upload params:', { Bucket: bucketName, Key: fileName });
        
        const command = new PutObjectCommand(params);
        const result = await s3.send(command);
        
        console.log('S3 upload result:', result);

        // Add S3 URL to req.file for database storage
        req.file.s3Key = fileName;
        req.file.s3Url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
        
        console.log('S3 URL created:', req.file.s3Url);
        console.log('Test this URL in browser:', req.file.s3Url);
        
        next();
    } catch (error) {
        console.error('S3 upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
};

module.exports = {
    upload,
    uploadToS3
};