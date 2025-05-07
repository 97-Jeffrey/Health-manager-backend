const docClient = require('../aws_config').getDocClient();

/**
 * get all hydrations with @param userId
 *
 * @param {string} userId
 * @return {Promise} data - response is data.Attributes
 */

function _getHydrations (userId) {

    const params ={
        TableName: process.env.DYNAMO_DB_MEAL_TABLE_NAME,
        Key: { user_id : userId },
        ReturnValues: 'UPDATED_NEW',
    }

    return docClient.get(params).promise()

}
exports.default = _getHydrations