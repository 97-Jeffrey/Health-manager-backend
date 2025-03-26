const docClient = require('../aws_config').getDocClient()


/**
 * Add new journey  for user with @param userId 

 *
 * @param {String} patientId
 * @param {Object} journey
 * @return {Promise} data - response is data.Attributes
 */

function _updateJourney(userId, journey){
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