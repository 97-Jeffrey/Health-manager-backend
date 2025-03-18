const docClient = require('../aws_config').getDocClient()

/**
 * Get account information for user with userId = @param userId
 *
 * @param {String} userId
 * @return {Promise} data - response is data.Item
 */

const USRE_ATTR = {
    email:'email',
    birthdate:"birthdate",
    name:'name',
    website: 'website',
    specialty:'specialty',
    phone_number: 'phone_number',
    address:'address',
}

function _updateAccount(userId, attribute, value) {
    let date = new Date()
    const params = {
        TableName: process.env.DYNAMO_DB_TABLE_NAME,
        Key: { user_id: userId },
        UpdateExpression: `
        SET last_updated_at = :timeNow, 
        #attr = :attr`,
        ExpressionAttributeNames: {
            '#attr': USRE_ATTR[attribute], // Map #attr to the actual attribute name
        },
        ExpressionAttributeValues: {
            ':timeNow': date.toISOString(),
            ':attr': value,
        },
        ReturnValues: 'UPDATED_NEW',
    }
    return docClient.update(params).promise()
}

exports.default = _updateAccount