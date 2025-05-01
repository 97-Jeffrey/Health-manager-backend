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


// get all sleeps entry
router.get('/:userId/sleeps', async(req, res)=>{

    const { userId } = req.params;


    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId" method="GET".`
        )
        return
    }

    try{
        const { Item } = await awsFitnessService.getFitness(userId)
        const sleepData= Item?.sleep?? []

        console.log('Item', Item)

        res.status(200).send(sleepData)
       
        
    }catch(err){
        printError('route', NAMESPACE, 'getFitness / sleep', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/sleeps" method="GET".`
        )
        throw err
    }
})


// create a brand new fitness
router.post('/:userId/:type/create', async (req, res) => {
    try {
        const { userId, type } = req.params
        if (!validateUser(req)) {
            res.status(401).send(
                `Unauthorized request: path="/${NAMESPACE}/:userId/create" method="POST".`
            )
            return
        }
        const newId = uuidv4();
        const data= req.body[type];
        const newData = {...data, id: newId }

        try{
  

            const data = await awsFitnessService.createFitness(userId, type, newData)
            printInfo('awsFitnessService', NAMESPACE, `createFitness / ${type}` ,data.Attributes)
            
            res.status(200).send(`${type} Create Success`)
                
        }
        catch(err){
            printError('awsFitnessService', NAMESPACE, `createFitness / ${type}`, err)
            res.status(400).send(
                `Service error: path="/${NAMESPACE}/:userId/create" method="POST".`
            )

        }
        
    } catch (err) {
        printError('awsFitnessService', NAMESPACE, `createFitness / ${type}`, err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/create" method="POST".`
        )
        throw err
    }
})


// update a existing sport
router.put(`/:userId/:type/edit/:fitnessId`, async (req, res) => {

    const { userId, fitnessId, type } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/edit/:fitnessId" method="PUT".`
        )
        return
    }
    const data=req.body[type]


    try {

        const datas = await awsFitnessService.getFitness(userId)
        const newDatas =datas.Item[type].map(item => item.id !== fitnessId? item: data);

        const result = await awsFitnessService.updateFitness(userId, type, newDatas);
        printInfo('awsFitnessService', NAMESPACE,`updateFitness / ${type}`, result.Attributes)

        res.status(200).send(`${type} Update Success`)

            

    } catch (err) {
   
        printError('awsFitnessService', NAMESPACE, `updateFitness / ${type}`, err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/edit/:sportId" method="PUT".`
        )
        
    }

})



// Delete A sport:
router.post(`/:userId/sport/delete`, async (req, res) => {

    const { userId, type } = req.params
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
    

        await awsFitnessService.updateFitness(userId, type, newSports)
        
        res.status(200).send('fitness Delete Success')
           

    } catch (err) {
        printError('awsFitnessService', NAMESPACE, 'deleteFitness / sport', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/delete" method="POST".`
        )
    }

})


// Delete A sleep:
router.post(`/:userId/sleep/delete`, async (req, res) => {

    const { userId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/delete" method="POST".`
        )
        return
    }
    const { sleepId } = req.body;

    try {
        const sleeps = await awsFitnessService.getFitness(userId)
        const newSleeps = [...sleeps.Item.sleep.filter(sle => sle.id !== sleepId)];
    

        await awsFitnessService.updateFitness(userId, 'sleep', newSleeps)
        
        res.status(200).send('Sleep Delete Success')
           

    } catch (err) {
        printError('awsFitnessService', NAMESPACE, 'deleteFitness / sleep', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/delete" method="POST".`
        )
    }

})


module.exports = router