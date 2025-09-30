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
module.exports = authRouter;