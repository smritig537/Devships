const express = require('express');
const app = express();
const User = require('./models/User');
require('./config/database');
require('./utils/validate');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authUser = require('./Middlewares/auth');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');
const cors = require('cors');

app.use(
cors({
        origin:"https://devships-tbn4-ebrand7p8-smritig537s-projects.vercel.app/",
        credentials:true,
    })
);



app.use(express.json()); //agar mai express.json use nahi karti toh mere mongodb compass mai data blank save hota because its a middleware through which the body is going from postman and getting saved.

app.use(cookieParser()); //for reading cookies tokens

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);



// app.listen(5000, ()=>{
//     console.log("Server is running on port 5000");
// })
module.exports = app;
