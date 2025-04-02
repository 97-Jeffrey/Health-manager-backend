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
        const { Item } = await awsBodyService.getBodySymptoms(userId)
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
        
        res.status(200).send('Journey Create Success')
            
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
        const symptoms = await awsBodyService.getBodySymptoms(userId)
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
        const symptoms = await awsBodyService.getBodySymptoms(userId)
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



module.exports = router