const docClient = require('../aws_config').getDocClient()


/**
 * Update a existing mind for user with @param userId  and @param mind
 *
 * @param {String} userId
 * @param {Object} mind
 * @return {Promise} data - response is data.Attributes
 */

function _updateMind(userId, mind){



    let date = new Date()
    const params = {
        TableName: process.env.DYNAMO_DB_MIND_TABLE_NAME,
        Key: { user_id: userId },
        UpdateExpression:
            'SET last_updated_at = :timeNow, mind = :mind',
        ExpressionAttributeValues: {
            ':timeNow': date.toISOString(),
            ':mind': mind
        },
        ReturnValues: 'UPDATED_NEW',
    }
    return docClient.update(params).promise()

}


exports.default = _updateMind