const multer = require('multer');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToS3 = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const randomName = crypto.randomBytes(32).toString('hex');
        const fileName = `${randomName}-${req.file.originalname}`;

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

const getSignedImageUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });
    
    return await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
};

module.exports = {
    upload,
    uploadToS3,
    getSignedImageUrl
};