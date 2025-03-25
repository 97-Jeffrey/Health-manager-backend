const docClient = require('../aws_config').getDocClient();

/**
 * Create a new @param intakeForm with @param practitionerId
 *
 * @param {Object} data
 * @param {Object} schedule
 * @return {Promise} data - response is data.Attributes
 */

function _getRecipe (userId, recipeId) {

    const params ={
        TableName: process.env.DYNAMO_DB_RECIPE_TABLE_NAME,
        Key: { user_id : userId,  recipe_id: recipeId},
        ReturnValues: 'UPDATED_NEW',
    }

    return docClient.get(params).promise()

}
exports.default = _getRecipe