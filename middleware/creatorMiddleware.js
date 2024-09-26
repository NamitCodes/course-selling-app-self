const jwt = require("jsonwebtoken")
const JSON_SECRET_KEY = process.env.JSON_SECRET_KEY;

function cookieJWTAuth(req,res,next){
    const token = req.cookies.token;
    try{
        const creator = jwt.verify(token, JSON_SECRET_KEY);
        // console.log(creator);
        req.body.id = creator.id;
        next()
    }
    catch (e) {
        res.clearCookie("token")
        res.json({
            message: "Error occurred"
        })
    }
}

module.exports = {
    cookieJWTAuth: cookieJWTAuth
}