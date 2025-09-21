const express = require('express');
const User = require('../models/User');
require('../config/database');
const { validateSignupDate } = require('../utils/validate');
const bcrypt = require('bcrypt');
const jwt = require
('jsonwebtoken');


const authRouter = express.Router();

// signup API
authRouter.post('/signup', async (req, res) => {
    validateSignupDate(req);
    try {
        const { name, email, password, Skills } = req.body;  // <-- include Skills here

        // encrypt the password
        const poweredPassword = await bcrypt.hash(password, 10);

        // create user (spread req.body, but overwrite password & handle Skills safely)
        const user = new User({
            ...req.body,
            password: poweredPassword,
            Skills: Array.isArray(Skills) ? Skills : []   // <-- FIX ✅
        });

        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
        })

        res.json({message: "User added successfully", data:savedUser});
    } catch (e) {
        console.error("Signup error:", e);
        res.status(400).send("Not added the user");
    }
});



//Login Api
authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send("Invalid Credentials");
        }

        console.log("Entered password:", password);
        console.log("Stored password hash:", user.password);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {

            // create a jwt Token
            const token = jwt.sign({_id:user._id},"Smriti@Devships12&23",{expiresIn: "1h",});
            // const token = getJWT();

            console.log(token);

            // Add The token to cookie and send the response back to the user
              res.cookie("token", token, {
                // httpOnly: true,
                secure: false,
                sameSite: "lax",
            });
            
            return res.send(user);
        } else {
            return res.status(401).send("Invalid Credentials2");
        }
        // if(!isPasswordValid){
        //     return res.status(401).send("Invalid Credentials");
        // }else{
             // create a jwt Token

            // Add The token to cookie and send the response back to the user
        //     return res.send("Login Successful");
        // }

    } catch (e) {
        console.error("Login error:", e);
        return res.status(500).send("Server Error");
    }
});

authRouter.post('/logout', async(req,res)=>{
    // res.clearCookie('token');
    // res.send("Logout successful");
    res.cookie("token",null,{expires: new Date(Date.now())});
    res.send("Logout successful");
    console.log("Logout successful");
}   );

module.exports = authRouter;