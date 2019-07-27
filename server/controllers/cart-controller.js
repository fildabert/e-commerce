const Cart = require("../models/cart")
const User = require("../models/user")
const Product = require("../models/product")
const mongoose = require("mongoose")

class CartController{
    static create(req, res, next) {
        Product.findOne({_id: req.body.product})
            .then(product =>{
                if((product.stock - 1) < 0) {
                    throw({
                        code: 400,
                        message: `Sorry,${product.title} is out of stock`
                    })
                }
                return Cart.findOne({userId: req.headers.decoded._id, product: req.body.product, status: 'ordered'})
            })
            .then(found =>{
                if(found){
                    console.log(found, "ASDASDASDJSA")
                    Cart.update({_id: found._id}, {$inc: { quantity: req.body.quantity }})
                    .then(updated =>{
                        res.status(201).json(updated)
                    })
                }else{
                    var newCart = new Cart({
                        status: 'ordered',
                        userId: req.headers.decoded._id,
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
            userId: req.headers.decoded._id,
            status: 'ordered',
        }).populate("userId").populate("product")
        .then(found =>{
            res.status(200).json(found)
        })
        .catch(next)
    }


    static updateCart(req, res, next) { //CHECKOUT
        var totalPrice = null
        var promises = []
        Cart.find({userId: req.headers.decoded._id, status: "ordered"}).populate("product").populate("userId")
        .then(carts =>{
            carts.forEach(cart =>{
                totalPrice += (cart.product.price * cart.quantity)
                if((cart.product.stock - cart.quantity) < 0) {
                    throw({
                        code: 400,
                        message: `Sorry, ${cart.product.title} is out of stock`
                    })
                }
            })
            if((carts[0].userId.balance - totalPrice) >= 0){
                carts.forEach(cart =>{
                    cart.status = "pending"
                    cart.checkoutDate = new Date()
                    promises.push(cart.save())
                })
            }else {
                throw ({
                    code: 400,
                    message: "Your balance is not enough, please top up to continue"
                })
            }
            return User.findOne({_id: req.headers.decoded._id})
        })
        .then(user =>{
            user.balance -= +totalPrice
            promises.push(user.save())
            return Promise.all(promises)
            
        })
        .then(result =>{
            res.status(200).json(result)
        })
        .catch(next)




        // Cart.updateMany({
        //     userId: req.headers.decoded._id,
        //     status: req.body.status,
        // },{status: req.body.newStatus, checkoutDate: req.body.checkoutDate})
        // .then(updated =>{
        //     res.status(201).json(updated)
        // })
        // .catch(next)
    }
    static updateQuantity(req, res, next) {
        Cart.findOne({_id: req.body._id}).populate("product")
        .then(cart =>{
            // console.log(cart, req.body.quantity)
            if((cart.product.stock - req.body.quantity) >= 0) {
                cart.quantity = req.body.quantity
                return cart.save()
            }else {
                throw({
                    code: 400,
                    message: "Product is out of stock"
                })
            }
        })
        .then(cart =>{
            res.status(200).json(cart)
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
        Cart.find({userId: req.headers.decoded._id, status: req.params.status}).populate("product")
         .then(transactions =>{
             res.status(200).json(transactions)
         })
         .catch(next)
    }

    static getAllPendingTransactions(req, res, next) {
        // console.log("HELLO???????????????????")
        Cart.find({status: "pending"}).populate("product").populate("userId")
        .then(carts =>{
            console.log(carts)
            res.status(200).json(carts)
        })
        .catch(next)
    }
    
    static updateTransactions(req, res, next) {
        Cart.findOne({_id: req.body.id})
        .then(cart =>{
            cart.status = req.body.status
            return cart.save()
        })
        .then(cart =>{
            res.status(200).json(cart)
        })
        .catch(next)
    }
}

module.exports = CartController