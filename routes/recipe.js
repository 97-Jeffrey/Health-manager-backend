const express = require('express')
const router = express.Router()
const awsUserService  = require('../services/user')
const awsRecipeService = require('../services/recipe')
const { validateUser, printInfo, printError} = require('../helpers/general_helpers')
const { v4: uuidv4 } = require('uuid')

const NAMESPACE = 'RECIPE';


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
  
            const userData = await awsUserService.updateUser(userId, 'recipes', recipeId)
            printInfo('awsRecipeService', 'USER','updateUser',userData.Attributes)

            const data = await awsRecipeService.createRecipe(userId, recipeId, recipe)
            printInfo('awsRecipeService', NAMESPACE,'createRecipe',data.Attributes)
            
            res.status(200).send('Recipe Create Success')
                
        }
        catch(err){
            printError('awsService', NAMESPACE, 'updateUser', err)
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