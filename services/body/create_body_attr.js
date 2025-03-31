const docClient = require('../aws_config').getDocClient()


/**
 * Add new @param attribute for user with @param userId
 *
 * @param {String} userId
 * @param {String} name
 * @param {Object} attribute
 * 
 * @return {Promise} data - response is data.Attributes
 */

function _createBodyAttr(userId, name, attribute){
    let date = new Date()
    const params = {
        TableName: process.env.DYNAMO_DB_BODY_TABLE_NAME,
        Key: { user_id: userId },
        UpdateExpression:
            `SET last_updated_at = :timeNow, ${name} = list_append(if_not_exists(${name}, :emptyList), :attr)`,
        ExpressionAttributeValues: {
            ':timeNow': date.toISOString(),
            ':emptyList': [],
            ':attr': [attribute],
        },
        ReturnValues: 'UPDATED_NEW',
    }
    return docClient.update(params).promise()

}

exports.default = _createBodyAttr