const User = require("../models/user")
const Product = require("../models/product")
const Cart = require("../models/cart")

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
  deleteProduct(done){
    Product.deleteMany({})
      .then(() =>{
        console.log("Products collection cleared")
        done()
      })
      .catch(err =>{
        console.log(err)
        done()
      })
  },
  deleteCart(done) {
    Cart.deleteMany({})
      .then(() =>{
        console.log("Products collection cleared")
        done()
      })
      .catch(err =>{
        console.log(err)
        done()
      })
  }
}