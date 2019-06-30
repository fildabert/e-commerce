const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const secret =  process.env.SECRET

class UserController{

    static register(req, res, next){
        var newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            balance: 0,
            admin: req.body.admin
        })
        return newUser.save()
        .then(created =>{
            const token = jwt.sign({_id: created._id, email: created.email, username: created.username, admin: created.admin}, secret, {expiresIn: "1h"})
            res.status(200).json({"access_token": token, _id: created._id, "username": created.username, "email": created.email, "admin": created.admin})
    
        })
        .catch(next)
    }

    static login(req, res, next){
        if(!req.body.email || !req.body.password){
            throw({
                code: 400,
                message: "Please fill in all the required fields"
            })
        }
        return User.findOne({email: req.body.email})
        .then(userFound =>{
            if(userFound){
                res.locals.userData = userFound
                return bcrypt.compare(req.body.password, userFound.password)
            }else{
                return false
            }
        })
        .then(valid =>{
            console.log(res.locals.userData)
            if(valid){
                console.log(res.locals.userData)
                const token = jwt.sign({_id: res.locals.userData._id, email: res.locals.userData.email, username: res.locals.userData.username, admin: res.locals.userData.admin}, secret, {expiresIn: "1h"})
                res.status(200).json({"access_token": token, _id: res.locals.userData._id, "username": res.locals.userData.username, "email": res.locals.userData.email, "admin": res.locals.userData.admin})
            }else{
                throw ({
                    code: 400,
                    message: "Invalid Email/Password"
                })
            }
        })
        .catch(next)
    }
    static googleLogin(req, res, next) {
        User.findOne({email: req.body.email})
        .then(userFound =>{
            if(userFound){
                console.log(userFound)
                const token = jwt.sign({_id: userFound._id, email: userFound.email, username: userFound.username, profilePicture: req.body.profilePicture, admin: userFound.admin}, secret, {expiresIn: "1h"})
                res.status(200).json({"access_token": token, _id: userFound._id, "username": userFound.username, "email": userFound.email, "admin": userFound.admin})
            }else{
                var newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    balance: 0,
                    admin: false
                })
                newUser.save()
                .then(created =>{
                    console.log(created)
                    const token = jwt.sign({_id: created._id, email: created.email, username: created.username, profilePicture: req.body.profilePicture, admin: created.admin}, secret, {expiresIn: "1h"})
                    res.status(200).json({"access_token": token, _id: created._id, "username": created.username, "email": created.email, "admin": userFound.admin})
                })
                .catch(next)
            }
        })
    }

}

module.exports = UserController