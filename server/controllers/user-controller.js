const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const secret =  process.env.SECRET
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '58857443225-5c2ubp38j7cpjhhukju5qebolnqg2nm5.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

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
            const token = jwt.sign({_id: created._id, email: created.email, username: created.username, admin: created.admin, balance: created.balance}, secret, {expiresIn: "6h"})
            res.status(200).json({"access_token": token, _id: created._id, "username": created.username, "email": created.email, "admin": created.admin, balance: created.balance})
    
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
                const token = jwt.sign({_id: res.locals.userData._id, email: res.locals.userData.email, username: res.locals.userData.username, admin: res.locals.userData.admin, balance: user.balance}, secret, {expiresIn: "6h"})
                res.status(200).json({"access_token": token, _id: res.locals.userData._id, "username": res.locals.userData.username, "email": res.locals.userData.email, "admin": res.locals.userData.admin, balance: res.locals.userData.balance})
            }else{
                throw ({
                    code: 400,
                    message: "Invalid Email/Password"
                })
            }
        })
        .catch(next)
    }

    static googleLogin (req, res, next) {
        var payload = null
        client.verifyIdToken({
            idToken: req.body.code,
            audience: CLIENT_ID
        })
        .then(ticket =>{
            payload = ticket.getPayload()
            return User.findOne({email: payload.email})
        })
        .then(user =>{
            if(user){
                return user
            } else {
                var newuser = new User({
                    username: payload.name,
                    email: payload.email,
                    password: payload.jti,
                    balance: 0,
                    admin: false
                })
                return newuser.save()
            }
        })
        .then(user =>{
            const token = jwt.sign({_id: user._id, username: user.username, email: user.email, profilePicture: payload.picture, admin: user.admin, balance: user.balance}, secret, {expiresIn: "6h"})
            res.status(200).json({access_token: token, _id: user._id, username: user.username, email: user.email, profilePicture: payload.picture, admin: user.admin, balance: user.balance})
        })
        .catch(next)
    }

    static topUp(req, res, next) {
        User.findOne({_id: req.headers.decoded._id})
        .then(user =>{
            user.balance += +req.body.balance
            return user.save()
        })
        .then(user =>{
            res.status(200).json(user)
        })
        .catch(next)
    }

    static getBalance(req, res, next) {
        User.findOne({_id: req.headers.decoded._id})
        .then(user =>{
            res.status(200).json(user.balance)
        })
        .catch(next)
    }
}

module.exports = UserController
