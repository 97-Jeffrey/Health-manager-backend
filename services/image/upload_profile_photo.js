const multerS3 = require('multer-s3')
const multer = require('multer')
const awsImageConfig = require('./config')
const s3 = awsImageConfig.getS3()

/**
 * Upload a single avatar of max size 5MB to S3 bucket.
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Function} cb - Callback function
 */

 const _uploadProfilePhoto = multer({
    storage: multerS3({
        acl: 'public-read',
        bucket: process.env.AWS_S3_BUCKET_NAME,
        cacheControl: 'max-age=0',
        contentLength: 5000000,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {

            const key = awsImageConfig.keyName(
                req.params.userId,
                file,
                'profile-photo',
                true
            );

            console.log('Generated key:', key)
            cb(
                null,
                key
            )
        },
        s3: s3,
    }),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (_, file, cb) => {
        console.log('Incoming file:', file);
        awsImageConfig.imageFileFilter(file, (err, accept) => {
            console.log('Filter result:', err, accept);
            cb(err, accept);
        })
    },
}).single('profile-photo')

exports.default = _uploadProfilePhoto