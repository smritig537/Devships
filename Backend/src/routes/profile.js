const express = require('express');
const profileRouter = express.Router();
const User = require('../models/User');
require('../config/database');
const { validateProfileEditData } = require('../utils/validate');

const authUser = require('../Middlewares/auth');

const app = express();

app.use(express.json());   // <-- This parses JSON bodies
app.use(express.urlencoded({ extended: true }));

profileRouter.get('/profile', authUser, async (req, res) => {
    // const cookies = req.cookies;
    // const { token } = cookies;
    

    // if (!token) {
    //     return res.status(401).json({ error: "Token not found in cookies" });
    // }

    try {
        const user = req.user;
        // const decodedMessage = jwt.verify(token, "Smriti@Devships12&23");
        // console.log(decodedMessage);
        // console.log(cookies);
        // res.send("Reading cookies");

        res.send(user);
    } catch (err) {
        // console.error("JWT verification failed:", err.message);
        // res.status(403).json({ error: "Invalid or expired token" });
        res.status(400).send("Error in profile");

    }
});

// PATCH route for profile edit
// profileRouter.patch('/profile/edit', authUser, async (req, res) => {
//     try {
//         // Validate incoming data
//         validateProfileEditData(req);

//         // Find user and update with the allowed fields
//         const userId = req.user._id;
//         const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
//             new: true, // return updated document
//             runValidators: true // run Mongoose validators
//         });

//         if (!updatedUser) {
//             return res.status(404).send("User not found");
//         }

//         res.send({
//             message: "Profile updated successfully ",
//             user: updatedUser
//         });
//     } catch (e) {
//         console.error(e.message);
//         res.status(400).send(e.message);
//     }
// });

profileRouter.patch('/profile/edit', authUser, async (req, res) => {
    try {
        // Validate fields in request
        validateProfileEditData(req);

        const loggedInUser = req.user;

        // Update allowed fields
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        // Save user
        await loggedInUser.save();

        // Send response with success message + updated user
        res.send({
            message: `${loggedInUser.name}'s profile updated successfully`,
            user: loggedInUser
        });

    } catch (e) {
        console.error("Profile Update Error:", e.message);
        res.status(400).send(e.message || "Error in profile");
    }
});

profileRouter.patch('./profile/password',authUser,async(req,res)=>{
   try{
    //forgot password api
    

   }catch(e){

   }
})




module.exports = profileRouter;