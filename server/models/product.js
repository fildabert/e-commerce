const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Product Title cannot be empty"],
        unique: [true, "Product is already registered in our database"]
    },
    description:{
        type: String,
        required: [true, "Product description is empty"]
    },
    price:{
        type: Number,
        required: [true, "Product price cannot be empty"]
    },
    weaponType: {
        type: String,
        required: [true, "Product type cannot be empty"]
    },
    image:{
        type: String,
        required: [true, "Product image cannot be empty"]
    },
    stock:{
        type: Number,
        min: 0
    }
})

module.exports = mongoose.model("Product", productSchema)