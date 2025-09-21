const express = require('express');
const userRouter = express.Router();
const  authUser   = require('../Middlewares/auth');
const ConnectionRequest = require('../models/connectionRequests');
const User = require('../models/User');
const USER_SAFE_DATA = ['_id', 'name', 'email', 'age', 'gender', 'about', 'photo_url', 'Skills'];

//Get all th epending connection request for the loggedIn user
userRouter.get('/user/requests/recieved', authUser, async (req, res) => {
  try {
    console.log("req.user in route:", req.user);
    const loggedInUserId = req.user;
    console.log("Querying for toUserId:", loggedInUserId._id);

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA.join(" ") + " photo_url Skills"); // Ensure proper space-separated string

    console.log("Fetched connectionRequests:", connectionRequests);

    if (!connectionRequests || connectionRequests.length === 0) {
      console.log("No requests found for user:", loggedInUserId._id);
      // Debug: Find all requests for this user regardless of status
      const allRequests = await ConnectionRequest.find({
        $or: [{ toUserId: loggedInUserId._id }, { fromUserId: loggedInUserId._id }],
      });
      console.log("All requests for this user:", allRequests);
      // Debug: List all possible statuses
      const statuses = await ConnectionRequest.distinct("status");
      console.log("All status values in collection:", statuses);
    }

    res.json({
      message: connectionRequests.length > 0 ? "Data fetched Successfully" : "No requests found",
      data: connectionRequests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all accepted connections for the logged-in user
userRouter.get('/user/connections', authUser, async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const loggedInUserId = req.user;

    if (!loggedInUserId || !loggedInUserId._id) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    console.log('Querying for connections with user ID:', loggedInUserId._id);
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId._id, status: 'accepted' },
        { toUserId: loggedInUserId._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA) // Populate sender details
      .populate('toUserId', USER_SAFE_DATA); // Populate recipient details

    console.log('Found connections:', connectionRequests);

    if (connectionRequests.length === 0) {
      console.log('No accepted connections found for user ID:', loggedInUserId._id);
      // Log all connection requests for debugging
      const allRequests = await ConnectionRequest.find({
        $or: [
          { fromUserId: loggedInUserId._id },
          { toUserId: loggedInUserId._id },
        ],
      });
      console.log('All connection requests for this user:', allRequests);
      const statuses = await ConnectionRequest.distinct('status');
      console.log('All status values in collection:', statuses);
    }

    res.json({
      message: connectionRequests.length > 0 ? 'Connections fetched successfully' : 'No accepted connections found',
      data: connectionRequests, // Return full connection objects
    });
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(400).json({ message: 'Error fetching connections', error: error.message });
  }
});

//feed api 
//User should not see his own card, his connections card and ignored  cards and interested cards
userRouter.get('/user/feed', authUser, async (req, res) => {
    try{
       const loggedInUser = req.user;

       const page = parseInt(req.query.page) || 1;
       let limit = parseInt(req.query.limit) || 10;
       const skip = (page - 1) * limit;
       limit = limit>50 ? 50 : limit;

       //Find all connection requests (sent + recieved)
       const connectionRequests = await ConnectionRequest.find({
           $or: [
               { fromUserId: loggedInUser._id },
               { toUserId: loggedInUser._id },
           ],
       }).select("fromUserId toUserId");

       console.log("Connection requests for feed:", connectionRequests);

       //Create a set of user ids to hide
       const hideUserFromFeed = new Set();
       connectionRequests.forEach((request) => {
           hideUserFromFeed.add(request.fromUserId.toString());
           hideUserFromFeed.add(request.toUserId.toString());
       });
       
      
        // res.json([...hideUserFromFeed]); //sending an array of user ids 

      //showing connections and their data 
      const users = await User.find({
        $and: [
          { _id: { $nin: Array.from(hideUserFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],

      }).select(USER_SAFE_DATA).skip(skip).limit(limit);
      res.json({data:users});

    }catch(e){
        res.status(400).send("No user to be shown error: ")    
    }
});

userRouter.get('/user/requests/sent', authUser, async (req, res) => {
  try {
    console.log("req.user in route:", req.user);
    const loggedInUserId = req.user;
    console.log("Querying for fromUserId:", loggedInUserId._id);

    const connectionRequests = await ConnectionRequest.find({
      fromUserId: loggedInUserId._id,
      status: { $in: ["interested", "ignored"] },
    }).populate("toUserId", USER_SAFE_DATA.join(" ") + " photo_url Skills");

    console.log("Sent requests found:", connectionRequests.length);

    res.json({
      message: connectionRequests.length > 0 ? "Data fetched Successfully" : "No sent requests found",
      data: connectionRequests,
    });
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


userRouter.post('/request/send/interested/:userId', authUser, async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Sender (e.g., Anjali)
    const toUserId = req.params.userId; // Recipient (e.g., Rahul)

    console.log("Sending request from:", loggedInUserId, "to:", toUserId);

    const existingRequest = await ConnectionRequest.findOne({
      fromUserId: loggedInUserId,
      toUserId: toUserId,
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const newRequest = new ConnectionRequest({
      fromUserId: loggedInUserId,
      toUserId: toUserId,
      status: "interested",
    });
    await newRequest.save();
    console.log("Saved ConnectionRequest:", newRequest);

    res.json({
      message: "Connection request sent successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error sending request:", error);
    res.status(500).json({ error: "Failed to send request" });
  }
});


module.exports = userRouter;