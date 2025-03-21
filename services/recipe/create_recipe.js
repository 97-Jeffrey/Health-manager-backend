const docClient = require('../aws_config').getDocClient()

/**
 * create recipe for user with userId = @param userId
 *
 * @param {String} userId
 * @param {String} recipeId
 * @param {Object} recipe
 * @return {Promise} data - response is data.Item
 */


function _createRecipe(userId, recipeId, recipe) {
    let date = new Date()
    const params = {
        TableName: process.env.DYNAMO_DB_RECIPE_TABLE_NAME,
        Key: { user_id: userId, recipe_id: recipeId },
        UpdateExpression: `
        SET last_updated_at = :timeNow, 
        #attr = :attr`,
        ExpressionAttributeNames: {
            '#attr': 'recipe',
        },
        ExpressionAttributeValues: {
            ':timeNow': date.toISOString(),
            ':attr': recipe,
        },
        ReturnValues: 'UPDATED_NEW',
    }
    return docClient.update(params).promise()
}

exports.default = _createRecipe