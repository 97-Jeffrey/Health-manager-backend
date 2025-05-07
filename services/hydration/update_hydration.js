const docClient = require('../aws_config').getDocClient()


/**
 * Update a existing hydration for user with @param userId  and @param hydration
 *
 * @param {String} userId
 * @param {Object} hydration
 * @return {Promise} data - response is data.Attributes
 */

function _updateHydration(userId, hydration){

    let date = new Date()
    const params = {
        TableName: process.env.DYNAMO_DB_MEAL_TABLE_NAME,
        Key: { user_id: userId },
        UpdateExpression:
            'SET last_updated_at = :timeNow, hydration = :hydration',
        ExpressionAttributeValues: {
            ':timeNow': date.toISOString(),
            ':hydration': hydration
        },
        ReturnValues: 'UPDATED_NEW',
    }
    return docClient.update(params).promise()

}


exports.default = _updateHydration