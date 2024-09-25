require('dotenv').config()
const express  = require("express");

const { userRouter } = require("./routes/user")
const { creatorRouter } = require("./routes/creator")
const { courseRouter } = require("./routes/course");
const { default: mongoose } = require('mongoose');

const app = express()

app.use("/user", userRouter)
app.use("/creator", creatorRouter)
app.use("/course", courseRouter)


async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(process.env.PORT);
}

main()