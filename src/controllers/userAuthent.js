const User = require("../models/user")
const validate = require("../utils/validator")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const register = async (req,res) => {

    try {
        // validate the data
        validate(req.body);
        const {firstName, emailId, password} = req.body;
        // const ans = User.exists({emailId}); for checking emailId is already existing or not 
        // but no need mongo apne se create nahi hone dega also schema mei unique tag kiya hai
        req.body.password = await bcrypt.hash(password,10);
        
        const user = await User.create(req.body);

        const token = jwt.sign({_id:user._id, emailId:emailId},process.env.JWT_SECRET,{expiresIn:60*60});
        res.cookie('token',token,{maxAge: 60*60*1000})
        res.status(201).send("user Registered Successfully");
    } catch (error) {
        res.status(400).send("Error "+error);
    }
}


const login = async (req,res) => {
    try {
        const {emailId, password} = req.body;
        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");
        const user = User.findOne({emailId});

        const match = bcrypt.compare(password,user.password);
        if(!match)
            throw new Error("Invalid Credentials");
        const token = jwt.sign({_id:user._id, emailId:emailId},process.env.JWT_SECRET,{expiresIn:60*60});
        res.cookie('token',token,{maxAge: 60*60*1000})
        res.status(200).send("Logged in successfully")
    } catch (error) {
        res.status(401).send("Error: "+err);
    }
}

const logout = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}