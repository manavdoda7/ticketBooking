const jwt = require('jsonwebtoken')
const User = require('../models/index').client
const db = require('./dbconnection')
require('dotenv').config()

const checkAuth = async(req, res, next) => {
    let token
    try {
        token = req.headers.authorization.split(" ")[1]
    } catch(err) {
        console.log('Token fetch error', err);
        return res.status(404).json({success:false, error:"token not found"})
    }
    // console.log(token);
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_USER)
        req.userData = decode
        let user = await User.findAll({
            where:{
                email:decode.email
            }
        })
        if(user.length==0) return res.status(400).json('You\'re not authorised.')
        next()
    } catch(err) {
        console.log('JWT Token verification failed.', err);
        return res.status(401).json({success: true, error: "You're not authorized."})
    }
}
module.exports = checkAuth