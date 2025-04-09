const express = require('express')
const router = express.Router()
const awsMindService  = require('../services/mind')

const { v4: uuidv4 } = require('uuid')

const NAMESPACE = 'MIND';

// get mind properties for a user
router.get('/:userId', async(req, res)=>{

    const { userId } = req.params;


    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId" method="GET".`
        )
        return
    }

    try{
        const { Item } = await awsMindService.getMindAttribute(userId)
        // const data= Item[attr] ?? MIND_DEFAULT[attr]

        // console.log('data', data)

        res.status(200).send(Item)
       
        
    }catch(err){
        printError('route', NAMESPACE, `getMindAttribute`, err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/mind/:attr" method="GET".`
        )
        throw err
    }
})


// add new mind proprety
router.post('/:userId/create', async (req, res) => {
    
    const { userId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/mind/create" method="POST".`
        )
        return
    }
    const { mind } = req.body;
    const mindId = uuidv4()
    const newMind = { mindId, ...mind }

    try{

        const data = await awsMindService.createMind(userId, newMind)
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
router.put(`/:userId/:mindId`, async (req, res) => {

    const { userId, mindId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/:mindId" method="PUT".`
        )
        return
    }
    const { mind } =req.body

    try {
        const minds = await awsMindService.getMindAttribute(userId)
        const newMinds =minds.Item.mind.map(mi => mi.id !== mindId? mi: mind);

        const data = await awsMindService.updateMind(userId, newMinds);
        printInfo('awsMindService', NAMESPACE,'updateMind', data.Attributes)

        res.status(200).send('mind Update Success')

            

    } catch (err) {
   
        printError('awsMindService', NAMESPACE, 'updateMind', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/:mind" method="PUT".`
        )
        
    }

})



// Delete A mind:
router.post(`/:userId/delete`, async (req, res) => {

    const { userId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/delete" method="POST".`
        )
        return
    }
    const { mindId } = req.body;


    try {
        const minds = await awsMindService.getMindAttribute(userId)
        const newMinds = [...minds.Item.mind.filter(mid => mid.id !== mindId)];
    

        await awsMindService.updateMind(userId, newMinds)
        
        res.status(200).send('Mind Delete Success')
           

    } catch (err) {
        printError('awsMindService', NAMESPACE, 'deleteMind', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/delete" method="POST".`
        )
    }

})




module.exports = router
