const express = require('express')
const router = express.Router()
const awsImageService = require('../services/image/index')
const {
    printError,
    printInfo,
    validateUser,
} = require('../helpers/general_helpers')
const { updateUser } = require('../services/user')

const NAMESPACE = 'images'

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });



// File upload validation middleware
const validateFileUpload = (req, res, next) => {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    const file = req.files.file;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
  
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Only JPG, PNG, and GIF files are allowed' });
    }
  
    if (file.size > maxSize) {
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }
  
    next();
  };
  


router.post('/:userId/profile-photo',  validateFileUpload, async (req,res)=>{

    const { userId } = req.params;

    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/profile-photo" method="POST".`
        )
        return
    }

    try {

        const file = req.files.file;

        const fileExt = file.name.split('.').pop();
        const key = `profile-photo/${userId}/${uuidv4()}.${fileExt}`;


        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: file.data,
            ContentType: file.mimetype,
            // ACL: 'public-read', // or 'private' if you prefer
        };

        const s3Response = await s3.upload(params).promise();

        res.status(200).json({ 
            success: true, 
            fileUrl: s3Response.Location,
            // key: s3Response.Key
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
        error: 'Upload failed',
        details: error.message 
        });
    }
      



})

module.exports = router