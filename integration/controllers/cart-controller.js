const Cart = require("../models/cart")
const mongoose = require("mongoose")

class CartController{
    static create(req, res, next) {
        Cart.findOne({userId: req.body.userId, product: req.body.product, status: false})
            .then(found =>{
                if(found){
                    console.log(found, "ASDASDASDJSA")
                    Cart.update({_id: found._id}, {$inc: { quantity: req.body.quantity }})
                    .then(updated =>{
                        res.status(201).json(updated)
                    })
                }else{
                    var newCart = new Cart({
                        status: false,
                        userId: req.body.userId,
                        product: req.body.product,
                        quantity: req.body.quantity,
                        checkoutDate: null
                    })
                    newCart.save()
                    .then(created =>{
                        res.status(201).json(created)
                       })
                }
            })
            .catch(next)
    }
    static findCart(req, res, next) {
        Cart.find({
            userId: req.query._id,
            status: false
        }).populate("userId").populate("product")
        .then(found =>{
            res.status(201).json(found)
        })
        .catch(next)
    }
    static updateCart(req, res, next) {
        Cart.updateMany({
            userId: req.body.userId,
            status: false,
        },{status: true, checkoutDate: req.body.checkoutDate})
        .then(updated =>{
            res.status(201).json(updated)
        })
        .catch(next)
    }
    static updateQuantity(req, res, next) {
        Cart.updateOne({_id: mongoose.Types.ObjectId(req.body._id)}, {quantity: req.body.quantity})
        .then(updated =>{
            res.status(201).json(updated)
        })
        .catch(next)
    }
    static deleteCart(req, res, next) {
        Cart.deleteOne({_id: req.query.id})
        .then(deleted =>{
            res.status(201).json(deleted)
        })
        .catch(next)
    }
    static getTransactions(req, res, next) {
        Cart.find({userId: req.query.userId, status: true}).populate("product")
         .then(transactions =>{
             res.status(200).json(transactions)
         })
         .catch(next)
    }
}

module.exports = CartController