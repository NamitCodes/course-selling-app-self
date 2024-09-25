const { Router } = require("express");
const creatorRouter = Router();

creatorRouter.get('/signup', (req, res) => {
    
    res.send("Hi from creator get '/' endpoint")
})

module.exports = {
    creatorRouter: creatorRouter
}