const express = require('express')
const router = express.Router()
const awsUserService  = require('../services/user')
const awsRecipeService = require('../services/recipe')
const { validateUser, printInfo, printError} = require('../helpers/general_helpers')
const { v4: uuidv4 } = require('uuid')

const NAMESPACE = 'RECIPE';

// get all recipes
router.get('/:userId', async(req, res)=>{

    const { userId } = req.params;


    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:id" method="GET".`
        )
        return
    }

    try{
        const result = []
        const { Item } = await awsUserService.getAttributes(userId, ['recipes'])
        const recipesId= Item?.recipes


        if(Item?.recipes?.length){
            for(let i=0; i<recipesId.length; i++){
                const { Item } = await awsRecipeService.getRecipe(userId, recipesId[i]);
                result.push({
                    ...Item.recipe, 
                    id: Item.recipe_id, 
                    lastUpdatedAt: Item.last_updated_at 
                })

            }
            res.status(200).send(result)
        }else{
            res.send([])
        }
        
    }catch(err){
        printError('route', NAMESPACE, 'getRecipes', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/" method="GET".`
        )
        throw err
    }
})

// get one recipe
router.get('/:userId/:recipeId', async(req, res)=>{

    const { userId , recipeId } = req.params;


    if (!validateUser(req)) {
        res.status(401).send(
            `Unauthorized request: path="/${NAMESPACE}/:userId/:recipeId" method="GET".`
        )
        return
    }

    try{
       
        const { Item } = await awsRecipeService.getRecipe(userId, recipeId);

        const result = {
            ...Item.recipe,
            id: Item.recipe_id, 
            lastUpdatedAt: Item.last_updated_at 
        }

        res.status(200).send(result)
       
        
    }catch(err){
        printError('route', NAMESPACE, 'getRecipe', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:userId/:recipeId" method="GET".`
        )
        throw err
    }
})

// create a brand new recipe
router.post('/:userId/create', async (req, res) => {
    try {
        const { userId } = req.params
        if (!validateUser(req)) {
            res.status(401).send(
                `Unauthorized request: path="/${NAMESPACE}/:id/create" method="POST".`
            )
            return
        }
        const recipeId = uuidv4();
        const { recipe } = req.body;

        console.log('recipe', recipeId, recipe)

        // return;

        try{
  
            const userData = await awsUserService.updateUser(userId, 'recipes', recipeId, true)
            printInfo('awsUserService', 'USER','updateUser',userData.Attributes)

            const data = await awsRecipeService.createRecipe(userId, recipeId, recipe)
            printInfo('awsRecipeService', NAMESPACE,'createRecipe',data.Attributes)
            
            res.status(200).send('Recipe Create Success')
                
        }
        catch(err){
            printError('awsService', NAMESPACE, 'updateUser and createRecipe', err)
            res.status(400).send(
                `Service error: path="/${NAMESPACE}/:id/create" method="POST".`
            )

        }
        
    } catch (err) {
        printError('route', NAMESPACE, 'createRecipe', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:id/update" method="PUT".`
        )
        throw err
    }
})

// update a exising recipe
router.put('/:userId/edit/:recipeId', async (req, res) => {
    try {
        const { userId, recipeId } = req.params
        if (!validateUser(req)) {
            res.status(401).send(
                `Unauthorized request: path="/${NAMESPACE}/:userId/edit/:recipeId" method="PUT".`
            )
            return
        }
        const { recipe } = req.body;

        console.log('recipe', recipeId, recipe)

        // return;

        try{
  
            const data = await awsRecipeService.updateRecipe(userId, recipeId, recipe)
            printInfo('awsRecipeService', NAMESPACE,'updateRecipe',data.Attributes)
            
            res.status(200).send('Recipe Create Success')
                
        }
        catch(err){
            printError('awsService', NAMESPACE, 'updateRecipe', err)
            res.status(400).send(
                `Service error: path="/${NAMESPACE}/:id/create" method="POST".`
            )

        }
        
    } catch (err) {
        printError('route', NAMESPACE, 'updateRecipe', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:id/update" method="PUT".`
        )
        throw err
    }
})

// delete a existing recipe
router.post('/:userId/delete', async (req, res) => {
    try {
        const { userId } = req.params
        if (!validateUser(req)) {
            res.status(401).send(
                `Unauthorized request: path="/${NAMESPACE}/:userId/delete" method="POST".`
            )
            return
        }
        const { recipeId } = req.body;


        try{
            // remove from user recipe list first:
            const { Item } = await awsUserService.getAttributes(userId, ['recipes']);
            console.log("Item", Item);

            const newRecipeList = Item.recipes.filter(id=> id!==recipeId);

            const userData = await awsUserService.updateUser(userId, 'recipes', newRecipeList, false)
            printInfo('awsUserService', 'USER','updateUser',userData.Attributes)

            // then remove it from RECIPE TABLE:
  
            const data = await awsRecipeService.deleteRecipe(userId, recipeId)
            printInfo('awsRecipeService', NAMESPACE,'deleteRecipe',data.Attributes)
            
            res.status(200).send('Recipe delete Success')
                
        }
        catch(err){
            printError('awsService', NAMESPACE, 'deleteUser', err)
            res.status(400).send(
                `Service error: path="/${NAMESPACE}/:id/create" method="POST".`
            )

        }
        
    } catch (err) {
        printError('route', NAMESPACE, 'updateUser', err)
        res.status(400).send(
            `Route error: path="/${NAMESPACE}/:id/update" method="PUT".`
        )
        throw err
    }
})



module.exports = router