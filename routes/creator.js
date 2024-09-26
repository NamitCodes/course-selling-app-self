const { Router } = require("express");
const creatorRouter = Router();

const { CreatorModel, CourseModel } = require("../db")

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const { z } = require("zod")

const JSON_SECRET_KEY = process.env.JSON_SECRET_KEY;
const { cookieJWTAuth, editCourseAuth } = require("../middleware/creatorMiddleware");
// const { now } = require("mongoose");
// const course = require("./course");


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
        }, JSON_SECRET_KEY);

        // what to do with this TOKEN now? Isn't this redundant in signup?
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

creatorRouter.post('/login', async (req, res) => {
    const email = req.headers.email;
    const password = req.headers.password;

    const creator = await CreatorModel.findOne({
        email: email
    })

    if (bcrypt.compare(password, creator.password)) {
        const token = jwt.sign({
            id: creator._id
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

creatorRouter.post('/courses', cookieJWTAuth, async (req, res) => {
    // zod validation
    const reqBody = z.object({
        title: z.string().min(3).max(40),
        description: z.string().min(3).max(100),
        imageUrl: z.string().min(3).max(300),
        price: z.number()
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

    const { id, title, description, imageUrl, price } = req.body;

    // create a new course
    try {
        const newCourse = await CourseModel.create({
            title: title,
            description: description,
            imageUrl: imageUrl, // check out web3 saas in 6 hours video for learning how to make so that creator is able to upload image
            price: price,
            lastUpdated: new Date() // see if you can make this better
        })

        // reference this course to the creator
        await CreatorModel.updateOne(
            { _id: id },
            {
                $push: { createdCourses: newCourse._id }
            }) // above code block is glitchy
            // I think yahaan pe if-else statement daalna chahiye to recheck if referencing has been done
        const creator = await CreatorModel.findOne({ createdCourses: newCourse._id });
        if (creator._id.toString() === id){
            res.json({
                message: "Course created successfully",
                courseId: newCourse._id
            })
        } else {
            res.json({
                message: "Course could not be created",
                // duplicated bnenge yahaan
                courseId: newCourse._id
            })
        }
    }
    catch (e) {
        res.status(403).json({
            message: "Something went wrong"
        })
    }
})

creatorRouter.put('/courses/:courseId', cookieJWTAuth, async (req, res) => {
    const { courseId } = req.params;
    const { id, title, description, imageUrl, price } = req.body;

    try {
        // Find the course
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Find the creator who has this course in their createdCourses array
        const creator = await CreatorModel.findOne({ createdCourses: courseId });

        if (!creator) {
            return res.status(404).json({ message: 'Creator not found' });
        }

        // Check if the creator's ID matches the ID provided in the request body
        if (creator._id.toString() !== id) {
            return res.status(403).json({ message: "You don't have permission to update this course" });
        }

        // Update the course details
        course.title = title;
        course.description = description;
        course.imageUrl = imageUrl;
        course.price = price;
        course.lastUpdated = new Date()

        await course.save(); // ??/

        res.status(200).json({ message: 'Course updated successfully', course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

creatorRouter.get('/courses', cookieJWTAuth, async (req, res) => {
    const response = await CourseModel.find({})
    res.json({
        courses: response
    })
})


module.exports = {
    creatorRouter: creatorRouter
}