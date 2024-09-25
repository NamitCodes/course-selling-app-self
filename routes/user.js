const { Router } = require("express");
const userRouter = Router()

userRouter.get("/", (req, res) => {
    res.send("Hello from userRouter get'/' endpoint")
})

module.exports = {
    userRouter: userRouter
}
