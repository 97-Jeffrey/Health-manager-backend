const docClient = require('../aws_config').getDocClient()

/**
 * Get account information for practitioner with practitionerId = @param userId
 *
 * @param {String} userId
 * @return {Promise} data - response is data.Item
 */

async function _getUser(userId) {
    const params = {
        TableName: process.env.DYNAMO_DB_TABLE_NAME,
        Key: { user_id : userId },
    }
    return docClient.get(params).promise()
}

exports.default = _getUser