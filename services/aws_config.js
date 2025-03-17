const AWS = require('aws-sdk')

// Enabled for mocking DynamoDB tables
const isTest = process.env.JEST_WORKER_ID
const config = {
    convertEmptyValues: true,
    ...(isTest && {
        endpoint: 'localhost:8000',
        sslEnabled: false,
        region: 'local-env',
    }),
}

const docClient =
    process.env.NODE_ENV === 'production'
        ? new AWS.DynamoDB.DocumentClient()
        : new AWS.DynamoDB.DocumentClient(config)

const ses = new AWS.SES()

/**
 * Getter function for docClient object.
 *
 * @return {Object} Immutable docClient object
 */
function _getDocClient() {
    Object.freeze(docClient)
    return docClient
}

/**
 * Getter function for ses service object.
 *
 * @return {Object} Immutable ses service object
 */
function _getSES() {
    Object.freeze(ses)
    return ses
}

module.exports = {
    getDocClient: _getDocClient,
    getSES: _getSES,
}
