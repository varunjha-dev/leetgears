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

        const token = jwt.sign({_id:user._id, emailId:emailId, role:'user'},process.env.JWT_SECRET,{expiresIn:60*60});
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        }
        res.cookie('token',token,{maxAge: 60*60*1000})
        res.status(201).json({
            user:reply,
            message:"Registered successfully"
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
            _id: user._id
        }
        const token = jwt.sign({_id:user._id, emailId:emailId, role:user.role},process.env.JWT_SECRET,{expiresIn:60*60});
        res.cookie('token',token,{maxAge: 60*60*1000})
        res.status(201).json({
            user:reply,
            message:"Logged in successfully"
        })
    } catch (error) {
        res.status(401).send("Error: "+error);
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

        res.cookie("token",null,{expires: new Date(Date.now())});
        res.send("Logged Out Succesfully");
       
    } catch (error) {
         res.status(401).send("Error: "+error); 
    }
}

const adminRegister = async (req,res) => {
    try{
        // validate the data;
      validate(req.body); 
      const {firstName, emailId, password}  = req.body;

     req.body.password = await bcrypt.hash(password, 10);
     const user =  await User.create(req.body);
     const token = jwt.sign({_id:user._id, emailId:emailId, role:user.role},process.env.JWT_SECRET,{expiresIn:60*60});
     res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).send("User Registered Successfully");
    } catch (err) {
        res.status(400).send("Error: "+err);
    }
}
const deleteProfile = async (req,res) => {
    try {
        const userId = req.result._id;
        // UserSchema Delete
        await User.findByIdAndDelete(userId);
        // Delete from submission from below or via Model
        // await Submission. deleteMany(userId);
        res.status(200).send("Deleted Successfully");
    } catch (err) {
        res.status(500).send("Internal Server Error")
    }
}
module.exports = {register, login, logout, adminRegister, deleteProfile}