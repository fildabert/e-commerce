const mongoose = require("mongoose")
const encrypt = require("../helpers/encrypt")

const userSchema = new mongoose.Schema({
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
})

module.exports = mongoose.model("User", userSchema)