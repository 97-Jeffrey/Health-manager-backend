const docClient = require('../aws_config').getDocClient()


/**
 * Update a existing fitness for user with @param userId  and @param name and 
 * @param attr
 *
 * @param {String} userId
 * @param {String} name
 * @param {Object} attr
 * 
 * @return {Promise} data - response is data.Attributes
 */

function _updateFitnessAttr(userId, name, attr){

    let date = new Date()
    const params = {
        TableName: process.env.DYNAMO_DB_FITNESS_TABLE_NAME,
        Key: { user_id: userId },
        UpdateExpression:
            `SET last_updated_at = :timeNow, ${name} = :attr`,
        ExpressionAttributeValues: {
            ':timeNow': date.toISOString(),
            ':attr': attr
        },
        ReturnValues: 'UPDATED_NEW',
    }
    return docClient.update(params).promise()

}


exports.default = _updateFitnessAttr