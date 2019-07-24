const User = require("../models/user")
const Product = require("../models/product")
const Cart = require("../models/cart")
require("dotenv").config()
const { Storage } = require("@google-cloud/storage")
const bucketName = process.env.CLOUD_BUCKET
const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: process.env.KEYFILE_PATH
})

module.exports = {
  deleteUser(done) {
    User.deleteMany({})
      .then(() => {
        console.log('Users collection cleared!');
        done()
      })
      .catch(err => {
        console.log(err);
        done()
      });
  },
  deleteProduct(image, done){
    console.log("MASUK", image)
    return storage
      .bucket('hacktivgun.fildabert.com')
      .file(image)
      .delete()
      .then(() =>{
        return Product.deleteMany({})
          .then(() =>{
            console.log("Products collection cleared")
            done()
          })
          
      })
      .catch(err =>{
        console.log(err)
        done()
      })
  },
  deleteCart(done) {
    Cart.deleteMany({})
      .then(() =>{
        console.log("Carts collection cleared")
        done()
      })
      .catch(err =>{
        console.log(err)
        done()
      })
  },
  deleteImage(image, done) {
    console.log("MASUK")
    return storage
      .bucket('hacktivgun.fildabert.com')
      .file(image)
      .delete()
      .then(() =>{
        console.log("Bucket Image deleted")
        done()
      })
      .catch(err =>{
        console.log(err)
        done()
      })
  }
}