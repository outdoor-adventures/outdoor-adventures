const multer = require('multer');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const dotenv = require('dotenv');
const crypto = require('crypto');


// Load environment variables from .env file
dotenv.config();

// .env setup for amazon s3 bucket. Pulls the bucket name, region, access key, and secret access key from the .env file.
// Reach out to Johnny to get the bucket information if you do not have it.

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

// S3 client configuration
const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});

// Multer setup for in-memory storage
// This allows us to upload files to S3 directly from memory without saving them to disk first
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to upload files to S3
const uploadToS3 = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    // Generate a unique filename using crypto to avoid collisions
    // This is important to ensure that files with the same name do not overwrite each other in the S3 bucket
    // With S3s default setup, images that are named the same will overwrite eachother. No matter if the image is the same or not.
    // This is why we use crypto to generate a random name for the image.
    try {
        const randomName = crypto.randomBytes(32).toString('hex');
        const fileName = `${randomName}-${req.file.originalname}`;

        // Set up parameters for the S3 upload
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };
        
        const command = new PutObjectCommand(params);
        await s3.send(command);

        req.file.s3Url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
        next();
    } catch (error) {
        console.error('S3 upload failed:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
};

// Function to get a signed URL for accessing the uploaded image
// This is useful for displaying the image in the frontend without making it public
// Each time a URL is requested, it will be valid for a limited time (1 hour in this case)

const getSignedImageUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    
    return await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
};


// Export the middleware and S3 client for use in other parts of the application

module.exports = {
    upload,
    uploadToS3,
    getSignedImageUrl
};