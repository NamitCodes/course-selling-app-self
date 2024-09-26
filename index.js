require('dotenv').config()
const express  = require("express");

const { userRouter } = require("./routes/user")
const { creatorRouter } = require("./routes/creator")
const { default: mongoose } = require('mongoose');
const cookieParser = require("cookie-parser");
const path = require("path")

const { rateLimit } = require("express-rate-limit")
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 20, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
    standardHeaders: true, // add the `RateLimit-*` headers to the response
    legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
})

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(limiter)            // rate limit

app.use("/user", userRouter)
app.use("/creator", creatorRouter)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/creator/creator-signup.html"))
})
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(process.env.PORT);
}

main()