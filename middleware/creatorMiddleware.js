const jwt = require("jsonwebtoken")
const JSON_SECRET_KEY = process.env.JSON_SECRET_KEY;

function cookieJWTAuth(req,res,next){
    const token = req.cookies.token;
    try{
        const creator = jwt.verify(token, JSON_SECRET_KEY);
        if (creator.id){
            req.body.id = creator.id;
            next()
        } else {
            res.status(403).json({
                message: "You are not authenticated."
            })
        }
    }
    catch (e) {
        res.clearCookie("token")
        res.json({
            message: "Error while authenticating"
        })
    }
}

module.exports = {
    cookieJWTAuth: cookieJWTAuth
}