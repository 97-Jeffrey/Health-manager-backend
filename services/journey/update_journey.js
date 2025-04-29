const docClient = require('../aws_config').getDocClient()


/**
 * Update a existing journey for user with @param userId  and @param journey
 *
 * @param {String} userId
 * @param {Object} journey
 * @return {Promise} data - response is data.Attributes
 */

function _updateJourney(userId, journey){


    console.log(userId, journey)


    let date = new Date()
    const params = {
        TableName: process.env.DYNAMO_DB_JOURNEY_TABLE_NAME,
        Key: { user_id: userId },
        UpdateExpression:
            'SET last_updated_at = :timeNow, journey = :journey',
        ExpressionAttributeValues: {
            ':timeNow': date.toISOString(),
            ':journey': journey
        },
        ReturnValues: 'UPDATED_NEW',
    }
    return docClient.update(params).promise()

}


exports.default = _updateJourney