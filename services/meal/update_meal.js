const docClient = require('../aws_config').getDocClient()


/**
 * Update a existing meal for user with @param userId  and @param meal
 *
 * @param {String} userId
 * @param {Object} meal
 * @return {Promise} data - response is data.Attributes
 */

function _updateMeal(userId, meal){

    let date = new Date()
    const params = {
        TableName: process.env.DYNAMO_DB_MEAL_TABLE_NAME,
        Key: { user_id: userId },
        UpdateExpression:
            'SET last_updated_at = :timeNow, meal = :meal',
        ExpressionAttributeValues: {
            ':timeNow': date.toISOString(),
            ':meal': meal
        },
        ReturnValues: 'UPDATED_NEW',
    }
    return docClient.update(params).promise()

}


exports.default = _updateMeal