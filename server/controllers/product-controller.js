const Product = require("../models/product")
const Cart = require("../models/cart")
require("dotenv").config()
const { Storage } = require("@google-cloud/storage")
const bucketName = process.env.CLOUD_BUCKET
const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: process.env.KEYFILE_PATH
            })


class ProductController{

    static create(req, res, next){
        var newProduct = new Product({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            weaponType: req.body.weaponType,
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
var arr = req.body.image.split("/")
	console.log(arr[arr.length-1] === req.body.previousImage, "==============================")
	if(arr[arr.length-1] === req.body.previousImage) {
	return new Promise((resolve, reject) =>{
	resolve()
	})
	 .then(() =>{
            return Product.update({_id: req.body.id},{
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                weaponType: req.body.weaponType,
                image: req.body.image,
                stock: req.body.stock
            })
        })
        .then(updated =>{
            return Product.findOne({_id: req.query.id})
        })
        .then(updated =>{
            res.status(200).json(updated)
        })
	}

 
	
	return storage
        .bucket('hacktivgun.fildabert.com')
        .file(req.body.previousImage)
        .delete()
        .then(() =>{
            return Product.update({_id: req.body.id},{
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                weaponType: req.body.weaponType,
                image: req.body.image,
                stock: req.body.stock
            })
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
        Cart.deleteMany({product: req.query.id, status: false})
        .then(deleted =>{
            return Product.deleteOne({_id: req.query.id})
        })
        .then(deleted =>{
            res.status(200).json(deleted)
        })
        .catch(next)
    }

    static decrement(req, res, next){
        console.log("MASUK")
        return Product.update({_id: req.body.id},{
          $inc: { stock: -req.body.quantity}  
        })
        .then(updated =>{
            console.log(updated)
            res.status(200).json(updated)
        })
        .catch(next)
    }
}

module.exports = ProductController
