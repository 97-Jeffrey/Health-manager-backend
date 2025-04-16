const express = require('express')
const router = express.Router()
const awsMindService  = require('../services/mind')

const { v4: uuidv4 } = require('uuid');
const { validateUser, printInfo, printError } = require('../helpers/general_helpers');

const NAMESPACE = 'MIND';

// get mind properties for a user
router.get('/:userId/:attr', async(req, res)=>{

    const { userId, attr } = req.params;


    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId"/:attr method="GET".`
        )
        return
    }

    try{
        const { Item } = await awsMindService.getMindAttribute(userId)
        const data= Item[attr] ?? []

        res.status(200).send(data)
       
        
    }catch(err){
        printError('route', NAMESPACE, `getMindAttribute`, err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/mind/:attr" method="GET".`
        )
        throw err
    }
})


// add new mind proprety
router.post('/:userId/create/:type', async (req, res) => {
    
    const { userId, type } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/mind/create/:type" method="POST".`
        )
        return
    }
    const { mind } = req.body;
    const mindId = uuidv4()
    const newMind = { ...mind, id: mindId }

    try{

        const data = await awsMindService.createMind(userId, type, newMind)
        printInfo('awsMindService', NAMESPACE,'createMind', data.Attributes)
        
        res.status(200).send('mind Create Success')
            
    }
    catch(err){
        printError('awsMindService', NAMESPACE, 'createMind', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/:userId/mind/create" method="POST".`
        )
    }
})


// update a existing mind:
router.put(`/:userId/:mindId/:type`, async (req, res) => {

    const { userId, mindId, type } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/:mindId/:type" method="PUT".`
        )
        return
    }
    const { mind } =req.body

    try {
        const minds = await awsMindService.getMindAttribute(userId)
        const newMinds =minds.Item[type].map(mi => mi.id !== mindId? mi: mind);

        const data = await awsMindService.updateMind(userId, type, newMinds);
        printInfo('awsMindService', NAMESPACE, `updateMind / ${type}`, data.Attributes)

        res.status(200).send('mind Update Success')

            

    } catch (err) {
   
        printError('awsMindService', NAMESPACE, 'updateMind', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/:mindId/:type" method="PUT".`
        )
        
    }

})



// Delete A mind:
router.post(`/:userId/:type/delete`, async (req, res) => {

    const { userId, type } = req.params

    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/:type/delete" method="POST".`
        )
        return
    }
    const { mindId } = req.body;


    try {
        const minds = await awsMindService.getMindAttribute(userId)
        const newMinds = [...minds.Item[type].filter(mi => mi.id !== mindId)];
    
        await awsMindService.updateMind(userId, type, newMinds)
        
        res.status(200).send('Mind Delete Success')
           

    } catch (err) {
        printError('awsMindService', NAMESPACE, 'deleteMind', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/delete" method="POST".`
        )
    }

})




module.exports = router
