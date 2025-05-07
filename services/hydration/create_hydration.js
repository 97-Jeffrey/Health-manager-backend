const docClient = require('../aws_config').getDocClient()


/**
 * Add new @param hydration for user with @param userId
 *
 * @param {String} userId
 * @param {Object} hydration
 * 
 * @return {Promise} data - response is data.Attributes
 */

function _createHydration(userId, hydration){
    let date = new Date()
    const params = {
        TableName: process.env.DYNAMO_DB_MEAL_TABLE_NAME,
        Key: { user_id: userId },
        UpdateExpression:
            `SET last_updated_at = :timeNow, hydration = list_append(if_not_exists(hydration, :emptyList), :attr)`,
        ExpressionAttributeValues: {
            ':timeNow': date.toISOString(),
            ':emptyList': [],
            ':attr': [hydration],
        },
        ReturnValues: 'UPDATED_NEW',
    }
    return docClient.update(params).promise()

}

exports.default = _createHydration