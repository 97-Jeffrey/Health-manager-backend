const docClient = require('../aws_config').getDocClient()


/**
 * Add new @param mind for user with @param userId and @param mind
 *
 * @param {String} userId
 * @param {Object} mind
 * @return {Promise} data - response is data.Attributes
 */

function _createMind(userId, mind){
    let date = new Date()
    const params = {
        TableName: process.env.DYNAMO_DB_MIND_TABLE_NAME,
        Key: { user_id: userId },
        UpdateExpression:
            'SET last_updated_at = :timeNow, mind = list_append(if_not_exists(mind, :emptyList), :attr)',
        ExpressionAttributeValues: {
            ':timeNow': date.toISOString(),
            ':emptyList': [],
            ':attr': [mind],
        },
        ReturnValues: 'UPDATED_NEW',
    }
    return docClient.update(params).promise()

}

exports.default = _createMind