const User = require("../models/user")
const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    var decoded = jwt.decode(req.headers.token)
    if(decoded.admin){
        next()
    }else{
        throw ({
            code: 401,
            message: "Access Denied: Unauthorized"
        })
    }
}
