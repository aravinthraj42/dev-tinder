const express = require('express');
const userRouter = express.Router();
const userAuth = require('../middleware/auth');
const ConnectionRequestModel = require('../model/connectionRequest');
const User = require('../model/user');
;
const populateUserFields = ['firstName', 'lastName', 'profileUrl', 'skills','about'];

// get all Pending Connection for Logined user
userRouter.get("/user/request/received", userAuth, async (req, res) => {

    try {
        const loggedInuser = req.user;
        const connectionRequests = await ConnectionRequestModel.find( {
                toUserId: loggedInuser._id,
                status: 'interested'
            }).populate('fromUserId', populateUserFields);

        res.status(200).json({ 
        message: "Connection requests fetched successfully",
        data:  connectionRequests,
        status: 200 
});
    } catch (err) {
        res.status(400).json({ message: "Error: " + err.message });
    }
});

// get all Accepted Connection for Logined user
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{

const loggedInuser = req.user;

const connectionRequest = await ConnectionRequestModel.find({
    status: 'accepted', 
    $or: [{fromUserId: loggedInuser._id}, {toUserId: loggedInuser._id}]})
    .populate('fromUserId', populateUserFields)
    .populate('toUserId', populateUserFields);

    const data = connectionRequest.map((row)=> {
        if(row.fromUserId._id.toString() === loggedInuser._id.toString()){
            return row.toUserId;
        }else{
            return row.fromUserId;
        }
    });

    
        res.status(200).json({ 
        message: "Connections fetched successfully",
        data:  data,
        status: 200 
    });

    }catch (err) {
        res.status(400).json({ message: "Error: " + err.message });
    }

});

// Get feed for Logined user
userRouter.get("/user/feed", userAuth, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Number of feed items per page
    const skip = (page - 1) * limit; // 1-1 *10 ==> 0*10 = -10, 1-1 *10 = 0, 2-1 *10 = 10
   
    const loggedInuser = req.user;
    // ALL CARDS -> Fetch all users except the logged-in user/ accepted profile/Ignored profile/interested Profile for the feed

    // Logic to fetch feed for the logged-in user goes here
    const connections = await ConnectionRequestModel.find({
        $or: [{fromUserId: loggedInuser._id}, {toUserId: loggedInuser._id}]
    }).select('fromUserId toUserId ');

    const hideUserFromFeed = new Set();
        connections.forEach(req => {
        hideUserFromFeed.add(req.fromUserId.toString());
        hideUserFromFeed.add(req.toUserId.toString());
        });

const feed = await User.find({
  $and: [
    { _id: { $nin: Array.from(hideUserFromFeed) } },
    { _id: { $ne: loggedInuser._id } }
  ]
}).select(populateUserFields).skip(skip).limit(limit);
    res.status(200).json({ 
        message: "Feed fetched successfully",
        data: feed, // Replace with actual feed data
        status: 200 
    });
});


module.exports = userRouter;