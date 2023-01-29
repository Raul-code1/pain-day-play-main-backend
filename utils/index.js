const checkPermissions = require('./checkPermissions')
const { createToken }=require('./jwt')

module.exports={
    createToken,
    checkPermissions
}

