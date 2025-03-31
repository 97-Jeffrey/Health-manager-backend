const docClient = require('../aws_config').getDocClient()


/**
 * Update a existing body attribute for user with @param userId  and @param name and 
 * @param attr
 *
 * @param {String} patientId
 * @param {String} name
 * @param {Object} attr
 * 
 * @return {Promise} data - response is data.Attributes
 */

function _updateBodyAttr(userId, name, attr){

    let date = new Date()
    const params = {
        TableName: process.env.DYNAMO_DB_BODY_TABLE_NAME,
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


exports.default = _updateBodyAttr