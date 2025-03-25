const docClient = require('../aws_config').getDocClient()

/**
 * Get only @param atrributes from DynamoDB for practitioner with practitionerID = @param practitionerId
 *
 * @param {String} practitionerId
 * @param {String[]} attributes
 * @return {Promise} data - response is data.Item
 */
function _getAttributes(userId, attributes) {
    const params = {
        TableName: process.env.DYNAMO_DB_TABLE_NAME,
        Key: { user_id: userId },
        AttributesToGet: attributes,
    }
    return docClient.get(params).promise()
}

exports.default = _getAttributes
