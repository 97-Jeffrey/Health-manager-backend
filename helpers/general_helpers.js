/**
 * @description This file contains some general helper functions.
 */

/** Constants declaration */
const CAN_STATES = [
    'AB',
    'BC',
    'MB',
    'NB',
    'NL',
    'NT',
    'NS',
    'NU',
    'ON',
    'PE',
    'QC',
    'SK',
    'YT',
]
const USA_STATES = [
    'AL',
    'AK',
    'AS',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'DC',
    'FM',
    'FL',
    'GA',
    'GU',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MH',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'MP',
    'OH',
    'OK',
    'OR',
    'PW',
    'PA',
    'PR',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VI',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
]
const FgRed = ';\x1b[31m'
const FgCyan = '\x1b[36m'





/**
 * Check if userid in jwtToken is same as practitionerId
 *
 * @param {Object} req - Request object
 * @return {Boolean} True if practitioner is valid, otherwise false
 */
function _validateUser(req) {

    const { userId } = req.params
    const { username } = req.user
    return userId === username
}



/**
 * Print error to the console.
 *
 * @param {String} resourceType
 * @param {String} namespace
 * @param {String} funcName
 * @param {*} err
 * @param {Boolean} formatError
 */
function _printError(
    resourceType,
    namespace,
    funcName,
    err,
    formatError = false
) {
    if (!formatError)
        console.log(
            FgRed,
            `${resourceType}::${namespace}::${funcName}::error - ${JSON.stringify(
                err
            )}`
        )
    else
        console.log(
            FgRed,
            `${resourceType}::${namespace}::${funcName}::error - ${JSON.stringify(
                err,
                null,
                2
            )}`
        )
}

/**
 * Print info to the console.
 *
 * @param {String} resourceType
 * @param {String} namespace
 * @param {String} funcName
 * @param {*} info
 * @param {Boolean} detailInfo
 */
function _printInfo(
    resourceType,
    namespace,
    funcName,
    info,
    detailInfo = false
) {
    if (!detailInfo)
        console.log(
            FgCyan,
            `${resourceType}::${namespace}::${funcName}::success`
        )
    else
        console.log(
            FgCyan,
            `${resourceType}::${namespace}::${funcName}::success - ${JSON.stringify(
                info,
                null,
                2
            )}`
        )
}


module.exports = {
    validateUser: _validateUser,
    printError: _printError,
    printInfo: _printInfo
}

