const express = require("express")
const router = express.Router()
const userController = require("../controllers/user-controller")
const authenticate = require("../middlewares/authenticate")


router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/googlelogin", userController.googleLogin)
router.patch("/topup", authenticate, userController.topUp)
router.get("/getBalance", authenticate, userController.getBalance)


module.exports = router