const mongoose = require ('mongoose');

const connectDB = async() =>{
  await mongoose.connect(
   "mongodb://localhost:27017/namaste_node"
  );
}

connectDB()
.then(()=>{
 console.log("Database connection establised");
})
.catch((err)=>{
    console.error("not connect")

})