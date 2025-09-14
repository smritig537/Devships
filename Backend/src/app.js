const express = require('express');

//app.use("/route",rH,rH1,[rH2,rh3],rh4)
require('./config/database');
const app = express();


// app.use("/user1",(req,res,next)=>{
//     console.log("first response!!");
//     res.send("first Response"); 
//     next();
// },[((req,res,next)=>{
//     res.send("second response "); //array
//     next();
// }),((req,res,next)=>{
//     res.send("Third response ");
//     next();
// }),],
// ((req,res,next)=>{
//     res.send("fourth response ");
//     next();
// }),
// ((req,res)=>{

//     res.send("fifth response ");
// })
// )



// ✅ Define a route under /admin
app.get("/admin/getAllData", (req, res) => {
    res.send( "Here is all the data for admin." );
});

//this will only give hte rize to get calls
app.get("/user/:userId/:password",(req,res)=>{
    console.log(req.params)
    res.send({firstName:"Smriti", lastName:"Gupta"});
})

app.post("/user",(err, req,res,next)=>{
    if(err){

        res.status(500).send('error');

    }
   
    res.send("user data posted..");
    next();
})

//this will give access to all api calls for /test
app.get("/test",(req,res,next)=>{
     res.send("Hello from the server");
    next();
})

app.get("/test",(rerq,res)=>{
    res.send("Hello from the server2");
})


app.use("/hello1",(req,res)=>{
    try{
        throwerror('ygyy');
        res.send("Data sent")

    }catch{

        res.status(500).send("some error")
    }
    // res.send("Hello hello")
})


app.listen(7777 ,()=>{

    console.log("Server is running on port 7777....")

});