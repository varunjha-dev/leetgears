const express = require('express');
const authRouter = express.Router();
const {register, login, logout, adminRegister, deleteProfile} = require('../controllers/userAuthent')
const userMiddleware = require("../middleware/userMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

// Register user
authRouter.post('/register',register);
// Login
authRouter.post('/login',login);
// logout
authRouter.post('/logout',userMiddleware, logout);
// GetProfile
// authRouter.get('/getProfile',getProfile);

// Register admin
authRouter.post('/admin/register', adminMiddleware, adminRegister);
// Delete User
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);

authRouter.get('/check',userMiddleware,(req,res)=>{
    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id: req.result._id
    }
    res.status(200).json({
        user: reply,
        message: "Valid User"
    })
})
module.exports = authRouter;