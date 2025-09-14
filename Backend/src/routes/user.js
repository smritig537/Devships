const express = require('express');
const userRouter = express.Router();
const  authUser   = require('../Middlewares/auth');
const ConnectionRequest = require('../models/connectionRequests');
const User = require('../models/User');
const USER_SAFE_DATA = ['name', 'email', 'id', 'image', 'age', 'gender', 'about'];

//Get all th epending connection request for the loggedIn user
userRouter.get('/user/requests/recieved', authUser, async (req, res) => {
  try {
    console.log("req.user in route:", req.user);

    const loggedInUserId = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId._id, 
      status: "interested",
    }).populate("fromUserId",USER_SAFE_DATA);

    res.json({
      message: "Data fetched Successfully",
      data: connectionRequests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error); 
    res.status(400).send("No user to be shown");
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

    const data = connectionRequests.map((request) => {
  if (request.fromUserId._id.toString() === loggedInUserId._id.toString()) {
    return request.toUserId;
  }
  return request.fromUserId;
});
    if (connectionRequests.length === 0) {
      console.log('No accepted connections found for user ID:', loggedInUserId._id);
      // Log all connection requests for this user (for debugging)
      const allRequests = await ConnectionRequest.find({
        $or: [
          { fromUserId: loggedInUserId._id },
          { toUserId: loggedInUserId._id },
        ],
      });
      console.log('All connection requests for this user:', allRequests);
      // Log all status values in collection
      const statuses = await ConnectionRequest.distinct('status');
      console.log('All status values in collection:', statuses);
    }

    res.json({
      message: connectionRequests.length > 0 ? 'Connections fetched successfully' : 'No accepted connections found',
      data: connectionRequests,
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


module.exports = userRouter;