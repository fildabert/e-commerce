const chai = require("chai")
const chaiHttp = require("chai-http")
const fs = require("fs")

var image = fs.readFileSync("./test/mp-5.png")
var imageName = null

const app = require("../app")
const { deleteProduct, deleteImage } = require("../helpers/delete-all")
var token = null

var productId = null

chai.use(chaiHttp)
const expect = chai.expect

after(function(done){
    deleteProduct(imageName, done);
    // deleteImage(imageName, done)
})

// chai.request(app)
//     .post("/users/register")
//     .send({
//         username: "filbert2",
//         email: "filbert2@mail.com",
//         password: "filbert2"
//     })
//     .then(res =>{
//         token = res.body.access_token
//     })
//     .catch(err =>{
//         console.log(err)
//     })


    describe("Products CRUD", function() {
        describe("Correct Parameters", function() {
            describe("POST /add", function() {
                it.only("should send an object containing new registered product info with status code 201", function(done) {
                    this.timeout(60000)
                    chai.request(app)
                        .post("/products/add")
                        .attach("image", image, "mp-5.png")
                        .field("title", "Product Title1")
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

            describe("GET /all", function() {
                it.only("should get all product data", function(done) {
                    chai.request(app)
                        .get("/products/all")
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

            describe("PUT /edit", function() {
                it.only("should send an object containing updated product with status code 200", function(done) {
                    this.timeout(60000)
                    chai.request(app)
                        .put(`/products/edit/${productId}`)
                        .attach("image", fs.readFileSync("./test/rickk.jpeg"), "rickk.jpeg")
                            .field("title", "Product Title")
                            .field("description", "Product Description")
                            .field("price", '1000')
                            .field("weaponType", "Assault Rifle")
                            .field("stock", '5')
                        .then(res =>{
                            var imageUrl = res.body[0].image.split("/")
                            imageName = imageUrl[imageUrl.length-1]
                            // console.log(imageName)
                            expect(res.body).to.be.an("array")
                            expect(res.body[0]).to.be.an("object")
                            expect(res).to.have.status(200)
                            expect(res.body[0]).to.have.property("title")
                            expect(res.body[0]).to.have.property("description")
                            expect(res.body[0]).to.have.property("image")
                            expect(res.body[0]).to.have.property("price")
                            expect(res.body[0]).to.have.property("weaponType")
                            expect(res.body[0]).to.have.property("stock")
                            done()
                        })
                        .catch(err =>{
                            console.log(err)
                        })
                })

                it.only("should send an object containing updated product with status code 200(not updating image here)", function(done) {
                    this.timeout(60000)
                    chai.request(app)
                        .put(`/products/edit/${productId}`)
                        .attach("image", "", "rickk.jpeg")
                        .field("title", "Edited Title")
                        .field("description", "Edited Description")
                        .field("price", '2000')
                        .field("weaponType", "Assault Rifle")
                        .field("stock", '10')
                    .then(res =>{
                        expect(res.body).to.be.an("array")
                        expect(res.body[0]).to.be.an("object")
                        expect(res).to.have.status(200)
                        expect(res.body[0]).to.have.property("title")
                        expect(res.body[0]).to.have.property("description")
                        expect(res.body[0]).to.have.property("image")
                        expect(res.body[0]).to.have.property("price")
                        expect(res.body[0]).to.have.property("weaponType")
                        expect(res.body[0]).to.have.property("stock")
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                        done()
                    })
                })
            })

            describe("PATCH /editquantity", function() {
                it.only("should reduce the stock of the product", function(done) {
                    chai.request(app)
                        .patch(`/products/editquantity/${productId}`)
                        .send({
                            quantity: 2
                        })
                        .then(res =>{
                            expect(res).to.have.status(200)
                            expect(res.body).to.have.property("title")
                            expect(res.body).to.have.property("description")
                            expect(res.body).to.have.property("image")
                            expect(res.body).to.have.property("price")
                            expect(res.body).to.have.property("weaponType")
                            expect(res.body).to.have.property("stock")
                            expect(res.body.stock).to.equal(8)
                            done()
                        })
                        .catch(err =>{
                            console.log(err)
                            done()
                        })
                })
            })

            describe("DELETE /delete/:id", function() {
                it.only("should delete selected product", function(done) {
                    chai.request(app)
                        .delete(`/products/delete/${productId}`)
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

// describe("Products CRUD", function (){
//     describe("Correct parameters", function(){
//         describe("POST /add", function (){
//             it("should send an object containing new registered product info with status code 201", function(done){
//                 chai.request(app)
//                     .post("/products/add")
//                     .send({
//                         title: "Product 1",
//                         description: "Product 1 Description",
//                         price: "10000",
//                         image: "Image Link Here",
//                         stock: 4,
//                         type: "Assault Rifle"
//                     })
//                     .then(res =>{
//                         expect(res).to.have.status(201)
//                         expect(res.body).to.be.an("object")
//                         expect(res.body).to.have.property("title")
//                         expect(res.body).to.have.property("description")
//                         expect(res.body).to.have.property("price")
//                         expect(res.body).to.have.property("image")
//                         expect(res.body).to.have.property("stock")
//                         expect(res.body).to.have.property("weaponType")
//                         productId = res.body._id
//                         console.log(productId)
//                         console.log(token)
//                         done()
//                     })
//                     .catch(err =>{
//                         console.log(err)
//                     })
//             })
//         })
//         describe("GET /all", function (){
//             it("should send an array of objects containing all products with status code 200", function(done){
//                 chai.request(app)
//                     .get("/products/all")
//                     .then(res =>{
//                         expect(res).to.have.status(200)
//                         expect(res.body).to.be.an("array")
//                         done()
//                     })
//                     .catch(err =>{
//                         console.log(err)
//                     })
//             })
//         })
//         describe("PUT /edit", function (){
//             it("should send an object containing latest updated product with status code 200", function(done){
//                 chai.request(app)
//                     .put(`/products/edit?id=${productId}`)
//                     .send({
//                         title: "Edited Product 1",
//                         description: "Edited Product 1 Description",
//                         price: "20000",
//                         image: "Edited Image Link Here",
//                         stock: 10,
//                         type: "SMG" 
//                     })
//                     .then(res =>{
//                         expect(res).to.have.status(200)
//                         expect(res.body).to.be.an("object")
//                         expect(res.body.title).to.equal("Edited Product 1")
//                         expect(res.body.description).to.equal("Edited Product 1 Description")
//                         expect(res.body.price).to.equal(20000)
//                         expect(res.body.image).to.equal("Edited Image Link Here")
//                         expect(res.body.stock).to.equal(10)
//                         done()
//                     })
//                     .catch(err =>{
//                         console.log(err)
//                     })
    
//             })
//         })
//         describe("DELETE /delete", function (){
//             it("should send an object with status code 200", function(done){
//                 chai.request(app)
//                     .delete(`/products/delete?id=${productId}`)
//                     .then(res =>{
//                         // console.log(productId, "=====================")
//                         expect(res).to.have.status(200)
//                         expect(res.body).to.be.an("object")
//                         expect(res.body).to.have.property("deletedCount")
//                         expect(res.body.deletedCount).to.equal(1)
//                         done()
//                     })
//                     .catch(err =>{
//                         console.log(productId, "=====================")
//                         console.log(err)
//                     })
//             })
//         })
//     })

    // describe("Error when user tries to access Products CRUD without a valid token", function(){
    //     it("should throw an error with status code 401", function(){

    //     })
    // })

    // describe("Invalid parameters", function(){
    //     describe("POST /add", function(){
    //         it("should throw an error when one of the required fields are not filled", function(){
    //             chai.request(app)
    //                 .post("/products/add")
    //                 .send({
    //                     title: "",
    //                     description: "Product 1 Description",
    //                     price: "10000",
    //                     image: "Image Link Here",
    //                     stock: 4
    //                 })
    //                 .then(res =>{
    //                     expect(res).to.have.status(400)
    //                     expect(res.body).to.equal("Product validation failed: title: Product Title cannot be empty")
    //                     // done()
    //                 })
    //                 .catch(err =>{
    //                     console.log(err)
    //                 })
    //         })
    //     })
    // })
// })