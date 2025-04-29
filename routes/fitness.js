const express = require('express')
const router = express.Router()
const awsFitnessService = require('../services/fitness')
const { validateUser, printInfo, printError} = require('../helpers/general_helpers')
const { v4: uuidv4 } = require('uuid')

const NAMESPACE = 'FITNESS';



// get all sports entry
router.get('/:userId/sports', async(req, res)=>{

    const { userId } = req.params;


    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId" method="GET".`
        )
        return
    }

    try{
        const { Item } = await awsFitnessService.getFitness(userId)
        const sportData= Item?.sport?? []

        console.log('Item', Item)

        res.status(200).send(sportData)
       
        
    }catch(err){
        printError('route', NAMESPACE, 'getFitness', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/sports" method="GET".`
        )
        throw err
    }
})


// create a brand new sport
router.post('/:userId/create', async (req, res) => {
    try {
        const { userId } = req.params
        if (!validateUser(req)) {
            res.status(401).send(
                `Unauthorized request: path="/${NAMESPACE}/:userId/create" method="POST".`
            )
            return
        }
        const sportId = uuidv4();
        const { sport } = req.body;
        const newSport = {...sport, id: sportId }

        try{
  

            const data = await awsFitnessService.createFitness(userId, 'sport', newSport)
            printInfo('awsFitnessService', NAMESPACE,'createFitness',data.Attributes)
            
            res.status(200).send('Sport Create Success')
                
        }
        catch(err){
            printError('awsFitnessService', NAMESPACE, 'createFitness', err)
            res.status(400).send(
                `Service error: path="/${NAMESPACE}/:userId/create" method="POST".`
            )

        }
        
    } catch (err) {
        printError('awsFitnessService', NAMESPACE, 'createFitness', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/create" method="POST".`
        )
        throw err
    }
})


// update a existing sport
router.put(`/:userId/edit/:sportId`, async (req, res) => {

    const { userId, sportId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/edit/:sportId" method="PUT".`
        )
        return
    }
    const { sport } =req.body


    try {

        const sports = await awsFitnessService.getFitness(userId)
        const newSports =sports.Item.sport.map(spo => spo.id !== sportId? spo: sport);


        const data = await awsFitnessService.updateFitness(userId, 'sport', newSports);
        printInfo('awsFitnessService', NAMESPACE,'updateFitness', data.Attributes)

        res.status(200).send('Sport Update Success')

            

    } catch (err) {
   
        printError('awsFitnessService', NAMESPACE, 'updateFitness', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/edit/:sportId" method="PUT".`
        )
        
    }

})



// Delete A fitness:
router.post(`/:userId/delete`, async (req, res) => {

    const { userId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/delete" method="POST".`
        )
        return
    }
    const { sportId } = req.body;

    try {
        const sports = await awsFitnessService.getFitness(userId)
        const newSports = [...sports.Item.sport.filter(sport => sport.id !== sportId)];
    

        await awsFitnessService.updateFitness(userId, "sport", newSports)
        
        res.status(200).send('fitness Delete Success')
           

    } catch (err) {
        printError('awsFitnessService', NAMESPACE, 'deleteFitness', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/delete" method="POST".`
        )
    }

})



module.exports = router