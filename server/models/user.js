const mongoose = require("mongoose")
const encrypt = require("../helpers/encrypt")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, "username is empty"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is empty"],
        unique: [true, "email is already taken"]
    },
    password: {
        type: String,
        required: [true, "password is empty"]
    },
    balance: {
        type: Number
    },
    admin:{
        type: Boolean
    }
})

userSchema.pre("save", function(next){
    if(this.isNew){
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(re.test(this.email)){
            this.password = encrypt(this.password)
            next()
        }else{
            throw ({
                code: 400,
                message: "Invalid email input"
            })
        }
    } else {
        next()
    }
})

module.exports = mongoose.model("User", userSchema)