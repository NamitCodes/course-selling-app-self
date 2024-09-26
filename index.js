require('dotenv').config()
const express  = require("express");

const { userRouter } = require("./routes/user")
const { creatorRouter } = require("./routes/creator")
const { courseRouter } = require("./routes/course");
const { default: mongoose } = require('mongoose');
const cookieParser = require("cookie-parser");

const rateLimit = require("express-rate-limit")
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(limiter)            // rate limit

app.use("/user", userRouter)
app.use("/creator", creatorRouter)
app.use("/course", courseRouter)


async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(process.env.PORT);
}

main()