const chai = require("chai")
const chaiHttp = require("chai-http")

const app = require("../app")
const { deleteCart } = require("../helpers/delete-all")
const fs = require("fs")

var token = null

var productId = null
var cartId = null

chai.use(chaiHttp)
const expect = chai.expect

after(function(done){
    deleteCart(done);
})

describe("Cart CRUD", function() {
    describe("Correct Parameters", function() {
        describe("Dummy user for cart", function() {
            it("should get user JWT token", function(done) {
                chai.request(app)
                    .post("/users/register")
                    .send({
                        username: "filbert303",
                        email: "filbert303@mail.com",
                        password: "filbert303",
                        admin: true
                    })
                    .then(res =>{
                        // console.log(res.body)
                        token = res.body.access_token
                        expect(res).to.have.status(200)
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                        done()
                    })
            })

            it("should top up the balance of the user", function(done) {
                chai.request(app)
                    .patch("/users/topup")
                    .set("token", token)
                    .send({
                        balance: 6000
                    })
                    .then(res =>{
                        // console.log(res.body)
                        expect(res).to.have.status(200)
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                        done()
                    })
            })
        })
        describe("Dummy product for cart", function() {
            it("should send an object containing new registered product info with status code 201", function(done) {
                this.timeout(60000)
                // console.log(token)
                chai.request(app)
                    .post("/products/add")
                    .set("token", token)
                    .attach("image", fs.readFileSync("./test/mp-5.png"), "mp-5.png")
                    .field("title", "Product Title123")
                    .field("description", "Product Description")
                    .field("price", '1000')
                    .field("weaponType", "Assault Rifle")
                    .field("stock", '5')
                  .then(res =>{
                    expect(res.body).to.be.an("object")
                    expect(res).to.have.status(201)
                    expect(res.body).to.have.property("title")
                    expect(res.body).to.have.property("description")
                    expect(res.body).to.have.property("image")
                    expect(res.body).to.have.property("price")
                    expect(res.body).to.have.property("weaponType")
                    expect(res.body).to.have.property("stock")
                    var imageUrl = res.body.image.split("/")
                    imageName = imageUrl[imageUrl.length-1]
                    productId = res.body._id
                    done()
                  })
                  .catch(err =>{
                      console.log(err)
                  })
            })
        })

        describe("Adding new items into cart", function() {
            it("should add product into cart and return status code 201", function(done) {
                chai.request(app)
                    .post("/carts/add")
                    .set("token", token)
                    .send({
                        product: productId,
                        quantity: 2              
                    })
                .then(res =>{
                    cartId = res.body._id
                    expect(res).to.have.status(201)
                    expect(res.body).to.have.property("status")
                    expect(res.body.status).to.equal("ordered")
                    expect(res.body).to.have.property("userId")
                    expect(res.body).to.have.property("product")
                    expect(res.body).to.have.property("quantity")
                    expect(res.body).to.have.property("checkoutDate")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })

        describe("Get user's cart", function() {
            it("should get the cart data of current logged in user", function(done) {
                chai.request(app)
                    .get("/carts/all")
                    .set("token", token)
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("array")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })

        describe("Updating the quantity of an item in cart", function() {
            it("should update the quantity of an item in cart", function(done) {
                chai.request(app)
                    .put("/carts/updatequantity")
                    .set("token", token)
                    .send({
                        _id: cartId,
                        quantity: 5
                    })
                .then(res =>{
                    // console.log(res.body)
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("object")
                    expect(res.body.product.stock - res.body.quantity).to.gte(0)
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })

        describe("Cart Checkout", function() {
            it("should update the status of cart to pending", function(done) {
                chai.request(app)
                    .put("/carts/updatestatus")
                    .set("token", token)
                    .send({
                        
                    })
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("array")
                    expect(res.body[0].status).to.equal("pending")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })

        
        describe("Get all transactions with status pending as an admin", function() {
            it("should return all pending transactions", function(done) {
                chai.request(app)
                    .get(`/carts/transactions/admin`)
                    .set("token", token)
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("array")
                    expect(res.body[0].status).to.equal("pending")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })

        

        describe("Updating the status of an order as an admin", function() {
            it("should update the status of an order from pending to sent", function(done) {
                chai.request(app)
                    .patch(`/carts/transactions/admin`)
                    .set("token", token)
                    .send({
                        id: cartId,
                        status: "sent"
                    })
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("object")
                    expect(res.body.status).to.equal("sent")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })

            })
        })

        describe("Get transactions by status type", function() {
            it("should return all transactions with status type sent", function(done) {
                chai.request(app)
                    .get(`/carts/transactions/sent`)
                    .set("token", token)
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("array")
                    expect(res.body[0].status).to.equal("sent")
                    // console.log(res.body)
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })

        describe("Updating the status of and order as a user", function() {
            it("should update the status of an order from sent to received", function(done) {
                chai.request(app)
                    .patch("/carts/transactions/complete")
                    .set("token", token)
                    .send({
                        id: cartId,
                        status: "received"
                    })
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an("object")
                    expect(res.body.status).to.equal("received")
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })
        
        
        describe("Delete Cart", function() {
            it("should delete the selected cart", function(done) {
                chai.request(app)
                    .delete(`/carts/delete?id=${cartId}`)
                    .set("token", token)
                .then(res =>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.property("deletedCount")
                    expect(res.body.deletedCount).to.equal(1)
                    done()
                })
                .catch(err =>{
                    console.log(err)
                    done()
                })
            })
        })    
    })


    
})

