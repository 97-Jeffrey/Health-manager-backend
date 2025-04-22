const express = require('express')
const router = express.Router()
const awsMealService = require('../services/meal')
const awsRecipeService = require('../services/recipe')
const { validateUser, printInfo, printError} = require('../helpers/general_helpers')
const { v4: uuidv4 } = require('uuid')

const NAMESPACE = 'MEAL';



// get all meals
router.get('/:userId/meals', async(req, res)=>{

    const { userId } = req.params;


    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId" method="GET".`
        )
        return
    }

    try{
        const { Item } = await awsMealService.getMeals(userId)
        const mealData= Item?.meal?? []

        console.log('Item', Item)

        res.status(200).send(mealData)
       
        
    }catch(err){
        printError('route', NAMESPACE, 'getMeals', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/meals" method="GET".`
        )
        throw err
    }
})


// create a brand new meal
router.post('/:userId/create', async (req, res) => {
    try {
        const { userId } = req.params
        if (!validateUser(req)) {
            res.status(401).send(
                `Unauthorized request: path="/${NAMESPACE}/:userId/create" method="POST".`
            )
            return
        }
        const mealId = uuidv4();
        const { meal } = req.body;
        const newMeal = {...meal, id: mealId }

        try{

            const micronutrients = await awsRecipeService.parseNutrients(newMeal.name)
            printInfo('awsRecipeService', NAMESPACE,'parseNutrients',{})
  

            const data = await awsMealService.createMeal(userId, {...newMeal, micronutrients})
            printInfo('awsMealService', NAMESPACE,'createMeal',data.Attributes)
            
            res.status(200).send('Meal Create Success')
                
        }
        catch(err){
            printError('awsMealService', NAMESPACE, 'createMeal', err)
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


// update a existing meal
router.put(`/:userId/edit/:mealId`, async (req, res) => {

    const { userId, mealId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/edit/:mealId" method="PUT".`
        )
        return
    }
    const { meal } =req.body


    try {


        const micronutrients = await awsRecipeService.parseNutrients(meal.name)
        printInfo('awsRecipeService', NAMESPACE,'parseNutrients',{})

        const meals = await awsMealService.getMeals(userId)
        const newMeals =meals.Item.meal.map(eachMeal => eachMeal.id !== mealId? eachMeal: {...meal, micronutrients});


        const data = await awsMealService.updateMeal(userId, newMeals);
        printInfo('awsMealService', NAMESPACE,'updateMeal', data.Attributes)

        res.status(200).send('Meal Update Success')

            

    } catch (err) {
   
        printError('awsMealService', NAMESPACE, 'updateMeal', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/edit/:mealId" method="PUT".`
        )
        
    }

})



// Delete A Meal:
router.post(`/:userId/delete`, async (req, res) => {

    const { userId } = req.params
    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/delete" method="POST".`
        )
        return
    }
    const { mealId } = req.body;

    try {
        const meals = await awsMealService.getMeals(userId)
        const newMeals = [...meals.Item.meal.filter(meal => meal.id !== mealId)];
    

        await awsMealService.updateMeal(userId, newMeals)
        
        res.status(200).send('Meal Delete Success')
           

    } catch (err) {
        printError('awsMealService', NAMESPACE, 'deleteMeal', err)
        res.status(400).send(
            `Service error: path="/${NAMESPACE}/${userId}/delete" method="POST".`
        )
    }

})



module.exports = router