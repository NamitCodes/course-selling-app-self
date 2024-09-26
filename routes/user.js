const { Router } = require("express");
const { UserModel, CourseModel } = require("../db");
const userRouter = Router()

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const { z } = require("zod")

const JSON_SECRET_KEY = process.env.JSON_SECRET_KEY;
const { cookieJWTAuth } = require("../middleware/creatorMiddleware");


userRouter.post("/signup", async (req, res) => {
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
        await UserModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })
        const token = jwt.sign({
            id: userRouter._id
        }, JSON_SECRET_KEY);

        // what to do with this TOKEN now? Isn't this redundant in signup?
        res.send({
            message: "User created successfully",
            token: token
        })
    } catch (e) {
        res.status(503).send({
            message: "Something went wrong while signing up!"
        })
    }

})

userRouter.post("/login", async (req, res) => {
    const email = req.headers.email;
    const password = req.headers.password;

    const user = await UserModel.findOne({
        email: email
    })

    if (bcrypt.compare(password, user.password)) {
        const token = jwt.sign({
            id: user._id
        }, JSON_SECRET_KEY, { expiresIn: "1h" })

        // store this token in a cookie
        res.cookie("token", token, {
            httpOnly: true
        })

        res.json({
            message: "Logged in successfully",
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

userRouter.get("/courses", cookieJWTAuth, async (req, res) => {
    const response = await CourseModel.find({})
    res.json({
        courses: response
    })
})

userRouter.post("/courses/:courseId", cookieJWTAuth, async (req, res) => { // purchases a course
    const { courseId } = req.params;
    const { id } = req.body;

    try {
        await UserModel.updateOne(
            { _id: id },
            { $push: { purchasedCourses: courseId } }
        ).then(
            res.json({
                message: "Course purchased successfully"
            })
        )
    } catch (e) {
        res.json({
            message: "Payment failed."
        })
    }
})

userRouter.get("/purchasedCourses", cookieJWTAuth, async (req, res) => {
    const { id } = req.body;
    try {
        const user = await UserModel.findOne({
            _id: id
        }, "purchasedCourses")

        if (!user) {
            res.status(404).json({
                message: "User not found"
            })
            return
        }

        res.json({
            purchasedCourses: user.purchasedCourses
        })
    } catch (e) {
        res.status(500).json({ message: 'Server error' })
    }

})


module.exports = {
    userRouter: userRouter
}
