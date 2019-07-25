const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;


const CartSchema = new mongoose.Schema({
    status:{
        type: String,
        required: [true, "Status cannot be empty"]
    },
    userId: {
        type: ObjectId,
        ref: "User"
    },
    product: {
        type: ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
    },
    checkoutDate: {
        type: Date
    }
})

module.exports = mongoose.model("Cart", CartSchema)