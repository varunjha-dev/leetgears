const User = require("../models/user")
const validate = require("../utils/validator")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const redisClient = require("../config/redis");
const Submission = require("../models/submission")


const register = async (req,res) => {
    try {
        // validate the data
        validate(req.body);
        const {firstName, emailId, password} = req.body;
        // const ans = User.exists({emailId}); for checking emailId is already existing or not 
        // but no need mongo apne se create nahi hone dega also schema mei unique tag kiya hai
        req.body.password = await bcrypt.hash(password,10);
        req.body.role = 'user'
        const user = await User.create(req.body);

        const token = jwt.sign(
            {_id:user._id, emailId:emailId, role:'user'},
            process.env.JWT_SECRET,
            {expiresIn:60*60}
        );
        
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role
        }
        
        // FIXED: Proper cookie options for CORS
        const cookieOptions = {
            httpOnly: true,                    // Prevents XSS attacks
            secure: false,                     // false for localhost HTTP
            sameSite: 'lax',                   // 'lax' works for localhost different ports
            maxAge: 60*60*1000,                // 1 hour in milliseconds
            path: '/'                          // Available for all routes
        };
        
        res.cookie('token', token, cookieOptions);
        res.status(201).json({
            user: reply,
            message: "Registered successfully"
        })
    } catch (error) {
        res.status(400).json({
            message: error.message || "Registration failed"
        });
    }
}


const login = async (req,res) => {
    try {
        const {emailId, password} = req.body;
        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");
        const user = await User.findOne({emailId});

        const match = await bcrypt.compare(password,user.password);
        if(!match)
            throw new Error("Invalid Credentials");
            
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role
        }
        
        const token = jwt.sign(
            {_id:user._id, emailId:emailId, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:60*60}
        );
        
        // FIXED: Same cookie options as register
        const cookieOptions = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60*60*1000,
            path: '/'
        };
        
        res.cookie('token', token, cookieOptions);
        res.status(200).json({
            user: reply,
            message: "Logged in successfully"
        })
    } catch (error) {
        res.status(401).json({
            message: error.message || "Login failed"
        });
    }
}


const logout = async (req,res) => {
    try {
        // validate the token
        const {token} = req.cookies;
        const payload = jwt.decode(token);
        
        // Token add in Redis blocklist
        await redisClient.set(`token:${token}`,'Blocked');
        // Clear cookies 
        await redisClient.expireAt(`token:${token}`,payload.exp);    

        // Clear cookie with same options
        res.cookie("token", "", {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(0),
            path: '/'
        });
        
        res.status(200).json({
            message: "Logged Out Successfully"
        });
       
    } catch (error) {
        res.status(401).json({
            message: error.message || "Logout failed"
        }); 
    }
}


const adminRegister = async (req,res) => {
    try{
        // validate the data;
        validate(req.body); 
        const {firstName, emailId, password}  = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        const user = await User.create(req.body);
        
        const token = jwt.sign(
            {_id:user._id, emailId:emailId, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:60*60}
        );
        
        // FIXED: Same cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60*60*1000,
            path: '/'
        };
        
        res.cookie('token', token, cookieOptions);
        res.status(201).json({
            user: {
                firstName: user.firstName,
                emailId: user.emailId,
                _id: user._id,
                role: user.role
            },
            message: "Admin Registered Successfully"
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || "Admin registration failed"
        });
    }
}

const deleteProfile = async (req,res) => {
    try {
        const userId = req.result._id;
        // UserSchema Delete
        await User.findByIdAndDelete(userId);
        // Delete from submission from below or via Model
        // await Submission.deleteMany({userId: userId});
        res.status(200).json({
            message: "Deleted Successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {register, login, logout, adminRegister, deleteProfile}
