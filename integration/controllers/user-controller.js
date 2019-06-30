const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secret =  "RAHASIA"

class UserController{

    static register(req, res, next){
        var newUser = new User({
            email: req.body.email,
            password: req.body.password,
            balance: 0,
            admin: req.body.admin
        })
        return newUser.save()
        .then(created =>{
            res.status(201).json(created)
        })
        .catch(next)
    }

    static login(req, res, next){
        return User.findOne({email: req.body.email})
        .then(userFound =>{
            res.locals.userData = userFound
            return bcrypt.compare(req.body.password, userFound.password)
        })
        .then(valid =>{
            if(valid){
                const token = jwt.sign({_id: res.locals.userData._id, email: res.locals.userData.email}, secret, {expiresIn: "1h"})
                res.status(200).json({"access_token": token})
            }else{
                throw ({
                    code: 400,
                    message: "Invalid Email/Password"
                })
            }
        })
        .catch(next)
    }

}

module.exports = UserController