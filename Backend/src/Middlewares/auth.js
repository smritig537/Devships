const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).send("Token not valid");
    }

    try {
        const decodeObj = await jwt.verify(token, "Smriti@Devships12&23");
        const _id = decodeObj._id;

        const user = await User.findById(_id); // added await here too
        if (!user) {
            return res.status(404).send("User not found");
        }

        req.user = user; // attach full user object to request
        next();
    } catch (e) {
        console.log(e);
        res.status(401).send("Unauthorized");
    }
};


module.exports = authUser;



// const authUser = async(req,res,next )=>{
//     const cookies = req.cookies;
//     const {token} = cookies;
    
//     if(!token){
//         return res.status(401).json({ error: "Token not found in cookies" });}
//     try{
//         const decodeObj = JsonWebTokenError.verify(token,
//             "Smriti@Devships12&23");
//             req.user = decodeObj;
//             console.log(req.user);
//             console.log(cookies);
//             res.send(user);

//             next();

//     }catch(e){
//          console.error("JWT verification failed:");
//          res.status(403).json({ error: "Invalid or expired token" });
//     }

//     }

    
