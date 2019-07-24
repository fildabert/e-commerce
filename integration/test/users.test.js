const chai = require("chai")
const chaiHttp = require("chai-http")
const { deleteUser } = require("../helpers/delete-all")

const app = require("../app")

chai.use(chaiHttp)

const expect = chai.expect;

var token = null

after(function(done){
    deleteUser(done);
})

describe("Users CRUD", function (){
    describe("Correct parameters", function(){
        describe("POST /register", function (){
            it("should send an object containing new registered user info with status code 201", function(done){
                chai.request(app)
                    .post("/users/register")
                    .send({
                        username: "filbert",
                        email: "filbert@mail.com",
                        password: "filbert",
                        admin: true
                    })
                    .then(function(res){
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property("access_token")
                        expect(res.body).to.have.property("_id")
                        expect(res.body).to.have.property("username")
                        expect(res.body).to.have.property("email")
                        expect(res.body).to.have.property("balance")
                        expect(res.body).to.have.property("admin")
                        done();
                    })
                    .catch(function(err){
                        console.log(err)
                    })
            })
        })
        describe("POST /login", function (){
            it("should send an object containing access_token with status code 200", function(done){
                chai.request(app)
                    .post("/users/login")
                    .send({
                        email: "filbert@mail.com",
                        password: "filbert"
                    })
                    .then(res =>{
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an("object")
                        expect(res.body).to.have.property("access_token")
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                    })
            })
        })
    })

    describe("Invalid parameters", function(){
        describe("POST /register", function (){
            it("should throw an error when email is invalid", function(done){
                chai.request(app)
                    .post("/users/register")
                    .send({
                        email: "filbert",
                        password: "filbert"
                    })
                    .then(res =>{
                        expect(res).to.have.status(400)
                        expect(res).to.have.property("error")
                        expect(res.body).to.equal("Invalid email input")
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                    })
            })
        })

        describe("POST /register", function (){
            it("should throw an error when email is duplicate", function(done){
                chai.request(app)
                    .post("/users/register")
                    .send({
                        email: "filbert@mail.com",
                        password: "filbert"
                    })
                    .then(res =>{
                        expect(res).to.have.status(400)
                        expect(res).to.have.property("error")
                        expect(res.body).to.equal(`email : "filbert@mail.com" already exist`)
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                    })
            })
            it("should throw an error when email is empty", function(done){
                chai.request(app)
                    .post("/users/register")
                    .send({
                        email: "",
                        password: "filbert"
                    })
                    .then(res =>{
                        expect(res).to.have.status(400)
                        expect(res).to.have.property("error")
                        expect(res.body).to.equal(`User validation failed: email: email is empty`)
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                    })
            })
            it("should throw an error when password is empty", function(done){
                chai.request(app)
                    .post("/users/register")
                    .send({
                        email: "filbert@mail.com",
                        password: ""
                    })
                    .then(res =>{
                        expect(res).to.have.status(400)
                        expect(res).to.have.property("error")
                        expect(res.body).to.equal(`User validation failed: password: password is empty`)
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                    })
            })
        })


        describe("POST /login", function(){
            it("should throw an error when email/password is incorrect", function(done){
                chai.request(app)
                    .post("/users/login")
                    .send({
                        email:"filbert@mail.com",
                        password: "wrongpassword"
                    })
                    .then(res =>{
                        expect(res).to.have.status(400)
                        expect(res).to.have.property("error")
                        expect(res.body).to.equal(`Invalid Email/Password`)
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                    })
            })

            it("should throw an error when email is empty", function(done){
                chai.request(app)
                    .post("/users/login")
                    .send({
                        email:"",
                        password: "wrongpassword"
                    })
                    .then(res =>{
                        expect(res).to.have.status(400)
                        expect(res).to.have.property("error")
                        expect(res.body).to.equal(`Please fill in all the required fields`)
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                    })
            })

            it("should throw an error when password is empty", function(done){
                chai.request(app)
                    .post("/users/login")
                    .send({
                        email:"filbert",
                        password: ""
                    })
                    .then(res =>{
                        expect(res).to.have.status(400)
                        expect(res).to.have.property("error")
                        expect(res.body).to.equal(`Please fill in all the required fields`)
                        done()
                    })
                    .catch(err =>{
                        console.log(err)
                    })
            })
        })

        
    })
})

