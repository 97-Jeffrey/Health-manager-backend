const docClient = require('../aws_config').getDocClient()

/**
 * Get account information for user with userId = @param userId
 *
 * @param {String} userId
 * @return {Promise} data - response is data.Item
 */

const USER_ATTR = {
    email:'email',
    birthdate:"birthdate",
    name:'name',
    website: 'website',
    specialty:'specialty',
    phone_number: 'phone_number',
    address:'address',
    recipes: 'recipes'
}

const TYPE_LIST_ATTR =[
    'recipes'
]

function _updateAccount(userId, attribute, value, ADD_NEW=false) {

    console.log(userId, attribute, value);

    let date = new Date()

    let updateExp = 'SET last_updated_at = :timeNow, '
    let expAttrVals = {
        ':timeNow': date.toISOString(),
    }

    if (TYPE_LIST_ATTR.indexOf(attribute) !== -1 && ADD_NEW) {
        updateExp += `#attr = list_append(if_not_exists(#attr, :emptyList), :attr)`
        expAttrVals[':emptyList'] = []
        expAttrVals[':attr'] = [value]
    } else {
        updateExp += `#attr= :attr`
        expAttrVals[':attr'] = value
    }


    const params = {
        TableName: process.env.DYNAMO_DB_TABLE_NAME,
        Key: { user_id: userId },
        UpdateExpression: updateExp,
        ExpressionAttributeNames: {
            '#attr': USER_ATTR[attribute], // Map #attr to the actual attribute name
        },
        ExpressionAttributeValues: expAttrVals,
        ReturnValues: 'UPDATED_NEW',
    }
    return docClient.update(params).promise()
}

exports.default = _updateAccount