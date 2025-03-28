const express = require('express')
const router = express.Router()
const awsJourneyService = require('../services/journey')
const { validateUser, printInfo, printError } = require('../helpers/general_helpers')
const { v4: uuidv4 } = require('uuid')


const NAMESPACE = 'JOURNEY';

// get all journeys
router.get('/:userId', async(req, res)=>{

    const { userId } = req.params;


    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId" method="GET".`
        )
        return
    }

    try{
        const { Item } = await awsJourneyService.getJourneys(userId)
        const journeyData= Item?.journey?? []

        // console.log('Item', Item)

        res.status(200).send(journeyData)
       
        
    }catch(err){
        printError('route', NAMESPACE, 'getJourneys', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/" method="GET".`
        )
        throw err
    }
})


// create a brand new journey
router.post('/:userId/create', async (req, res) => {
    try {
        const { userId } = req.params
        if (!validateUser(req)) {
            res.status(401).send(
                `Unauthorized request: path="/${NAMESPACE}/:userId/create" method="POST".`
            )
            return
        }
        const journeyId = uuidv4();
        const { journey } = req.body;
        const newJourney = {...journey, id: journeyId}

        try{
  

            const data = await awsJourneyService.createJoruney(userId, newJourney)
            printInfo('awsJourneyService', NAMESPACE,'createJourney',data.Attributes)
            
            res.status(200).send('Journey Create Success')
                
        }
        catch(err){
            printError('awsService', NAMESPACE, 'createJourney', err)
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


// update Journey:
router.put(`/:userId/edit/:journeyId`, async (req, res) => {

    const { userId, journeyId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/edit/:journeyId" method="PUT".`
        )
        return
    }
    const { journey } =req.body

    console.log('journey', journey)
    console.log('journey Id', journeyId)

    try {
        const journeys = await awsJourneyService.getJourneys(userId)
        const newJourneys =journeys.Item.journey.map(jour => jour.id !== journeyId? jour: journey);



        console.log("newJourneys", newJourneys)

        const data = await awsJourneyService.updateJourney(userId, newJourneys);
        printInfo('awsJourneyService', NAMESPACE,'updateJourney', data.Attributes)

        res.status(200).send('Journey Update Success')

            

    } catch (err) {
   
        printError('awsJourneyService', NAMESPACE, 'updateJourney!!!!', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/edit/:journeyId" method="PUT".`
        )
        
    }

})


// Delete Health Journey:
router.post(`/:userId/delete`, async (req, res) => {

    const { userId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/delete" method="POST".`
        )
        return
    }
    const { journeyId } = req.body;

    console.log("journeyId", journeyId)

    try {
        const journeys = await awsJourneyService.getJourneys(userId)
        const newJourneys = [...journeys.Item.journey.filter(journey => journey.id !== journeyId)];
    

        await awsJourneyService.updateJourney(userId, newJourneys)
        
        res.status(200).send('journey Delete Success')
           

    } catch (err) {
        printError('awsJourneyService', NAMESPACE, 'deleteJourey', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/delete" method="POST".`
        )
    }

})


module.exports = router