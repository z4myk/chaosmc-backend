const {verifyToken, isAdmin, renewToken} = require('./authJwt');
const {checkDuplicateEmail} = require('./verifySignUp');
module.exports = 
    {verifyToken, isAdmin, renewToken, checkDuplicateEmail}; 