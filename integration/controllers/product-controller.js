const Product = require("../models/product")

class ProductController{

    static create(req, res, next){
        var newProduct = new Product({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            image: req.body.image,
            stock: req.body.stock
        })
        newProduct.save()
        .then(created =>{
            res.status(201).json(created)
        })
        .catch(next)
    }

    static findAll(req, res, next){
        Product.find({})
        .then(allProducts =>{
            res.status(200).json(allProducts)
        })
        .catch(next)
    }

    static update(req, res, next){
        return Product.update({_id: req.query.id},{
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            image: req.body.image,
            stock: req.body.stock
        })
        .then(updated =>{
            return Product.findOne({_id: req.query.id})
        })
        .then(updated =>{
            res.status(200).json(updated)
        })
        .catch(next)
    }

    static delete(req, res, next){
        return Product.deleteOne({_id: req.query.id})
        .then(deleted =>{
            res.status(200).json(deleted)
        })
        .catch(next)
    }
}

module.exports = ProductController