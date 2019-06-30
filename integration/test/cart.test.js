const chai = require("chai")
const chaiHttp = require("chai-http")

const app = require("../app")
const { deleteCart } = require("../helpers/delete-all")

var productId = null

chai.use(chaiHttp)
const expect = chai.expect

after(function(done){
    deleteCart(done);
})

