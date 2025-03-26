const docClient = require('../aws_config').getDocClient()

/**
 * delete recipe for user with userId @param userId and @param recipeId
 *
 * @param {String} userId
 * @param {String} recipeId
 * @return {Promise} data - response is data.Item
 */


function _deleteRecipe(userId, recipeId) {
    const params = {
        TableName: process.env.DYNAMO_DB_RECIPE_TABLE_NAME,
        Key: { user_id: userId, recipe_id: recipeId },
    }
    return docClient.delete(params).promise()
}

exports.default = _deleteRecipe