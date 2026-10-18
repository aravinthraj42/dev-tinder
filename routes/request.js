const express = require('express');
const requestRouter = express.Router();
const userAuth = require('../middleware/auth');
const ConnectionRequestModel = require('../model/connectionRequest');
const UserModel = require('../model/user');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        // Logic to send a connection request
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatuses = [ 'interested', 'ignored'];
        if (!allowedStatuses.includes(status)) {
            // throw new Error('Invalid status');
            return res.status(400).json(
                { message: 'Invalid status type',
                  status: status
                 },
                
            );
        }
       if (fromUserId.toString() === toUserId) {
        return res.status(400).json({ message: 'Cannot send connection request to yourself' });
}
        const toUser = await UserModel.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: 'User not found or invalid' });
        }

        // Existing Connection

        const existingConnection = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnection) {
            return res.status(400).json({ message: 'Connection request already exists' });
        }   

        const connectionRequest = new ConnectionRequestModel({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        });
        const data =  await connectionRequest.save();


        res.status(200).json({
             message: req.user.firstName + ' ' + "is " + status + " in the " + toUser.firstName + " Profile",
             data: data });
    } catch(err) {
        res.status(400).send(err.message);
    }
});

requestRouter.post("/request/receive/:status/:requestId", userAuth, async (req, res) => {
    //ValidatTE THE STATUS


    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatuses = [ 'accepted', 'rejected'];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status type', status:   status });
    }

    const ConnectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested"
    });
    if (!ConnectionRequest) {
        return res.status(404).json({ message: 'Connection request not found' });
    }  
    
    ConnectionRequest.status = status;
    await ConnectionRequest.save();

    res.status(200).json({ message: 'Connection request ' + status, data: ConnectionRequest });

    // A => B
    //LoggedIn = toUserIf
    //Status = intereted
    // requestId = are valid

}); 

module.exports = requestRouter;
