const { Router } = require("express");
const creatorRouter = Router();

const { CreatorModel, CourseModel } = require("../db")

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const { z } = require("zod")

// const pwd = "password"
// const hashedpassword = bcrypt.hash(pwd, 10)
// console.log(hashedpassword); // this does not work as this is a promise (pending)


const JSON_WEB_TOKEN = process.env.JSON_WEB_TOKEN;


creatorRouter.post('/signup', async (req, res) => {

    // added zod validation
    const reqBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(30),
        firstName: z.string().min(3).max(50),
        lastName: z.string().min(3).max(50)
    })
    // const parsedData = reqBody.parse(req.body);
    const { success, data, error } = reqBody.safeParse(req.body) // this is how reqBody and req.body talk with each other

    // how to show the user the exact error?
    if (!success) {
        res.json({
            message: "Incorrect Format",
            error: error.issues[0].message // TODO make errors better. reference: check zod docs
        })
        return
    }


    const { email, password, firstName, lastName } = req.body;

    // hash the password so that plaintext password is not stored in db
    const hashedPassword = await bcrypt.hash(password, 10)

    // put inside try catch block
    try {
        await CreatorModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })
        const token = jwt.sign({
            id: creatorRouter._id
        }, JSON_WEB_TOKEN);
        res.send({
            message: "Admin created successfully",
            token: token
        })
    } catch (e) {
        res.status(503).send({
            message: "Something went wrong while signing up!"
        })
    }

})

creatorRouter.post('/login', (req, res) => {

    res.send("Hi from creator get '/' endpoint")
})

creatorRouter.post('/courses', (req, res) => {

    res.send("Hi from creator get '/' endpoint")
})

creatorRouter.put('/courses/:courseId', (req, res) => {

    res.send("Hi from creator get '/' endpoint")
})

creatorRouter.get('/courses', (req, res) => {

    res.send("Hi from creator get '/' endpoint")
})


module.exports = {
    creatorRouter: creatorRouter
}