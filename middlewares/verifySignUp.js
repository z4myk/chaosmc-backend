const Role = require("../models/role")
const User = require("../models/user");

const checkDuplicateEmail = async (req, res, next) => {
    const email = await User.findOne({email: req.body.email})
    if(email) return res.status(400).json({message: 'The email already exists'})
    next();
}

module.exports = {
    checkDuplicateEmail,   
}