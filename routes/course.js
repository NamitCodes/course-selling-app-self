const { Router } = require("express");
const courseRouter = Router();

courseRouter.get("/", (req, res) => {
    res.send("Hi from course get '/' endpoint")
})

module.exports = {
    courseRouter: courseRouter
}