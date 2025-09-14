const jwt = require("jsonwebtoken")
const User = require("../models/user");
const redisClient = require("../config/redis")

const userMiddleware = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token)
            throw new Error("Token is not persent");

        const payload = jwt.verify(token,process.env.JWT_SECRET);

        const {_id} = payload;

        if(!_id){
            throw new Error("Invalid token");
        }

        const result = await User.findById(_id);

        if(!result){
            throw new Error("User Doesn't Exist");
        }

        // checking presence in Redis blocklist

         const IsBlocked = await redisClient.exists(`token:${token}`);

        if(IsBlocked)
            throw new Error("Invalid Token");

        req.result = result;


        next();
    } catch (error) {
        res.status(401).send("Error: "+ error.message)
    }
}
module.exports = userMiddleware;