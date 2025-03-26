const getRecipe = require('./get_recipe').default
const createRecipe = require('./create_recipe').default;
const updateRecipe = require('./update_recipe').default;
const deleteRecipe = require('./delete_recipe').default;


module.exports={
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe
}