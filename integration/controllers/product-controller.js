const Product = require("../models/product")
const Cart = require("../models/cart")
require("dotenv").config()
const { Storage } = require("@google-cloud/storage")
const bucketName = process.env.CLOUD_BUCKET
const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: process.env.KEYFILE_PATH
})



class ProductController {

    static create(req, res, next) {
        var newProduct = new Product({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            weaponType: req.body.weaponType,
            image: req.file.cloudStoragePublicUrl,
            stock: req.body.stock
        })
        newProduct.save()
            .then(created => {
                res.status(201).json(created)
            })
            .catch(next)
    }

    static findAll(req, res, next) {
        Product.find({})
            .then(allProducts => {
                res.status(200).json(allProducts)
            })
            .catch(next)
    }

    static update(req, res, next) {
        // var arr = req.body.image.split("/")
        Product.findOne({_id: req.params.id})
        .then(product =>{
            if(req.file === undefined) {
                product.title = req.body.title
                product.description = req.body.description
                product.price = req.body.price
                product.weaponType = req.body.weaponType
                product.stock = req.body.stock
                console.log(product)
                var promises = []
                promises.push(product.save())
                return Promise.all(promises)
            } else {
                var promises = []
                var imageUrl = product.image.split("/")
                var imageName = imageUrl[imageUrl.length -1]
                product.title = req.body.title
                product.description = req.body.description
                product.price = req.body.price
                product.weaponType = req.body.weaponType
                product.image = req.file.cloudStoragePublicUrl
                product.stock = req.body.stock
                promises.push(product.save())
                promises.push(storage
                    .bucket('hacktivgun.fildabert.com')
                    .file(imageName)
                    .delete())
                return Promise.all(promises)  
            }
        })
        .then(product =>{
            res.status(200).json(product)
        })
        .catch(next)

        // if (arr[arr.length - 1] === req.body.previousImage) {
        //     return new Promise((resolve, reject) => {
        //         resolve()
        //     })
        //         .then(() => {
        //             return Product.update({ _id: req.params.id }, {
        //                 title: req.body.title,
        //                 description: req.body.description,
        //                 price: req.body.price,
        //                 weaponType: req.body.weaponType,
        //                 image: req.body.image,
        //                 stock: req.body.stock
        //             })
        //         })
        //         .then(updated => {
        //             return Product.findOne({ _id: req.params.id })
        //         })
        //         .then(updated => {
        //             res.status(200).json(updated)
        //         })
        // }
        // return storage
        //     .bucket('hacktivgun.fildabert.com')
        //     .file(req.body.previousImage)
        //     .delete()
        //     .then(() => {
        //         return Product.update({ _id: req.params.id }, {
        //             title: req.body.title,
        //             description: req.body.description,
        //             price: req.body.price,
        //             weaponType: req.body.weaponType,
        //             image: req.body.image,
        //             stock: req.body.stock
        //         })
        //     })
        //     .then(updated => {
        //         return Product.findOne({ _id: req.params.id })
        //     })
        //     .then(updated => {
        //         res.status(200).json(updated)
        //     })
        //     .catch(next)
    }

    static delete(req, res, next) {
        Cart.deleteMany({ product: req.params.id, status: false })
            .then(deleted => {
                return Product.deleteOne({ _id: req.params.id })
            })
            .then(deleted => {
                res.status(200).json(deleted)
            })
            .catch(next)
    }

    static decrement(req, res, next) {
        Product.findOne({_id: req.params.id})
        .then(product =>{
            if((product.stock - req.body.quantity) < 0) {
                throw({
                    code: 400,
                    message: `Sorry, ${product.title} is out of stock, please contact our staffs`
                })
            }
            product.stock -= +req.body.quantity
            return product.save()
        })
        .then(product =>{
            res.status(200).json(product)
        })
        .catch(next)
        // return Product.update({ _id: req.body.id }, {
        //     $inc: { stock: -req.body.quantity }
        // })
        //     .then(updated => {
        //         console.log(updated)
        //         res.status(200).json(updated)
        //     })
        //     .catch(next)
    }
}

module.exports = ProductController
