const express = require('express')
const router = express.Router()
const awsBodyService = require('../services/body')
const { validateUser, printInfo, printError } = require('../helpers/general_helpers')
const { v4: uuidv4 } = require('uuid')

const NAMESPACE = 'BODY';


// get all body symptoms
router.get('/:userId/symptoms', async(req, res)=>{

    const { userId } = req.params;


    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId" method="GET".`
        )
        return
    }

    try{
        const { Item } = await awsBodyService.getBodyAttributes(userId)
        const symptomData= Item?.symptoms?? []

        console.log('Item', Item)

        res.status(200).send(symptomData)
       
        
    }catch(err){
        printError('route', NAMESPACE, 'getBodySymptoms', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/symptoms" method="GET".`
        )
        throw err
    }
})



// get all body weights
router.get('/:userId/weights', async(req, res)=>{

    const { userId } = req.params;


    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId" method="GET".`
        )
        return
    }

    try{
        const { Item } = await awsBodyService.getBodyAttributes(userId)
        const weightData= Item?.weights?? []

        console.log('Item', Item)

        res.status(200).send(weightData)
       
        
    }catch(err){
        printError('route', NAMESPACE, 'getBodyAttributes / weights', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/weights" method="GET".`
        )
        throw err
    }
})


// get all body glucoses
router.get('/:userId/glucoses', async(req, res)=>{

    const { userId } = req.params;


    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId" method="GET".`
        )
        return
    }

    try{
        const { Item } = await awsBodyService.getBodyAttributes(userId)
        const glucoseData= Item?.glucoses?? []

        console.log('Item', Item)

        res.status(200).send(glucoseData)
       
        
    }catch(err){
        printError('route', NAMESPACE, 'getBodyAttributes / glucoses', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/glucses" method="GET".`
        )
        throw err
    }
})



// add a new body weight
router.post('/:userId/weight/create', async (req, res) => {
    
    const { userId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/weight/create" method="POST".`
        )
        return
    }
    const weightId = uuidv4();
    const { bodyWeight } = req.body;
    const newWeight = {...bodyWeight, id: weightId}

    try{

        const data = await awsBodyService.createBodyAttributes(userId, 'weights', newWeight)
        printInfo('awsBodyService', NAMESPACE,'createBodyAttributes / weights', data.Attributes)
        
        res.status(200).send('weight Create Success')
            
    }
    catch(err){
        printError('awsBodyService', NAMESPACE, 'createBodyAttributes / weights', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/:userId/weight/create" method="POST".`
        )
    }
})


// add a new body glucose:
router.post('/:userId/glucose/create', async (req, res) => {
    
    const { userId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/glucose/create" method="POST".`
        )
        return
    }
    const glucoseId = uuidv4();
    const { bodyGlucose } = req.body;
    const newGlucose = {...bodyGlucose, id: glucoseId }

    try{

        const data = await awsBodyService.createBodyAttributes(userId, 'glucoses', newGlucose)
        printInfo('awsBodyService', NAMESPACE,'createBodyAttributes / glucoses', data.Attributes)
        
        res.status(200).send('glucose Create Success')
            
    }
    catch(err){
        printError('awsBodyService', NAMESPACE, 'createBodyAttributes / glucoses', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/:userId/glucose/create" method="POST".`
        )
    }
})



// create a brand new body symptom
router.post('/:userId/symptom/create', async (req, res) => {
    
    const { userId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/create" method="POST".`
        )
        return
    }
    const symptomId = uuidv4();
    const { bodySymptom } = req.body;
    const newSymptom = {...bodySymptom, id: symptomId}

    try{

        const data = await awsBodyService.createBodyAttributes(userId, 'symptoms', newSymptom)
        printInfo('awsBodyService', NAMESPACE,'createBodyAttributes / symptoms', data.Attributes)
        
        res.status(200).send('symptom Create Success')
            
    }
    catch(err){
        printError('awsBodyService', NAMESPACE, 'createBodyAttributes / symptoms', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/:userId/symptom/create" method="POST".`
        )
    }
})



// update A body Symptom:
router.put(`/:userId/symptom/edit/:symptomId`, async (req, res) => {

    const { userId, symptomId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/symptom/edit/:symptomId" method="PUT".`
        )
        return
    }
    const { bodySymptom } =req.body


    try {
        const symptoms = await awsBodyService.getBodyAttributes(userId)
        const newSymptoms =symptoms.Item.symptoms.map(sym => sym.id !== symptomId? sym: bodySymptom);


        const data = await awsBodyService.updateBodyAttributes(userId, 'symptoms', newSymptoms);
        printInfo('awsBodyService', NAMESPACE,'updateBodyAttributes / symptoms', data.Attributes)

        res.status(200).send('body symptoms Update Success')

            

    } catch (err) {
   
        printError('awsBodyService', NAMESPACE, 'updateBodyAttributes / symptoms', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/symptom/edit/:symptomId" method="PUT".`
        )
        
    }

})


