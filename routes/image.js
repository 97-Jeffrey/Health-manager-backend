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



router.post('/:userId/profile-photo', (req,res)=>{

    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/profile-photo" method="POST".`
        )
        return
    }

    awsImageService.uploadProfilePhoto(req, res, (err)=>{
        if (err) {
            printError('awsImageService', NAMESPACE, 'uploadProfilePhoto', err)
            // res.status(422).send(
            //     `Service error: path="/${NAMESPACE}/:userId/profile-photo" method="POST".`
            // )

            return res.status(422).json({
                error: 'File upload failed',
                details: err.message,
                type: 'UPLOAD_ERROR'
            });
        }else if (req.file === undefined){
            res.status(422).send(`User error: No File Selected.`)
        }
       

        else {
            const photoUrl = `${req.file.location}?versionId=${req.file.versionId}`
            printInfo('awsService', NAMESPACE, 'uploadProfilePhoto', photoUrl)

            const { userId } = req.params
            // Update profile photo url in Practitioner-Info DynamoDb table
            updateUser(userId, 'image', photoUrl)
                .then((data) => {
                    printInfo(
                        'awsService',
                        NAMESPACE,
                        'updateUser',
                        data.Attributes
                    )
                    res.send(data.Attributes)
                })
                .catch((err) => {
                    printError(
                        'awsService',
                        NAMESPACE,
                        'updateUser',
                        err
                    )
                    res.status(400).send(
                        `Service error: path="/${NAMESPACE}/:userId/profile-photo" method="POST".`
                    )
                })
        }



    })


})

module.exports = router