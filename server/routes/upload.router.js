const express = require('express');
const { S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const router = express.Router();

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    },
    region: process.env.BUCKET_REGION
});

// Get presigned URL for upload
router.get('/presigned-url', async (req, res) => {
    try {
        const randomName = crypto.randomBytes(32).toString('hex');
        const fileName = `${randomName}-${req.query.filename || 'upload'}`;
        
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            ContentType: req.query.contentType || 'image/jpeg'
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
        
        res.json({
            uploadURL: signedUrl,
            key: fileName
        });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({ error: 'Failed to generate upload URL' });
    }
});

module.exports = router;