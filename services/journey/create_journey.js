const docClient = require('../aws_config').getDocClient()


/**
 * Add new @param recommendation for user with @param userId from
 *
 * @param {String} patientId
 * @param {Object} journey
 * @return {Promise} data - response is data.Attributes
 */

function _createJourney(userId, journey){
    let date = new Date()
    const params = {
        TableName: process.env.DYNAMO_DB_JOURNEY_TABLE_NAME,
        Key: { user_id: userId },
        UpdateExpression:
            'SET last_updated_at = :timeNow, journey = list_append(if_not_exists(journey, :emptyList), :attr)',
        ExpressionAttributeValues: {
            ':timeNow': date.toISOString(),
            ':emptyList': [],
            ':attr': [journey],
        },
        ReturnValues: 'UPDATED_NEW',
    }
    return docClient.update(params).promise()

}

exports.default = _createJourney