const express = require('express')
const router = express.Router()
const awsUserService = require('../services/user/index')
const { validateUser, printInfo, printError} = require('../helpers/general_helpers')

NAMESPACE = 'USER'


router.get('/:userId', async(req, res)=>{

    try{
        const { userId } = req.params
        if (!validateUser(req)) {
            res.status(401).send(
                `Unauthorized request: path="/${NAMESPACE}/:id/update" method="PUT".`
            )
            return
        }

       const { Item } = await awsUserService.getUser(userId)
       Item.userId = Item.user_id
       delete Item['user_id']
       res.status(200).send(Item)

    }catch (err) {
        printError('route', NAMESPACE, 'getUser', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:id" method="GET".`
        )
        throw err
    }
    
    

})




router.put('/:userId/update', async (req, res) => {
    try {
        const { userId } = req.params
        if (!validateUser(req)) {
            res.status(401).send(
                `Unauthorized request: path="/${NAMESPACE}/:id/update" method="PUT".`
            )
            return
        }
        const { attribute, value } = req.body
        awsUserService
            .updateUser(userId, attribute, value)
            .then((data) => {
                printInfo(
                    'awsService',
                    NAMESPACE,
                    'updateUser',
                    data.Attributes
                )
                res.status(200).send(data.Attributes)
            })
            .catch((err) => {
                printError('awsService', NAMESPACE, 'updateUser', err)
                res.status(400).send(
                    `Service error: path="/${NAMESPACE}/:id/update" method="PUT".`
                )
            })
    } catch (err) {
        printError('route', NAMESPACE, 'updateUser', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:id/update" method="PUT".`
        )
        throw err
    }
})

module.exports = router