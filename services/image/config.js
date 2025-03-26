const AWS = require('aws-sdk')
const path = require('path')

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
}) // Create a S3 object bucket

/**
 * Getter function for s3 object.
 *
 * @return {Object} Immutable s3 object
 */
function _getS3() {
    Object.freeze(s3)
    return s3
}

/**
 * Check if file is a valid image file.
 *
 * @param {File} file
 * @param {Function} cb
 * @return {Function}
 */
function _imageFileFilter(file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    )
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb(
            new Error(
                'Invalid file type, only JPEG, JPG, PDF and PNG is allowed.'
            ),
            false
        )
    }
}

/**
 * Create new key name to save file in S3 bucket.
 *
 * @param {String} pid Practitioner id
 * @param {File} file Image file
 * @param {String} type One of 'avatar','clinic-logo'
 * @param {Bool} addExt append file ext to key name if true
 * @return {String} New key name
 */
function _keyName(pid, file, type, addExt) {
    if (addExt) {
        const extname = path.extname(file.originalname).toLowerCase()
        return `${pid}/${type}${extname}`
    }
    return `${pid}/${type}`
}

module.exports = {
    keyName: _keyName,
    getS3: _getS3,
    imageFileFilter: _imageFileFilter,
}