// update A body weight:
router.put(`/:userId/weight/edit/:weightId`, async (req, res) => {

    const { userId, weightId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/weight/edit/:weightId" method="PUT".`
        )
        return
    }
    const { bodyWeight } =req.body


    try {
        const weights = await awsBodyService.getBodyAttributes(userId)
        const newWeights =weights.Item.weights.map(weight => weight.id !== weightId? weight: bodyWeight);


        const data = await awsBodyService.updateBodyAttributes(userId, 'weights', newWeights);
        printInfo('awsBodyService', NAMESPACE,'updateBodyAttributes / weights', data.Attributes)

        res.status(200).send('body weights Update Success')

            

    } catch (err) {
   
        printError('awsBodyService', NAMESPACE, 'updateBodyAttributes / weights', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/weights/edit/:symptomId" method="PUT".`
        )
        
    }

})


// update A body glucose:
router.put(`/:userId/glucose/edit/:glucoseId`, async (req, res) => {

    const { userId, glucoseId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/glucose/edit/:glucoseId" method="PUT".`
        )
        return
    }
    const { bodyGlucose } =req.body


    try {
        const glucoses = await awsBodyService.getBodyAttributes(userId)
        const newGlucoses =glucoses.Item.glucoses.map(glucose => glucose.id !== glucoseId? glucose: bodyGlucose);


        const data = await awsBodyService.updateBodyAttributes(userId, 'glucoses', newGlucoses);
        printInfo('awsBodyService', NAMESPACE,'updateBodyAttributes / glucoses', data.Attributes)

        res.status(200).send('body Glucoses Update Success')

            

    } catch (err) {
   
        printError('awsBodyService', NAMESPACE, 'updateBodyAttributes / glucoses', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/glucose/edit/:glucoseId" method="PUT".`
        )
        
    }

})


// Delete A body symptom:
router.post(`/:userId/symptom/delete`, async (req, res) => {

    const { userId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/symptom/delete" method="POST".`
        )
        return
    }
    const { bodySymptomId } = req.body;

    try {
        const symptoms = await awsBodyService.getBodyAttributes(userId)
        const newSymptoms = [...symptoms.Item.symptoms.filter(symptom => symptom.id !== bodySymptomId)];


        console.log("newSymptoms", newSymptoms)
    

        await awsBodyService.updateBodyAttributes(userId, 'symptoms', newSymptoms)
        printInfo('awsBodyService', NAMESPACE,'deleteBodyAttributes / symptoms', {})
        
        res.status(200).send('symptoms Delete Success')
           

    } catch (err) {
        printError('awsBodyService', NAMESPACE, 'deleteBodyAttributes / symptoms', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/symptom/delete" method="POST".`
        )
    }

})



// Delete A body weight:
router.post(`/:userId/weight/delete`, async (req, res) => {

    const { userId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/weight/delete" method="POST".`
        )
        return
    }
    const { bodyWeightId } = req.body;

    try {
        const weights = await awsBodyService.getBodyAttributes(userId)
        const newWeights = [...weights.Item.weights.filter(weight => weight.id !== bodyWeightId)];

    

        await awsBodyService.updateBodyAttributes(userId, 'weights', newWeights)
        printInfo('awsBodyService', NAMESPACE,'deleteBodyAttributes / weights', {})
        
        res.status(200).send('weight Delete Success')
           

    } catch (err) {
        printError('awsBodyService', NAMESPACE, 'deleteBodyAttributes / weights', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/weights/delete" method="POST".`
        )
    }

})



// Delete A body glucose:
router.post(`/:userId/glucose/delete`, async (req, res) => {

    const { userId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/glucose/delete" method="POST".`
        )
        return
    }
    const { bodyGlucoseId } = req.body;

    try {
        const glucoses = await awsBodyService.getBodyAttributes(userId)
        const newGlucoses = [...glucoses.Item.glucoses.filter(glucose => glucose.id !== bodyGlucoseId)];

    

        await awsBodyService.updateBodyAttributes(userId, 'glucoses', newGlucoses)
        printInfo('awsBodyService', NAMESPACE,'deleteBodyAttributes / glucoses', {})
        
        res.status(200).send('Glucose Delete Success')
           

    } catch (err) {
        printError('awsBodyService', NAMESPACE, 'deleteBodyAttributes / glucose', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/glucose/delete" method="POST".`
        )
    }

})



module.exports = router