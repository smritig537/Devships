const mongoose = require ('mongoose');

const connectDB = async() =>{
  await mongoose.connect(
   "mongodb+srv://smritig537db_User:Smritijeet%400723@cluster0.tvudfqp.mongodb.net"
  );
}

connectDB()
.then(()=>{
 console.log("Database connection establised");
})
.catch((err)=>{
    console.error("not connect")

})