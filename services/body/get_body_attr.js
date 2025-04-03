const docClient = require('../aws_config').getDocClient();

/**
 * get all body symptoms with @param userId
 *
 * @param {string} userId
 * @return {Promise} data - response is data.Attributes
 */

function _getBodyAttr (userId) {

    const params ={
        TableName: process.env.DYNAMO_DB_BODY_TABLE_NAME,
        Key: { user_id : userId },
        ReturnValues: 'UPDATED_NEW',
    }

    return docClient.get(params).promise()

}
exports.default = _getBodyAttr