const docClient = require('../aws_config').getDocClient()


/**
 * Add new @param meal for user with @param userId
 *
 * @param {String} userId
 * @param {Object} meal
 * 
 * @return {Promise} data - response is data.Attributes
 */

function _createMeal(userId, meal){
    let date = new Date()
    const params = {
        TableName: process.env.DYNAMO_DB_MEAL_TABLE_NAME,
        Key: { user_id: userId },
        UpdateExpression:
            `SET last_updated_at = :timeNow, meal = list_append(if_not_exists(meal, :emptyList), :attr)`,
        ExpressionAttributeValues: {
            ':timeNow': date.toISOString(),
            ':emptyList': [],
            ':attr': [meal],
        },
        ReturnValues: 'UPDATED_NEW',
    }
    return docClient.update(params).promise()

}

exports.default = _createMeal