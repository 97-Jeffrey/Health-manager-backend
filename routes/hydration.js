const express = require('express')
const router = express.Router()
const awsHydrationService = require('../services/hydration')
const { validateUser, printInfo, printError} = require('../helpers/general_helpers')
const { v4: uuidv4 } = require('uuid')

const NAMESPACE = 'HYDRATION';

// get all hydrationss
router.get('/:userId/hydrations', async(req, res)=>{

    const { userId } = req.params;


    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId" method="GET".`
        )
        return
    }

    try{
        const { Item } = await awsHydrationService.getHydrations(userId)
        const hydrationData= Item?.hydration?? []

        console.log('Item', Item)

        res.status(200).send(hydrationData)
       
        
    }catch(err){
        printError('route', NAMESPACE, 'getHydrations', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/hydrations" method="GET".`
        )
        throw err
    }
})


// create a brand new hydration
router.post('/:userId/create', async (req, res) => {
    try {
        const { userId } = req.params
        if (!validateUser(req)) {
            res.status(401).send(
                `Unauthorized request: path="/${NAMESPACE}/:userId/create" method="POST".`
            )
            return
        }
        const hydrationId = uuidv4();
        const { hydration } = req.body;
        const newHydration = {...hydration, id: hydrationId }

        try{
  

            const data = await awsHydrationService.createHydration(userId, newHydration)
            printInfo('awsHydrationService', NAMESPACE,'createHydration',data.Attributes)
            
            res.status(200).send('Hydration Create Success')
                
        }
        catch(err){
            printError('awsHydrationService', NAMESPACE, 'createHydration', err)
            res.status(400).send(
                `Service error: path="/${NAMESPACE}/:userId/create" method="POST".`
            )

        }
        
    } catch (err) {
        printError('awsJourneyService', NAMESPACE, 'createJourney', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/create" method="POST".`
        )
        throw err
    }
})


// update a existing hydration
router.put(`/:userId/edit/:hydrationId`, async (req, res) => {

    const { userId, hydrationId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/edit/:hydrationId" method="PUT".`
        )
        return
    }
    const { hydration } =req.body


    try {


        const hydrations = await awsHydrationService.getHydrations(userId)
        const newHydrations =hydrations.Item.hydration.map(eachHyd => eachHyd.id !== hydrationId? eachHyd: hydration);


        const data = await awsHydrationService.updateHydration(userId, newHydrations);
        printInfo('awsHydrationService', NAMESPACE,'updateHydration', data.Attributes)

        res.status(200).send('Hydration Update Success')

            

    } catch (err) {
   
        printError('awsHydrationService', NAMESPACE, 'updateHydration', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/edit/:hydrationId" method="PUT".`
        )
        
    }

})



// Delete A Hydration:
router.post(`/:userId/delete`, async (req, res) => {

    const { userId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/delete" method="POST".`
        )
        return
    }
    const { hydrationId } = req.body;

    try {
        const hydrations = await awsHydrationService.getHydrations(userId)
        const newHydrations = [...hydrations.Item.hydration.filter(hyd => hyd.id !== hydrationId)];
    

        await awsHydrationService.updateHydration(userId, newHydrations)
        
        res.status(200).send('Hydration Delete Success')
           

    } catch (err) {
        printError('awsHydrationService', NAMESPACE, 'deleteHydration', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/delete" method="POST".`
        )
    }

})



module.exports = router