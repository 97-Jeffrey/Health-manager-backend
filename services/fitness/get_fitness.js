const docClient = require('../aws_config').getDocClient();

/**
 * get fitness entry based on @param userId 
 *
 * @param {string} userId
 * @return {Promise} data - response is data.Attributes
 */

function _getFitness (userId) {

    const params ={
        TableName: process.env.DYNAMO_DB_FITNESS_TABLE_NAME,
        Key: { user_id : userId },
        ReturnValues: 'UPDATED_NEW',
    }

    return docClient.get(params).promise()

}
exports.default = _getFitness