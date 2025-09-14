const express = require('express');
const requestRouter = express.Router();

const User = require('../models/User');
require('../config/database');
require('../utils/validate');
const authUser = require('../Middlewares/auth');
const ConnectionRequest = require('../models/connectionRequests');

requestRouter.post('/sendConnection', authUser , async(req,res)=>{ 
    console.log("sending connection request");
    res.send("Connection request sent"); 
     
});


requestRouter.post('/user', async (req, res) =>{
    const userEmail = req.body.email;
    const userId = req.body.id;
    const data = req.body;
    
    try{

        const isAllowedUpdate = ["userid","name","password","age","gender"];

       const isUpdateAllowed = Object.keys(data).every((k)   =>
       isAllowedUpdate.includes(k)
       );
       if(!isUpdateAllowed){
           return res.status(400).send("Update not allowed");
       }
       if(data?.gender.length >7){
           return res.status(400).send("Gender not allowed");
       }
        const users = await User.find({email: userEmail});
    
    if(users.Length === 0){
        res.status(404).send("User not found");
    }else{
        res.send(users);
    }

    }catch(e){
        res.status(400).send("Not added the user: ")
    }
})

requestRouter.get('/feed', async (req, res) =>{
    try{

       const users = await User.find({});
       res.send(users); 

    }catch(e){
        res.status(400).send("No user to be shown: " + error.message)    
    }
})

//delete the user
requestRouter.delete('/delete', async(req,res) => {

    const userId = req.body.id;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send(user);

    }catch(e){

        res.status(400).send("No user to be deleted: " + error.message);

    }


})

requestRouter.patch('/update', async(req , res)=>{
     const userId = req.body.id;
     const user = req.body;

     try{
        const users = await User.findByIdAndUpdate({_id:userId} , user, {
            returnDocument: "after",
            // runValidators: true
        });
        console.log(users);
        res.send(users);
        

     }catch(e){

        res.status(400).send("No user to be updated: " );
     }
})

// Accept a connection request
requestRouter.post('/request/send/interested/:toUserId', authUser, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Status is required in request body" });
        }

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        // Check if a request already exists in either direction
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ error: "Connection request already exists" });
        }

        const newRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await newRequest.save();

        res.json({
            message: "Connection request sent successfully",
            data
        });

    } catch (e) {
        console.error("Error sending connection request:", e.message);
        res.status(400).json({ error: "Failed to send connection request" });
    }
});

// Add to requestRouter.js
requestRouter.post('/request/review/accepted/:requestId', authUser, async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const loggedInUserId = req.user._id;

    // Find the request
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: 'interested'
    });

    if (!connectionRequest) {
      return res.status(404).json({ error: 'Connection request not found or not in interested status' });
    }

    // Update status to accepted
    connectionRequest.status = 'accepted';
    await connectionRequest.save();

    // Populate user details
    await connectionRequest.populate('fromUserId', 'name email photo_url');
    await connectionRequest.populate('toUserId', 'name email photo_url');

    res.json({
      message: 'Connection request accepted successfully',
      data: connectionRequest
    });
  } catch (error) {
    console.error('Error accepting request:', error.message);
    res.status(500).json({ error: 'Failed to accept request' });
  }
});


// Reject a connection request
requestRouter.post('/request/review/rejected/:requestId', authUser, async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const loggedInUserId = req.user._id;

        // Find the request
        const connectionRequest = await ConnectionRequest.findById(requestId);

        if (!connectionRequest) {
            return res.status(404).json({ error: "Connection request not found" });
        }

        // Only the "toUser" can reject
        if (connectionRequest.toUserId.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ error: "Not authorized to reject this request" });
        }

        // Update status to rejected
        connectionRequest.status = "rejected";
        await connectionRequest.save();

        res.json({
            message: "Connection request rejected successfully",
            data: connectionRequest
        });

    } catch (e) {
        console.error("Error rejecting request:", e.message);
        res.status(500).json({ error: "Failed to reject request" });
    }
});



module.exports = requestRouter;