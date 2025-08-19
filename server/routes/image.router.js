const express = require('express');
const { getSignedImageUrl } = require('../modules/multer-S3-middleware');
const router = express.Router();

// Serve S3 images through signed URLs
router.get('/:key', async (req, res) => {
    try {
        const signedUrl = await getSignedImageUrl(req.params.key);
        res.redirect(signedUrl);
    } catch (error) {
        console.error('Error serving image:', error);
        res.status(404).send('Image not found');
    }
});

module.exports = router;